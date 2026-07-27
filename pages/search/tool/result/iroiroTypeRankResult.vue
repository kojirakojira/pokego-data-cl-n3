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
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      ランキング
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.resData.searchPattern }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col class="body-2 text-right">
            タイプ数：
            {{ cDtoItem.resData.typeRankList.length }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="iroiroTypeRankHeaders"
              :items="cDtoItem.resData.typeRankList"
              items-per-page="-1"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
            >
              <template #[`item.twoTypeKey`]="{ item }">
                <SearchType
                  v-if="item.twoTypeKey.type1"
                  :type="constantAccessor.getTypeJpn(item.twoTypeKey.type1)"
                />
                <SearchType
                  v-if="item.twoTypeKey.type2"
                  :type="constantAccessor.getTypeJpn(item.twoTypeKey.type2)"
                  style="margin-left: 3px;"
                />
              </template>
              <template #[`item.msgs`]="{ item }">
                <v-list style="background-color: transparent;" dense>
                  <v-list-item
                    v-for="(v, i) in item.msgs"
                    :key="item.twoTypeKey.type1 + item.twoTypeKey.type2 + i"
                    class="px-0"
                  >
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-if="cDtoItem.resData.msgDecoration" v-html="typeColorUtils.typeDecoration(v)" />
                    <div v-else>
                      {{ v }}
                    </div>
                  </v-list-item>
                </v-list>
              </template>
              <template #bottom />
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading v-if="isValidInput" full-page />
      <div v-else class="text-center">
        <MajorPartsInvalidInputBackLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import { TypeColorUtils } from '~/utils/editUtils'
import { ConstantAccessor } from '~/utils/constantUtils'
import {
  type IroiroTypeRankResponse,
  IroiroTypeRankResultDtoItem,
  IroiroTypeRankResultSearchParams,
  get
} from '~/components/interface/iroiroTypeRank'
const searchPattern = 'iroiroTypeRank'
// current dto item
const cDtoItem = ref<IroiroTypeRankResultDtoItem>(new IroiroTypeRankResultDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const screenControlMethods = () => {
  const init = async () => {
    // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, IroiroTypeRankResultSearchParams)
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
    const rd: IroiroTypeRankResponse | null = restoredParams?.resData

    if (rd && rd.searchPattern) {
    // resDataが復元できた場合
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      // 入力チェック不要
      const ret = await get(cDtoItem.value.searchParams)
      if (!ret) {
        isValidInput.value = false
        return
      }
      cDtoItem.value.resData = ret
    }

    dispMethods().putHeaderStr(cDtoItem.value.resData.msgsHeader)
    isLoading.value = !cDtoItem.value.resData
  }

  return {
    init
  }
}

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)
const iroiroTypeRankHeaders = ref<Array<any>>([
  { title: '順位', value: 'rank', align: 'center' },
  { title: 'タイプ', value: 'twoTypeKey', sortable: false },
  { title: '', value: 'msgs' }
])
const dispMethods = () => {
  const putHeaderStr = (title: string): void => {
    iroiroTypeRankHeaders.value.forEach((row) => {
      if (row.value === 'msgs') {
        row.title = title
      }
    })
  }

  return {
    putHeaderStr
  }
}

await screenControlMethods().init()

/**
 * Header
 */
const patternName = searchCommon().getSearchPatternName(searchPattern)
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = commonStore().getStaticUrl()
const metaObject = computed((): MetaObject => {
  return {
    title: patternName,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${patternName} - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: 'タイプについての色々なランキングを確認することができます。' },
      { property: 'og:image', content: `${staticUrl}/public/${'pokego/peripper-eyes.png'}` }
    ]
  }
})
useHead(metaObject)
</script>
