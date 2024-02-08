<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <v-container>
      <v-row>
        <v-col>
          <v-btn
            rounded
            small
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
              item-value="k"
              item-title="v"
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
              item-value="k"
              item-title="v"
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
    <SearchResultList
      v-if="cDtoItem.psr.goPokedexList.length !== 0"
      :psr="cDtoItem.psr"
      @click-row="searchCommon().clickRowResultList($event, searchPattern, cDtoItem.searchParams)"
    />
  </div>
</template>

<script setup lang="ts">
const searchPattern = 'typeScore'
interface RequestQuery {
    name?: string,
    type1?: string,
    type2?: string
}
// current dto item
const cDtoItem = ref<OnePokeDtoItem>({
  searchParams: {
    type1: '',
    type2: '',
    name: '',
    isPoke: false
  },
  psr: {
    goPokedexList: [],
    maybe: false
  },
  resData: {}
})
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isSearchBtnClick = ref(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'psr', 'resData'], cDtoItem.value)

const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check()
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
    return
  }

  // リクエスト、画面遷移用のクエリを作成する。
  const requestQuery: RequestQuery = {}
  if (cDtoItem.value.searchParams.isPoke) {
    // ポケモン
    requestQuery.name = cDtoItem.value.searchParams.name
  } else {
    // タイプ
    const sp = cDtoItem.value.searchParams
    if (sp.type1) { requestQuery.type1 = sp.type1 }
    if (sp.type2) { requestQuery.type2 = sp.type2 }
  }

  const res: Record<string, any> = await get(requestQuery)
  handleApiResult(res, requestQuery)
}

const check = () => {
  let msg = ''
  if (cDtoItem.value.searchParams.isPoke) {
    msg += validateUtils().checkRequired({ item: cDtoItem.value.searchParams.name, itemName: 'ポケモン' })
  } else if (!cDtoItem.value.searchParams.type1 && !cDtoItem.value.searchParams.type2) {
    msg += '「タイプ」は少なくともどちらか一方を入力してください。'
  }
  return msg
}

const get = async (requestQuery: RequestQuery) => {
  return await fetchCommon('/api/typeScore', 'GET', {
    query: requestQuery
  })
}

/**
   * APIのレスポンスを処理する。
   *
   * @param res
   */
const handleApiResult = (res: Record<string, any>, requestQuery: RequestQuery) => {
  const rd = res.data

  // メッセージ、メッセージレベルによるハンドリング
  let success = false
  if (rd.executedType) {
    // タイプで検索した場合
    success = searchCommon().pushToast(
      rd.message,
      rd.msgLevel)
  } else {
    // ポケモンで検索した場合
    success = searchCommon().handleApiMessage(rd)
  }
  if (!success) {
    isSearchBtnClick.value = false
    return
  }

  if (rd.success) {
    if (rd.executedType || rd.pokemonSearchResult.unique) {
      // タイプから検索した場合、またはポケモンで検索して1件のみヒットした場合
      cDtoItem.value.resData = rd
      cDtoItem.value.psr = { goPokedexList: [], maybe: false }
      useRouter().push({
        name: 'search-result-typeScoreResult',
        query: searchCommon().makeQuery(rd.pokedexId, requestQuery)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-typeScore'
      })
      cDtoItem.value.psr = rd.pokemonSearchResult
      isSearchBtnClick.value = false
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
