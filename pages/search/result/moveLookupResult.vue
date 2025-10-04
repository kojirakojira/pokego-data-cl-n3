<template>
  <div>
    <MajorPartsH2Common>
      {{ `${cDtoItem?.resData.name}の技性能・覚えるポケモン` }}
    </MajorPartsH2Common>
    <v-container>
      <v-row>
        <v-col align="right">
          <v-btn rounded variant="outlined" :to="{ name: 'search-moveLookup' }">
            <v-icon>
              mdi-magnify
            </v-icon>
            別の技を検索
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="!isLoading">
      <v-container v-if="fastAttackDetails">
        <v-row>
          <v-col>
            <h3>基本情報</h3>
            <v-container :class="['basic-info-table', $style.fast_attack_basic_info_table]">
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  技名
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.name }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  分類
                </v-col>
                <v-col cols="7" :class="$style.content">
                  通常技
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  タイプ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  <SearchType :type="constantAccessor.getTypeJpn(fastAttackDetails.fastAttack.type)" />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>ジム・レイド</h3>
            <v-container :class="['basic-info-table', $style.fast_attack_basic_info_table]">
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ダメージ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.gymRaid.gymPower }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.gymPowerRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ダメージ発生時間
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.gymRaid.damageSeconds }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.damageSecondsRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  全体時間
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.gymRaid.totalSeconds }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  DPS
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.gymRaid.dps }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.dpsRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  EPS
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.gymRaid.eps }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.epsRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>PvP</h3>
            <v-container :class="['basic-info-table', $style.fast_attack_basic_info_table]">
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ダメージ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.pvp.pvpPower }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.pvpPowerRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ゲージ増加量
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.pvp.energy }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.pvpEnergyIncrAmountRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ターン数
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.pvp.turns }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  DPT
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.pvp.dpt }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.dptRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  EPT
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ fastAttackDetails.fastAttack.pvp.ept }}
                  <span class="caption">
                    {{ `(全技${fastAttackDetails.fastAttackRank.eptRank} / ${fastAttackDetails.fastAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>覚えるポケモン</h3>
            <v-container>
              <v-row>
                <v-col>
                  <v-data-table
                    id="fa-learn-pokemon-list"
                    v-model:sort-by="cDtoItem.tableControl.faLearnPokemonSortByArr"
                    :headers="learnPokemonHeaders"
                    :items="cDtoItem.resData.fastAttackDetails.learnPokemonList"
                    items-per-page="-1"
                    height="400"
                    multi-sort
                    item-value="goPokedex.pokedexId"
                    no-data-text="覚えるポケモンは存在しません。"
                    hover
                    @click:row="screenControlMethods().onClickLearningPokemonRow"
                  >
                    <template #[`item.no`]="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template #[`item.goPokedex.pokedexId`]="{ item }">
                      {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
                    </template>
                    <template #[`item.goPokedex.image1`]="{ item }">
                      <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image1)" />
                    </template>
                    <template #[`item.goPokedex.name`]="{ item }">
                      <div style="min-width: 140px;">
                        {{ item.goPokedex.name }}
                        <p v-if="item.goPokedex.remarks" class="text-caption">
                          {{ `(${item.goPokedex.remarks})` }}
                        </p>
                      </div>
                    </template>
                    <template #[`item.goPokedex.type1`]="{ item }">
                      <SearchType :type="item.goPokedex.type1" />
                      <SearchType
                        v-if="item.goPokedex.type2"
                        :type="item.goPokedex.type2"
                        style="margin-left:5px;"
                      />
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
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>{{ `${constantAccessor.getTypeJpn(fastAttackDetails.fastAttack.type)}タイプの通常技` }}</h3>
            <v-container>
              <v-row>
                <v-col>
                  <div :class="$style.select_gym_pvp">
                    <v-radio-group
                      v-model="cDtoItem.tableControl.radioStatus"
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
              <v-row>
                <v-col>
                  <v-data-table
                    id="fa-same-type-table"
                    v-model:sort-by="cDtoItem.tableControl.faSameTypeSortByArr"
                    :headers="faSameTypeHeaders"
                    :items="cDtoItem.resData.fastAttackDetails.sameTypeMoveList"
                    item-value="moveId"
                    items-per-page="-1"
                    height="400"
                    fixed-header
                    multi-sort
                    no-data-text="覚えるポケモンは存在しません。"
                    hover
                    @click:row="screenControlMethods().onClickSameTypeRow"
                  >
                    <template #[`item.no`]="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template #[`item.name`]="{ item }">
                      <div style="min-width: 140px;">
                        {{ item.name }}
                      </div>
                    </template>
                    <template #[`item.type`]="{ item }">
                      <SearchType :type="item.type" />
                    </template>
                    <template #bottom />
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="chargedAttackDetails">
        <v-row>
          <v-col>
            <h3>基本情報</h3>
            <v-container :class="['basic-info-table', $style.charged_attack_basic_info_table]">
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  技名
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.name }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  分類
                </v-col>
                <v-col cols="7" :class="$style.content">
                  スペシャル技
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  タイプ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  <SearchType :type="constantAccessor.getTypeJpn(chargedAttackDetails.chargedAttack.type)" />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>ジム・レイド</h3>
            <v-container :class="['basic-info-table', $style.charged_attack_basic_info_table]">
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ダメージ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.gymRaid.gymPower }}
                  <span class="caption">
                    {{ `(全技${chargedAttackDetails.chargedAttackRank.gymPowerRank} / ${chargedAttackDetails.chargedAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ゲージ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  <div class="d-flex align-center fill-height" style="width: 100px;">
                    <SearchMovesEnergyBar :divide="chargedAttackDetails.chargedAttack.gymRaid.energyBar" />
                  </div>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ダメージ発生時間
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.gymRaid.damageSeconds }}
                  <span class="caption">
                    {{ `(全技${chargedAttackDetails.chargedAttackRank.damageSecondsRank} / ${chargedAttackDetails.chargedAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  全体フレーム
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.gymRaid.totalSeconds }}
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  DPS
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.gymRaid.dps }}
                  <span class="caption">
                    {{ `(全技${chargedAttackDetails.chargedAttackRank.dpsRank} / ${chargedAttackDetails.chargedAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>PvP</h3>
            <v-container :class="['basic-info-table', $style.charged_attack_basic_info_table]">
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ダメージ
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.pvp.pvpPower }}
                  <span class="caption">
                    {{ `(全技${chargedAttackDetails.chargedAttackRank.pvpPowerRank} / ${chargedAttackDetails.chargedAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  ゲージ増加量
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.pvp.energy }}
                  <span class="caption">
                    {{ `(全技${chargedAttackDetails.chargedAttackRank.pvpEnergyIncrAmountRank} / ${chargedAttackDetails.chargedAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  DPE
                </v-col>
                <v-col cols="7" :class="$style.content">
                  {{ chargedAttackDetails.chargedAttack.pvp.dpe }}
                  <span class="caption">
                    {{ `(全技${chargedAttackDetails.chargedAttackRank.dpeRank} / ${chargedAttackDetails.chargedAttackRank.totalCount}位)` }}
                  </span>
                </v-col>
              </v-row>
              <v-row :class="$style.row">
                <v-col cols="5" :class="$style.title">
                  バフ
                </v-col>
                <v-col cols="7" :class="[$style.content, 'd-flex', 'align-baseline']">
                  <span style="white-space: pre-wrap;">{{ chargedAttackDetails.chargedAttack.pvp.buff.buffMsg }}</span>
                  <span class="caption">
                    {{ `(確率: ${chargedAttackDetails.chargedAttack.pvp.buff.activationChanceStr})` }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>覚えるポケモン</h3>
            <v-container>
              <v-row>
                <v-col>
                  <v-data-table
                    id="ca-learn-pokemon-list"
                    v-model:sort-by="cDtoItem.tableControl.caLearnPokemonSortByArr"
                    :headers="learnPokemonHeaders"
                    :items="cDtoItem.resData.chargedAttackDetails.learnPokemonList"
                    items-per-page="-1"
                    height="400"
                    multi-sort
                    item-value="goPokedex.pokedexId"
                    no-data-text="覚えるポケモンは存在しません。"
                    hover
                    @click:row="screenControlMethods().onClickLearningPokemonRow"
                  >
                    <template #[`item.no`]="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template #[`item.goPokedex.pokedexId`]="{ item }">
                      {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
                    </template>
                    <template #[`item.goPokedex.image1`]="{ item }">
                      <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image1)" />
                    </template>
                    <template #[`item.goPokedex.name`]="{ item }">
                      <div style="min-width: 140px;">
                        {{ item.goPokedex.name }}
                        <p v-if="item.goPokedex.remarks" class="text-caption">
                          {{ `(${item.goPokedex.remarks})` }}
                        </p>
                      </div>
                    </template>
                    <template #[`item.goPokedex.type1`]="{ item }">
                      <SearchType :type="item.goPokedex.type1" />
                      <SearchType
                        v-if="item.goPokedex.type2"
                        :type="item.goPokedex.type2"
                        style="margin-left:5px;"
                      />
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
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>{{ `${constantAccessor.getTypeJpn(chargedAttackDetails.chargedAttack.type)}タイプのスペシャル技` }}</h3>
            <v-container>
              <v-row>
                <v-col>
                  <div :class="$style.select_gym_pvp">
                    <v-radio-group
                      v-model="cDtoItem.tableControl.radioStatus"
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
              <v-row>
                <v-col>
                  <v-data-table
                    id="ca-same-type-table"
                    v-model:sort-by="cDtoItem.tableControl.caSameTypeSortByArr"
                    :headers="caSameTypeHeaders"
                    :items="cDtoItem.resData.chargedAttackDetails.sameTypeMoveList"
                    item-value="moveId"
                    items-per-page="-1"
                    height="400"
                    fixed-header
                    multi-sort
                    no-data-text="覚えるポケモンは存在しません。"
                    hover
                    @click:row="screenControlMethods().onClickSameTypeRow"
                  >
                    <template #[`item.no`]="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template #[`item.name`]="{ item }">
                      <div style="min-width: 140px;">
                        {{ item.name }}
                      </div>
                    </template>
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
                    <template #bottom />
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading v-if="isValidInput" full-page />
      <div v-else class="text-center">
        <MajorPartsInvalidInputBackLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import type { ChargedAttackDetails, FastAttackDetails, GoPokedexAndMoveInfo } from '~/components/interface/api/dto'
import {
  type MoveLookupResponse,
  MoveLookupResultDtoItem,
  MoveLookupResultSearchParams,
  type TableControl,
  get
} from '~/components/interface/moveLookup'
// const searchPattern = 'moveLookup'
// current dto item
const cDtoItem = ref<MoveLookupResultDtoItem>(new MoveLookupResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)

// アクセス簡略化のため
const fastAttackDetails = computed((): FastAttackDetails | null => {
  return cDtoItem.value?.resData.fastAttackDetails
})
const chargedAttackDetails = computed((): ChargedAttackDetails | null => {
  return cDtoItem.value?.resData.chargedAttackDetails
})

const faRgb = computed(() => fastAttackDetails.value ? typeColorUtils.getRGB(fastAttackDetails.value.fastAttack.type) : 'unset')
const faRgba = computed(() => fastAttackDetails.value ? typeColorUtils.getRGBA(0.1, fastAttackDetails.value.fastAttack.type) : 'unset')

const caRgb = computed(() => chargedAttackDetails.value ? typeColorUtils.getRGB(chargedAttackDetails.value.chargedAttack.type) : 'unset')
const caRgba = computed(() => chargedAttackDetails.value ? typeColorUtils.getRGBA(0.1, chargedAttackDetails.value.chargedAttack.type) : 'unset')

/**
 * table制御用機能
 */
const learnPokemonHeaders = readonly<Array<any>>([
  { title: 'No', key: 'no', align: 'center', sortable: false },
  { title: '図鑑No', key: 'goPokedex.pokedexId', align: 'center' },
  { title: '', key: 'goPokedex.image1', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name' },
  { title: 'タイプ', key: 'goPokedex.type1', sortable: false },
  { title: 'こうげき', key: 'goPokedex.attack' },
  { title: 'ぼうぎょ', key: 'goPokedex.defense' },
  { title: 'HP', key: 'goPokedex.hp' },
  { title: '覚え方', key: 'learningPattern' }
])
/** 列が全部そろったv-data-tableのヘッダ */
const faBaseSameTypeHeaders = readonly<Array<any>>([
  { title: 'No', key: 'no' },
  { title: '技名', key: 'name' },
  { title: 'タイプ', key: 'type' },
  { title: 'ダメージ', key: 'gymRaid.gymPower' },
  { title: '発生時間', key: 'gymRaid.damageSeconds' },
  { title: '全体時間', key: 'gymRaid.totalSeconds' },
  { title: 'DPS', key: 'gymRaid.dps' },
  { title: 'EPS', key: 'gymRaid.eps' },
  { title: 'ダメージ', key: 'pvp.pvpPower' },
  { title: 'ゲージ増加量', key: 'pvp.energy' },
  { title: 'ターン数', key: 'pvp.turns' },
  { title: 'DPT', key: 'pvp.dpt' },
  { title: 'EPT', key: 'pvp.ept' }
])
const caBaseSameTypeHeaders = readonly<Array<any>>([
  { title: 'No', key: 'no', sortable: false },
  { title: '技名', key: 'name' },
  { title: 'タイプ', key: 'type' },
  { title: 'ゲージ', key: 'gymRaid.energyBar' },
  { title: 'ダメージ', key: 'gymRaid.gymPower' },
  { title: '発生時間', key: 'gymRaid.damageSeconds' },
  { title: '全体時間', key: 'gymRaid.totalSeconds' },
  { title: 'DPS', key: 'gymRaid.dps' },
  { title: 'ダメージ', key: 'pvp.pvpPower' },
  { title: 'ゲージ増加量', key: 'pvp.energy' },
  { title: 'DPE', key: 'pvp.dpe' },
  { title: 'バフ', key: 'pvp.buff.buffMsg' },
  { title: 'バフ確率', key: 'pvp.buff.activationChance' }
])

const faSameTypeHeaders = computed((): Array<any> => {
  return faBaseSameTypeHeaders.filter((col) => {
    if (col.key.indexOf('.') < 1) { return true }
    return col.key.substring(0, col.key.indexOf('.')) === cDtoItem.value.tableControl.radioStatus
  })
})
const caSameTypeHeaders = computed((): Array<any> => {
  return caBaseSameTypeHeaders.filter((col) => {
    if (col.key.indexOf('.') < 1) { return true }
    return col.key.substring(0, col.key.indexOf('.')) === cDtoItem.value.tableControl.radioStatus
  })
})

/**
 * 画面制御用機能
 */
const screenControlMethods = () => {
  const init = async () => {
    // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, MoveLookupResultSearchParams)
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData', 'tableControl'])
    const rd: MoveLookupResponse | null = restoredParams?.resData
    const tableControl: TableControl | null = restoredParams?.tableControl

    if (rd && rd.moveId) {
      // resDataが復元できた場合
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      // 入力チェック不要
      const ret = await get(cDtoItem.value.searchParams)
      if (!ret) {
        // resが正しくない場合
        isValidInput.value = false
        return
      }
      cDtoItem.value.resData = ret
    }
    tableControlMethods().restoreTableControl(tableControl)

    isLoading.value = !cDtoItem.value.resData
  }

  interface GoPokedexAndMoveInfoItem {
    index: number,
    item: GoPokedexAndMoveInfo
  }
  /**
   * v-data-tableの列をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickLearningPokemonRow = (_: PointerEvent, selected: GoPokedexAndMoveInfoItem) => {
    useRouter().push({
      name: 'search-result-abundance',
      query: {
        pid: selected.item.goPokedex.pokedexId
      }
    })
  }

  interface SameTypeMoveItem {
    index: number,
    item: {
      moveId: string
    }
  }
  /**
   * v-data-tableの列をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickSameTypeRow = (_: PointerEvent, selected: SameTypeMoveItem) => {
    useRouter().push({
      name: 'search-result-moveLookupResult',
      query: {
        mid: selected.item.moveId
      }
    })
  }

  return {
    init,
    onClickLearningPokemonRow,
    onClickSameTypeRow
  }
}

// 自画面遷移時
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true
  await screenControlMethods().init()
  // evoInfoRef.value.refresh()
  if (import.meta.client) { scrollTo(0, 0) }
  isLoading.value = false
})
/**
 * テーブル制御
 */
const tableControlMethods = () => {
  /**
   * v-data-tableの復元
   * @param tableControl
   */
  const restoreTableControl = (tableControl: TableControl | null) => {
    const tc = cDtoItem.value.tableControl
    // ソートの復元
    tc.faLearnPokemonSortByArr = tableControl?.faLearnPokemonSortByArr || tc.faLearnPokemonSortByArr
    tc.caLearnPokemonSortByArr = tableControl?.caLearnPokemonSortByArr || tc.caLearnPokemonSortByArr
    tc.faSameTypeSortByArr = tableControl?.faSameTypeSortByArr || tc.faSameTypeSortByArr
    tc.caSameTypeSortByArr = tableControl?.caSameTypeSortByArr || tc.caSameTypeSortByArr
    // スクロール位置
    tc.faLearnPokemonScrollTop = tableControl?.faLearnPokemonScrollTop || tc.faLearnPokemonScrollTop
    tc.caLearnPokemonScrollTop = tableControl?.caLearnPokemonScrollTop || tc.caLearnPokemonScrollTop
    tc.faSameTypeScrollTop = tableControl?.faSameTypeScrollTop || tc.faSameTypeScrollTop
    tc.caSameTypeScrollTop = tableControl?.caSameTypeScrollTop || tc.caSameTypeScrollTop
  }

  return {
    restoreTableControl
  }
}

onMounted(() => {
  // スクロール位置の復元
  const faLpTable = document.getElementById('fa-learn-pokemon-list')
  if (faLpTable) { faLpTable.children[0].scrollTop = cDtoItem.value.tableControl.faLearnPokemonScrollTop }
  const caLpTable = document.getElementById('ca-learn-pokemon-list')
  if (caLpTable) { caLpTable.children[0].scrollTop = cDtoItem.value.tableControl.caLearnPokemonScrollTop }
  const faStTable = document.getElementById('fa-same-type-table')
  if (faStTable) { faStTable.children[0].scrollTop = cDtoItem.value.tableControl.faSameTypeScrollTop }
  const caStTable = document.getElementById('ca-same-type-table')
  if (caStTable) { caStTable.children[0].scrollTop = cDtoItem.value.tableControl.caSameTypeScrollTop }
})

onBeforeRouteLeave((_to, _from, next) => {
  // 画面を離れる前にスクロール位置を退避
  const faLpTable = document.getElementById('fa-learn-pokemon-list')
  if (faLpTable) { cDtoItem.value.tableControl.faLearnPokemonScrollTop = faLpTable.children[0].scrollTop }
  const caLpTable = document.getElementById('ca-learn-pokemon-list')
  if (caLpTable) { cDtoItem.value.tableControl.caLearnPokemonScrollTop = caLpTable.children[0].scrollTop }
  const faStTable = document.getElementById('fa-same-type-table')
  if (faStTable) { cDtoItem.value.tableControl.faSameTypeScrollTop = faStTable.children[0].scrollTop }
  const caStTable = document.getElementById('ca-same-type-table')
  if (caStTable) { cDtoItem.value.tableControl.caSameTypeScrollTop = caStTable.children[0].scrollTop }
  next()
})

await screenControlMethods().init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = 'pokego/peripper-eyes.png'
  return {
    title: `${pokeName}の技性能・覚えるポケモン`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}の技性能・覚えるポケモン - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}の技性能、覚えるポケモン、同じタイプの別の技を確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>

<style lang="scss" module>
.fast_attack_basic_info_table {
  padding: inherit;

  .row {
    .title {
      background: v-bind(faRgb);
    }
    &:nth-child(odd) .content:not(:first-child) {
      background: v-bind(faRgba);
    }
  }
}
.charged_attack_basic_info_table {
  padding: inherit;

  .row {
    .title {
      background: v-bind(caRgb);
    }
    &:nth-child(odd) .content:not(:first-child) {
      background: v-bind(caRgba);
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
