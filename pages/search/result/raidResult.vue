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
                  <v-row v-if="cDtoItem.resData.shadow" class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      シャドウ
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      シャドウとして算出
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
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            天候ブースト時CP
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ `${cDtoItem.resData.wbMinCp} ～ ${cDtoItem.resData.wbMaxCp}` }}
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
import type { MetaObject } from 'nuxt/schema'
import {
  type RaidResponse,
  RaidResultDtoItem,
  RaidResultSearchParams,
  get
} from '~/components/interface/raid'
const searchPattern = 'raid'
// current dto item
const cDtoItem = ref<RaidResultDtoItem>(new RaidResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, RaidResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: RaidResponse | null = searchCommon().restoreResData() as RaidResponse
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
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = useRuntimeConfig().public.staticUrl
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
  return {
    title: `${pokeName}のレイドCP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のレイドCP - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}のレイドCPを確認できます。` },
      { property: 'og:image', content: staticUrl + pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
