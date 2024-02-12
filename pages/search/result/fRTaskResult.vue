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
        CP<span v-if="cDtoItem.resData.mega" class="subtitle-2">
          {{ `（${editUtils().appendRemarks(cDtoItem.resData.befMegaGp.name, cDtoItem.resData.befMegaGp.remarks)}で算出）` }}
        </span>
      </h3>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            通常時CP
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ `${cDtoItem.resData.minCp} ～ ${cDtoItem.resData.maxCp}` }}
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type RouteLocationNormalizedLoaded } from 'vue-router'
const searchPattern = 'fRTask'
// current dto item
const cDtoItem = ref<ResultDtoItem>({
  searchParams: {
    pid: ''
  },
  resData: {}
})
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

// APIアクセス用get関数
const get = async (): Promise<Record<string, any>> => {
  const res = await fetchCommon('/api/fRTask', 'GET', {
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
  shadow: route.query.shadow === 'true'
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
  title: `${ogpName}のフィールドリサーチCP`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}のフィールドリサーチCP - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${cDtoItem.value.resData.name}のフィールドリサーチCPを確認できます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
