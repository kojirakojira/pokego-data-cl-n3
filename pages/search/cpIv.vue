<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
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
              :items="constantUtils().value.SITUATION"
              item-value="k"
              item-title="v"
              label="シチュエーションを選択"
              dense
              outlined
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
          <v-tooltip bottom>
            <template #activator="{ props }">
              <v-icon
                small
                v-bind="props"
              >
                mdi-help-circle
              </v-icon>
            </template>
            <span>フィールドリサーチクリア後のボーナス、タマゴ孵化は、天候ブーストの影響を受けません。</span>
          </v-tooltip>
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
    <SearchResultList
      v-if="cDtoItem.psr.goPokedexList.length !== 0"
      :psr="cDtoItem.psr"
      @click-row="searchCommon().clickRowResultList($event, searchPattern, cDtoItem.searchParams)"
    />
  </div>
</template>

<script setup lang="ts">
const searchPattern = 'cpIv'
// current dto item
const cDtoItem = ref<OnePokeDtoItem>({
  searchParams: {
    situation: 'wild',
    name: '',
    cp: '',
    wbFlg: false
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
  const res: Record<string, any> = await get()
  handleApiResult(res)
}

const check = () => {
  let msg = ''
  msg += validateUtils().checkRequired({ item: cDtoItem.value.searchParams.name, itemName: 'ポケモン' })
  msg += validateUtils().checkRequired({ item: cDtoItem.value.searchParams.cp, itemName: 'CP' })
  msg += validateUtils().checkNumeric({ item: cDtoItem.value.searchParams.cp, itemName: 'CP' })
  return msg
}

const get = async () => {
  return await fetchCommon('/api/cpIv', 'GET', {
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
    return
  }

  if (rd.success) {
    if (rd.pokemonSearchResult.unique) {
      // 1件のみヒットした場合
      cDtoItem.value.resData = rd
      cDtoItem.value.psr = { goPokedexList: [], maybe: false }
      useRouter().push({
        name: 'search-result-cpIvResult',
        query: searchCommon().makeQuery(rd.pokedexId, cDtoItem.value.searchParams)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-cpIv'
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
    { property: 'og:description', content: 'ポケモン、CP、ポケモンを捕まえるときのシチュエーションから、個体値を検索することができます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>
