<template>
  <GraphRadarGraph
    v-if="pokedex"
    title="原作種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ', 'すばやさ', 'とくぼう', 'とくこう']"
    :dataset="rankArr"
    :min="0"
    :max="count"
    :color="typeColorUtils.getColor(pokedex.type1, pokedex.type2)"
  />
</template>

<script setup lang="ts">
import type { Pokedex, RaceOriRank } from '~/components/interface/api/dto'
import { TypeColorUtils } from '~/utils/editUtils'

const props = withDefaults(
  defineProps<{
    pokedex: Pokedex | null,
    raceOriRank: RaceOriRank,
    count: number
  }>(),
  { pokedex: null })

const constant: ConstantValue = constantUtils().get()
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)

const rankArr = computed((): Array<number> => {
  if (!props.pokedex) {
    return []
  }
  const oriRank: RaceOriRank = props.raceOriRank
  // ['HP', 'こうげき', 'ぼうぎょ', 'すばやさ', 'とくぼう', 'とくこう']
  return [
    oriRank.hp,
    oriRank.attack,
    oriRank.defense,
    oriRank.speed,
    oriRank.specialDefense,
    oriRank.specialAttack
  ]
})
</script>
