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
        </v-row>
      </v-container>
      <h3>スーパーリーグPvP順位</h3>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-table class="body-2">
              <thead>
                <tr>
                  <th v-for="(h, index) in headers" :key="index">
                    {{ h.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: red;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpSlRankMax, h.key as keyof TableData, true) }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: blue;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpSlRankMin, h.key as keyof TableData, false) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-container>
      <h3>ハイパーリーグPvP順位</h3>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-table class="body-2">
              <thead>
                <tr>
                  <th v-for="(h, index) in headers" :key="index">
                    {{ h.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: red;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpHlRankMax, h.key as keyof TableData, true) }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: blue;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpHlRankMin, h.key as keyof TableData, false) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-container>
      <h3>マスターリーグPvP順位</h3>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-table class="body-2">
              <thead>
                <tr>
                  <th v-for="(h, index) in headers" :key="index">
                    {{ h.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: red;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpMlRankMax, h.key as keyof TableData, true) }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: blue;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpMlRankMin, h.key as keyof TableData, false) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
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
import type { ScpRank } from '~/components/interface/api/dto'
import {
  type ScpRankMaxMinResponse,
  ScpRankMaxMinResultDtoItem,
  ScpRankMaxMinResultSearchParams,
  get
} from '~/components/interface/scpRankMaxMin'
const searchPattern = 'scpRankMaxMin'
// current dto item
const cDtoItem = ref<ScpRankMaxMinResultDtoItem>(new ScpRankMaxMinResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

interface TableData {
  mm: string,
  iva: number,
  ivd: number,
  ivh: number,
  pl: string,
  cp: number,
  percent: number,
  sp: number,
  scp: number
}
const headers = ref<Record<string, string>[]>([
  { title: '', key: 'mm' }, // 最高個体 or 最低個体
  { title: 'AT', key: 'iva' },
  { title: 'DF', key: 'ivd' },
  { title: 'HP', key: 'ivh' },
  { title: 'PL', key: 'pl' },
  { title: 'CP', key: 'cp' },
  { title: '%', key: 'percent' }])

const isLoading = ref<boolean>(true)

/**
 * resDataのScpRankから、表示用の値を生成する。
 * @param rankData example: resData.scpHlRankMax
 * @param key TableDataのキー
 * @param maxFlg max or min
 */
const convTableData = (rankData: ScpRank, key: string, maxFlg: boolean): string | number => {
  if (key === 'mm') {
    return maxFlg ? '最高個体' : '最低個体'
  }
  return rankData[key as keyof typeof rankData]
}

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
    .restoreSearchParams(useRoute().query, ScpRankMaxMinResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: ScpRankMaxMinResponse | null = searchCommon().restoreResData() as ScpRankMaxMinResponse

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

// header
const ogpName = cDtoItem.value.resData.name || ''
const ogpImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
useHead({
  title: `${ogpName}のPvP順位の最高・最低`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}のPvP順位の最高・最低 - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${cDtoItem.value.resData.name}のPvP順位の最高・最低を確認できます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
