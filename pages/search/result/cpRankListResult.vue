<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col>
            <v-card max-width="500px" class="searched-items">
              <v-card-title class="d-block pa-2 searched-params-title">
                検索条件
              </v-card-title>
              <v-card-text class="caption text-left py-1">
                <v-container>
                  <v-row>
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      図鑑№
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ editUtils().getPdxNo(cDtoItem.resData.pokedexId) }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      ポケモン
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        算出結果
      </h3>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="(cDtoItem.resData.cpRankList)"
          items-per-page="500"
          :items-per-page-options="[500, 1000, -1]"
          class="body-2"
        />
      </v-container>
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type CpRankListResponse,
  CpRankListResultDtoItem,
  CpRankListResultSearchParams,
  get
} from '~/components/interface/cpRankList'
const searchPattern = 'cpRankList'

// current dto item
const cDtoItem = ref<CpRankListResultDtoItem>(new CpRankListResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const headers = ref<any>([
  { title: '順位', key: 'rank', sortable: true },
  { title: 'こうげき', key: 'iva', sortable: true },
  { title: 'ぼうぎょ', key: 'ivd', sortable: true },
  { title: 'HP', key: 'ivh', sortable: true },
  { title: 'CP(PL40)', key: 'cp', sortable: true }
])
const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, CpRankListResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: CpRankListResponse | null = searchCommon().restoreResData() as CpRankListResponse

  if (rd) {
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    // 入力チェック不要
    const ret = await get(cDtoItem.value.searchParams)
    if (!ret) { return }
    cDtoItem.value.resData = ret
  }

  isLoading.value = !cDtoItem.value.resData
}

await init()

// Header
const ogpName = cDtoItem.value.resData.name || ''
const ogpImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
useHead({
  title: `${ogpName}のCPランキング`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}のCPランキング - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${ogpName}のCPランキングを確認することができます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
