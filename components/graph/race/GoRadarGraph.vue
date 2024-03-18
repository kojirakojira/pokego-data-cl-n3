<template>
  <GraphRadarGraph
    title="GO種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ']"
    :dataset="rankArr"
    :min="0"
    :max="totalCount"
    :color="race.color"
  />
</template>

<script setup lang="ts">
import type { GoPokedexStats, Race } from '~/components/interface/api/dto'
import { reverseRank } from '~/components/graph/graphCommon'

const props = withDefaults(
  defineProps<{
    race: Race,
    goPokedexStats: GoPokedexStats
  }>(),
  {})

const goStatsItems: Array<Record<string, string>> = [
  { key: 'hp', statsKey: 'goHpStats' },
  { key: 'attack', statsKey: 'goAtStats' },
  { key: 'defense', statsKey: 'goDfStats' }
]

const totalCount = computed((): number => props.goPokedexStats.goHpStats.list.length)

const rankArr = computed((): Array<number> => {
  const goRadarElems: Array<number> = []
  // ['HP', 'こうげき', 'ぼうぎょ']
  goStatsItems.forEach((s) => {
    const r = reverseRank(
        props.race.goPokedex[s.key as keyof typeof props.race.goPokedex] as number,
        props.goPokedexStats[s.statsKey as keyof typeof props.goPokedexStats].list as Array<number>)
    goRadarElems.push(r + 1)
  })
  return goRadarElems
})
</script>
