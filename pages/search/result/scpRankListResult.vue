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
                      リーグ
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ leagueDic[cDtoItem.resData.league] }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>PvP順位</h3>
      <v-container>
        <v-row>
          <v-col
            style="text-align: right;"
          >
            <v-btn
              rounded
              color="info"
              size="x-small"
              @click="onClickScpSpBtn"
            >
              {{ headers.length === 7 ? 'SCP,ステ積を表示する': 'SCP,ステ積を非表示にする' }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="12" lg="12" xl="12">
            <v-data-table
              :headers="headers"
              :items="cDtoItem.resData.scpRankList"
              items-per-page="100"
              :items-per-page-options="[100, 500, 1000, -1]"
              class="body-2"
            >
              <template #[`item.percent`]="{ item }">
                {{ item.percent + '%' }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading split-scr />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import {
  type ScpRankListResponse,
  ScpRankListResultDtoItem,
  ScpRankListResultSearchParams,
  get,
  check
} from '~/components/interface/scpRankList'
const searchPattern = 'scpRankList'

// current dto item
const cDtoItem = ref<ScpRankListResultDtoItem>(new ScpRankListResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const headers = ref<any>([
  { title: 'ランク', key: 'rank' },
  { title: 'AT', key: 'iva' },
  { title: 'DF', key: 'ivd' },
  { title: 'HP', key: 'ivh' },
  { title: 'PL', key: 'pl' },
  { title: 'CP', key: 'cp' },
  { title: '%', key: 'percent' }])
const leagueDic = readonly<Record<string, string>>({
  sl: 'スーパーリーグ(CP1500以下)',
  gl: 'スーパーリーグ(CP1500以下)',
  hl: 'ハイパーリーグ(CP2500以下)',
  ul: 'ハイパーリーグ(CP2500以下)',
  ml: 'マスターリーグ'
})

const isLoading = ref<boolean>(true)

/**
 * SCP,ステ積表示ボタン押下時のイベント
 */
const onClickScpSpBtn = () => {
  if (headers.value.length === 7) {
    // 非表示時
    headers.value.push({ title: '(SCP)', key: 'scp' })
    headers.value.push({ title: '(ステ積)', key: 'sp' })
  } else if (headers.value.length === 9) {
    // 表示時
    headers.value.pop()
    headers.value.pop()
  }
}

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, ScpRankListResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: ScpRankListResponse | null = searchCommon().restoreResData() as ScpRankListResponse

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
    title: `${pokeName}のPvP順位の一覧`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のPvP順位の一覧 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}のPvP順位の一覧を確認できます。` },
      { property: 'og:image', content: staticUrl + pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
