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
          ポケモン
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-text-field
            v-model="cDtoItem.searchParams.name"
            label="例：ミュウツー"
            outlined
            dense
            rows="1"
            :rules="searchCommon().rules.name"
            :counter="20"
            maxlength="20"
            autocomplete="off"
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
    <SearchResultList
      v-if="cDtoItem.psr.goPokedexList.length !== 0"
      :psr="cDtoItem.psr"
      @click-row="searchCommon().clickRowResultList($event, searchPattern, cDtoItem.searchParams)"
    />
  </div>
</template>

<script setup lang="ts">
const searchPattern = 'scpRankMaxMin'

// current dto item
const cDtoItem = ref<OnePokeDtoItem>({
  searchParams: {
    name: ''
  },
  psr: {
    goPokedexList: [],
    maybe: false
  },
  resData: {}
})
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isSearchBtnClick = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'psr', 'resData'], cDtoItem.value)

/**
 * 検索ボタン押下時の処理
 */
const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check()
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
    return
  }
  const res = await get()
  handleApiResult(res)
}
const check = (): string => {
  let msg = ''
  msg += validateUtils().checkRequired({ item: cDtoItem.value.searchParams.name, itemName: 'ポケモン' })
  return msg
}

const get = async (): Promise<Record<string, any>> => {
  return await fetchCommon('/api/scpRankMaxMin', 'GET', {
    query: {
      name: cDtoItem.value.searchParams.name
    }
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
  if (!success) { return }

  if (rd.success) {
    if (rd.pokemonSearchResult.unique) {
      // 1件のみヒットした場合
      cDtoItem.value.resData = rd
      cDtoItem.value.psr = { goPokedexList: [], maybe: false }
      useRouter().push({
        name: 'search-result-scpRankMaxMin',
        query: searchCommon().makeQuery(rd.pokedexId, cDtoItem.value.searchParams)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-scpRankMaxMin'
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
    { property: 'og:description', content: 'PvPにおける最高個体値、最低個体値を確認することができます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>
