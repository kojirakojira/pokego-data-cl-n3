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
                      図鑑№
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ editUtils().getPdxNo(cDtoItem.resData.pokedexId) }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      ポケモン
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      <span class="cursor-pointer" @click="transitionUtils().abundance(cDtoItem.resData.pokedexId)">
                        {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        CP<span v-if="cDtoItem.resData.mega" class="subtitle-2">
          {{ `（${editUtils().appendRemarks(cDtoItem.resData.befMegaGp.name, cDtoItem.resData.befMegaGp.remarks)}で算出）` }}
        </span>
      </h3>
      <v-container>
        <v-row>
          <v-spacer v-if="!isXs" />
          <v-col class="col-title">
            CP
          </v-col>
          <v-col style="white-space: nowrap;">
            {{ `${normal.min} ～ ${normal.max}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-col class="text-body-2 text-left">
            <ul :class="$style.cp_annos">
              <li>※個体値の振れ幅は10~15。PLは15固定。天候ブーストの影響なし</li>
            </ul>
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
import { useDisplay } from 'vuetify'
import type { MetaObject } from 'nuxt/schema'
import {
  type FrTaskResponse,
  FrTaskResultDtoItem,
  FrTaskResultSearchParams,
  get
} from '~/components/interface/frTask'

const searchPattern = 'frTask'
// current dto item
const cDtoItem = ref<FrTaskResultDtoItem>(new FrTaskResultDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, FrTaskResultSearchParams)
  // dtoStoreからresDataを復元
  const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
  const rd: FrTaskResponse | null = restoredParams?.resData

  if (rd && rd.pokedexId) {
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

  isLoading.value = !cDtoItem.value.resData
}

const normal = computed(() => cDtoItem.value.resData.catchCp.normal)

const isXs = useDisplay().xs

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = commonStore().getStaticUrl()
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = `${staticUrl}/public/${cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png'}`
  return {
    title: `${pokeName}のフィールドリサーチCP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のフィールドリサーチCP - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}のフィールドリサーチCPを確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>

<style lang="scss" module>
.cp_annos {
  list-style: none;
  width: fit-content;
  margin: 0 auto;
}
</style>
