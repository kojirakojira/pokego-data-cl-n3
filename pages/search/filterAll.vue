<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <SearchInputFilterInput
        v-model="cDtoItem.searchParams"
        :is-search-btn-click="isSearchBtnClick"
        @click="screenControlMethods().clickSearchBtn"
      />
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FilterAllSearchDtoItem,
  type FilterAllResponse,
  get
} from '~/components/interface/filterAll'

const searchPattern = 'filterAll'
/**
 * 画面制御用機能
 */
// current dto item
const cDtoItem = ref<FilterAllSearchDtoItem>(new FilterAllSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)
const screenControlMethods = () => {
  /** 初期表示時の処理 */
  const init = (): void => {
    // created: 画面を復元する
    searchCommon().restoreSearchScreen(['searchParams', 'resData'], cDtoItem.value)
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
  const handleApiResult = (rd: FilterAllResponse) => {
    if (rd.success) {
      cDtoItem.value.resData = rd
      // 取得成功した場合
      useRouter().push({
        name: 'search-list-filterAllList',
        query: searchCommon().makeQuery(cDtoItem.value.searchParams)
      })
    }
  }

  return {
    init,
    clickSearchBtn
  }
}

screenControlMethods().init()

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: '絞り込み条件を複合的に設定し、対象のポケモンの一覧を確認することができます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>
