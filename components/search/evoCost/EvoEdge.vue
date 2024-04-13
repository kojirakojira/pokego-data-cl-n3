<template>
  <div :class="$style.evo_edge">
    <div :class="$style.evo_edge_flow">
      <SearchEvoCostPokemon
        :class="$style.evo_cost_pokemon"
        :go-pokedex="befGp"
        :click-action="() => { useRouter().push({ name: link, query: { pid: befGp.pokedexId }})}"
      />
      <v-icon class="px-1">
        mdi-arrow-right-bold-box
      </v-icon>
      <SearchEvoCostPokemon
        :class="$style.evo_cost_pokemon"
        :go-pokedex="gp"
        :click-action="() => { useRouter().push({ name: link, query: { pid: gp.pokedexId }})}"
      />
    </div>
    <div v-if="evoEdge.annos.length" :class="$style.evo_edge_annos">
      <p v-for="(anno, i) in evoEdge.annos" :key="`anno-${i}`" style="margin: 0px;">
        {{ `他の進化条件${String.fromCharCode(0x2460 + i)}：${anno}` }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EvolutionEdge } from '~/components/interface/api/dto'

const props = withDefaults(
  defineProps<{
    evoEdge: EvolutionEdge,
    link?: string
   }>(),
  { link: '' }
)

const befGp = computed(() => props.evoEdge.beforeGoPokedex)
const gp = computed(() => props.evoEdge.goPokedex)
</script>

<style lang="scss" module>
.evo_edge {
    display: flex;
    flex-flow: column;
    background: white;
    max-width: 100%;

    .evo_edge_flow {
        display: inline-flex;
        align-items: center;

        .evo_cost_pokemon {
            width: 150px;
        }
    }

    .evo_edge_annos {
        font-size: 10px;
    }
}
</style>
