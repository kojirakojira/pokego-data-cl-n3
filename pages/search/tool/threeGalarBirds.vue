<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            ポケモン
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-select
              v-model="cDtoItem.searchParams.pid"
              :items="cDtoItem.tgbArr"
              item-title="name"
              item-value="pid"
              label="ポケモンを選択"
              outlined
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            CP
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-text-field
              v-model="cDtoItem.searchParams.cp"
              label="例：4049"
              outlined
              dense
              autocomplete="off"
              type="number"
              @keydown.enter.exact="screenControlMethods().clickSearchBtn"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            天候ブースト
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-switch
              v-model="cDtoItem.searchParams.wbFlg"
              inset
              hide-details
              :label="cDtoItem.searchParams.wbFlg ? 'あり' : 'なし'"
              style="margin-top: 0px;"
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
  ThreeGalarBirdsSearchDtoItem,
  type TgbSelectItem,
  getList,
  check
} from '~/components/interface/threeGalarBirds'
import type { GoPokedex } from '~/components/interface/api/dto'

const searchPattern = 'threeGalarBirds'

// current dto item
const cDtoItem = ref<ThreeGalarBirdsSearchDtoItem>(new ThreeGalarBirdsSearchDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'tgbArr'], cDtoItem.value)

const screenControlMethods = () => {
  const init = async () => {
    // tgbArrの更新
    const dtoTgbArr = cDtoItem.value.tgbArr
    if (dtoTgbArr.length) { return }
    const tgbGpArr: Array<GoPokedex> = await getList()
    const tgbArr: Array<TgbSelectItem> = tgbGpArr.map((tgb) => {
      return {
        pid: tgb.pokedexId,
        name: editUtils().appendRemarks(tgb.name, tgb.remarks)
      }
    })
    dtoTgbArr.push(...tgbArr)
  }

  const clickSearchBtn = (e: Event) => {
    if (e instanceof KeyboardEvent && e.isComposing) {
      // キーボード操作かつ変換中の場合
      return
    }
    isSearchBtnClick.value = true
    const msg = check(cDtoItem.value.searchParams)
    if (msg) {
      alert(msg)
      isSearchBtnClick.value = false
      return
    }
    isLoading.value = true
    useRouter().push({
      name: searchCommon().getRouteName(searchPattern, true),
      query: searchCommon().makeQuery(cDtoItem.value.searchParams.pid, cDtoItem.value.searchParams)
    })
  }

  return {
    init,
    clickSearchBtn
  }
}

await screenControlMethods().init()

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: '野生で出現したガラル三鳥のCPから個体値の一覧を閲覧できます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
~/components/interface/threeGalarBirds
