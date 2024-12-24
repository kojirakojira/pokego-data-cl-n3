<template>
  <GraphRadarDiffGraph
    title="GO種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ']"
    :datasets="datasets"
    :min="0"
    :max="count"
  />
</template>

<script setup lang="ts">
import { RaceGoRank, type Race } from '~/components/interface/api/dto'
import type { RadarDataset } from '~/components/graph/RadarDiffGraph.vue'
import { colorArr } from '~/components/graph/graphCommon'

const props = withDefaults(
  defineProps<{
    raceArr: Array<Race>,
    count: number
  }>(),
  {})

const datasets = computed((): Array<RadarDataset> => {
  return props.raceArr.map((race, i) => {
    const rank: RaceGoRank = race.goRank || new RaceGoRank()
    return {
      elems: [rank.hp, rank.attack, rank.defense]
        .map(num => props.count - num + 1),
      label: editUtils().appendRemarks(race.name, race.remarks),
      color: colorArr[i]
    }
  })
})
</script>
