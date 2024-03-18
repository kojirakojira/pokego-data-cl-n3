<template>
  <GraphRadarDiffGraph
    title="原作種族値"
    :labels="['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']"
    :datasets="datasets"
    :min="0"
    :max="pokedexStats.hpStats.list.length"
  />
</template>

<script setup lang="ts">
import type { Pokedex, PokedexStats, Race } from '~/components/interface/api/dto'
import type { RadarDataset } from '~/components/graph/RadarDiffGraph.vue'
import { colorArr, reverseRank } from '~/components/graph/graphCommon'

const props = withDefaults(
  defineProps<{
    raceArr: Array<Race>,
    pokedexStats: PokedexStats
  }>(),
  {})

const datasets = computed((): Array<RadarDataset> => {
  if (props.raceArr.filter(race => !race.pokedex).length) {
    // 原作種族値が存在しないポケモンが指定された場合
    return []
  }
  return props.raceArr.map((race, i) => {
    const pdx: Pokedex = race.pokedex as Pokedex
    return {
      elems: [
        reverseRank(pdx.hp, props.pokedexStats.hpStats.list), // HP
        reverseRank(pdx.attack, props.pokedexStats.atStats.list), // こうげき
        reverseRank(pdx.specialAttack, props.pokedexStats.spAtStats.list), // とくこう
        reverseRank(pdx.speed, props.pokedexStats.spStats.list), // すばやさ
        reverseRank(pdx.specialDefense, props.pokedexStats.spDfStats.list), // とくぼう
        reverseRank(pdx.defense, props.pokedexStats.dfStats.list) // ぼうぎょ
      ],
      label: editUtils().appendRemarks(race.name, race.remarks),
      color: colorArr[i]
    }
  })
})
</script>
