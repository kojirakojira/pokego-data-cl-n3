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
            技名を入力
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <SearchInputMoveName
              v-model:name="cDtoItem.searchParams.name"
              v-model:mid="cDtoItem.searchParams.mid"
              :keyup-enter="clickSearchBtn"
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
              @click="clickSearchBtn"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <template v-if="cDtoItem?.moveSearchResult?.simpMoveList && cDtoItem.moveSearchResult.simpMoveList.length > 1">
        <v-container>
          <v-row>
            <v-col style="padding-bottom:0px;">
              {{ `検索結果：${cDtoItem.moveSearchResult.simpMoveList.length}件` }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0 subtitle-2">
              複数件ヒットしました。技を選択してください。
            </v-col>
          </v-row>
          <v-row v-if="cDtoItem.moveSearchResult.maybe">
            <v-col class="py-0 subtitle-2">
              ※あいまい検索
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-list style="border: solid thin grey;">
                <v-list-item
                  v-for="m in cDtoItem.moveSearchResult.simpMoveList"
                  :key="m.moveId"
                  @click="transitionResultPage(m.moveId)"
                >
                  <v-list-item-title>
                    {{ m.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MoveLookupSearchDtoItem,
  type MoveLookupResponse,
  get,
  check
} from '~/components/interface/moveLookup'

const searchPattern = 'moveLookup'
// current dto item
const cDtoItem = ref<MoveLookupSearchDtoItem>(new MoveLookupSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'moveSearchResult'], cDtoItem.value)

const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check(cDtoItem.value.searchParams)
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
    return
  }
  if (cDtoItem.value.searchParams.mid) {
    // midが存在する場合
    transitionResultPage(cDtoItem.value.searchParams.mid)
    return
  }
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
const handleApiResult = (rd: MoveLookupResponse) => {
  if (rd.success) {
    cDtoItem.value.moveSearchResult = rd.moveSearchResult
    if (rd.moveSearchResult.unique) {
      // 1件のみヒットした場合
      transitionResultPage(rd.moveId, rd)
    } else {
      // 複数件 or 0件ヒットした場合
      useRouter().replace({
        name: searchCommon().getRouteName(searchPattern)
      })
      isSearchBtnClick.value = false
      isLoading.value = false
    }
  }
}

/**
 * result画面に遷移する
 * ここで遷移する場合は、ポケモンが一意に特定できている
 *
 * @param mid
 * @param searchParams
 * @param resData
 */
const transitionResultPage = (mid: string, resData?: MoveLookupResponse): void => {
  // result画面にresDataをセット
  const pathName: string = searchCommon().getRouteName(searchPattern, true)
  const params: Record<string, any> = {}
  if (resData) { params.resData = resData }
  dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
    pathName,
    {},
    params,
    true
  ))
  // 遷移
  useRouter().push({
    name: pathName,
    query: { mid }
  })
}

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'タマゴから孵化したポケモンにおける、CPの振れ幅を確認することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
