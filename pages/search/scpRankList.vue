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
            リーグ
            <span class="required-mark">必須</span>
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-select
              v-model="cDtoItem.searchParams.league"
              :items="leagueArr"
              item-value="key"
              label="リーグを選択"
              dense
              outlined
              hide-details
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
  ScpRankListSearchDtoItem,
  type ScpRankListResponse,
  get,
  check
} from '~/components/interface/scpRankList'

const searchPattern = 'scpRankList'

// current dto item
const cDtoItem = ref<ScpRankListSearchDtoItem>(new ScpRankListSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const leagueArr = readonly<Array<Record<string, string>>>([
  { key: 'sl', title: 'スーパーリーグ' },
  { key: 'hl', title: 'ハイパーリーグ' },
  { key: 'ml', title: 'マスターリーグ' }
])

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
const handleApiResult = (rd: ScpRankListResponse) => {
  if (rd.success) {
    cDtoItem.value.resData = rd
    if (rd.pokemonSearchResult.unique) {
      // 1件のみヒットした場合
      useRouter().push({
        name: 'search-result-scpRankListResult',
        query: searchCommon().makeQuery(rd.pokedexId, cDtoItem.value.searchParams)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-scpRankList'
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
    { property: 'og:description', content: 'PvP順位のランキングを確認できます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
