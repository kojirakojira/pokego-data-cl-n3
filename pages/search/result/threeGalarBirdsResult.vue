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
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      CP
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.resData.cp }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      天候ブースト
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.resData.wbFlg ? 'あり' : 'なし' }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col class="subtitle-2">
            野生ポケモンにおけるPLは1～30、個体値はHP、こうげき、ぼうぎょそれぞれ最低値保証はなく0～15の振れ幅があります。天候ブーストの場合、PLは6～35、個体値は4～15になります。
          </v-col>
        </v-row>
      </v-container>
      <h3>
        {{ `個体値一覧(CP${cDtoItem.resData.cp})` }}
      </h3>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="12"
            lg="12"
            xl="12"
            style="text-align: right;"
            class="subtitle-2"
          >
            {{ `該当する個体数：${cDtoItem.resData.ivList?.length}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-data-table
            :headers="headers"
            :items="cDtoItem.resData.ivList"
            items-per-page="-1"
            :items-per-page-options="[50, 100, -1]"
            class="body-2"
          >
            <template #[`item.percent`]="{ item }">
              {{ item.percent + '%' }}
            </template>
          </v-data-table>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteLocationNormalizedLoaded } from 'vue-router'
const searchPattern = 'threeGalarBirds'
const headers = ref<any>([
  { title: '№', key: 'no', sortable: true },
  { title: 'AT', key: 'iva', sortable: true },
  { title: 'DF', key: 'ivd', sortable: true },
  { title: 'HP', key: 'ivh', sortable: true },
  { title: '%', key: 'percent', sortable: true },
  { title: 'PL', key: 'pl', sortable: true }
])
// current dto item
const cDtoItem = ref<ResultDtoItem>({
  searchParams: {
    pid: '',
    cp: '',
    wbFlg: false
  },
  resData: {}
})
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

// APIアクセス用get関数
const get = async (): Promise<Record<string, any>> => {
  const res = await fetchCommon('/api/threeGalarBirds', 'GET', {
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
  pid: route.query.pid,
  cp: route.query.cp,
  wbFlg: route.query.wbFlg === 'true'
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
  title: `${ogpName}の野生個体値`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}の野生個体値 - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `野生で出現した${ogpName}のCPから、有り得る個体値を一覧で表示させることができます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
