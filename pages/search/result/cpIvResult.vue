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
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      シチュエーション
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ constantAccessor.getValue(cDtoItem.resData.situation, 'SITUATION') }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
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
import type { MetaObject } from 'nuxt/schema'
import {
  type CpIvResponse,
  CpIvResultDtoItem,
  CpIvResultSearchParams,
  get,
  check
} from '~/components/interface/cpIv'
import { ConstantAccessor } from '~/utils/constantUtils'
const searchPattern = 'cpIv'

// current dto item
const cDtoItem = ref<CpIvResultDtoItem>(new CpIvResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem
const headers = ref<any>([
  { title: '№', key: 'no', sortable: true },
  { title: 'AT', key: 'iva', sortable: true },
  { title: 'DF', key: 'ivd', sortable: true },
  { title: 'HP', key: 'ivh', sortable: true },
  { title: '%', key: 'percent', sortable: true },
  { title: 'PL', key: 'pl', sortable: true }
])

const isLoading = ref<boolean>(true)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)

const init = async () => {
// route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, CpIvResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: CpIvResponse | null = searchCommon().restoreResearchResData() as CpIvResponse

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
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = editUtils().getUrl(cDtoItem.value.resData.image || 'pokego/peripper-eyes.png')
  return {
    title: `${pokeName}のCP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}の個体値 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}のCPから、シチュエーションに応じたあり得る個体値を確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
