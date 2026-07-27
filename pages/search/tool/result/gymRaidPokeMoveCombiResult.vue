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
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      図鑑№
                    </v-col>
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      {{ editUtils().getPdxNo(cDtoItem.resData.pokedexId) }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      ポケモン
                    </v-col>
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
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
      <v-container>
        <v-row>
          <v-col>
            <v-data-table
              id="move-combination-table"
              :headers="headers"
              :items="cDtoItem.resData.moveCombiList"
              items-per-page="-1"
              no-data-text="覚える技が存在しないか、未実装のポケモンです。"
              no-results-text="該当するデータがありません。"
              hover
            >
              <template #[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>
              <template #[`item.faName`]="{ item }">
                <div
                  style="min-width: 100px; cursor: pointer;"
                  @click="transitionUtils().moveLookupResult(item.faMoveId)"
                >
                  {{ item.faName }}
                </div>
              </template>
              <template #[`item.caName`]="{ item }">
                <div
                  style="min-width: 100px; cursor: pointer;"
                  @click="transitionUtils().moveLookupResult(item.faMoveId)"
                >
                  {{ item.caName }}
                </div>
              </template>
              <template #bottom />
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="caption">
              ※1: 「スコア」は、スペシャル技が溜まったら撃つ、溜まったら撃つを繰り返し、5分間攻撃し続けた場合に理論値で出せる最大の火力を示しています。
            </p>
            <p class="caption">
              ※2: シャドウポケモンのみが覚える技であっても、他の技との公平性を考慮してシャドウ倍率は乗せずに算出しています。
            </p>
          </v-col>
        </v-row>
      </v-container>
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
  type GymRaidPokeMoveCombiResponse,
  GymRaidPokeMoveCombiResultDtoItem,
  GymRaidPokeMoveCombiResultSearchParams,
  get
} from '~/components/interface/gymRaidPokeMoveCombi'
const searchPattern = 'gymRaidPokeMoveCombi'
// current dto item
const cDtoItem = ref<GymRaidPokeMoveCombiResultDtoItem>(new GymRaidPokeMoveCombiResultDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const headers = readonly<Array<any>>([
  { title: 'No', key: 'no', align: 'center', sortable: false },
  { title: '通常技', key: 'faName' },
  { title: 'スペシャル技', key: 'caName' },
  {
    title: 'スコア',
    align: 'center',
    children: [
      { title: '通常技', key: 'faAttackScore' },
      { title: 'スペシャル技', key: 'caAttackScore' },
      { title: '合計', key: 'attackScore' }
    ]
  }
])

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, GymRaidPokeMoveCombiResultSearchParams)
  // dtoStoreからresDataを復元
  const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
  const rd: GymRaidPokeMoveCombiResponse | null = restoredParams?.resData

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

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = commonStore().getStaticUrl()
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = `${staticUrl}/public/${cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png'}`
  return {
    title: `${pokeName}の技の組み合わせランキング(ジム・レイド)`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}の技の組み合わせランキング(ジム・レイド) - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `ジム・レイドにおいて、${pokeName}の最も火力がでる最強の技の組み合わせをランキング形式で見ることができます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>

<style lang="scss" module>
.cp_annos {
  list-style: none;
  width: fit-content;
  margin: 0 auto;
}
</style>
