<template>
  <GraphRadarGraph
    title="原作種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ', 'すばやさ', 'とくぼう', 'とくこう']"
    :dataset="rankArr"
    :min="0"
    :max="totalCount"
    :color="race.color"
  />
</template>

<script setup lang="ts">
import type { Pokedex, PokedexStats, Race } from '~/components/interface/api/dto'
import { reverseRank } from '~/components/graph/graphCommon'

const props = withDefaults(
  defineProps<{
    race: Race,
    pokedexStats: PokedexStats
  }>(),
  {})

const oriStatsItems: Array<Record<string, string>> = [
  { key: 'hp', statsKey: 'hpStats' },
  { key: 'attack', statsKey: 'atStats' },
  { key: 'defense', statsKey: 'dfStats' },
  { key: 'speed', statsKey: 'spStats' },
  { key: 'specialDefense', statsKey: 'spDfStats' },
  { key: 'specialAttack', statsKey: 'spAtStats' }]

const totalCount = computed((): number => props.pokedexStats.hpStats.list.length)

const rankArr = computed((): Array<number> => {
  if (!props.race.pokedex) {
    return []
  }
  const pokedex: Pokedex = props.race.pokedex
  const oriRadarElems: Array<number> = []
  // ['HP', 'こうげき', 'ぼうぎょ', 'すばやさ', 'とくぼう', 'とくこう']
  oriStatsItems.forEach((s) => {
    const r = reverseRank(
        pokedex[s.key as keyof typeof pokedex] as number,
        props.pokedexStats[s.statsKey as keyof typeof props.pokedexStats].list as Array<number>)
    oriRadarElems.push(r + 1)
  })
  return oriRadarElems
})
</script>
