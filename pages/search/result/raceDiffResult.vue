<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row
          v-for="(race, idx) in cDtoItem.resData.raceArr"
          :key="`p-name-${idx}`"
        >
          <v-spacer v-if="!isSmAndDown" />
          <v-col cols="6" md="5" lg="4" xl="3" class="py-0 d-inline-flex align-center">
            <span>
              <v-icon
                size="large"
                style="transform: rotate(90deg);"
                :color="`${layoutMethods().getGraphColor(idx)}`"
              >
                mdi-circle-half-full
              </v-icon>
              {{ editUtils().appendRemarks(race.goPokedex.name, race.goPokedex.remarks) }}
            </span>
          </v-col>
          <v-col cols="6" md="5" lg="4" xl="3" class="py-0 d-inline-flex align-center">
            <SearchType :type="race.goPokedex.type1" />
            <SearchType
              v-if="race.goPokedex.type2"
              :type="race.goPokedex.type2"
              style="margin-left:5px;"
            />
          </v-col>
          <v-spacer v-if="!isSmAndDown" />
        </v-row>
      </v-container>
      <h3>
        GO種族値
        <SearchInputHelpMsg>
          レーダーチャートの凡例をタップすると、特定のポケモンを非表示にできます。<br>
          順位はポケモンGO未実装のポケモンも含みます。
        </SearchInputHelpMsg>
      </h3>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            align="center"
          >
            <GraphRaceDiffGoRadarDiffGraph
              :race-arr="cDtoItem.resData.raceArr"
              :count="cDtoItem.resData.goTotalCount"
            />
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <div class="ma-auto" style="max-width: 550px;">
              <div class="d-flex flex-column">
                <v-data-table
                  :headers="goHeaders"
                  :items="goTableData"
                  items-per-page="-1"
                  no-data-text="loading now..."
                  no-results-text="該当するデータがありません。"
                  class="body-2"
                >
                  <template #[`item.name`]="{ item }">
                    {{ item.name }}
                    <template v-if="item.remarks">
                      <br><span class="caption">{{ `(${item.remarks})` }}</span>
                    </template>
                  </template>
                  <template #[`item.hp`]="{ item }">
                    {{ `${item.hp}` }}<br><span class="caption">{{ `(${item.hpRank}位)` }}</span>
                  </template>
                  <template #[`item.at`]="{ item }">
                    {{ `${item.at}` }}<br><span class="caption">{{ `(${item.atRank}位)` }}</span>
                  </template>
                  <template #[`item.df`]="{ item }">
                    {{ `${item.df}` }}<br><span class="caption">{{ `(${item.dfRank}位)` }}</span>
                  </template>
                  <template #bottom />
                </v-data-table>
                <p align="right" class="subtitle-2">
                  {{ `※全ポケモン${cDtoItem.resData.goTotalCount}体中(未実装、メガ、ゲンシ等含む)` }}
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        原作種族値
        <SearchInputHelpMsg>
          レーダーチャートの凡例をタップすると、特定のポケモンを非表示にできます。
        </SearchInputHelpMsg>
      </h3>
      <v-container>
        <v-row v-if="!cDtoItem.resData.raceArr.filter(race => !race.pokedex).length">
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="12"
            xl="6"
            align="center"
          >
            <GraphRaceDiffOriRadarDiffGraph
              :race-arr="cDtoItem.resData.raceArr"
              :count="cDtoItem.resData.oriTotalCount"
            />
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12" xl="6">
            <div class="ma-auto" style="max-width: 700px;">
              <div class="d-flex flex-column">
                <v-data-table
                  :headers="oriHeaders"
                  :items="oriTableData as Array<OriTableData>"
                  items-per-page="-1"
                  no-data-text="loading now..."
                  no-results-text="該当するデータがありません。"
                >
                  <template #[`item.name`]="{ item }">
                    {{ item.name }}
                    <template v-if="item.remarks">
                      <br><span class="caption">{{ `(${item.remarks})` }}</span>
                    </template>
                  </template>
                  <template #[`item.hp`]="{ item }">
                    {{ `${item.hp}` }}<br><span class="caption">{{ `(${item.hpRank}位)` }}</span>
                  </template>
                  <template #[`item.at`]="{ item }">
                    {{ `${item.at}` }}<br><span class="caption">{{ `(${item.atRank}位)` }}</span>
                  </template>
                  <template #[`item.df`]="{ item }">
                    {{ `${item.df}` }}<br><span class="caption">{{ `(${item.dfRank}位)` }}</span>
                  </template>
                  <template #[`item.spAt`]="{ item }">
                    {{ `${item.spAt}` }}<br><span class="caption">{{ `(${item.spAtRank}位)` }}</span>
                  </template>
                  <template #[`item.spDf`]="{ item }">
                    {{ `${item.df}` }}<br><span class="caption">{{ `(${item.spDfRank}位)` }}</span>
                  </template>
                  <template #[`item.sp`]="{ item }">
                    {{ `${item.sp}` }}<br><span class="caption">{{ `(${item.spRank}位)` }}</span>
                  </template>
                  <template #bottom />
                </v-data-table>
              </div>
              <p align="right" class="subtitle-2">
                {{ `※全ポケモン${cDtoItem.resData.oriTotalCount}体中(メガ、ゲンシ等含む)` }}
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <span class="subtitle-2 text-center">
              {{ cDtoItem.resData.raceArr
                .filter(race => !race.pokedex)
                .map(race => editUtils().appendRemarks(race.name, race.remarks))
                .join(",") + 'は、原作種族値が存在しないため比較できませんでした。' }}
            </span>
          </v-col>
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
import { useDisplay } from 'vuetify'
import { GoPokedex, RaceGoRank, RaceOriRank, type Pokedex } from '~/components/interface/api/dto'
import {
  type RaceDiffResponse,
  RaceDiffResultDtoItem,
  RaceDiffResultSearchParams,
  checkApiError,
  get
} from '~/components/interface/raceDiff'
import { graphCommon } from '~/components/graph/graphCommon'

const searchPattern = 'raceDiff'
/**
 * 画面制御用の定義、処理
 */
// current dto item
const cDtoItem = ref<RaceDiffResultDtoItem>(new RaceDiffResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem
const isLoading = ref<boolean>(true)

const screenControlMethods = () => {
  const init = async () => {
    // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, RaceDiffResultSearchParams)
    // dtoStoreからresDataを復元
    const rd: RaceDiffResponse | null = searchCommon().restoreResearchResData() as RaceDiffResponse
    if (rd) {
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      const ret: RaceDiffResponse = await get(cDtoItem.value.searchParams)
      if (ret && !checkApiError(ret)) {
        throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
      }
      cDtoItem.value.resData = ret
    }

    isLoading.value = !cDtoItem.value.resData
  }
  return {
    init
  }
}

/**
 * 画面全般のレイアウト
 */
// 画面の横幅がsm以下かどうか
const isSmAndDown = useDisplay().smAndDown

const layoutMethods = () => {
  const getGraphColor = (idx: number) => {
    const color: { r: number, g: number, b: number } = graphCommon().colorArr[idx]
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }
  return {
    getGraphColor
  }
}

/**
 * GO種族値用の定義、処理
 */
interface GoTableData {
  name: string,
  remarks: string,
  hp: number,
  at: number,
  df: number,
  hpRank: number,
  atRank: number,
  dfRank: number
}
const goHeaders = [
  { title: '', value: 'name' },
  { title: 'HP', value: 'hp' },
  { title: 'こうげき', value: 'at' },
  { title: 'ぼうぎょ', value: 'df' }
]
const goTableData = computed((): Array<GoTableData> => {
  const raceArr = cDtoItem.value.resData.raceArr
  return raceArr.map((race) => {
    const gp: GoPokedex = race.goPokedex
    const rank: RaceGoRank = race.goRank || new RaceGoRank()
    return {
      name: gp.name,
      remarks: gp.remarks,
      hp: gp.hp,
      at: gp.attack,
      df: gp.defense,
      hpRank: rank.hp,
      atRank: rank.attack,
      dfRank: rank.defense
    }
  })
})

/**
 * GO種族値用の定義、処理
 */
interface OriTableData {
  name: string,
  remarks: string,
  hp: number,
  at: number,
  df: number,
  spAt: number,
  spDf: number,
  sp: number,
  hpRank: number,
  atRank: number,
  dfRank: number,
  spAtRank: number,
  spDfRank: number,
  spRank: number
}
const oriHeaders = [
  { title: '', value: 'name' },
  { title: 'HP', value: 'hp' },
  { title: 'こうげき', value: 'at' },
  { title: 'ぼうぎょ', value: 'df' },
  { title: 'とくこう', value: 'spAt' },
  { title: 'とくぼう', value: 'spDf' },
  { title: 'すばやさ', value: 'sp' }
]
const oriTableData = computed((): Array<OriTableData> => {
  const raceArr = cDtoItem.value.resData.raceArr
  if (raceArr.filter(race => !race.pokedex).length) {
    // 原作種族値が存在しないポケモンが指定された場合
    return []
  }
  return raceArr.map((race) => {
    const pdx: Pokedex = race.pokedex as Pokedex
    const rank: RaceOriRank = race.oriRank || new RaceOriRank()
    return {
      name: pdx.name,
      remarks: pdx.remarks,
      hp: pdx.hp,
      at: pdx.attack,
      df: pdx.defense,
      spAt: pdx.specialAttack,
      spDf: pdx.specialDefense,
      sp: pdx.defense,
      hpRank: rank.hp,
      atRank: rank.attack,
      dfRank: rank.defense,
      spAtRank: rank.specialAttack,
      spDfRank: rank.specialDefense,
      spRank: rank.speed
    }
  })
})

await screenControlMethods().init()

/**
 * Header
 */
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  return {
    title: `${searchCommon().getSearchPatternName(searchPattern)}`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: 'ポケモンの種族値を比較し、どっちのポケモンが強いか調べることができます。' },
      { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
    ]
  }
})
useHead(metaObject)
</script>
