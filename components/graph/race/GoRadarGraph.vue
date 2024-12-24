<template>
  <GraphRadarGraph
    title="GO種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ']"
    :dataset="rankArr"
    :min="0"
    :max="count"
    :color="typeColorUtils.getColor(goPokedex.type1, goPokedex.type2)"
  />
</template>

<script setup lang="ts">
import type { GoPokedex, RaceGoRank } from '~/components/interface/api/dto'
import { TypeColorUtils } from '~/utils/editUtils'

const props = withDefaults(
  defineProps<{
    goPokedex: GoPokedex,
    raceGoRank: RaceGoRank,
    count: number
  }>(),
  {})

const constant: ConstantValue = constantUtils().get()
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)

const rankArr = computed((): Array<number> => {
  const goRank = props.raceGoRank
  // ['HP', 'こうげき', 'ぼうぎょ']
  return [goRank.hp, goRank.attack, goRank.defense]
    .map(num => props.count - num + 1)
})
</script>
