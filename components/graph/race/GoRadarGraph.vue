<template>
  <GraphRadarGraph
    title="GO種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ']"
    :dataset="rankArr"
    :min="0"
    :max="totalCount"
    :color="typeColorUtils.getColor(goPokedex.type1, goPokedex.type2)"
  />
</template>

<script setup lang="ts">
import type { GoPokedexStats, GoPokedex } from '~/components/interface/api/dto'
import { reverseRank } from '~/components/graph/graphCommon'
import { TypeColorUtils } from '~/utils/editUtils'

const props = withDefaults(
  defineProps<{
    goPokedex: GoPokedex,
    goPokedexStats: GoPokedexStats
  }>(),
  {})

const constant: ConstantValue = constantUtils().get()
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)

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
        props.goPokedex[s.key as keyof typeof props.goPokedex] as number,
        props.goPokedexStats[s.statsKey as keyof typeof props.goPokedexStats].list as Array<number>)
    goRadarElems.push(r + 1)
  })
  return goRadarElems
})
</script>
