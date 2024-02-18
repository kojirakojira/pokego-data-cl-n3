<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            ポケモン
            <span class="required-mark">必須</span>
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <SearchInputPokeName
              v-model="cDtoItem.searchParams.name"
              :keyup-enter="clickSearchBtn"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isSearchBtnClick"
              @click="clickSearchBtn"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <template v-if="cDtoItem.resData && cDtoItem.resData.pokemonSearchResult?.goPokedexList.length > 1">
        <SearchResultList
          :psr="cDtoItem.resData.pokemonSearchResult"
          @click-row="searchCommon().clickRowResultList($event, searchPattern, cDtoItem.searchParams)"
        />
      </template>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EvolutionSearchDtoItem } from '~/components/interface/evolution'

const searchPattern = 'evolution'
// current dto item
const cDtoItem = ref<EvolutionSearchDtoItem>(new EvolutionSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'resData'], cDtoItem.value)

const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check()
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
    return
  }
  isLoading.value = true
  const res: Record<string, any> = await get()
  handleApiResult(res)
}

const check = () => {
  let msg = ''
  msg += validateUtils().checkRequired({ item: cDtoItem.value.searchParams.name, itemName: 'ポケモン' })
  return msg
}

const get = async () => {
  return await fetchCommon('/api/evolution', 'GET', {
    query: cDtoItem.value.searchParams
  })
}

/**
   * APIのレスポンスを処理する。
   *
   * @param res
   */
const handleApiResult = (res: Record<string, any>) => {
  const rd = res.data

  // メッセージ、メッセージレベルによるハンドリング
  const success = searchCommon().handleApiMessage(rd)
  if (!success) {
    isSearchBtnClick.value = false
    isLoading.value = false
    return
  }

  if (rd.success) {
    cDtoItem.value.resData = rd
    if (rd.pokemonSearchResult.unique) {
      // 1件のみヒットした場合
      useRouter().push({
        name: 'search-result-evolutionResult',
        query: searchCommon().makeQuery(rd.pokedexId, cDtoItem.value.searchParams)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-evolution'
      })
      isSearchBtnClick.value = false
      isLoading.value = false
    }
  }
}

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: '特定のポケモンの進化ツリーを確認できます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>
