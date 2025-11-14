<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container v-if="cDtoItem.searchParams.types.length || cDtoItem.searchParams.moveDispType">
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
                      タイプ
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <div v-if="cDtoItem.searchParams.types.length !== constant.TYPE.length">
                        <span v-for="(t, i) in cDtoItem.searchParams.types" :key="`saerch-${i}`" class="mr-2">
                          <SearchType :type="t" />
                        </span>
                      </div>
                      <div v-else>
                        全タイプ
                      </div>
                    </v-col>
                  </v-row>
                  <v-row v-if="cDtoItem.searchParams.moveDispType" class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      技の分類
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <div>
                        {{ moveDispTypeName }}
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="cDtoItem.resData">
        <template v-if="cDtoItem.resData.shouldDispFaList">
          <v-row>
            <v-col cols="12">
              <h3>通常技</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right py-0">
              <span class="body-2">{{ `${cDtoItem.resData.faList.length}件` }}</span>
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
                :height="cDtoItem.resData.faList.length > 5 ? 600 : ''"
                :fixed-header="cDtoItem.resData.faList.length > 5"
                multi-sort
                no-data-text="loading now..."
                no-results-text="該当するデータがありません。"
                hover
                @click:row="screenControlMethods().onClickRow"
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
        </template>
        <template v-if="cDtoItem.resData.shouldDispCaList">
          <v-row>
            <v-col cols="12">
              <h3>スペシャル技</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right py-0">
              <span class="body-2">{{ `${cDtoItem.resData.caList.length}件` }}</span>
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
                :height="cDtoItem.resData.caList.length > 5 ? 600 : ''"
                :fixed-header="cDtoItem.resData.caList.length > 5"
                multi-sort
                no-data-text="loading now..."
                no-results-text="該当するデータがありません。"
                hover
                @click:row="screenControlMethods().onClickRow"
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
                  <div style="width: 100px;">
                    <span style="white-space: pre-wrap;">{{ item.pvp.buff.buffMsg }}</span>
                  </div>
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
        </template>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <h4>用語</h4>
            <ul class="caption ml-8">
              <li>DPS: Damage Per Secondの略。技の純粋な火力を示す指標。「ダメージ」と言いつつも、実際に相手に与えるダメージは一定の計算式で算出された値になる。</li>
              <li>EPS: Energy Per Secondの略。この数値が高ければ高いほどスペシャル技の回転が良くなる。</li>
              <li>DPT: Damage Per Turnの略。PvPの場合は0.5秒を1ターンとして扱う。大体DPSみたいなもん。</li>
              <li>EPT: Energy Per Turnの略。DPT同様、大体EPSみたいなもん。</li>
              <li>DPE: Damage Per Energyの略。スペシャル技のダメージ効率を表す。ゲージ減少量が少なくダメージが大きいとこの数値が大きくなる。</li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <h3>タイプ別の技一覧をみる</h3>
            <div>
              <SearchMovesTypeMoveListLink />
            </div>
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
  type FilterAllMoveResponse,
  FilterAllMoveResultDtoItem,
  FilterAllMoveResultSearchParams,
  type TableControl,
  get
} from '~/components/interface/filterAllMove'

const searchPattern = 'filterAllMove'
// current dto item
const cDtoItem = ref<FilterAllMoveResultDtoItem>(new FilterAllMoveResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const constant: ConstantValue = constantUtils().get()

const moveDispTypeName = computed(() => {
  let ret = ''
  const moveDispType = cDtoItem.value.searchParams.moveDispType
  switch (moveDispType) {
    case 'all':
      ret = 'すべて'
      break
    case 'ca':
      ret = 'スペシャル技のみ'
      break
    case 'fa':
      ret = '通常技のみ'
      break
    default:
      break
  }
  return ret
})

/**
 * table制御用機能
 */
/** 列が全部そろったv-data-tableのヘッダ */
const faBaseHeaders = readonly<Array<any>>([
  { title: 'No', key: 'no' },
  { title: '技名', key: 'name' },
  { title: 'タイプ', key: 'type' },
  { title: 'ダメージ', key: 'gymRaid.gymPower' },
  { title: 'ゲージ増加量', key: 'gymRaid.energy' },
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
const caBaseHeaders = readonly<Array<any>>([
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

/**
 * 画面遷移時のテーブル制御
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

const screenControlMethods = () => {
  const init = async () => {
    // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, FilterAllMoveResultSearchParams)
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData', 'tableControl'])
    const rd: FilterAllMoveResponse | null = restoredParams?.resData
    const tableControl: TableControl | null = restoredParams?.tableControl

    if (rd) {
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      // 入力チェック不要
      const ret = await get(cDtoItem.value.searchParams as FilterAllMoveResultSearchParams)
      if (!ret) {
        // resが正しくない場合
        throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
      }
      cDtoItem.value.resData = ret
    }

    tableControlMethods().restoreTableControl(tableControl)

    isLoading.value = !cDtoItem.value.resData
  }

  /**
   * v-data-tableの列をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: PointerEvent, selected: { item: { moveId: string } }) => {
    transitionUtils().moveLookupResult(selected.item.moveId)
  }

  return {
    init,
    onClickRow
  }
}

// 自画面遷移時
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true
  await screenControlMethods().init()
  // ローディングが完了し、画面が描画された後に実行したいため、nextTickだと少し早い
  setTimeout(() => { scrollTo(0, 0) }, 0)
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
