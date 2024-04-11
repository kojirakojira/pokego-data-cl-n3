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
          <v-col>
            {{ `${normal.min} ～ ${normal.max}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-spacer v-if="!isXs" />
          <v-col class="col-title">
            天候ブースト時CP
          </v-col>
          <v-col>
            {{ `${normal.wbMin} ～ ${normal.wbMax}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-col class="text-body-2">
            ※個体値の振れ幅は天候ブースト関係なく10～15。PLは通常時20、天候ブースト時25。
          </v-col>
        </v-row>
      </v-container>
      <h3>
        CP(シャドウレイドの場合)<span v-if="cDtoItem.resData.mega" class="subtitle-2">
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
            <span class="text-blue">{{ shadow.min }}</span>
            {{ ` ～ ${shadow.max}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-spacer v-if="!isXs" />
          <v-col class="col-title">
            天候ブースト時CP
          </v-col>
          <v-col style="white-space: nowrap;">
            <span class="text-blue">{{ shadow.wbMin }}</span>
            {{ ` ～ ${shadow.wbMax}` }}
          </v-col>
          <v-spacer v-if="!isXs" />
        </v-row>
        <v-row>
          <v-col class="text-body-2">
            <ul style="list-style: none;">
              <li>※シャドウレイドの場合、個体値の振れ幅は天候ブースト関係なく<span class="text-blue">6</span>～15。PLは通常時20、天候ブースト時25。</li>
              <li>※シャドウの場合はこうげきが上がりぼうぎょが下がるが、ダメージ量が変化するだけである。つまり、種族値・個体値に変化はなく、CPは通常（シャドウでない場合）と変わらない。</li>
            </ul>
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
  type RaidResponse,
  RaidResultDtoItem,
  RaidResultSearchParams,
  get
} from '~/components/interface/raid'
const searchPattern = 'raid'
// current dto item
const cDtoItem = ref<RaidResultDtoItem>(new RaidResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, RaidResultSearchParams)
  // dtoStoreからresDataを復元
  const rd: RaidResponse | null = searchCommon().restoreResData() as RaidResponse
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
const shadow = computed(() => cDtoItem.value.resData.catchCp.others[0])

const isXs = useDisplay().xs

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = useRuntimeConfig().public.staticUrl
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = cDtoItem.value.resData.image || '/pokego/peripper-eyes.png'
  return {
    title: `${pokeName}のレイドCP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のレイドCP - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}のレイドCPを確認できます。` },
      { property: 'og:image', content: staticUrl + pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
