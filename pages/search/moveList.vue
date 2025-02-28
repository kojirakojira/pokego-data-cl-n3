<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            何のランキングがみたい？
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-select
              v-model="cDtoItem.searchParams.scene"
              :items="moveListArr"
              item-title="jpn"
              item-value="id"
              prepend-icon="mdi-filter-multiple"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isSearchBtnClick"
              @click="screenControlMethods().clickSearchBtn"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MoveListResponse,
  MoveListSearchDtoItem,
  get
} from '~/components/interface/moveList'

const searchPattern = 'moveList'
/**
 * 画面制御用機能
 */
// current dto item
const cDtoItem = ref<MoveListSearchDtoItem>(new MoveListSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)
const screenControlMethods = () => {
  /** 初期表示時の処理 */
  const init = (): void => {
    isLoading.value = true
    // 画面を復元する
    searchCommon().restoreSearchScreen(['searchParams', 'resData'], cDtoItem.value)

    isLoading.value = false
  }

  const clickSearchBtn = async () => {
    isSearchBtnClick.value = true
    isLoading.value = true
    const res = await get(cDtoItem.value.searchParams)
    if (!res) {
      isSearchBtnClick.value = false
      isLoading.value = false
      return
    }
    handleApiResult(res)
  }

  /**
   * APIのレスポンスを処理する。
   *
   * @param rd
   */
  const handleApiResult = (rd: MoveListResponse) => {
    if (rd.success) {
      cDtoItem.value.resData = rd
      useRouter().push({
        name: 'search-result-iroiroTypeRankResult',
        query: searchCommon().makeQuery(cDtoItem.value.searchParams)
      })
    }
  }

  return {
    init,
    clickSearchBtn
  }
}

/**
 * 入力系機能
 */
const moveListArr = readonly<Array<{ id: string, jpn: string }>>([
  { id: 'gym', jpn: 'ジム・レイド' },
  { id: 'pvp', jpn: 'PvP' }
])

screenControlMethods().init()

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'ポケモンの名前から、ポケモンの情報を検索することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
