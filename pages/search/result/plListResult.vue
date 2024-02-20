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
import {
  PlListResponse,
  PlListResultDtoItem,
  PlListResultSearchParams,
  get,
  check
} from '~/components/interface/plList'
const searchPattern = 'plList'
// current dto item
const cDtoItem = ref<PlListResultDtoItem>(new PlListResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const headers = ref<any>([
  { title: 'PL', key: 'pl', sortable: true },
  { title: 'CP', key: 'cp', sortable: true }
])
const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, PlListResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: PlListResponse | null = searchCommon().restoreResData() as PlListResponse

  if (rd) {
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    if (check(cDtoItem.value.searchParams)) {
      throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
    }

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
