<template>
  <div
    :class="$style.evo_cost_pokemon"
    :style="link || clickAction ? 'cursor: pointer;' : 'pointer-events: none;'"
    @click="clickAction()"
  >
    <v-avatar size="36" style="float:left">
      <v-img :src="editUtils().getPokemonImageUrl(goPokedex.image1)" />
    </v-avatar>
    <span :class="$style.pokemon_name">
      {{ goPokedex.name }}
      <div v-if="goPokedex.remarks" :class="$style.remarks">
        {{ `(${goPokedex.remarks})` }}
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { GoPokedex } from '~/components/interface/api/dto'

withDefaults(
  defineProps<{
    goPokedex: GoPokedex,
    link?: boolean,
    clickAction?: Function
   }>(),
  { link: false, clickAction: () => {} }
)
</script>

<style lang="scss" module>
.evo_cost_pokemon {
    display: flex;
    align-items: center;

  .pokemon_name {
    margin-left: 5px;
    font-size: 14px;

    .remarks {
      font-size: 10px;
    }
  }
}
</style>
