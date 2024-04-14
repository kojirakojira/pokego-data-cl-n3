<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col>
            <v-list
              v-for="(detailDic, costTypeKey, i) in cDtoItem.resData.costTypeMap"
              :key="`cost-type-${costTypeKey}`"
              v-model:opened="cDtoItem.openDic[`costTypeKey-${i}`]"
              class="py-0"
            >
              <v-list-group
                :class="$style.cost_type_area"
                :value="costTypeKey"
              >
                <template #activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :title="`${costTypeKey}(${Object.keys(detailDic).length})`"
                  />
                </template>
                <v-list-item>
                  <v-container>
                    <v-row>
                      <v-col class="pa-0">
                        <v-list
                          v-for="(pokeArr, detailKey, n) in detailDic"
                          :key="`cost-detail-${detailKey}`"
                          v-model:opened="cDtoItem.openDic[`costDetailKey-${i}-${n}`]"
                          class="py-0"
                        >
                          <v-list-group
                            :class="$style.detail_area"
                            :value="detailKey"
                          >
                            <template #activator="{ props }">
                              <v-list-item v-bind="props">
                                {{ `${detailKey}(${pokeArr.length})` }}
                              </v-list-item>
                            </template>
                            <div :class="$style.evo_edge_area">
                              <SearchEvoCostEvoEdge
                                v-for="(ee, eeIdx) in pokeArr"
                                :key="`${costTypeKey}-${detailKey}-${eeIdx}`"
                                :evo-edge="ee"
                                link="search-result-abundance"
                                :class="$style.evo_edge"
                              />
                            </div>
                          </v-list-group>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-list-item>
              </v-list-group>
            </v-list>
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
  type EvoCostResponse,
  EvoCostResultDtoItem,
  EvoCostResultSearchParams,
  get
} from '~/components/interface/evoCost'
const searchPattern = 'evoCost'
// current dto item
const cDtoItem = ref<EvoCostResultDtoItem>(new EvoCostResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, EvoCostResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: EvoCostResponse | null = searchCommon().restoreResData(true) as EvoCostResponse
  const dtoOpenDic: Record<string, Array<string>> | null =
    searchCommon().restoreCurrentScreen(['openDic'])?.openDic

  if (rd) {
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    // 入力チェック不要
    const ret = await get(cDtoItem.value.searchParams)
    if (!ret) { return }
    cDtoItem.value.resData = ret
  }

  initOpenDic(dtoOpenDic)

  isLoading.value = !cDtoItem.value.resData
}

const initOpenDic = (dtoOpenDic: Record<string, Array<string>> | null) => {
  if (dtoOpenDic) {
    // 復元可能な場合はそのまま復元する。
    cDtoItem.value.openDic = dtoOpenDic
    return
  }

  // 復元できない場合は、openDicを初期化する
  const openDic = cDtoItem.value.openDic
  const costTypeMap = cDtoItem.value.resData.costTypeMap
  Object.entries(costTypeMap).forEach(([_, ctv], i) => {
    openDic[`costTypeKey-${i}`] = []

    Object.entries(ctv).forEach((_, n) => {
      openDic[`costDetailKey-${i}-${n}`] = []
    })
  })
}

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  return {
    title: `${searchCommon().getSearchPatternName(searchPattern)}`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: '進化条件（必要なアメの個数、進化アイテム等）から、ポケモンを逆引きすることができます。' },
      { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
    ]
  }
})
useHead(metaObject)
</script>

<style lang="scss" module>
.cost_type_area {
  border: thin solid rgba(0, 0, 0, 0.12);

  &:not(:last-child) {
    border-bottom: none;
  }

  .detail_area {
    border-top: thin solid rgba(0, 0, 0, 0.12);
    border-left: thin solid rgba(0, 0, 0, 0.12);
    display: flow;

    .evo_edge_area {
      display: flex;
      flex-flow: wrap;
      margin-left: 16px;
    }
  }
}
.evo_edge {
  padding: 4px 8px;
  margin: 2px;
  border: 0.1em solid gray;
}
</style>
