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
                      <span class="cursor-pointer" @click="transitionUtils().abundance(cDtoItem.resData.pokedexId)">
                        {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}
                      </span>
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
        ref="evoInfoRef"
        :pid="cDtoItem.resData.pid"
        :evol-tree-info="cDtoItem.resData.evolTreeInfo"
        :another-forms="cDtoItem.resData.anotherForms"
        :bf-af-aot-forms="cDtoItem.resData.bfAfAotForms"
        :race-map="cDtoItem.resData.raceMap"
        :evol-tree-annos="cDtoItem.resData.evolTreeAnnotations"
        router-link="searchCommon().getRouteName('evolutionResult', true)"
        :grid="[
          { cols: 12, md: 7, lg: 7, xl: 7 },
          { cols: 12, md: 5, lg: 5, xl: 5 }
        ]"
      />
      <MajorPartsPrevNextPokemon
        :pid="cDtoItem.resData.pid"
        :prev-text-func="prevTextFunc"
        :next-text-func="nextTextFunc"
        router-link="searchCommon().getRouteName('evolutionResult', true)"
      />
    </div>
    <div v-else>
      <Loading v-if="isValidInput" full-page />
      <div v-else class="text-center">
        <MajorPartsInvalidInputBackLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import {
  type EvolutionResponse,
  EvolutionResultDtoItem,
  EvolutionResultSearchParams,
  get
} from '~/components/interface/evolution'
import type { GoPokedex } from '~/components/interface/api/dto'
const MajorPartsPrevNextPokemon = defineAsyncComponent(() => import('~/components/majorParts/PrevNextPokemon.vue'))

const searchPattern = 'evolution'
// current dto item
const cDtoItem = ref<EvolutionResultDtoItem>(new EvolutionResultDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, EvolutionResultSearchParams)
  // dtoStoreからresDataを復元
  const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
  const rd: EvolutionResponse | null = restoredParams?.resData

  if (rd && rd.pokedexId) {
    // resDataが復元できた場合
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    // 入力チェック不要
    const ret = await get(cDtoItem.value.searchParams)
    if (!ret) {
      // resが正しくない場合
      isValidInput.value = false
      return
    }
    cDtoItem.value.resData = ret
  }

  isLoading.value = !cDtoItem.value.resData
}

// EvoInfoのref属性
const evoInfoRef = ref()
// 自画面遷移時
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true
  await init()
  if (import.meta.client) { scrollTo(0, 0) }
})

const prevTextFunc = (gp: GoPokedex): string =>
  `< ${editUtils().appendRemarks(gp.name, gp.remarks)}の進化ツリー(図鑑№${editUtils().getPdxNo(gp.pokedexId)})`
const nextTextFunc = (gp: GoPokedex): string =>
  `${editUtils().appendRemarks(gp.name, gp.remarks)}の進化ツリー(図鑑№${editUtils().getPdxNo(gp.pokedexId)}) >`

// created
await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = commonStore().getStaticUrl()
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData?.name || ''
  const pokeImage = `${staticUrl}/public/${cDtoItem.value.resData?.image2 || 'pokego/peripper-eyes.png'}`
  return {
    title: `${pokeName}の進化ツリー`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}の進化ツリー - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}の進化ツリーを確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
