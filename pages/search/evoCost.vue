<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4" md="4" lg="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            重視ポイント
          </v-col>
          <v-col cols="12" sm="8" md="8" lg="8">
            <v-radio-group v-model="cDtoItem.searchParams.costs" row>
              <v-radio label="アメの個数ごとの一覧を表示します。" value="candy" />
              <v-radio label="条件（進化アイテム等）ごとの一覧を表示します。" value="othrCosts" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isSearchBtnClick"
              @click="clickSearchBtn"
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
  EvoCostSearchDtoItem
} from '~/components/interface/evoCost'

const searchPattern = 'evoCost'
// current dto item
const cDtoItem = ref<EvoCostSearchDtoItem>(new EvoCostSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams'], cDtoItem.value)

const clickSearchBtn = () => {
  isSearchBtnClick.value = true
  isLoading.value = true
  // 結果画面側でAPIアクセスする。

  useRouter().push({
    name: 'search-result-evoCostResult',
    query: searchCommon().makeQuery(cDtoItem.value.searchParams)
  })
}

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: '進化条件（必要なアメの個数、進化アイテム等）から、ポケモンを逆引きすることができます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>
