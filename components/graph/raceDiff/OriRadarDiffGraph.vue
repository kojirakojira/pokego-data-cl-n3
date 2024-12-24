<template>
  <GraphRadarDiffGraph
    title="原作種族値"
    :labels="['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']"
    :datasets="datasets"
    :min="0"
    :max="count"
  />
</template>

<script setup lang="ts">
import { RaceOriRank, type Race } from '~/components/interface/api/dto'
import type { RadarDataset } from '~/components/graph/RadarDiffGraph.vue'
import { colorArr } from '~/components/graph/graphCommon'

const props = withDefaults(
  defineProps<{
    raceArr: Array<Race>,
    count: number
  }>(),
  {})

const datasets = computed((): Array<RadarDataset> => {
  if (props.raceArr.filter(race => !race.pokedex).length) {
    // 原作種族値が存在しないポケモンが指定された場合
    return []
  }
  return props.raceArr.map((race, i) => {
    const rank: RaceOriRank = race.oriRank || new RaceOriRank()
    return {
      elems: [
        rank.hp, // HP
        rank.attack, // こうげき
        rank.specialAttack, // とくこう
        rank.speed, // すばやさ
        rank.specialDefense, // とくぼう
        rank.defense // ぼうぎょ
      ]
        .map(num => props.count - num + 1),
      label: editUtils().appendRemarks(race.name, race.remarks),
      color: colorArr[i]
    }
  })
})
</script>
