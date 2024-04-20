<template>
  <v-container class="widget-item">
    <v-row>
      <v-col class="subtitle-1 py-0 h2-title">
        人気のポケモン
      </v-col>
    </v-row>
    <v-row v-show="!isLoading">
      <v-col>
        <div v-if="isHit">
          <!-- <v-list-item
            v-for="(p, index) in topicPokemons.arr"
            :key="index"
            class="px-0"
            :to="{name: 'search-result-abundance', query: { pid: p.pokedexId }}"
          > -->
          <v-list-item
            v-for="(p, index) in topicPokemons.arr"
            :key="index"
            class="px-0"
          >
            <v-list-item-title class="subtitle-2" :title="p.name">
              <div class="pokemon-icon">
                <v-avatar :image="editUtils().getPokemonImageUrl(p.image1)" />
                <v-icon v-if="index < 3" :color="getTrophyColor(index)" class="trophy">
                  mdi-trophy
                </v-icon>
              </div>
              {{ p.name }}
            </v-list-item-title>
          </v-list-item>
        </div>
        <div v-else class="subtitle-2">
          最近のアクセスはありません。
        </div>
      </v-col>
    </v-row>
    <v-row v-show="isLoading">
      <v-col>
        <Loading />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface TopicPokemonIF {
  pokedexId: string,
  image1: string
  name: string,
  count: number
}
const topicPokemons = ref<Record<string, Array<TopicPokemonIF>>>({
  arr: []
})
const isHit = ref<boolean>(true)
const isLoading = ref<boolean>(true)

onMounted(async () => {
  const res: Array<TopicPokemonIF> = await $fetch(useRuntimeConfig().public.apiUrl + '/api/topicPokemon')
  if (res) {
    topicPokemons.value.arr = res
  }
  isHit.value = !!topicPokemons.value.arr.length

  isLoading.value = false
})

const getTrophyColor = (index: number) => {
  let color = ''
  switch (index + 1) {
    case 1:
      color = 'yellow'
      break
    case 2:
      color = '#F0EFE8'
      break
    case 3:
      color = '#CD7427'
      break
  }
  return color
}
</script>

<style lang="scss">
.pokemon-icon {
  position: relative;
  display: inline-block;

  .trophy {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 40px;
    width: 40px;
  }
}
</style>
