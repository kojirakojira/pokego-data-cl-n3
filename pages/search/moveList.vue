<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container v-if="cDtoItem.resData">
        <v-row>
          <v-col cols="12">
            <h3>通常技</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              id="fast-attack-table"
              v-model:sort-by="cDtoItem.tableControl.faSortByArr"
              :headers="faHeaders"
              :items="cDtoItem.resData.faList"
              item-value="moveId"
              items-per-page="-1"
              height="400"
              fixed-header
              multi-sort
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              hover
            >
              <template #[`item.type`]="{ item }">
                <SearchType :type="item.type" />
              </template>
              <template #bottom />
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3>スペシャル技</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              id="charged-attack-table"
              v-model:sort-by="cDtoItem.tableControl.caSortByArr"
              :headers="caHeaders"
              :items="cDtoItem.resData.caList"
              item-value="moveId"
              items-per-page="-1"
              height="400"
              fixed-header
              multi-sort
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
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import {
  type MoveListResponse,
  MoveListResultDtoItem,
  type TableControl,
  get
} from '~/components/interface/moveList'

const searchPattern = 'moveList'
// current dto item
const cDtoItem = ref<MoveListResultDtoItem>(new MoveListResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

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
  { title: 'EPT', key: 'pvp.ept' }
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
  { title: 'バフ確率', key: 'pvp.buff.activationChance' }
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

const screenControlMethods = () => {
  const init = async () => {
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData', 'tableControl'])
    const rd: MoveListResponse | null = restoredParams?.resData
    const tableControl: TableControl | null = restoredParams?.tableControl

    if (rd) {
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      // 入力チェック不要
      const ret = await get()
      if (!ret) {
        // resが正しくない場合
        throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
      }
      cDtoItem.value.resData = ret
    }

    tableControlMethods().restoreTableControl(tableControl)

    isLoading.value = !cDtoItem.value.resData
  }

  return {
    init
  }
}

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
    // ラジオボタンの復元
    tc.radioStatus = tableControl?.radioStatus || tc.radioStatus
    // ソートの復元
    tc.faSortByArr = tableControl?.faSortByArr || tc.faSortByArr
    tc.caSortByArr = tableControl?.caSortByArr || tc.caSortByArr
    // スクロール位置
    tc.faScrollTop = tableControl?.faScrollTop || tc.faScrollTop
    tc.caScrollTop = tableControl?.caScrollTop || tc.caScrollTop
  }

  return {
    restoreTableControl
  }
}

watch(
  () => cDtoItem.value.tableControl.radioStatus,
  (newValue) => {
    const tc = cDtoItem.value.tableControl
    // ラジオボタンに合わせてソートを更新。ジム・レイド、PvP固有の列はソートを除去する。
    // 通常技
    tc.faSortByArr = tc.faSortByArr.filter((sItem) => {
      if (sItem.key.indexOf('.') < 1) {
        return true
      }
      return sItem.key.substring(0, sItem.key.indexOf('.')) === newValue
    })
    // スペシャル技
    tc.caSortByArr = tc.caSortByArr.filter((sItem) => {
      if (sItem.key.indexOf('.') < 1) {
        return true
      }
      return sItem.key.substring(0, sItem.key.indexOf('.')) === newValue
    })
  }
)

onMounted(() => {
  // スクロール位置の復元
  const faTable = document.getElementById('fast-attack-table')
  if (faTable) {
    faTable.children[0].scrollTop = cDtoItem.value.tableControl.faScrollTop
  }
  const caTable = document.getElementById('charged-attack-table')
  if (caTable) {
    caTable.children[0].scrollTop = cDtoItem.value.tableControl.caScrollTop
  }
})

onBeforeRouteLeave((_to, _from, next) => {
  // 画面を離れる前にスクロール位置を退避
  const faTable = document.getElementById('fast-attack-table')
  if (faTable) {
    cDtoItem.value.tableControl.faScrollTop = faTable.children[0].scrollTop
  }
  const caTable = document.getElementById('charged-attack-table')
  if (caTable) {
    cDtoItem.value.tableControl.caScrollTop = caTable.children[0].scrollTop
  }
  next()
})

await screenControlMethods().init()

/**
 * Header
 */
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  return {
    title: searchCommon().getSearchPatternName(searchPattern),
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: 'ポケモンGOにおける、すべての通常技・スペシャル技の一覧です。' },
      { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
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
