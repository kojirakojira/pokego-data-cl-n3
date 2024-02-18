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
                      個体値<br>(攻撃 - 防御 - HP)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `${cDtoItem.resData.scpSlRank.iva} - ${cDtoItem.resData.scpSlRank.ivd} - ${cDtoItem.resData.scpSlRank.ivh}` }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        PvP順位
      </h3>
      <v-container>
        <v-row>
          <v-col align="center">
            <p>{{ `スーパーリーグ：${cDtoItem.resData.scpSlRank.rank}位` }}</p>
            <p>{{ `ハイパーリーグ：${cDtoItem.resData.scpHlRank.rank}位` }}</p>
            <p>{{ `マスターリーグ：${cDtoItem.resData.scpMlRank.rank}位` }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="12"
            lg="12"
            xl="12"
            class="col-title"
          >
            詳細
          </v-col>
          <v-col cols="12" md="12" lg="12" xl="12">
            <v-data-table
              :headers="headers"
              :items="[
                cDtoItem.resData.scpSlRank,
                cDtoItem.resData.scpHlRank,
                cDtoItem.resData.scpMlRank
              ]"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
            >
              <template #[`item.league`]="{ item }">
                {{ leagueDic[item.league] }}
              </template>
              <template #[`item.percent`]="{ item }">
                {{ item.percent + '%' }}
              </template>
              <template #bottom />
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
import { type RouteLocationNormalizedLoaded } from 'vue-router'
import { ScpRankResponse, ScpRankResultDtoItem } from '~/components/interface/scpRank'
const searchPattern = 'scpRank'

// current dto item
const cDtoItem = ref<ScpRankResultDtoItem>(new ScpRankResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const headers = readonly<any>([
  { title: 'リーグ', key: 'league' },
  { title: '順位', key: 'rank' },
  { title: 'PL', key: 'pl' },
  { title: 'CP', key: 'cp' },
  { title: '%', key: 'percent' },
  { title: '(SCP)', key: 'scp' },
  { title: '(ステ積)', key: 'sp' }])
const leagueDic = readonly<Record<string, string>>({
  sl: 'スーパー',
  hl: 'ハイパー',
  ml: 'マスター'
})
const isLoading = ref<boolean>(true)

// APIアクセス用get関数
const get = async (): Promise<ScpRankResponse | void> => {
  const res = await fetchCommon('/api/scpRank', 'GET', {
    query: {
      pid: cDtoItem.value.searchParams.pid,
      iva: cDtoItem.value.searchParams.iv.substring(0, 2),
      ivd: cDtoItem.value.searchParams.iv.substring(2, 4),
      ivh: cDtoItem.value.searchParams.iv.substring(4, 6)
    }
  })
  const rd: Record<string, any> = res.data || {}
  if (!searchCommon().pushToast(rd?.message, rd?.msgLevel)) {
    return
  }
  return rd as ScpRankResponse
}

/**
 * searchParams, resDataのセット
 */
const route: RouteLocationNormalizedLoaded = useRoute()
cDtoItem.value.searchParams = {
  pid: String(route.query.pid),
  iv: String(route.query.iv)
}
// dtoStoreからresDataを復元
const rd: ScpRankResponse | null = searchCommon().restoreResData() as ScpRankResponse

if (rd) {
  cDtoItem.value.resData = rd
} else {
  // 存在しない場合は取得する
  const msg = validateUtils().checkIv({ item: cDtoItem.value.searchParams.iv, itemName: '個体値' })
  if (msg) {
    throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
  }
  const ret = await get()
  if (ret) { cDtoItem.value.resData = ret }
}
isLoading.value = !cDtoItem.value.resData

// Head情報
const ogpName = cDtoItem.value.resData.name
const ogpImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
useHead({
  title: `${ogpName}のPvP順位`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}のPvP順位 - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${cDtoItem.value.resData.name}のPvP順位を確認できます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
