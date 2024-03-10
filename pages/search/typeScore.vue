<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col>
            <v-btn
              rounded
              size="x-small"
              color="info"
              @click="cDtoItem.searchParams.isPoke = !cDtoItem.searchParams.isPoke"
            >
              <v-icon small>
                mdi-swap-horizontal
              </v-icon>
              入力方法を切り替える
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="cDtoItem.searchParams.isPoke">
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
        <template v-else>
          <v-row>
            <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
              <v-icon>
                mdi-pen
              </v-icon>
              タイプ
              <span class="required-mark">必須</span>
            </v-col>
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-select
                v-model="cDtoItem.searchParams.type1"
                :items="constantUtils().value.TYPE"
                item-value="type"
                item-title="jpn"
                label="タイプ1を入力"
                clearable
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-spacer />
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-select
                v-model="cDtoItem.searchParams.type2"
                :items="constantUtils().value.TYPE"
                item-value="type"
                item-title="jpn"
                label="タイプ2を入力"
                clearable
                hide-details
              />
            </v-col>
          </v-row>
        </template>
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
import {
  TypeScoreSearchParams,
  type TypeScoreResponse,
  TypeScoreSearchDtoItem,
  get,
  check,
  createRequestQuery
} from '~/components/interface/typeScore'

const searchPattern = 'typeScore'

// current dto item
const cDtoItem = ref<TypeScoreSearchDtoItem>(new TypeScoreSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'resData'], cDtoItem.value)

const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check(cDtoItem.value.searchParams)
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
    return
  }

  // リクエスト、画面遷移用のクエリを作成する。（isPokeはリクエストに含まない。）
  const requestQuery: TypeScoreSearchParams =
    createRequestQuery(cDtoItem.value.searchParams) as TypeScoreSearchParams

  isLoading.value = true
  const res = await get(requestQuery)
  if (!res) {
    isSearchBtnClick.value = false
    isLoading.value = false
    return
  }
  handleApiResult(res, requestQuery)
}

/**
 * APIのレスポンスを処理する。
 *
 * @param rd
 */
const handleApiResult = (rd: TypeScoreResponse, requestQuery: TypeScoreSearchParams) => {
  if (rd.success) {
    cDtoItem.value.resData = rd
    if (rd.executedType || rd.pokemonSearchResult.unique) {
      // タイプから検索した場合、またはポケモンで検索して1件のみヒットした場合
      useRouter().push({
        name: 'search-result-typeScoreResult',
        query: searchCommon().makeQuery(rd.pokedexId, requestQuery)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-typeScore'
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
    { property: 'og:description', content: 'タイプの評価を確認することができます。※評価ロジックは当サイト独自です。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>
