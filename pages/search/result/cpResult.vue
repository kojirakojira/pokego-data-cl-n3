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
                  <v-row v-if="cDtoItem.resData.pl" class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      PL
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.resData.pl }}
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
        <v-row>
          <v-col cols="12" md="6" lg="6" xl="6" class="col-title">
            CP
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ cDtoItem.resData.cp }}
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
  type CpResponse,
  CpResultDtoItem,
  CpResultSearchParams,
  get,
  check
} from '~/components/interface/cp'
const searchPattern = 'cp'
// current dto item
const cDtoItem = ref<CpResultDtoItem>(new CpResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, CpResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: CpResponse | null = searchCommon().restoreResData() as CpResponse

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
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = useRuntimeConfig().public.staticUrl
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
  return {
    title: `${pokeName}のCP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のCP - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}の個体値、PLから、CPを確認できます。` },
      { property: 'og:image', content: staticUrl + pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
