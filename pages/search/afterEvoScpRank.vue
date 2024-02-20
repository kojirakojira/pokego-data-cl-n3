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
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            個体値
            <span class="required-mark">必須</span>
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <SearchInputIv
              v-model="cDtoItem.searchParams.iv"
              :keyup-enter="clickSearchBtn"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            CP
            <div class="optional-mark">
              <span>任意</span>
            </div>
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-icon v-bind="props" size="small">
                  mdi-help-circle
                </v-icon>
              </template>
              <span>入力すると、進化後のCPもいっしょに調べることができます。</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-text-field
              v-model="cDtoItem.searchParams.cp"
              label="例：4049"
              outlined
              dense
              autocomplete="off"
              type="number"
              @keyup.enter.exact="clickSearchBtn"
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
              @click="clickSearchBtn()"
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
  AfterEvoScpRankSearchDtoItem,
  type
  AfterEvoScpRankResponse,
  get,
  check
} from '~/components/interface/afterEvoScpRank'

const searchPattern = 'afterEvoScpRank'

// current dto item
const cDtoItem = ref<AfterEvoScpRankSearchDtoItem>(new AfterEvoScpRankSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'resData'], cDtoItem.value)

/**
 * 検索ボタン押下時の処理
 */
const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check(cDtoItem.value.searchParams)
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
    return
  }
  isLoading.value = true
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
const handleApiResult = (rd: AfterEvoScpRankResponse) => {
  if (rd.success) {
    cDtoItem.value.resData = rd
    if (rd.pokemonSearchResult.unique) {
      // 1件のみヒットした場合
      useRouter().push({
        name: 'search-result-afterEvoScpRankResult',
        query: searchCommon().makeQuery(rd.pokedexId, cDtoItem.value.searchParams)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-afterEvoScpRank'
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
    { property: 'og:description', content: '進化後のPvP順位のランキングを確認できます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>

<style>
/* 入力ボックスフォーカス時に出てくる上下矢印のボタンを非表示にする。 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
  -moz-appearance:textfield;
}
</style>
