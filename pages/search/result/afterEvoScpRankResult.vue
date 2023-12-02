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
                      個体値<br>(こうげき - ぼうぎょ - HP)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `${cDtoItem.resData.iva} - ${cDtoItem.resData.ivd} - ${cDtoItem.resData.ivh}` }}
                    </v-col>
                  </v-row>
                  <v-row v-if="cDtoItem.resData.cp" class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      CP
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.resData.cp }}
                    </v-col>
                  </v-row>
                  <v-row v-if="cDtoItem.resData.pl" class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      (PL)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `(${cDtoItem.resData.pl})` }}
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
          <v-col cols="12">
            <h3>
              進化後のポケモン
            </h3>
            <v-data-table
              v-if="cDtoItem.resData.afEvoList.length"
              :headers="headers"
              :items="cDtoItem.resData.afEvoList"
              :items-per-page-options="[-1]"
              class="body-2"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image`]="{ item }">
                <!-- <v-avatar size="36" style="float:left">
                  <v-img :src="item.goPokedex.image ? item.goPokedex.image : require('~/static/img/no-image.png')" />
                </v-avatar> -->
                <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image)" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width:120px;">
                  {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
                </div>
              </template>
              <template #bottom />
            </v-data-table>
            <div v-else class="pl-4">
              なし
            </div>
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
const searchPattern = 'scpRank'
const headers = ref<any>([
  { title: '図鑑№', key: 'goPokedex.pokedexId', sortable: false },
  { title: '', key: 'goPokedex.image', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name', sortable: false },
  { title: 'スーパーリーグ順位', key: 'slRank', sortable: false },
  { title: 'ハイパーリーグ順位', key: 'hlRank', sortable: false },
  { title: 'マスターリーグ順位', key: 'mlRank', sortable: false },
  { title: 'CP', key: 'cp', sortable: false }])
// current dto item
const cDtoItem = ref<ResultDtoItem>({
  searchParams: {
    pid: '',
    iv: '',
    cp: ''
  },
  resData: {}
})
const dto: any = useAttrs().dto
dto.params = cDtoItem
const isLoading = ref<boolean>(true)

// APIアクセス用get関数
const get = async (): Promise<Record<string, any>> => {
  const res = await fetchCommon('/api/afterEvoScpRank', 'GET', {
    query: {
      id: cDtoItem.value.searchParams.pid,
      iva: cDtoItem.value.searchParams.iv.substring(0, 2),
      ivd: cDtoItem.value.searchParams.iv.substring(2, 4),
      ivh: cDtoItem.value.searchParams.iv.substring(4, 6),
      cp: cDtoItem.value.searchParams.cp
    }
  })
  const rd: Record<string, any> = res.data || {}
  if (!searchCommon().pushToast(rd?.message, rd?.msgLevel)) {
    return {}
  }
  return rd
}

/**
 * searchParams, resDataのセット
 */
const route: RouteLocationNormalizedLoaded = useRoute()
cDtoItem.value.searchParams = {
  pid: route.query.pid ? route.query.pid.toString() : '',
  iv: route.query.iv,
  cp: route.query.cp
}
// dtoStoreからresDataを復元
const rd: Record<string, any> | null = searchCommon().restoreResData()

if (rd) {
  cDtoItem.value.resData = rd
} else {
  // 存在しない場合は取得する
  let msg = ''
  msg += validateUtils().checkIv({ item: cDtoItem.value.searchParams.iv, itemName: '個体値' })
  msg += cDtoItem.value.searchParams.cp
    ? validateUtils().checkNumeric({ item: cDtoItem.value.searchParams.cp, itemName: 'CP' })
    : ''
  if (msg) {
    throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
  }

  cDtoItem.value.resData = await get()
}

if (!cDtoItem.value.searchParams.cp && headers.value[headers.value.length - 1].key === 'cp') {
  // cpが未入力の場合はcp列を削除する。
  headers.value.pop()
}
isLoading.value = !cDtoItem.value.resData

// Head情報
const ogpName = cDtoItem.value.resData.name
const ogpImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
useHead({
  title: `${ogpName}の進化後PvP順位`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpName}の進化後PvP順位 - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${cDtoItem.value.resData.name}の進化後のPvP順位を確認できます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + ogpImage }
  ]
})
</script>
