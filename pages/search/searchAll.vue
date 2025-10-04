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
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <SearchInputPokeName
              v-model:name="cDtoItem.searchParams.name"
              v-model:pid="cDtoItem.searchParams.pid"
              :keyup-enter="screenControlMethods().clickSearchBtn"
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
              @click="screenControlMethods().clickSearchBtn"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <template v-if="cDtoItem.pokemonSearchResult && cDtoItem.pokemonSearchResult?.goPokedexList.length > 1">
        <SearchResultList
          :psr="cDtoItem.pokemonSearchResult"
          @click-row="screenControlMethods().transitionResultPage($event, cDtoItem.searchParams)"
        />
      </template>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SearchAllSearchDtoItem,
  type SearchAllResponse,
  check,
  get,
  SearchAllSearchParams
} from '~/components/interface/searchAll'

const searchPattern = 'searchAll'
/**
 * 画面制御用機能
 */
// current dto item
const cDtoItem = ref<SearchAllSearchDtoItem>(new SearchAllSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)
const screenControlMethods = () => {
  /** 初期表示時の処理 */
  const init = (): void => {
    // created: 画面を復元する
    searchCommon().restoreSearchScreen(['searchParams', 'pokemonSearchResult'], cDtoItem.value)
  }

  const clickSearchBtn = async () => {
    isSearchBtnClick.value = true
    const msg = check(cDtoItem.value.searchParams)
    if (msg) {
      alert(msg)
      isSearchBtnClick.value = false
      return
    }
    isLoading.value = true
    if (cDtoItem.value.searchParams.pid) {
    // pidが存在する場合
      transitionResultPage(cDtoItem.value.searchParams.pid, cDtoItem.value.searchParams)
      return
    }
    const res = await get(cDtoItem.value.searchParams)
    if (!res) {
      isSearchBtnClick.value = false
      isLoading.value = false
      return
    }
    handleApiResult(res)
  }

  /**
   * APIのレスポンスを処理する。
   *
   * @param rd
   */
  const handleApiResult = (rd: SearchAllResponse) => {
    if (rd.success) {
      cDtoItem.value.pokemonSearchResult = rd.pokemonSearchResult
      if (rd.pokemonSearchResult.unique) {
        // 1件のみヒットした場合
        transitionResultPage(rd.pokemonSearchResult.goPokedex.pokedexId, cDtoItem.value.searchParams)
      } else {
        // 複数件 or 0件ヒットした場合
        useRouter().replace({
          name: 'search-searchAll'
        })
        isSearchBtnClick.value = false
        isLoading.value = false
      }
    }
  }

  /**
   * result画面に遷移する
   * ここで遷移する場合は、ポケモンが一意に特定できている
   *
   * @param pid
   * @param searchParams
   */
  const transitionResultPage = (pid: string, searchParams: SearchAllSearchParams): void => {
  // searchAllでabundanceの情報を取得することはないため、prePushは不要
  // 遷移
    useRouter().push({
      name: 'search-result-abundance',
      query: searchCommon().makeQuery(pid, searchParams)
    })
  }

  return {
    init,
    clickSearchBtn,
    transitionResultPage
  }
}

screenControlMethods().init()

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'ポケモンの名前から、ポケモンの情報を検索することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
