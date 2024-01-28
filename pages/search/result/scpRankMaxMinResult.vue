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
                    {{ convTableData(cDtoItem.resData.scpSlRankMax as RankData, h.key as keyof TableData, true) }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: blue;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpSlRankMin as RankData, h.key as keyof TableData, false) }}
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
                    {{ convTableData(cDtoItem.resData.scpHlRankMax as RankData, h.key as keyof TableData, true) }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: blue;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpHlRankMin as RankData, h.key as keyof TableData, false) }}
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
                    {{ convTableData(cDtoItem.resData.scpMlRankMax as RankData, h.key as keyof TableData, true) }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="h.key === 'mm' ? 'color: blue;' : undefined"
                  >
                    {{ convTableData(cDtoItem.resData.scpMlRankMin as RankData, h.key as keyof TableData, false) }}
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
import { RouteLocationNormalizedLoaded } from 'vue-router'
interface RankData {
  iva: number,
  ivd: number,
  ivh: number,
  pl: string,
  cp: number,
  percent: number,
  sp: number,
  scp: number
}
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
const searchPattern = 'scpRankMaxMin'
const headers = ref<Record<string, string>[]>([
  { title: '', key: 'mm' },
  { title: 'AT', key: 'iva' },
  { title: 'DF', key: 'ivd' },
  { title: 'HP', key: 'ivh' },
  { title: 'PL', key: 'pl' },
  { title: 'CP', key: 'cp' },
  { title: '%', key: 'percent' }])
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
  const res = await fetchCommon('/api/scpRankMaxMin', 'GET', {
    query: cDtoItem.value.searchParams
  })
  const rd: Record<string, any> = res.data || {}
  if (!searchCommon().pushToast(rd?.message, rd?.msgLevel)) {
    return {}
  }
  return rd
}

/**
 * resDataの"RankData"から、表示用の値を生成する。
 * @param rankData example: resData.scpHlRankMax
 * @param key TableDataのキー
 * @param maxFlg max or min
 */
const convTableData = (rankData: RankData, key: keyof TableData, maxFlg: boolean): string | number => {
  if (key === 'mm') {
    return maxFlg ? '最高個体' : '最低個体'
  }
  return rankData[key]
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

/**
 * Head情報
 */
const ogpName = cDtoItem.value.resData.name
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
