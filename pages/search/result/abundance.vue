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
              :src="editUtils().getPokemonImageUrl(cDtoItem.resData.image2)"
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
            class="pa-0"
          >
            <v-row>
              <v-col style="text-align: end;">
                <IconAwakeningIconMegaIcon
                  :msg="cDtoItem.resData.megaMsg"
                  :mega="cDtoItem.resData.mega"
                  :can-mega="cDtoItem.resData.canMega"
                />
                <IconAwakeningIconDynamaxIcon
                  :msg="cDtoItem.resData.dynamaxMsg"
                  :impl-flg="cDtoItem.resData.goPokedex.dynamaxImplFlg"
                  type="Dynamax"
                />
                <IconAwakeningIconDynamaxIcon
                  :msg="cDtoItem.resData.gigantamaxMsg"
                  :impl-flg="cDtoItem.resData.goPokedex.gigantamaxImplFlg"
                  type="Gigantamax"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-container
            v-if="isLoadedAbundance"
            :class="['basic-info-table', $style.abundance_basic_info_table]"
          >
            <v-row :class="$style.row">
              <v-col cols="5" :class="$style.title">
                図鑑No
              </v-col>
              <v-col cols="7" :class="$style.content">
                {{ editUtils().getPdxNo(cDtoItem.resData.pokedexId) }}
              </v-col>
            </v-row>
            <v-row :class="$style.row">
              <v-col cols="5" :class="$style.title">
                ポケモン
              </v-col>
              <v-col cols="7" :class="$style.content">
                {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}
              </v-col>
            </v-row>
            <v-row :class="$style.row">
              <v-col cols="5" :class="$style.title">
                タイプ
              </v-col>
              <v-col cols="7" :class="$style.content">
                <SearchType :type="cDtoItem.resData.goPokedex.type1" />
                <SearchType
                  v-if="cDtoItem.resData.goPokedex.type2"
                  :type="cDtoItem.resData.goPokedex.type2"
                  style="margin-left:5px;"
                />
              </v-col>
            </v-row>
            <v-row :class="$style.row">
              <v-col cols="5" :class="$style.title">
                世代
              </v-col>
              <v-col cols="7" :class="$style.content">
                {{ constantAccessor.getValue(cDtoItem.resData.goPokedex.gen, 'GEN') }}
              </v-col>
            </v-row>
            <v-row :class="$style.row">
              <v-col cols="5" :class="$style.title">
                PokémonGO実装
              </v-col>
              <v-col cols="7" :class="$style.content">
                <span v-if="cDtoItem.resData.goPokedex.implFlg">実装済</span>
                <span v-else class="text-red">未実装</span>
              </v-col>
            </v-row>
            <v-row :class="$style.row">
              <v-col cols="5" :class="$style.title">
                強ポケ補正
                <SearchInputHelpMsg>
                  ポケモンGOの種族値は、原作の種族値から一定の変換式で算出されます。種族値が高すぎる一部のポケモンは算出された種族値から×0.91されます。<br>この補正には通称がないため、このサイトでは「強ポケ補正」と呼んでいます。
                </SearchInputHelpMsg>
              </v-col>
              <v-col cols="7" :class="$style.content">
                <span v-if="cDtoItem.resData.tooStrong" class="text-red">対象</span>
                <span v-else>対象外</span>
              </v-col>
            </v-row>
          </v-container>
          <div v-else>
            <Loading />
          </div>
          <h3>CP</h3>
          <template v-if="isLoadedAbundance">
            <v-container :class="['basic-info-table', $style.abundance_cp_table]">
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  CP(PL40)
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ cDtoItem.resData.cp40 }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  CP(PL50)
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ cDtoItem.resData.cp50 }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  最大CP(PL51)
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ cDtoItem.resData.maxCp }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  野生
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ `${cDtoItem.resData.wild.normal.min} ～ ${cDtoItem.resData.wild.normal.max}` }}
                  <p class="caption my-0">
                    {{ `天候ブースト時:${cDtoItem.resData.wild.normal.wbMin} ～ ${cDtoItem.resData.wild.normal.wbMax}` }}
                  </p>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  レイド
                  <SearchInputHelpMsg v-if="cDtoItem.resData.mega">
                    捕獲時はメガシンカ進化前になることご注意ください。
                  </SearchInputHelpMsg>
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ `${cDtoItem.resData.raid.normal.min} ～ ${cDtoItem.resData.raid.normal.max}` }}
                  <p class="caption my-0">
                    {{ `天候ブースト時:${cDtoItem.resData.raid.normal.wbMin} ～ ${cDtoItem.resData.raid.normal.wbMax}` }}
                  </p>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ロケット団勝利ボーナス
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ `${cDtoItem.resData.rocket.normal.min} ～ ${cDtoItem.resData.rocket.normal.max}` }}
                  <p class="caption my-0">
                    {{ `天候ブースト時:${cDtoItem.resData.rocket.normal.wbMin} ～ ${cDtoItem.resData.rocket.normal.wbMax}` }}
                  </p>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  フィールドリサーチ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ `${cDtoItem.resData.frTask.normal.min} ～ ${cDtoItem.resData.frTask.normal.max}` }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  タマゴ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ `${cDtoItem.resData.egg.normal.min} ～ ${cDtoItem.resData.egg.normal.max}` }}
                  <p v-if="cDtoItem.resData.eggGp" class="caption my-0">
                    {{ `(${editUtils().appendRemarks(cDtoItem.resData.eggGp.name, cDtoItem.resData.eggGp.remarks)}で算出)` }}
                  </p>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ダイマックス捕獲時
                </v-col>
                <v-col cols="7" :class="$style.content">
                  <template v-if="cDtoItem.resData.dynamax">
                    {{ `${cDtoItem.resData.dynamax.normal.min} ～ ${cDtoItem.resData.dynamax.normal.max}` }}
                  </template>
                  <template v-else>
                    -
                  </template>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  キョダイマックス捕獲時
                </v-col>
                <v-col cols="7" :class="$style.content">
                  <template v-if="cDtoItem.resData.gigantamax">
                    {{ `${cDtoItem.resData.gigantamax.normal.min} ～ ${cDtoItem.resData.gigantamax.normal.max}` }}
                  </template>
                  <template v-else>
                    -
                  </template>
                </v-col>
              </v-row>
              <v-row v-if="cDtoItem.resData.superLeagueSafeCpList.length" :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  スーパーリーグ制限内最大CP
                  <SearchInputHelpMsg>
                    {{ safeCpMsgGenerator }}
                  </SearchInputHelpMsg>
                </v-col>
                <v-col cols="7" :class="$style.content">
                  <div v-for="gpac in cDtoItem.resData.superLeagueSafeCpList" :key="`sl-safe-${gpac.goPokedex.pokedexId}`">
                    {{ gpac.cp }}<span class="caption my-0">{{ `(PL:${gpac.pl})` }}</span>
                    <template v-if="cDtoItem.resData.superLeagueSafeCpList.length > 1">
                      <p class="caption my-0">
                        {{ `(${editUtils().appendRemarks(gpac.goPokedex.name, gpac.goPokedex.remarks)}に進化させる場合)` }}
                      </p>
                      <v-divider />
                    </template>
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="cDtoItem.resData.hyperLeagueSafeCpList.length" :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ハイパーリーグ制限内最大CP
                  <SearchInputHelpMsg>
                    {{ safeCpMsgGenerator }}
                  </SearchInputHelpMsg>
                </v-col>
                <v-col cols="7" :class="$style.content">
                  <div v-for="gpac in cDtoItem.resData.hyperLeagueSafeCpList" :key="`sl-safe-${gpac.goPokedex.pokedexId}`">
                    {{ gpac.cp }}<span class="caption my-0">{{ `(PL:${gpac.pl})` }}</span>
                    <template v-if="cDtoItem.resData.hyperLeagueSafeCpList.length > 1">
                      <p class="caption my-0">
                        {{ `(${editUtils().appendRemarks(gpac.goPokedex.name, gpac.goPokedex.remarks)}に進化させる場合)` }}
                      </p>
                      <v-divider />
                    </template>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-container class="py-0">
              <v-row v-if="!cDtoItem.resData.finEvo && !cDtoItem.resData.mega" class="py-0">
                <v-col align="right">
                  <p class="link" @click="transitionUtils().afterEvoScpRank(cDtoItem.resData)">
                    進化後のリーグ制限内PvP順位を確認する >>
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <div v-else>
            <Loading />
          </div>
          <!-- 種族値 -->
          <h3>種族値</h3>
          <v-container v-if="isLoadedRace">
            <v-row :class="$style.race">
              <v-col>
                <GraphRaceGoRadarGraph
                  :go-pokedex="cDtoItem.raceResData.race.goPokedex"
                  :race-go-rank="cDtoItem.raceResData.race.goRank || new RaceGoRank()"
                  :count="cDtoItem.raceResData.goTotalCount"
                />
              </v-col>
              <v-col cols="12" class="mb-4">
                <p v-for="item in raceArr" :key="`go-col-${item.title}`" :class="[$style.stats, 'py-1']">
                  <span class="text-right px-1">
                    {{ `${item.title}：` }}
                  </span>
                  <span class="px-1">
                    {{ item.value }}
                  </span>
                </p>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col align="right">
                <p class="link" @click="transitionUtils().raceResult(cDtoItem.raceResData.pokedexId)">
                  種族値の詳細をみる >>
                </p>
                <p class="link" @click="transitionUtils().raceDiff([cDtoItem.raceResData])">
                  種族値を比較する >>
                </p>
              </v-col>
            </v-row>
          </v-container>
          <div v-else>
            <Loading />
          </div>
          <!-- PvP最高個体値 -->
          <h3>PvP最高個体値</h3>
          <v-container v-if="isLoadedScpRank">
            <v-row>
              <v-col cols="12">
                <v-table class="body-2">
                  <thead>
                    <tr>
                      <th v-for="(h, index) in scpRankHeaders" :key="index">
                        {{ h.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(tr) in scpRankMaxArr" :key="tr.league">
                      <td v-for="(td, tdKey) in tr" :key="`key-${tr.league}-${tdKey}`">
                        {{ tr[tdKey] }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col align="right">
                <p class="link" @click="transitionUtils().scpRankMaxMinResult(cDtoItem.scpRankMaxMinResData.pokedexId)">
                  詳細をみる >>
                </p>
                <p class="link" @click="transitionUtils().scpRankList(cDtoItem.scpRankMaxMinResData)">
                  個体値ランキングをみる >>
                </p>
                <p class="link" @click="transitionUtils().scpRank(cDtoItem.scpRankMaxMinResData)">
                  特定の個体のPvP順位をみる >>
                </p>
              </v-col>
            </v-row>
          </v-container>
          <div v-else>
            <Loading />
          </div>
          <!-- 覚える技 -->
          <h3>覚える技</h3>
          <div v-if="isLoadedPokemonAttack">
            <v-container class="py-0">
              <v-row>
                <v-col>
                  <div :class="$style.select_gym_pvp">
                    <v-radio-group
                      v-model="cDtoItem.pokemonAttackTableControl.radioStatus"
                      width="fit-content"
                      inline
                      hide-details
                    >
                      <v-radio label="ジム・レイド" color="primary" value="gymRaid" />
                      <v-radio label="PvP" color="primary" value="pvp" />
                    </v-radio-group>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <!-- メガシンカ後でない場合 -->
            <h4>通常技</h4>
            <v-container>
              <v-row>
                <v-col>
                  <v-data-table
                    :headers="faHeaders"
                    :items="cDtoItem.pokemonAttackResData.fastAttackList"
                    item-value="moveId"
                    items-per-page="-1"
                    no-data-text="loading now..."
                    no-results-text="該当するデータがありません。"
                    hover
                  >
                    <template #[`item.type`]="{ item }">
                      <SearchType :type="item.type" />
                    </template>
                    <template #[`item.learningPattern`]="{ item }">
                      <SearchMovesLearningPattern :pattern-id="item.learningPattern" :pattern-name="item.learningPatternName" />
                    </template>
                    <template #bottom />
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
            <h4>スペシャル技</h4>
            <v-container>
              <v-row>
                <v-col>
                  <v-data-table
                    :headers="caHeaders"
                    :items="cDtoItem.pokemonAttackResData.chargedAttackList"
                    item-value="moveId"
                    items-per-page="-1"
                    no-data-text="loading now..."
                    no-results-text="該当するデータがありません。"
                    hover
                  >
                    <template #[`item.type`]="{ item }">
                      <SearchType :type="item.type" />
                    </template>
                    <template #[`item.pvp.buff.buffMsg`]="{ item }">
                      <span style="white-space: pre-wrap;">{{ item.pvp.buff.buffMsg }}</span>
                    </template>
                    <template #[`item.pvp.buff.activationChance`]="{ item }">
                      <span>{{ item.pvp.buff.activationChanceStr }}</span>
                    </template>
                    <template #[`item.gymRaid.energyBar`]="{ item }">
                      <SearchMovesEnergyBar :divide="item.gymRaid.energyBar" />
                    </template>
                    <template #[`item.learningPattern`]="{ item }">
                      <div class="d-flex align-center">
                        <SearchMovesLearningPattern :pattern-id="item.learningPattern" :pattern-name="item.learningPatternName" />
                        <SearchInputHelpMsg v-if="item.learningPatternAnnos">
                          {{ item.learningPatternAnnos }}
                        </SearchInputHelpMsg>
                      </div>
                    </template>
                    <template #bottom />
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <!-- タイプ倍率 -->
          <h3>タイプ倍率</h3>
          <div v-if="isLoadedTypeScore">
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
                実際のダメージは、タイプ一致ボーナスによってここから×1.2倍されます。
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
          </div>
          <div v-else>
            <Loading />
          </div>
        </v-col>
        <v-col cols="12" md="5" lg="4" xl="4">
          <h3>
            進化
          </h3>
          <div :class="$style.evolution">
            <SearchEvolutionEvoInfo
              v-if="isLoadedEvolution"
              :pid="cDtoItem.evoResData.pid"
              :evol-tree-info="cDtoItem.evoResData.evolTreeInfo"
              :another-forms="cDtoItem.evoResData.anotherForms"
              :bf-af-aot-forms="cDtoItem.evoResData.bfAfAotForms"
              :race-map="cDtoItem.evoResData.raceMap"
              :evol-tree-annos="cDtoItem.evoResData.evolTreeAnnotations"
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
        :prev-text-func="commonMethods().prevTextFunc"
        :next-text-func="commonMethods().nextTextFunc"
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
import type { MetaObject } from 'nuxt/schema'
import { ConstantAccessor, TypeColorUtils } from '#imports'
import {
  type AbundanceResponse,
  AbundanceResultDtoItem,
  AbundanceResultSearchParams,
  get
} from '~/components/interface/abundance'
import type { ResearchResponse } from '~/components/interface/api/response'
import { EvolutionResultSearchParams, type EvolutionResponse } from '~/components/interface/evolution'
import { RaceResultSearchParams, type RaceResponse } from '~/components/interface/race'
import { TypeScoreResultSearchParams, type TypeScoreResponse } from '~/components/interface/typeScore'
import { type GoPokedex, RaceGoRank, GoPokedexAndCpPl, ScpRank } from '~/components/interface/api/dto'
import { ScpRankMaxMinResponse, ScpRankMaxMinSearchParams } from '~/components/interface/scpRankMaxMin'
import { PokemonAttackResultSearchParams, type PokemonAttackResponse } from '~/components/interface/pokemonAttack'
const MajorPartsH2Common = defineAsyncComponent(() => import('~/components/majorParts/H2Common.vue'))
const IconAwakeningIconMegaIcon = defineAsyncComponent(() => import('~/components/icon/awakeningIcon/MegaIcon.vue'))
const IconAwakeningIconDynamaxIcon = defineAsyncComponent(() => import('~/components/icon/awakeningIcon/DynamaxIcon.vue'))
const GraphRaceGoRadarGraph = defineAsyncComponent(() => import('~/components/graph/race/GoRadarGraph.vue'))
const SearchTypeComments = defineAsyncComponent(() => import('~/components/search/type/TypeComments.vue'))
const SearchInputHelpMsg = defineAsyncComponent(() => import('~/components/search/input/HelpMsg.vue'))
const MajorPartsPrevNextPokemon = defineAsyncComponent(() => import('~/components/majorParts/PrevNextPokemon.vue'))

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
      const abundanceReq = new AbundanceResultSearchParams()
      const raceReq = new RaceResultSearchParams(false) // statisticsを取得しない。
      const scpRankMaxMinReq = new ScpRankMaxMinSearchParams()
      const evoReq = new EvolutionResultSearchParams()
      const typeScoreReq = new TypeScoreResultSearchParams()
      const pokemonAttackReq = new PokemonAttackResultSearchParams()
      // すべてのリクエストにpokedexIdを設定する
      abundanceReq.pid =
      raceReq.pid =
      scpRankMaxMinReq.pid =
      evoReq.pid =
      typeScoreReq.pid =
      pokemonAttackReq.pid = cDtoItem.value.searchParams.pid

      // 閲覧数をカウントしない
      raceReq.enableCount = true
      scpRankMaxMinReq.enableCount = true
      evoReq.enableCount = true
      typeScoreReq.enableCount = true
      pokemonAttackReq.enableCount = true

      // 入力チェック不要
      await Promise.all([
        get('/api/abundance', cDtoItem.value, abundanceReq, 'resData'),
        get('/api/race', cDtoItem.value, raceReq, 'raceResData'),
        get('/api/scpRankMaxMin', cDtoItem.value, scpRankMaxMinReq, 'scpRankMaxMinResData'),
        get('/api/evolution', cDtoItem.value, evoReq, 'evoResData'),
        get('/api/typeScore', cDtoItem.value, typeScoreReq, 'typeScoreResData'),
        get('/api/pokemonAttack', cDtoItem.value, pokemonAttackReq, 'pokemonAttackResData')
      ])
        .then((rdArr) => {
          for (const rd of rdArr) {
            if (!rd || rd.msgLevel === 'error') {
              // resにエラーが含まれていた場合
              throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
            }
          }
        })
    }
  }

  const getCurrentData = (pid: string): Record<string, ResearchResponse> | null => {
    const resDataNameArr = [
      'resData',
      'raceResData',
      'scpRankMaxMinResData',
      'evoResData',
      'typeScoreResData',
      'pokemonAttackResData'
    ]
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
    cDtoItem.value.scpRankMaxMinResData = resDataDic.scpRankMaxMinResData as ScpRankMaxMinResponse
    cDtoItem.value.evoResData = resDataDic.evoResData as EvolutionResponse
    cDtoItem.value.typeScoreResData = resDataDic.typeScoreResData as TypeScoreResponse
    cDtoItem.value.pokemonAttackResData = resDataDic.pokemonAttackResData as PokemonAttackResponse
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
  return !!cDtoItem.value.resData.goPokedex.pokedexId
})
/** スーパーリーグ安全圏CP、ハイパーリーグ安全圏CP用のメッセージを生成する。 */
const safeCpMsgGenerator = computed(() => {
  const gp: GoPokedex = cDtoItem.value.resData.goPokedex
  // スーパーリーグもハイパーリーグもここの処理は同じ。
  const gpacArr: Array<GoPokedexAndCpPl> = cDtoItem.value.resData.superLeagueSafeCpList
  if (!gpacArr.length) {
    return ''
  }
  const finEvoPokeNames = gpacArr
    .map(gpac => editUtils().appendRemarks(gpac.goPokedex.name, gpac.goPokedex.remarks))
    .join('、')
  return `${editUtils().appendRemarks(gp.name, gp.remarks)}を最終進化形態(${finEvoPokeNames})に進化させた場合、CP制限に確実にひっかからない最大のCPを示しています。`
})

/**
 * race
 */
/** raceの読み込みが終わったらtrueになる。 */
const isLoadedRace = computed(() => {
  return !!cDtoItem.value.raceResData.pokedexId
})
interface RaceValue {
  title: string,
  value: number,
  color: { r: number, g: number, b: number }
}
const raceArr = computed((): Array<RaceValue> => {
  const goPokedex: GoPokedex = cDtoItem.value.raceResData.race.goPokedex
  return [
    { title: 'HP', value: goPokedex.hp, color: { r: 0, g: 0, b: 255 } },
    { title: 'こうげき', value: goPokedex.attack, color: { r: 255, g: 0, b: 0 } },
    { title: 'ぼうぎょ', value: goPokedex.defense, color: { r: 0, g: 255, b: 0 } }
  ]
})

/**
 * scpRank
 */
/** scpRankMaxMinの読み込みが終わったらtrueになる。 */
const isLoadedScpRank = computed(() => {
  return !!cDtoItem.value.scpRankMaxMinResData.pokedexId
})
const scpRankHeaders = ref<Record<string, string>[]>([
  { title: '', key: 'league' },
  { title: 'AT', key: 'iva' },
  { title: 'DF', key: 'ivd' },
  { title: 'HP', key: 'ivh' },
  { title: 'PL', key: 'pl' }])

const scpRankMaxArr = computed(() => {
  const rd = cDtoItem.value.scpRankMaxMinResData
  const scpRankMaxArr: Array<ScpRank> = [rd.scpSlRankMax, rd.scpHlRankMax, rd.scpMlRankMax]
  return scpRankMaxArr
    .map((scpRank) => {
      const leagueDic = {
        sl: 'スーパーリーグ順位',
        hl: 'ハイパーリーグ順位',
        ml: 'マスターリーグ順位'
      }
      return {
        league: leagueDic[scpRank.league as keyof typeof leagueDic],
        iva: scpRank.iva,
        ivd: scpRank.ivd,
        ivh: scpRank.ivh,
        pl: scpRank.pl
      }
    })
})

/**
 * evolution
 */
/** evolutionの読み込みが終わったらtrueになる。 */
const isLoadedEvolution = computed(() => {
  return !!cDtoItem.value.evoResData.pokedexId
})

/**
 * typeScore
 */
/** typeScoreの読み込みが終わったらtrueになる。 */
const isLoadedTypeScore = computed(() => {
  return !!cDtoItem.value.typeScoreResData.pokedexId
})

/**
 * pokemonAttack
 */
const isLoadedPokemonAttack = computed(() => {
  return !!cDtoItem.value.pokemonAttackResData.pokedexId
})
/**
 * table制御用機能
 */
/** 列が全部そろったv-data-tableのヘッダ */
const faBaseHeaders = readonly<Array<any>>([
  { title: 'No', key: 'no' },
  { title: '技名', key: 'name' },
  { title: 'タイプ', key: 'type' },
  { title: 'ダメージ', key: 'gymRaid.gymPower', size: '8px' },
  { title: '発生時間', key: 'gymRaid.damageSecond' },
  { title: '全体時間', key: 'gymRaid.totalSecond' },
  { title: 'DPS', key: 'gymRaid.dps' },
  { title: 'EPS', key: 'gymRaid.eps' },
  { title: 'ダメージ', key: 'pvp.pvpPower' },
  { title: 'ゲージ増加量', key: 'pvp.energy' },
  { title: 'ターン数', key: 'pvp.turns' },
  { title: 'DPT', key: 'pvp.dpt' },
  { title: 'EPT', key: 'pvp.ept' },
  { title: '覚え方', key: 'learningPattern' }
])
const caBaseHeaders = readonly<Array<any>>([
  { title: 'No', key: 'no' },
  { title: '技名', key: 'name' },
  { title: 'タイプ', key: 'type' },
  { title: 'ゲージ', key: 'gymRaid.energyBar' },
  { title: 'ダメージ', key: 'gymRaid.gymPower', size: '8px' },
  { title: '発生時間', key: 'gymRaid.damageSecond' },
  { title: '全体時間', key: 'gymRaid.totalSecond' },
  { title: 'DPS', key: 'gymRaid.dps' },
  { title: 'ダメージ', key: 'pvp.pvpPower' },
  { title: 'ゲージ減少量', key: 'pvp.energy' },
  { title: 'DPE', key: 'pvp.dpe' },
  { title: 'バフ', key: 'pvp.buff.buffMsg' },
  { title: 'バフ確率', key: 'pvp.buff.activationChanceStr' },
  { title: '覚え方', key: 'learningPattern' }
])

// 通常技のヘッダ
const faHeaders = computed((): Array<any> => {
  return faBaseHeaders.filter((col) => {
    if (col.key.indexOf('.') < 1) {
      return true
    }
    return col.key.substring(0, col.key.indexOf('.')) === cDtoItem.value.pokemonAttackTableControl.radioStatus
  })
})

// スペシャル技のヘッダ
const caHeaders = computed((): Array<any> => {
  return caBaseHeaders.filter((col) => {
    if (col.key.indexOf('.') < 1) {
      return true
    }
    return col.key.substring(0, col.key.indexOf('.')) === cDtoItem.value.pokemonAttackTableControl.radioStatus
  })
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

    prevNextRef.value.refresh()
    window.scrollTo(0, 0)
  })

await screenControlMethods().init()

const commonMethods = () => {
  const prevTextFunc = (gp: GoPokedex): string => {
    return `< ${editUtils().appendRemarks(gp.name, gp.remarks)}(図鑑№${editUtils().getPdxNo(gp.pokedexId)})`
  }
  const nextTextFunc = (gp: GoPokedex) => {
    return `${editUtils().appendRemarks(gp.name, gp.remarks)}(図鑑№${editUtils().getPdxNo(gp.pokedexId)}) >`
  }

  return {
    prevTextFunc,
    nextTextFunc
  }
}

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  return {
    title: `${pokeName}の情報`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `【ポケモンGO】${pokeName}のCP、種族値、技 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}の情報を確認できます。` },
      { property: 'og:image', content: editUtils().getPokemonImageUrl(cDtoItem.value.resData.image2) }
    ]
  }
})
useHead(metaObject)
</script>

<style lang="scss" module>
.race {
  border: medium solid maroon;
  // border-color: red blue blue red;
}
.evolution {
  border: medium solid green;
}
.stats {
  width: fit-content;
  margin: 0 auto;

  span {
    display: inline-block;
    width: 100px;
  }
}
.abundance_basic_info_table {
  padding: inherit;

  .row {
    .title {
      background: v-bind(rgb1);
    }
    &:nth-child(odd) .content:not(:first-child) {
      background: v-bind(rgba1);
    }
  }
}
.abundance_cp_table {
  padding: inherit;

  .row {
    .title {
      background: v-bind(rgb2);
    }
    &:nth-child(odd) .content:not(:first-child) {
      background: v-bind(rgba2);
    }
  }
}
.select_gym_pvp {
  width: fit-content;
  padding: 5px 20px 5px 5px;
  border-radius: 25px;
  border: thin solid;

  &:hover {
    border-color: blue;
  }
}
</style>
