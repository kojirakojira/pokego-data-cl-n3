<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>
          関連するポケモン
        </h3>
      </v-col>
    </v-row>
    <v-row v-if="!isLoading" class="my-0">
      <v-col cols="12" sm="6" md="6" lg="6" xl="6">
        <nuxt-link v-if="prev" :to="{ name: routerLink, query: queryFunc(prev) }">
          {{ prevTextFunc(prev) }}
        </nuxt-link>
      </v-col>
      <v-col
        v-if="next"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="6"
        align="right"
      >
        <nuxt-link :to="{ name: routerLink, query: queryFunc(next) }">
          {{ nextTextFunc(next) }}
        </nuxt-link>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <Loading split-scr />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { type GoPokedex } from '~/components/interface/api/dto'

const props = withDefaults(
  defineProps<{
    pid: string, // 図鑑ID
    prevTextFunc: Function,
    nextTextFunc: Function,
    routerLink: string,
    queryFunc?: Function
   }>(),
  { queryFunc: (gp: GoPokedex | null | undefined) => { return { pid: gp?.pokedexId } } }
)
const prev = ref<string>('')
const next = ref<string>('')
const isLoading = ref<boolean>(true)

const get = async () => {
  const res = await fetchCommon('/api/prevNextPokemon', 'GET', {
    query: { pid: props.pid }
  })
  const rd: Record<string, any> = res.data || {}
  return rd
}
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true

  const resData = await get()
  prev.value = resData.prev
  next.value = resData.next

  isLoading.value = false
},
{ immediate: true })
</script>
