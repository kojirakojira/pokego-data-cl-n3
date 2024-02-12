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
          :items="cDtoItem.resData.cpRankList"
          items-per-page="500"
          :items-per-page-options="[500, 1000, -1]"
          class="body-2"
        >
          <template #[`item.goPokedex.pokedexId`]="{ item }">
            {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
          </template>
          <template #[`item.goPokedex.name`]="{ item }">
            {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
          </template>
        </v-data-table>
      </v-container>
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type RouteLocationNormalizedLoaded } from 'vue-router'
const searchPattern = 'cpRankList'
// current dto item
const cDtoItem = ref<ResultDtoItem>({
  searchParams: {
    pid: ''
  },
  resData: {}
})
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

// APIアクセス用get関数
const get = async (): Promise<Record<string, any>> => {
  const res = await fetchCommon('/api/cpRankList', 'GET', {
    query: cDtoItem.value.searchParams
  })
  const rd: Record<string, any> = res.data || {}
  if (!searchCommon().pushToast(rd?.message, rd?.msgLevel)) {
    return {}
  }
  return rd
}

/**
  * searchParams, resDataのセット
  */
const route: RouteLocationNormalizedLoaded = useRoute()
cDtoItem.value.searchParams = {
  pid: route.query.pid
}
// dtoStoreからresDataを復元
const rd: Record<string, any> | null = searchCommon().restoreResData()

if (rd) {
  cDtoItem.value.resData = rd
} else {
  // 存在しない場合は取得する
  cDtoItem.value.resData = await get()
}

isLoading.value = !cDtoItem.value.resData

// Head情報
const ogpName = cDtoItem.value.resData.name
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
