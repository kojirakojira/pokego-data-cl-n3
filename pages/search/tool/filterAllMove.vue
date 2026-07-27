<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ constantAccessor.getValue('type', 'FILTER_ITEMS') }}
            <v-checkbox
              v-model="allCheck"
              label="すべて選択"
              hide-details
              color="success"
            />
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <div class="d-flex flex-wrap">
              <v-checkbox
                v-for="t in constant.TYPE"
                :key="`TYPE-${t}`"
                v-model="cDtoItem.searchParams.types"
                :label="t.jpn"
                :value="t.type"
                hide-details
                multiple
                color="info"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            技の種類
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-radio-group v-model="cDtoItem.searchParams.moveDispType" row>
              <v-radio label="すべて" value="all" />
              <v-radio label="通常技" value="fa" />
              <v-radio label="スペシャル技" value="ca" />
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
              @click="screenControlMethods().clickSearchBtn"
            >
              検索
            </v-btn>
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
import {
  check,
  FilterAllMoveSearchDtoItem
} from '~/components/interface/filterAllMove'

const searchPattern = 'filterAllMove'
/**
 * 画面制御用機能
 */
// current dto item
const cDtoItem = ref<FilterAllMoveSearchDtoItem>(new FilterAllMoveSearchDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)

const typeLength: number = constant.TYPE.length
const allCheck = computed({
  get () {
    return typeLength === cDtoItem.value.searchParams.types.length
  },
  set (newVal) {
    cDtoItem.value.searchParams.types.splice(0)
    if (newVal) {
      cDtoItem.value.searchParams.types.push(...constant.TYPE.map(type => type.type))
    }
  }
})

const screenControlMethods = () => {
  /** 初期表示時の処理 */
  const init = (): void => {
    // created: 画面を復元する
    searchCommon().restoreSearchScreen(['searchParams'], cDtoItem.value)

    // 一つもタイプが選択されていない場合は、すべて選択する。
    if (!cDtoItem.value.searchParams.types.length) {
      cDtoItem.value.searchParams.types.push(...constant.TYPE.map(type => type.type))
    }
  }

  const clickSearchBtn = () => {
    isSearchBtnClick.value = true
    isLoading.value = true
    const msg = check(cDtoItem.value.searchParams)
    if (msg) {
      alert(msg)
      isSearchBtnClick.value = false
      isLoading.value = false
      return
    }
    handleApiResult()
  }

  /**
   * APIのレスポンスを処理する。
   *
   */
  const handleApiResult = () => {
    // 取得成功した場合
    transitionUtils().moveList(
      cDtoItem.value.searchParams.types,
      cDtoItem.value.searchParams.moveDispType
    )
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
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
