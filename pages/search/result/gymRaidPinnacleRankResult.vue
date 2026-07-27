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
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      相手のポケモン
                    </v-col>
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      <SearchType :type="cDtoItem.searchParams.oppType1" />
                      <SearchType
                        v-if="cDtoItem.searchParams.oppType2 && cDtoItem.searchParams.oppType1 !== cDtoItem.searchParams.oppType2"
                        :type="cDtoItem.searchParams.oppType2"
                        style="margin-left: 3px;"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      自分のポケモン
                    </v-col>
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      <div v-if="cDtoItem.searchParams.ownTypes.length !== 0 && cDtoItem.searchParams.ownTypes.length !== constant.TYPE.length">
                        <span v-for="(t, i) in cDtoItem.searchParams.ownTypes" :key="`saerch-${i}`" class="mr-2">
                          <SearchType :type="t" />
                        </span>
                      </div>
                      <div v-else>
                        全タイプ
                      </div>
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      天気
                    </v-col>
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.searchParams.weather ? constantAccessor.getValue(cDtoItem.searchParams.weather, 'WEATHER') : '指定なし' }}
                      <p v-if="cDtoItem.resData.wbTypeList?.length">
                        {{ '(天候ブースト対象:' }}<!-- eslint-disable-next-line vue/no-v-html --><!--
                        --><span v-html="typeColorUtils.typeDecoration(cDtoItem.resData.wbTypeList.map(t => constantAccessor.getTypeJpn(t)).join(' '))" /><!--
                        -->{{ ')' }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-row v-if="cDtoItem.searchParams.shadowSelected !== 'only'" class="searched-param">
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      メガシンカ
                    </v-col>
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      {{ selectPatternDic[cDtoItem.searchParams.megaSelected] }}
                    </v-col>
                  </v-row>
                  <v-row v-if="cDtoItem.searchParams.megaSelected !== 'only'" class="searched-param">
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      シャドウ
                    </v-col>
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      {{ selectPatternDic[cDtoItem.searchParams.shadowSelected] }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      最強 or 最弱
                    </v-col>
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      {{ orderDic[cDtoItem.searchParams.order] }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      ポケモンの重複を除去する
                    </v-col>
                    <v-col cols="6" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.searchParams.unique ? 'する' : 'しない' }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cDtoItem.resData.typeComments">
          <v-col>
            <SearchTypeComments
              :type1="cDtoItem.searchParams.oppType1"
              :type2="cDtoItem.searchParams.oppType2"
              :comments="cDtoItem.resData.typeComments"
            />
          </v-col>
        </v-row>
      </v-container>
      <h3>ランキング</h3>
      <v-container>
        <v-row>
          <v-col>
            <p class="caption">
              ※1: 「スコア」は、スペシャル技が溜まったら撃つ、溜まったら撃つを繰り返し、5分間攻撃し続けた場合に理論値で出せる最大の火力を示しています。
            </p>
            <p class="caption">
              ※2: タイプによる算出の場合、耐久力を考慮していないため、ぼうぎょ面は指標に含まれません。
            </p>
            <p class="caption">
              ※3: ジム・レイドに配置されたポケモンのぼうぎょ力は100と仮定し、タイプ一致補正、タイプ相性、天候ブースト、シャドウ補正を考慮し算出しています。
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-right">
            {{ `${cDtoItem.resData.combiList.length}件` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              id="pokemon-attack-combination-table"
              v-model:sort-by="cDtoItem.tableControl.sortByArr"
              v-model:items-per-page="cDtoItem.tableControl.itemsPerPage"
              v-model:page="cDtoItem.tableControl.currentPage"
              :headers="headers"
              :items="cDtoItem.resData.combiList"
              :items-per-page-options="itemsPerPageOptions"
              multi-sort
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              hover
              @click:row="screenControlMethods().onClickRow"
            >
              <template #[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="`${staticUrl}/public/${(item.goPokedex.image1) || 'no-image.png'}`" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width: 140px;">
                  {{ item.goPokedex.name }}
                  <p v-if="item.goPokedex.remarks" class="text-caption">
                    {{ `(${item.goPokedex.remarks})` }}
                  </p>
                </div>
              </template>
              <template #[`item.attribute`]="{ item }">
                <span
                  v-if="item.mega || item.shadow"
                  :class="[$style.mega_shadow, !item.shadow || $style.shadow, !item.mega || $style.mega]"
                >
                  {{ item.attribute }}
                </span>
              </template>
              <template #[`item.faName`]="{ item }">
                <div style="min-width: 100px;">
                  {{ item.faName }}
                </div>
              </template>
              <template #[`item.caName`]="{ item }">
                <div style="min-width: 100px;">
                  {{ item.caName }}
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading v-if="isValidInput" full-page />
      <div v-else>
        <MajorPartsInvalidInputBackLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import type { GoPokedex } from '~/components/interface/api/dto'
import {
  type GymRaidPinnacleRankResponse,
  GymRaidPinnacleRankResultDtoItem,
  GymRaidPinnacleRankResultSearchParams,
  get,
  check,
  type TableControl,
  selectPatternDic,
  orderDic
} from '~/components/interface/gymRaidPinnacleRank'

const searchPattern = 'gymRaidPinnacleRank'
// current dto item
const cDtoItem = ref<GymRaidPinnacleRankResultDtoItem>(new GymRaidPinnacleRankResultDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)

const headers = readonly<Array<any>>([
  { title: 'No', key: 'no', align: 'center', sortable: false },
  { title: '図鑑No', key: 'goPokedex.pokedexId', align: 'center' },
  { title: '', key: 'goPokedex.image1', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name' },
  { title: '', key: 'attribute' },
  { title: '通常技', key: 'faName' },
  { title: 'スペシャル技', key: 'caName' },
  {
    title: 'スコア',
    align: 'center',
    children: [
      { title: '通常技', key: 'faAttackScore' },
      { title: 'スペシャル技', key: 'caAttackScore' },
      { title: '合計', key: 'attackScore' }
    ]
  }
])

const screenControlMethods = () => {
  const init = async () => {
  // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, GymRaidPinnacleRankResultSearchParams)
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData', 'tableControl', 'typeScoreResData'])
    const rd: GymRaidPinnacleRankResponse | null = restoredParams?.resData
    const tableControl: TableControl | null = restoredParams?.tableControl

    if (rd) {
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

    tableControlMethods().restoreTableControl(tableControl)

    isLoading.value = !cDtoItem.value.resData
  }

  /**
   * v-data-tableの列をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: PointerEvent, selected: { item: { goPokedex: GoPokedex } }) => {
    transitionUtils().abundance(selected.item.goPokedex.pokedexId)
  }

  return {
    init,
    onClickRow
  }
}

const itemsPerPageOptions = computed((): Array<number> => {
  const retArr: Array<number> = []
  const count = cDtoItem.value.resData.combiList.length

  const limit = 200
  if (count > limit) {
    for (let i = limit; i < count; i += limit) {
      retArr.push(i)
    }
  }
  retArr.push(-1)

  return retArr
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
    // ソートの復元
    tc.sortByArr = tableControl?.sortByArr || tc.sortByArr
    // 現在の1ページ当たり表示件数の復元
    tc.itemsPerPage = tableControl?.itemsPerPage || itemsPerPageOptions.value[0]
    // 現在のページ
    tc.currentPage = tableControl?.currentPage || 1
  }

  return {
    restoreTableControl
  }
}

// onMounted(() => {
//   // スクロール位置の復元
//   const table = document.getElementById('pokemon-attack-combination-table')
//   if (table) {
//     table.children[0].scrollTop = cDtoItem.value.tableControl.scrollTop
//   }
// })

// onBeforeRouteLeave((_to, _from, next) => {
//   // 画面を離れる前にスクロール位置を退避
//   const table = document.getElementById('pokemon-attack-combination-table')
//   if (table) {
//     cDtoItem.value.tableControl.scrollTop = table.children[0].scrollTop
//   }
//   next()
// })

await screenControlMethods().init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = commonStore().getStaticUrl()
const metaObject = computed((): MetaObject => {
  const type1 = constantAccessor.getTypeJpn(cDtoItem.value.searchParams.oppType1)
  const type2 = cDtoItem.value.searchParams.oppType2
    ? constantAccessor.getTypeJpn(cDtoItem.value.searchParams.oppType2)
    : ''
  const typeTitle = `ジム・レイド対策！タイプ ${type1}${type2 ? ',' + type2 : ''}への対策ポケモンのランキングまとめ`
  const typeDescription = `タイプが${type1}${type2 ? ',' + type2 : ''}のジム・レイドポケモンの対策ポケモンのランキングを確認することができます。\
  全ポケモンにおける全技の組み合わせから最適なポケモンを知ることができ、ジムまたはレイドのパーティ構築の参考材料になります。`
  const pokeImage = 'pokego/peripper-eyes.png'
  return {
    title: `${typeTitle}`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${typeTitle} - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: typeDescription },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>

<style lang="scss" module>
.mega_shadow {
  font-size: 70%;
  display: inline-block;
  vertical-align: top;
  color: white;
  font-weight: bold;
  padding: 1px 3px !important;
  border-radius: 4px;
  white-space: nowrap;
}
.mega {
  background-color: purple;
}
.shadow {
  background-color: black;
}
</style>
