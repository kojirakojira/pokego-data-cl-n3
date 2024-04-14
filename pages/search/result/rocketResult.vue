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
                      {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}
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
            通常時CP
          </v-col>
          <v-col style="white-space: nowrap;">
            {{ `${normal.min} ～ ${normal.max}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-spacer v-if="!isXs" />
          <v-col class="col-title">
            天候ブースト時CP
          </v-col>
          <v-col style="white-space: nowrap;">
            {{ `${normal.wbMin} ～ ${normal.wbMax}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-col class="text-body-2 text-sm-center">
            ※個体値の振れ幅は天候ブースト関係なく0～15。PLは通常時8、天候ブースト時13。
          </v-col>
        </v-row>
      </v-container>
      <h3>
        CP(サカキ戦の場合)<span v-if="cDtoItem.resData.mega" class="subtitle-2">
          {{ `（${editUtils().appendRemarks(cDtoItem.resData.befMegaGp.name, cDtoItem.resData.befMegaGp.remarks)}で算出）` }}
        </span>
      </h3>
      <v-container>
        <v-row>
          <v-spacer v-if="!isXs" />
          <v-col class="col-title">
            通常時CP
          </v-col>
          <v-col style="white-space: nowrap;">
            <span class="text-red">{{ sakaki.min }}</span>
            {{ ` ～ ${sakaki.max}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-spacer v-if="!isXs" />
          <v-col class="col-title">
            天候ブースト時CP
          </v-col>
          <v-col style="white-space: nowrap;">
            <span class="text-red">{{ sakaki.wbMin }}</span>
            {{ ` ～ ${sakaki.wbMax}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-col class="text-body-2 text-sm-center">
            ※個体値の振れ幅は天候ブースト関係なく<span class="text-red">6</span>～15。PLは通常時8、天候ブースト時13。
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
import { useDisplay } from 'vuetify'
import type { MetaObject } from 'nuxt/schema'
import {
  type RocketResponse,
  RocketResultDtoItem,
  RocketResultSearchParams,
  get
} from '~/components/interface/rocket'

const searchPattern = 'rocket'

// current dto item
const cDtoItem = ref<RocketResultDtoItem>(new RocketResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, RocketResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: RocketResponse | null = searchCommon().restoreResearchResData() as RocketResponse

  if (rd) {
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    // 入力チェック不要
    const ret = await get(cDtoItem.value.searchParams)
    if (!ret) { return }
    cDtoItem.value.resData = ret
  }

  isLoading.value = !cDtoItem.value.resData
}

const normal = computed(() => cDtoItem.value.resData.catchCp.normal)
const sakaki = computed(() => cDtoItem.value.resData.catchCp.others[0])

const isXs = useDisplay().xs

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = editUtils().getUrl(cDtoItem.value.resData.image || 'pokego/peripper-eyes.png')
  return {
    title: `${pokeName}のロケット団勝利ボーナスCP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のロケット団勝利ボーナスCP - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `ロケット団を倒した後にゲットできる、シャドウ${pokeName}のCPの振れ幅を確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
