<template>
  <GraphRadarDiffGraph
    title="GO種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ']"
    :datasets="datasets"
    :min="0"
    :max="goPokedexStats.goHpStats.list.length"
  />
</template>

<script setup lang="ts">
import type { GoPokedexStats, Race } from '~/components/interface/api/dto'
import type { RadarDataset } from '~/components/graph/RadarDiffGraph.vue'
import { colorArr, reverseRank } from '~/components/graph/graphCommon'

const props = withDefaults(
  defineProps<{
    raceArr: Array<Race>,
    goPokedexStats: GoPokedexStats
  }>(),
  {})

const datasets = computed((): Array<RadarDataset> => {
  return props.raceArr.map((race, i) => {
    return {
      elems: [
        reverseRank(race.goPokedex.hp, props.goPokedexStats.goHpStats.list),
        reverseRank(race.goPokedex.attack, props.goPokedexStats.goAtStats.list),
        reverseRank(race.goPokedex.defense, props.goPokedexStats.goDfStats.list)
      ],
      label: editUtils().appendRemarks(race.name, race.remarks),
      color: colorArr[i]
    }
  })
})
</script>
