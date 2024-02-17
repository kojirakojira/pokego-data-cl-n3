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
        検索結果
      </h3>
      <SearchEvolutionEvoInfo
        :pid="cDtoItem.resData.pid"
        :evo-tree-info="cDtoItem.resData.evoTreeInfo"
        :another-forms="cDtoItem.resData.anotherForms"
        :bf-af-aot-forms="cDtoItem.resData.bfAfAotForms"
        :race-map="cDtoItem.resData.raceMap"
        :evo-tree-annos="cDtoItem.resData.evoTreeAnnotations"
        router-link="search-result-evolutionResult"
      />
      <MajorPartsPrevNextPokemon
        :pid="cDtoItem.resData.pid"
        :prev-text-func="
          (gp: GoPokedex) =>
            `&lt; ${editUtils().appendRemarks(gp.name, gp.remarks)}の進化ツリー(図鑑№${editUtils().getPdxNo(gp.pokedexId)})`"
        :next-text-func="
          (gp: GoPokedex) =>
            `${editUtils().appendRemarks(gp.name, gp.remarks)}の進化ツリー(図鑑№${editUtils().getPdxNo(gp.pokedexId)}) &gt;`"
        router-link="search-result-evolutionResult"
      />
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type RouteLocationNormalizedLoaded } from 'vue-router'
import { type GoPokedex } from '~/components/interface/api/dto'
const searchPattern = 'evolution'
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
  const res = await fetchCommon('/api/evolution', 'GET', {
    query: cDtoItem.value.searchParams
  })
  const rd: Record<string, any> = res.data || {}
  if (!searchCommon().pushToast(rd?.message, rd?.msgLevel)) {
    return {}
  }
  return rd
}

let ogpName = ''
let ogpImage = ''
const init = async () => {
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
  ogpName = cDtoItem.value.resData.name
  ogpImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
}

// created
await init()

// 自画面遷移時
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true
  await init()
  isLoading.value = false
})

useHead({
  title: `${ogpName}の進化ツリー`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}の進化ツリー - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${ogpName}の進化ツリーを確認できます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
