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
          <SearchInputPokeName
            v-model="cDtoItem.searchParams.name"
            :keyup-enter="clickSearchBtn"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" md="4" lg="4" xl="4" class="col-title">
          <v-icon>
            mdi-pen
          </v-icon>
          シャドウ
        </v-col>
        <v-col cols="8" md="8" lg="8" xl="8">
          <ClientOnly>
            <v-switch
              v-model="cDtoItem.searchParams.shadow"
              inset
              :label="cDtoItem.searchParams.shadow ? 'シャドウとして算出' : ''"
              color="purple"
            />
          </ClientOnly>
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
const searchPattern = 'raid'
// current dto item
const cDtoItem = ref<OnePokeDtoItem>({
  searchParams: {
    shadow: false,
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
  return validateUtils().checkRequired({ item: cDtoItem.value.searchParams.name, itemName: 'ポケモン' })
}

const get = async () => {
  return await fetchCommon('/api/raid', 'GET', { query: cDtoItem.value.searchParams })
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
        name: 'search-result-raidResult',
        query: searchCommon().makeQuery(rd.pokedexId, cDtoItem.value.searchParams)
      })
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: 'search-raid'
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
    { property: 'og:description', content: 'レイドバトル後にゲットできるポケモンのCPの振れ幅を確認できます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>
