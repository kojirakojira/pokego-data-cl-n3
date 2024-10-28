<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container v-if="cDtoItem.resData">
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="cDtoItem.resData.faList"
              item-value="moveId"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              hover
            />
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
import {
  type MoveListResponse,
  MoveListResultSearchParams,
  MoveListResultDtoItem,
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
const baseHeaders = readonly<Array<any>>([
  { title: '技名', key: 'name' },
  {
    title: 'ジム・レイド',
    align: 'center',
    children: [
      { title: 'ダメージ', key: 'gym.gymPower', size: '8px' },
      { title: 'DPS', key: 'gym.dps' },
      { title: 'EPS', key: 'gym.eps' },
      { title: '発生時間', key: 'gym.damagedTime' },
      { title: '全体時間', key: 'gym.totalTime' }
    ]
  },
  {
    title: 'PvP',
    align: 'center',
    children: [
      { title: 'ダメージ', key: 'pvp.pvpPower' },
      { title: 'ゲージ増加量', key: 'pvp.energy' },
      { title: 'ターン数', key: 'pvp.turns' },
      { title: 'DPT', key: 'pvp.dpt' },
      { title: 'EPT', key: 'pvp.ept' }
    ]
  }
])

const headers = computed((): Array<any> => {
  // const selectedArr: Array<string> = cDtoItem.value.tableControl.chkboxSelected
  // return baseHeaders.filter(col => !selectedArr.includes(col.key))
  return baseHeaders.filter(() => true)
})

const screenControlMethods = () => {
  const init = async () => {
    // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, MoveListResultSearchParams)
    // dtoStoreからresDataを復元
    const rd: MoveListResponse | null = searchCommon().restoreResData(true) as MoveListResponse

    if (rd) {
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      // 入力チェック不要
      const ret = await get(cDtoItem.value.searchParams)
      if (!ret) { return }
      cDtoItem.value.resData = ret
    }
    console.log(cDtoItem.value.resData)

    isLoading.value = !cDtoItem.value.resData
  }

  return {
    init
  }
}

// const dispMethods = () => {
//   const putHeaderStr = (title: string): void => {
//   }

//   return {
//     putHeaderStr
//   }
// }

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
      { property: 'og:description', content: 'タイプについての色々なランキングを確認することができます。' },
      { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
    ]
  }
})
useHead(metaObject)
</script>
