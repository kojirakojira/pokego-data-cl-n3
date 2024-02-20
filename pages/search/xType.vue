<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col class="caption">
            じぶんのポケモン、あいてのポケモンのタイプのうち1つをXと仮定し、何のタイプであれば有利になるかを求めることができます。<br>
            なんだか分かりにくい機能なので、とりあえず使って試してみてください。
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="5" lg="5" class="px-0">
            <v-container>
              <v-row align="center">
                <v-col cols="12" sm="5" md="6" lg="6" class="col-title">
                  <v-icon>
                    mdi-pen
                  </v-icon>
                  じぶんのポケモン
                </v-col>
                <v-col cols="12" sm="7" md="6" lg="6">
                  <v-select
                    v-model="cDtoItem.searchParams.own1"
                    :items="typeArr"
                    item-title="v"
                    item-value="k"
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-spacer />
                <v-col cols="12" sm="7" md="6" lg="6">
                  <v-select
                    v-model="cDtoItem.searchParams.own2"
                    :items="typeArr"
                    item-title="v"
                    item-value="k"
                    clearable
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
            lg="1"
            class="px-0"
            style="display: flex; align-items: center;"
          >
            <v-container>
              <v-row>
                <v-col align="center">
                  <v-icon class="arrow-down">
                    mdi-arrow-right-bold-outline
                  </v-icon>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" sm="12" md="5" lg="5" class="px-0">
            <v-container>
              <v-row>
                <v-col cols="12" sm="5" md="6" lg="6" class="col-title">
                  <v-icon>
                    mdi-pen
                  </v-icon>
                  あいてのポケモン
                </v-col>
                <v-col cols="12" sm="7" md="6" lg="6">
                  <v-select
                    v-model="cDtoItem.searchParams.opp1"
                    :items="typeArr"
                    item-title="v"
                    item-value="k"
                    clearable
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-spacer />
                <v-col cols="12" sm="7" md="6" lg="6">
                  <v-select
                    v-model="cDtoItem.searchParams.opp2"
                    :items="typeArr"
                    item-title="v"
                    item-value="k"
                    clearable
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="5" lg="5" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            重視ポイント
          </v-col>
          <v-col cols="12" sm="12" md="7" lg="7">
            <v-radio-group v-model="cDtoItem.searchParams.emphasis" row>
              <v-radio label="設定しない" value="none" />
              <v-radio label="こうげき重視" value="attack" />
              <v-radio label="ぼうぎょ重視" value="defense" />
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
  XTypeSearchDtoItem,
  type XTypeResponse,
  get,
  check
} from '~/components/interface/xType'

const searchPattern = 'xType'

// current dto item
const cDtoItem = ref<XTypeSearchDtoItem>(new XTypeSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

const typeArr = ref<Array<{ k: string, v: string }>>([])
typeArr.value.splice(0)
typeArr.value.push({ k: 'x', v: 'xで仮定' }, ...constantUtils().value.TYPE)

// created: 画面を復元する
searchCommon().restoreSearchScreen(['searchParams', 'resData'], cDtoItem.value)

const clickSearchBtn = async () => {
  isSearchBtnClick.value = true
  const msg = check(cDtoItem.value.searchParams)
  if (msg) {
    alert(msg)
    isSearchBtnClick.value = false
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
const handleApiResult = (rd: XTypeResponse) => {
  if (rd.success) {
    cDtoItem.value.resData = rd
    useRouter().push({
      name: 'search-result-xTypeResult',
      query: searchCommon().makeQuery(null, cDtoItem.value.searchParams)
    })
  }
}

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'じぶんのポケモン、あいてのポケモンのタイプのうち1つをXと仮定し、何のタイプであれば有利になるかを求めることができます。' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>

<style lang="scss">
.arrow-down {
  transform: rotate(90deg);

  @include display_pc {
    transform: rotate(0deg);
  }
}
</style>
