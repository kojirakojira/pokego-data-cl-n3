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
              v-model:name="cDtoItem.searchParams.name"
              v-model:pid="cDtoItem.searchParams.pid"
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
            PL
            <span class="required-mark">必須</span>
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-select
              v-model="cDtoItem.searchParams.pl"
              :items="constant.PL"
              label="PLを選択"
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
              @click="clickSearchBtn"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <template v-if="cDtoItem.pokemonSearchResult && cDtoItem.pokemonSearchResult?.goPokedexList.length > 1">
        <SearchResultList
          :psr="cDtoItem.pokemonSearchResult"
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
  CpSearchDtoItem,
  type CpResponse,
  type CpSearchParams,
  get,
  check
} from '~/components/interface/cp'

const searchPattern = 'cp'
// current dto item
const cDtoItem = ref<CpSearchDtoItem>(new CpSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

const constant: ConstantValue = constantUtils().get()

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'pokemonSearchResult'], cDtoItem.value)

const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check(cDtoItem.value.searchParams)
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
    return
  }
  if (cDtoItem.value.searchParams.pid) {
    // pidが存在する場合
    transitionResultPage(cDtoItem.value.searchParams.pid, cDtoItem.value.searchParams)
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
const handleApiResult = (rd: CpResponse) => {
  if (rd.success) {
    cDtoItem.value.pokemonSearchResult = rd.pokemonSearchResult
    if (rd.pokemonSearchResult.unique) {
      // 1件のみヒットした場合
      transitionResultPage(rd.pokedexId, cDtoItem.value.searchParams, rd)
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-cp'
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
 * @param resData
 */
const transitionResultPage = (pid: string, searchParams: CpSearchParams, resData?: CpResponse): void => {
  // result画面にresDataをセット
  const pathName: string = 'search-result-cpResult'
  const params: Record<string, any> = {}
  if (resData) { params.resData = resData }
  dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
    pathName,
    {},
    params,
    true
  ))
  // 遷移
  useRouter().push({
    name: pathName,
    query: searchCommon().makeQuery(pid, searchParams)
  })
}

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: '個体値、PLを入力することにより、CPを求めることができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
