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
          <v-col>
            <h3>
              進化後ポケモンのPvP順位
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              v-if="cDtoItem.resData.afEvolIvList.length"
              :headers="headers"
              :items="cDtoItem.resData.afEvolIvList"
              items-per-page="-1"
              class="body-2"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image1)" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width:120px;">
                  {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
                </div>
              </template>
              <template #[`item.slRank`]="{ item }">
                {{ item.slRank || '' }}
                <p v-if="item.slOver" class="caption text-red">
                  CP制限超過
                </p>
              </template>
              <template #[`item.hlRank`]="{ item }">
                {{ item.hlRank || '' }}
                <p v-if="item.hlOver" class="caption text-red">
                  CP制限超過
                </p>
              </template>
              <template #bottom />
            </v-data-table>
            <div v-else class="pl-4" align="center">
              なし
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container
        v-for="(scpRankAio) in cDtoItem.resData.afEvolScpRankList"
        :key="`afEvol-details-${scpRankAio.goPokedex.pokedexId}`"
      >
        <v-row>
          <v-col>
            <h4>
              {{ editUtils().appendRemarks(scpRankAio.goPokedex.name, scpRankAio.goPokedex.remarks) }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="targetHeaders"
              :items="[
                scpRankAio.sl,
                scpRankAio.hl,
                scpRankAio.ml
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
      <v-container>
        <v-row>
          <v-col>
            <h3>
              {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}のPvP順位
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              v-if="cDtoItem.resData.targetGpIv.goPokedex.region !== 'M'"
              :headers="headers"
              :items="[ cDtoItem.resData.targetGpIv ]"
              items-per-page="-1"
              class="body-2"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image1)" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width:120px;">
                  {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
                </div>
              </template>
              <template #bottom />
            </v-data-table>
            <div v-else class="pl-4" align="center">
              メガシンカ状態ではPvP参加不可
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col align="right">
            <p class="link" @click="transitionUtils().abundance(cDtoItem.resData.pokedexId)">
              ポケモン情報をみる >>
            </p>
            <p class="link" @click="transitionUtils().afterEvoScpRank(cDtoItem.resData, cDtoItem.searchParams.iv, cDtoItem.searchParams.cp)">
              検索条件を変更する >>
            </p>
            <p class="link" @click="transitionUtils().scpRank(cDtoItem.resData, cDtoItem.searchParams.iv)">
              進化後PvP順位の詳細を確認する >>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading v-if="isValidInput" split-scr />
      <div v-else>
        <MajorPartsInvalidInputBackLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import {
  type AfterEvoScpRankResponse,
  AfterEvoScpRankResultSearchParams,
  AfterEvoScpRankResultDtoItem,
  get,
  check
} from '~/components/interface/afterEvoScpRank'
const searchPattern = 'afterEvoScpRank'

// current dto item
const cDtoItem = ref<AfterEvoScpRankResultDtoItem>(new AfterEvoScpRankResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const headers = ref<any>([
  { title: '図鑑№', key: 'goPokedex.pokedexId', sortable: false },
  { title: '', key: 'goPokedex.image1', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name', sortable: false },
  { title: 'スーパーリーグ順位', key: 'slRank', sortable: false },
  { title: 'ハイパーリーグ順位', key: 'hlRank', sortable: false },
  { title: 'マスターリーグ順位', key: 'mlRank', sortable: false },
  { title: 'CP', key: 'cp', sortable: false }])
const targetHeaders = readonly<any>([
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
const isValidInput = ref<boolean>(true)

const screenControlMethods = () => {
  const init = async () => {
  // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, AfterEvoScpRankResultSearchParams)
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
    const rd: AfterEvoScpRankResponse | null = restoredParams?.resData

    if (rd && rd.pokedexId) {
    // resDataが復元できた場合
      cDtoItem.value.resData = rd
    } else {
    // 存在しない場合は取得する
      if (check(cDtoItem.value.searchParams)) {
        throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
      }

      const ret = await get(cDtoItem.value.searchParams)
      if (!ret) {
        isValidInput.value = false
        return
      }
      cDtoItem.value.resData = ret
    }

    if (!cDtoItem.value.searchParams.cp && headers.value[headers.value.length - 1].key === 'cp') {
      // cpが未入力の場合はcp列を削除する。
      headers.value.pop()
    }
    isLoading.value = !cDtoItem.value.resData
  }

  return {
    init
  }
}

// created
await screenControlMethods().init()
// 自画面遷移時
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true
  await screenControlMethods().init()
  // evoInfoRef.value.refresh()
  if (import.meta.client) { scrollTo(0, 0) }
  isLoading.value = false
})

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = editUtils().getUrl(cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png')
  return {
    title: `${pokeName}の進化後PvP順位`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}の進化後PvP順位 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}の進化後のPvP順位を確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
