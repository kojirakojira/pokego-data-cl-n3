<template>
  <div>
    <div v-if="isLoadedAbundance">
      <MajorPartsH2Common>
        {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}
      </MajorPartsH2Common>
      <v-container v-if="isLoadedAbundance">
        <v-row>
          <v-col align="center">
            <v-img
              :src="editUtils().getPokemonImageUrl(cDtoItem.resData.image)"
              rounded
              max-width="200px"
              aspect-ratio="1"
            />
          </v-col>
        </v-row>
      </v-container>
      <div v-else>
        <Loading full-page />
      </div>
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" md="7" lg="8" xl="8">
          <!-- abundanceの表 -->
          <h3>基本情報</h3>
          <v-container
            v-if="isLoadedAbundance"
            class="basic-info-table abundance-basic-info-table"
          >
            <v-row>
              <v-col cols="5">
                図鑑No
              </v-col>
              <v-col cols="7">
                {{ editUtils().getPdxNo(cDtoItem.resData.pokedexId) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                ポケモン
              </v-col>
              <v-col cols="7">
                {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                タイプ
              </v-col>
              <v-col cols="7">
                <SearchType :type="cDtoItem.resData.goPokedex.type1" />
                <SearchType
                  v-if="cDtoItem.resData.goPokedex.type2"
                  :type="cDtoItem.resData.goPokedex.type2"
                  style="margin-left:5px;"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                世代
              </v-col>
              <v-col cols="7">
                {{ constantAccessor.getValue(cDtoItem.resData.goPokedex.gen, 'GEN') }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                PokémonGO実装
              </v-col>
              <v-col cols="7">
                <span v-if="cDtoItem.resData.goPokedex.implFlg">実装済</span>
                <span v-else class="text-red">未実装</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                強ポケ補正
              </v-col>
              <v-col cols="7">
                <span v-if="cDtoItem.resData.tooStrong" class="text-red">対象</span>
                <span v-else>対象外</span>
              </v-col>
            </v-row>
          </v-container>
          <div v-else>
            <Loading />
          </div>
          <h3>CP</h3>
          <v-container
            v-if="isLoadedAbundance"
            class="basic-info-table abundance-cp-table"
          >
            <v-row>
              <v-col cols="5">
                CP(PL40)
              </v-col>
              <v-col cols="7">
                {{ cDtoItem.resData.cp40 }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                CP(PL50)
              </v-col>
              <v-col cols="7">
                {{ cDtoItem.resData.cp50 }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                最大CP(PL51)
              </v-col>
              <v-col cols="7">
                {{ cDtoItem.resData.maxCp }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                レイドCP
                <SearchInputHelpMsg v-if="cDtoItem.resData.mega">
                  捕獲時はメガシンカ進化前になることご注意ください。
                </SearchInputHelpMsg>
              </v-col>
              <v-col cols="7">
                {{ `${cDtoItem.resData.raid.min} ～ ${cDtoItem.resData.raid.max}` }}
                <p class="caption my-0">
                  {{ `天候ブースト時:${cDtoItem.resData.raid.wbMin} ～ ${cDtoItem.resData.raid.wbMax}` }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                ロケット団勝利ボーナスCP
              </v-col>
              <v-col cols="7">
                {{ `${cDtoItem.resData.rocket.min} ～ ${cDtoItem.resData.rocket.max}` }}
                <p class="caption my-0">
                  {{ `天候ブースト時:${cDtoItem.resData.rocket.wbMin} ～ ${cDtoItem.resData.rocket.wbMax}` }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                フィールドリサーチCP
              </v-col>
              <v-col cols="7">
                {{ `${cDtoItem.resData.fRTask.min} ～ ${cDtoItem.resData.fRTask.max}` }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                タマゴCP
              </v-col>
              <v-col cols="7">
                {{ `${cDtoItem.resData.egg.min} ～ ${cDtoItem.resData.egg.max}` }}
              </v-col>
            </v-row>
          </v-container>
          <div v-else>
            <Loading />
          </div>
          <!-- 種族値 -->
          <h3>種族値</h3>
          <v-container v-if="isLoadedRace">
            <v-row class="race">
              <v-col>
                <GraphRaceGoRadarGraph
                  :go-pokedex="cDtoItem.raceResData.race.goPokedex"
                  :go-pokedex-stats="cDtoItem.raceResData.statistics.goPokedexStats"
                />
              </v-col>
              <v-col
                cols="12"
                sm="5"
                md="5"
                lg="5"
                xl="5"
                class="stats"
              >
                <v-container>
                  <v-row v-for="item in statsDic.goStatsItems" :key="`go-col-${item.title}`">
                    <v-col cols="6" style="text-align: right">
                      {{ item.title }}
                    </v-col>
                    <v-col cols="6">
                      {{ item.value }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
          <div v-else>
            <Loading />
          </div>
          <!-- タイプ倍率 -->
          <h3>タイプ倍率</h3>
          <v-container v-if="isLoadedTypeScore">
            <v-container v-if="cDtoItem.typeScoreResData.typeComments">
              <v-row>
                <v-col>
                  <SearchTypeComments
                    :comments="cDtoItem.typeScoreResData.typeComments"
                    :type1="cDtoItem.typeScoreResData.type1"
                    :type2="cDtoItem.typeScoreResData.type2"
                    :name="cDtoItem.typeScoreResData.name"
                    :remarks="cDtoItem.typeScoreResData.remarks"
                  />
                </v-col>
              </v-row>
            </v-container>
            <h4>
              こうげき時
              <SearchInputHelpMsg>
                タイプ一致時のダメージ倍率を示しています。ここから×1.2倍されます。
              </SearchInputHelpMsg>
            </h4>
            <SearchTypeAtkDmgMult
              :type1="cDtoItem.typeScoreResData.type1"
              :type2="cDtoItem.typeScoreResData.type2"
              :def-type-dic1="cDtoItem.typeScoreResData.attackerType1Map"
              :def-type-dic2="cDtoItem.typeScoreResData.attackerType2Map"
            />
            <h4>ぼうぎょ時</h4>
            <SearchTypeDefDmgMult
              :type1="cDtoItem.typeScoreResData.type1"
              :type2="cDtoItem.typeScoreResData.type2"
              :atk-type-dic="cDtoItem.typeScoreResData.defenderTypeMap"
            />
          </v-container>
          <div v-else>
            <Loading />
          </div>
        </v-col>
        <v-col cols="12" md="5" lg="4" xl="4">
          <h3>
            進化
          </h3>
          <div class="evolution">
            <SearchEvolutionEvoInfo
              v-if="isLoadedEvolution"
              ref="evoInfoRef"
              :pid="cDtoItem.evoResData.pid"
              :evo-tree-info="cDtoItem.evoResData.evoTreeInfo"
              :another-forms="cDtoItem.evoResData.anotherForms"
              :bf-af-aot-forms="cDtoItem.evoResData.bfAfAotForms"
              :race-map="cDtoItem.evoResData.raceMap"
              :evo-tree-annos="cDtoItem.evoResData.evoTreeAnnotations"
              router-link="search-result-abundance"
            />
            <div v-else>
              <Loading />
            </div>
          </div>
          <!-- <h3>もっと調べる</h3> -->
        </v-col>
      </v-row>
    </v-container>
    <div v-if="isLoadedAbundance">
      <MajorPartsPrevNextPokemon
        ref="prevNextRef"
        :pid="cDtoItem.resData.goPokedex.pokedexId"
        :prev-text-func="
          (gp: GoPokedex) =>
            `&lt; ${editUtils().appendRemarks(gp.name, gp.remarks)}(図鑑№${editUtils().getPdxNo(gp.pokedexId)})`"
        :next-text-func="
          (gp: GoPokedex) =>
            `${editUtils().appendRemarks(gp.name, gp.remarks)}(図鑑№${editUtils().getPdxNo(gp.pokedexId)}) &gt;`"
        router-link="search-result-abundance"
        :prev-grid="{ cols: 12 }"
        :next-grid="{ cols: 12 }"
      />
    </div>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>

<script setup lang="ts">
// import type { MetaObject } from 'nuxt/schema'
import { ConstantAccessor, TypeColorUtils } from '#imports'
import {
  type AbundanceResponse,
  AbundanceResultDtoItem,
  AbundanceResultSearchParams,
  get
} from '~/components/interface/abundance'
import type { ResearchResponse } from '~/components/interface/api/response'
import type { EvolutionResponse } from '~/components/interface/evolution'
import type { RaceResponse } from '~/components/interface/race'
import type { TypeScoreResponse } from '~/components/interface/typeScore'
import type { GoPokedexStats, GoPokedex } from '~/components/interface/api/dto'

// current dto item
const cDtoItem = ref<AbundanceResultDtoItem>(new AbundanceResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const screenControlMethods = () => {
  const init = async () => {
    // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, AbundanceResultSearchParams)
    // dtoStoreからresDataを復元
    const rdDic: Record<string, ResearchResponse> | null = getCurrentData(cDtoItem.value.searchParams.pid)

    if (rdDic && Object.keys(rdDic).length) {
      setAllResData(rdDic)
    } else {
      // 存在しない場合は取得する
      // 入力チェック不要
      await Promise.all([
        get('/api/abundance', cDtoItem.value, 'resData'),
        get('/api/race', cDtoItem.value, 'raceResData'),
        get('/api/evolution', cDtoItem.value, 'evoResData'),
        get('/api/typeScore', cDtoItem.value, 'typeScoreResData')
      ])
    }
  }

  const getCurrentData = (pid: string): Record<string, ResearchResponse> | null => {
    const resDataNameArr = ['resData', 'raceResData', 'evoResData', 'typeScoreResData']
    const resDataDic: Record<string, ResearchResponse> | null =
      searchCommon().restoreCurrentScreen(resDataNameArr) as Record<string, ResearchResponse>
    if (!resDataDic) {
      return null
    }

    if (Object.entries(resDataDic).filter(([, v]) => pid !== v.pokedexId).length) {
      // pidが一致しないresDataがあった場合はnullを返す。
      return null
    }

    return resDataDic
  }

  const setAllResData = (resDataDic: Record<string, any>): void => {
    cDtoItem.value.resData = resDataDic.resData as AbundanceResponse
    cDtoItem.value.raceResData = resDataDic.raceResData as RaceResponse
    cDtoItem.value.evoResData = resDataDic.evoResData as EvolutionResponse
    cDtoItem.value.typeScoreResData = resDataDic.typeScoreResData as TypeScoreResponse
  }

  return {
    init
  }
}

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)

/**
 * abundance
 */
const rgb1 = computed(() => typeColorUtils.getRGB(cDtoItem.value.resData.goPokedex.type1))
const rgba1 = computed(() => typeColorUtils.getRGBA(0.1, cDtoItem.value.resData.goPokedex.type1))
const rgb2 = computed(() => {
  const goPokedex = cDtoItem.value.resData.goPokedex
  return typeColorUtils.getRGB(goPokedex.type2 || goPokedex.type1) // タイプ2。なかったらタイプ1
})
const rgba2 = computed(() => {
  const goPokedex = cDtoItem.value.resData.goPokedex
  return typeColorUtils.getRGBA(0.1, goPokedex.type2 || goPokedex.type1) // タイプ2。なかったらタイプ1
})
/** abundanceの読み込みが終わったらtrueになる。 */
const isLoadedAbundance = computed(() => {
  return Object.keys(cDtoItem.value.resData).length
})

/**
 * race
 */
/** raceの読み込みが終わったらtrueになる。 */
const isLoadedRace = computed(() => {
  return Object.keys(cDtoItem.value.raceResData).length
})
interface StatsValue {
  title: string,
  value: number,
  stats: Array<number>,
  color: { r: number, g: number, b: number }
}
const statsDic = computed((): Record<string, Array<StatsValue>> => {
  const goPokedex: GoPokedex = cDtoItem.value.raceResData.race.goPokedex
  const goStats: GoPokedexStats = cDtoItem.value.raceResData.statistics.goPokedexStats
  return {
    goStatsItems: [
      { title: 'HP', value: goPokedex.hp, stats: goStats.goHpStats.list, color: { r: 0, g: 0, b: 255 } },
      { title: 'こうげき', value: goPokedex.attack, stats: goStats.goAtStats.list, color: { r: 255, g: 0, b: 0 } },
      { title: 'ぼうぎょ', value: goPokedex.defense, stats: goStats.goDfStats.list, color: { r: 0, g: 255, b: 0 } }
    ]
  }
})

/**
 * evolution
 */
/** evolutionの読み込みが終わったらtrueになる。 */
const isLoadedEvolution = computed(() => {
  return Object.keys(cDtoItem.value.evoResData).length
})
// EvoInfoのref属性
const evoInfoRef = ref()

/** typeScoreの読み込みが終わったらtrueになる。 */
const isLoadedTypeScore = computed(() => {
  return Object.keys(cDtoItem.value.typeScoreResData).length
})

/**
 * 共通系
 */
const prevNextRef = ref()

watch(
  () => useRoute().fullPath,
  async () => {
    // 初期表示処理
    await screenControlMethods().init()
    // EvoInfoの更新
    evoInfoRef.value.refresh()
    prevNextRef.value.refresh()
    window.scrollTo(0, 0)
  })

await screenControlMethods().init()

// Header
// const thisPath = useRuntimeConfig().public.url + useRoute().path
// const staticUrl = useRuntimeConfig().public.staticUrl
// const metaObject = computed((): MetaObject => {
//   const pokeName = cDtoItem.value.resData.name || ''
//   const pokeImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
//   return {
//     title: `${pokeName}のタマゴCP`,
//     meta: [
//       { property: 'og:type', content: 'article' },
//       { property: 'og:title', content: `${pokeName}のタマゴCP - ペリずかん` },
//       { property: 'og:url', content: thisPath },
//       { property: 'og:site_name', content: 'ペリずかん' },
//       { property: 'og:description', content: `${pokeName}のCPを確認できます。` },
//       { property: 'og:image', content: staticUrl + pokeImage }
//     ]
//   }
// })
// useHead(metaObject)
</script>

<style lang="scss">
.race {
  border: medium solid maroon;
  // border-color: red blue blue red;
}
.evolution {
  border: medium solid green;
}
.stats {
  vertical-align: middle;
  margin: auto;
}
.abundance-basic-info-table {
  padding: inherit;

  .v-row {
    .v-col:first-child {
      background: v-bind(rgb1);
    }
    &:nth-child(odd) .v-col:not(:first-child) {
      background: v-bind(rgba1);
    }
  }
}
.abundance-cp-table  {
  padding: inherit;

  .v-row {
    .v-col:first-child {
      background: v-bind(rgb2);
    }
    &:nth-child(odd) .v-col:not(:first-child) {
      background: v-bind(rgba2);
    }
  }
}
</style>
