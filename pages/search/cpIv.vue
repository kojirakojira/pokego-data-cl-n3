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
            シチュエーション
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <client-only>
              <v-select
                v-model="cDtoItem.searchParams.situation"
                :items="constant.SITUATION"
                item-value="k"
                item-title="v"
                label="シチュエーションを選択"
                hide-details
              />
            </client-only>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            ポケモン
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
            CP
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
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            天候ブースト
            <SearchInputHelpMsg>
              フィールドリサーチクリア後のボーナス、タマゴ孵化は、天候ブーストの影響を受けません。
            </SearchInputHelpMsg>
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-switch
              v-model="cDtoItem.searchParams.wbFlg"
              inset
              hide-details
              :label="cDtoItem.searchParams.wbFlg ? 'あり' : 'なし'"
              :disabled="
                cDtoItem.searchParams.situation === 'frTask' || cDtoItem.searchParams.situation === 'egg'"
              style="margin-top: 0px;"
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
import {
  type CpIvResponse,
  CpIvSearchDtoItem,
  get,
  check
} from '~/components/interface/cpIv'

const searchPattern = 'cpIv'
// current dto item
const cDtoItem = ref<CpIvSearchDtoItem>(new CpIvSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

const constant: ConstantValue = constantUtils().get()

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
const handleApiResult = (rd: CpIvResponse) => {
  if (rd.success) {
    cDtoItem.value.resData = rd
    if (rd.pokemonSearchResult.unique) {
      // 1件のみヒットした場合
      useRouter().push({
        name: 'search-result-cpIvResult',
        query: searchCommon().makeQuery(rd.pokedexId, cDtoItem.value.searchParams)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-cpIv'
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
    { property: 'og:description', content: 'ポケモン、CP、ポケモンを捕まえるときのシチュエーションから、個体値を検索することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
