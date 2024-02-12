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
                  <v-row class="searched-param" align="center">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      個体値<br>(こうげき - ぼうぎょ - HP)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `${cDtoItem.resData.iva} - ${cDtoItem.resData.ivd} - ${cDtoItem.resData.ivh}` }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        PLとCP一覧
      </h3>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="cDtoItem.resData.plList"
          items-per-page="-1"
          class="body-2"
        >
          <template #[`item.percent`]="{ item }">
            {{ item.percent + '%' }}
          </template>
          <template #bottom />
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
const searchPattern = 'plList'
// current dto item
const cDtoItem = ref<ResultDtoItem>({
  searchParams: {
    pid: '',
    iv: null
  },
  resData: {}
})
const dto: any = useAttrs().dto
dto.params = cDtoItem

const headers = ref<any>([
  { title: 'PL', key: 'pl', sortable: true },
  { title: 'CP', key: 'cp', sortable: true }
])
const isLoading = ref<boolean>(true)

// APIアクセス用get関数
const get = async (): Promise<Record<string, any>> => {
  const res = await fetchCommon('/api/plList', 'GET', {
    query: {
      pid: cDtoItem.value.searchParams.pid,
      iva: cDtoItem.value.searchParams.iv.substring(0, 2),
      ivd: cDtoItem.value.searchParams.iv.substring(2, 4),
      ivh: cDtoItem.value.searchParams.iv.substring(4, 6)
    }
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
  iv: route.query.iv
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
  title: `${ogpName}のPLごとのCP`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}のPLごとのCP - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${ogpName}のPLごとのCPを確認できます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
