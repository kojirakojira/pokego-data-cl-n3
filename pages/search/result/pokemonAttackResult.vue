<template>
  <div>
    <MajorPartsH2Common>
      {{ `${editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks)}が覚える技` }}
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
      </v-container>
      <div v-if="cDtoItem.resData.preMegaGp">
        <v-container>
          <v-row>
            <v-col class="text-center">
              メガ進化後のポケモンです。
              <nuxt-link
                :to="{
                  name: 'search-result-pokemonAttackResult',
                  query: { pid: cDtoItem.resData.preMegaGp.pokedexId } }"
              >
                {{ `${editUtils().appendRemarks(cDtoItem.resData.preMegaGp.name, cDtoItem.resData.preMegaGp.remarks)}` }}
              </nuxt-link>
              を参照してください。
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div v-else>
        <!-- メガシンカ後でない場合 -->
        <h3>通常技</h3>
        <v-container>
          <v-row>
            <v-col>
              <v-data-table
                :headers="faHeaders"
                :items="cDtoItem.resData.fastAttackList"
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
        <h3>スペシャル技</h3>
        <v-container>
          <v-row>
            <v-col>
              <v-data-table
                :headers="caHeaders"
                :items="cDtoItem.resData.chargedAttackList"
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
        <div :class="$style.fixed">
          <v-radio-group v-model="cDtoItem.tableControl.radioStatus" inline hide-details>
            <v-radio label="ジム・レイド" color="primary" value="gymRaid" />
            <v-radio label="PvP" color="primary" value="pvp" />
          </v-radio-group>
        </div>
      </div>
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
import {
  type PokemonAttackResponse,
  PokemonAttackResultDtoItem,
  PokemonAttackResultSearchParams,
  get
} from '~/components/interface/pokemonAttack'
// const searchPattern = 'pokemonAttack'
// current dto item
const cDtoItem = ref<PokemonAttackResultDtoItem>(new PokemonAttackResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)
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

const faHeaders = computed((): Array<any> => {
  return faBaseHeaders.filter((col) => {
    if (col.key.indexOf('.') < 1) {
      return true
    }
    return col.key.substring(0, col.key.indexOf('.')) === cDtoItem.value.tableControl.radioStatus
  })
})

const caHeaders = computed((): Array<any> => {
  return caBaseHeaders.filter((col) => {
    if (col.key.indexOf('.') < 1) {
      return true
    }
    return col.key.substring(0, col.key.indexOf('.')) === cDtoItem.value.tableControl.radioStatus
  })
})

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, PokemonAttackResultSearchParams)
  // dtoStoreからresDataを復元
  const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
  const rd: PokemonAttackResponse | null = restoredParams?.resData

  if (rd && rd.pokedexId) {
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

  isLoading.value = !cDtoItem.value.resData
}

// 自画面遷移時
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true
  await init()
  // evoInfoRef.value.refresh()
  if (import.meta.client) { scrollTo(0, 0) }
  isLoading.value = false
})

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = editUtils().getUrl(cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png')
  return {
    title: `${pokeName}が覚える技`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}が覚える技 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}が覚える通常技、スペシャル技を確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>

<style lang="scss" module>
.fixed {
  background-color: white;
  padding: 5px 20px 5px 5px;
  position: fixed;
  bottom: 25px;
  left: 25px;
  z-index: 50;
  border-radius: 25px;
  border: thin solid;

  &:hover {
    border-color: blue;
  }
}

</style>
