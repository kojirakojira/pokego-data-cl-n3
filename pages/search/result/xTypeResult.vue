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
                      じぶんのタイプ
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <span
                        v-if="cDtoItem.resData.own1"
                        :style="`background-color: ${editUtils().getRGB(cDtoItem.resData.own1)};'}`"
                        class="type"
                      >
                        {{ toJpn(cDtoItem.resData.own1) }}
                      </span>
                      <span
                        v-if="cDtoItem.resData.own2"
                        :style="`background-color: ${editUtils().getRGB(cDtoItem.resData.own2)};;margin-left:3px;'}`"
                        class="type"
                      >
                        {{ toJpn(cDtoItem.resData.own2) }}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      あいてのタイプ
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <span
                        v-if="cDtoItem.resData.opp1"
                        :style="`background-color: ${editUtils().getRGB(cDtoItem.resData.opp1)};`"
                        class="type"
                      >
                        {{ toJpn(cDtoItem.resData.opp1) }}
                      </span>
                      <span
                        v-if="cDtoItem.resData.opp2"
                        :style="`background-color: ${editUtils().getRGB(cDtoItem.resData.opp2)};margin-left:3px;`"
                        class="type"
                      >
                        {{ toJpn(cDtoItem.resData.opp2) }}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      重視ポイント
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.resData.emphasis }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="cDtoItem.resData.typeComments.length">
        <v-row>
          <v-col>
            <SearchTypeComments
              :comments="cDtoItem.resData.typeComments"
              :type1="definedXOwn ? cDtoItem.resData.opp1: cDtoItem.resData.own1"
              :type2="definedXOwn ? cDtoItem.resData.opp2: cDtoItem.resData.own2"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="(cDtoItem.resData.typeRankList as Array<XTypeElement>)"
              items-per-page="-1"
            >
              <template #[`item.twoTypeKey`]="{ item }">
                <span
                  v-if="item.twoTypeKey.type1"
                  :style="`background-color: ${editUtils().getRGB(item.twoTypeKey.type1)};`"
                  class="type"
                >
                  {{ toJpn(item.twoTypeKey.type1) }}
                </span>
                <span
                  v-if="item.twoTypeKey.type2"
                  :style="`background-color: ${editUtils().getRGB(item.twoTypeKey.type2)}; margin-left:3px;`"
                  class="type"
                >
                  {{ toJpn(item.twoTypeKey.type2) }}
                </span>
              </template>
              <template #[`item.atkMsgs`]="{ item }">
                <v-list style="background-color: transparent;">
                  <v-list-item v-for="(v, i) in item.atkMsgs" :key="item.twoTypeKey.type1 + item.twoTypeKey.type2 + i">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-html="combiDecoration(v, true)" />
                  </v-list-item>
                </v-list>
              </template>
              <template #[`item.defMsgs`]="{ item }">
                <v-list style="background-color: transparent;">
                  <v-list-item v-for="(v, i) in item.defMsgs" :key="item.twoTypeKey.type1 + item.twoTypeKey.type2 + i">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-html="combiDecoration(v, false)" />
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
      <Loading split-scr />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import { type XTypeElement } from '~/components/interface/api/dto'
import {
  type XTypeResponse,
  XTypeResultDtoItem,
  XTypeResultSearchParams,
  get,
  check
} from '~/components/interface/xType'

const searchPattern = 'xType'

// current dto item
const cDtoItem = ref<XTypeResultDtoItem>(new XTypeResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const headers = ref<any>([
  { title: '有利順位', value: 'rank', align: 'center' },
  { title: 'タイプ', value: 'twoTypeKey', sortable: false, align: 'left' },
  { title: 'こうげき時相性', value: 'atkMsgs', sortable: false, align: 'left' },
  { title: 'ぼうぎょ時相性', value: 'defMsgs', sortable: false, align: 'left' }
])

// xを自分側に定義したかどうか
const definedXOwn = ref<boolean>(false)
const isLoading = ref<boolean>(true)

const toJpn = (v: string) => {
  if (v === 'x') {
    return 'Xで仮定'
  }

  return constantUtils().getValue(v, constantUtils().value.TYPE)
}
/**
 * 引数に指定された値に'x'が含まれているかを判定する。
 * 残余引数で引数の値を配列で受け取る。
 */
const isIncludeX = (...args: string[]): boolean => {
  return !!args.filter(v => v === 'x').length
}
/**
 * タイプを装飾する。
 */
const combiDecoration = (msg: string, atkFlg: boolean) => {
  let ret = editUtils().typeDecoration(msg)

  const regex: RegExp = /（×.*）/
  ret = ret.replace(regex, (match: string) => {
    let str = match
    const mult: number = +match.substring(2, match.length - 1)
    if ((atkFlg && mult < 1) || (!atkFlg && mult > 1)) {
      str = '<span style="color: blue;">' + match + '</span>'
    }
    return str
  })
  return ret
}

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, XTypeResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: XTypeResponse = searchCommon().restoreResData() as XTypeResponse

  if (rd) {
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    if (check(cDtoItem.value.searchParams)) {
      throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
    }

    const ret = await get(cDtoItem.value.searchParams)
    if (!ret) { return }
    cDtoItem.value.resData = ret
  }

  definedXOwn.value = isIncludeX(cDtoItem.value.resData.own1, cDtoItem.value.resData.own2)
  isLoading.value = !cDtoItem.value.resData
}

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = useRuntimeConfig().public.staticUrl
const metaObject = computed((): MetaObject => {
  const ogpOwn1 = toJpn(cDtoItem.value.resData.own1) || ''
  const ogpOwn2 = toJpn(cDtoItem.value.resData.own2) || ''
  const ogpOpp1 = toJpn(cDtoItem.value.resData.opp1) || ''
  const ogpOpp2 = toJpn(cDtoItem.value.resData.opp2) || ''
  const ogpType = `${ogpOwn1}${ogpOwn2 ? ' ' + ogpOwn2 : ''}→${ogpOpp1}${ogpOpp2 ? ' ' + ogpOpp2 : ogpOpp2}`

  return {
    title: `${ogpType}のXタイプ検索の結果`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${ogpType}のXタイプ検索の結果 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: 'じぶんのポケモン、あいてのポケモンのタイプのうち1つをXと仮定し、何のタイプであれば有利になるかを求めることができます。' },
      { property: 'og:image', content: staticUrl + '/pokego/peripper-eyes.png' }
    ]
  }
})
useHead(metaObject)
</script>
