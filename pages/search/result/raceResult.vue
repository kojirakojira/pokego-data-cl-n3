<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row v-if="cDtoItem.resData.filteredItems.length">
          <v-col align="center">
            <SearchInputFilteredItems
              :items="cDtoItem.resData.filteredItems"
              :title-style="'background-color: yellow;'"
            />
            <span v-if="!cDtoItem.resData.included" class="caption">{{ '※' + cDtoItem.resData.message }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card max-width="500px" class="searched-items">
              <v-card-title class="d-block pa-2 searched-params-title">
                検索対象
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
                      タイプ
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <SearchType :type="cDtoItem.resData.race.goPokedex.type1" />
                      <SearchType
                        v-if="cDtoItem.resData.race.goPokedex.type2"
                        :type="cDtoItem.resData.race.goPokedex.type2"
                        style="margin-left:5px;"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      強ポケ補正
                      <SearchInputHelpMsg>
                        ポケモンGOの種族値は、原作の種族値から一定の変換式で算出されます。種族値が高すぎる一部のポケモンは算出された種族値から×0.91されます。
                      </SearchInputHelpMsg>
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <span v-if="cDtoItem.resData.tooStrong" class="red--text">対象</span>
                      <span v-else>対象外</span>
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      ポケモンGO実装
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <span v-if="cDtoItem.resData.race.goPokedex.implFlg">実装済み</span>
                      <span v-else class="font-weight-bold red--text">未実装</span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        GO種族値
        <SearchInputHelpMsg>
          絞り込み条件を設定しなかった場合は、ポケモンGO未実装のポケモンも含みます。<br>グラフの表示は各ステータスの順位を基準としています。
        </SearchInputHelpMsg>
      </h3>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" lg="6" xl="6" align="right">
            <GraphRaceGoRadarGraph
              :go-pokedex="cDtoItem.resData.race.goPokedex"
              :race-go-rank="cDtoItem.resData.race.goRank || new RaceGoRank()"
              :count="cDtoItem.resData.goTotalCount"
            />
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6" class="stats">
            <v-row v-for="item in statsDic.goStatsItems" :key="`go-stats-${item.title}`">
              <v-col cols="6" md="4" lg="4" xl="2" style="text-align: right">
                {{ item.title }}
              </v-col>
              <v-col cols="6" md="8" lg="8" xl="10">
                {{ item.value }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-for="item in statsDic.goStatsItems" :key="`go-line-${item.title}`">
          <v-col>
            <GraphLineGraph
              :title="item.title"
              :dataset="item.stats"
              :point="item.value"
              :color="item.color"
              style="height: 200px;"
            />
          </v-col>
        </v-row>
      </v-container>
      <h3>
        原作種族値
        <SearchInputHelpMsg>
          グラフの表示は各ステータスの順位を基準としています。そうです。この世の中は相対評価なのです。
        </SearchInputHelpMsg>
      </h3>
      <v-container v-if="cDtoItem.resData.race.pokedex">
        <v-row>
          <v-col cols="12" md="6" lg="6" xl="6" align="right">
            <GraphRaceOriRadarGraph
              :pokedex="cDtoItem.resData.race.pokedex"
              :race-ori-rank="cDtoItem.resData.race.oriRank || new RaceOriRank()"
              :count="cDtoItem.resData.oriTotalCount"
            />
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6" class="stats">
            <v-row v-for="item in statsDic.oriStatsItems" :key="`go-stats-${item.title}`">
              <v-col cols="6" md="4" lg="4" xl="2" style="text-align: right">
                {{ item.title }}
              </v-col>
              <v-col cols="6" md="8" lg="8" xl="10">
                {{ item.value }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-for="item in statsDic.oriStatsItems" :key="`ori-line-${item.title}`">
          <v-col>
            <GraphLineGraph
              :title="item.title"
              :dataset="item.stats"
              :point="item.value"
              :color="item.color"
              style="height: 200px;"
            />
          </v-col>
        </v-row>
      </v-container>
      <div v-else class="subtitle-2 text-center">
        {{ `※${editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks)}は、原作種族値が存在しません。` }}
      </div>
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import { RaceGoRank, RaceOriRank, type GoPokedex, type GoPokedexStats, type Pokedex, type PokedexStats } from '~/components/interface/api/dto'
import {
  type RaceResponse,
  RaceResultDtoItem,
  RaceResultSearchParams,
  get
} from '~/components/interface/race'

const searchPattern = 'race'
// current dto item
const cDtoItem = ref<RaceResultDtoItem>(new RaceResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, RaceResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: RaceResponse | null = searchCommon().restoreResearchResData() as RaceResponse

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

interface StatsValue {
  title: string,
  value: number,
  stats: Array<number>,
  color: { r: number, g: number, b: number }
}
// RadarGraph横のやつと、LineGraphを表示するための連想配列
const statsDic = computed((): Record<string, Array<StatsValue>> => {
  const goPokedex: GoPokedex = cDtoItem.value.resData.race.goPokedex
  const goStats: GoPokedexStats = cDtoItem.value.resData.statistics.goPokedexStats
  const dic = {
    goStatsItems: [] as Array<StatsValue>,
    oriStatsItems: [] as Array<StatsValue>
  }

  const goStatsItems: Array<StatsValue> = [
    { title: 'HP', value: goPokedex.hp, stats: goStats.goHpStats.list, color: { r: 0, g: 0, b: 255 } },
    { title: 'こうげき', value: goPokedex.attack, stats: goStats.goAtStats.list, color: { r: 255, g: 0, b: 0 } },
    { title: 'ぼうぎょ', value: goPokedex.defense, stats: goStats.goDfStats.list, color: { r: 0, g: 255, b: 0 } }
  ]
  dic.goStatsItems.push(...goStatsItems)

  const pokedex: Pokedex | null | undefined = cDtoItem.value.resData.race.pokedex
  const pokeStats: PokedexStats = cDtoItem.value.resData.statistics.pokedexStats
  if (!pokedex) {
    // アーマードミュウツー等、ポケモンGOにのみ存在するポケモンの場合
    return dic
  }
  const oriStatsItems: Array<StatsValue> = [
    { title: 'HP', value: pokedex.hp, stats: pokeStats.hpStats.list, color: { r: 0, g: 0, b: 255 } },
    { title: 'こうげき', value: pokedex.attack, stats: pokeStats.atStats.list, color: { r: 255, g: 0, b: 0 } },
    { title: 'ぼうぎょ', value: pokedex.defense, stats: pokeStats.dfStats.list, color: { r: 0, g: 255, b: 0 } },
    { title: 'とくこう', value: pokedex.specialAttack, stats: pokeStats.spAtStats.list, color: { r: 255, g: 20, b: 147 } },
    { title: 'とくぼう', value: pokedex.specialDefense, stats: pokeStats.spDfStats.list, color: { r: 255, g: 255, b: 0 } },
    { title: 'すばやさ', value: pokedex.speed, stats: pokeStats.spStats.list, color: { r: 199, g: 21, b: 133 } }
  ]
  dic.oriStatsItems.push(...oriStatsItems)

  return dic
})

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = editUtils().getUrl(cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png')
  return {
    title: `${pokeName}の種族値`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}の種族値 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}の種族値を確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>

<style>
.stats {
  vertical-align: middle;
  margin: auto;
}
</style>
