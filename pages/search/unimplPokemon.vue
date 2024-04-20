<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container v-if="cDtoItem.resData">
        <v-row>
          <v-col align="right">
            {{ `最終更新日：${cDtoItem.resData.lastUpdated}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col align="right">
            {{ `未実装ポケモン数：${unimplList.length}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list :items="unimplList" lines="three" item-props variant="elevated">
              <template #prepend="{ item }">
                <v-avatar :image="item.prependAvatar" />
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SimpPokemon } from '~/components/interface/api/dto'
import {
  type UnimplPokemonResponse,
  UnimplPokemonResultDtoItem,
  get
} from '~/components/interface/unimplPokemon'

const searchPattern = 'unimplPokemon'
// current dto item
const cDtoItem = ref<UnimplPokemonResultDtoItem>(new UnimplPokemonResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['resData'], cDtoItem.value)

const res: UnimplPokemonResponse = await get()
cDtoItem.value.resData = res

const unimplList = computed(() => {
  const arr: Array<Record<string, any>> = cDtoItem.value.resData.unimplList.map((sp: SimpPokemon) => {
    return {
      prependAvatar: editUtils().getPokemonImageUrl(sp.image1),
      title: editUtils().appendRemarks(sp.name, sp.remarks),
      subtitle: sp.gen,
      id: sp.pokedexId
    }
  })
  return arr
})

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'ポケモンGO未実装ポケモンの一覧を閲覧することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
