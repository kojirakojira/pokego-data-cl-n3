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
        ダイマックスCP
      </h3>
      <v-container>
        <template v-if="cDtoItem.resData.dynamaxCatchCp">
          <v-row>
            <v-spacer v-if="!isXs" />
            <v-col class="col-title">
              ダイマックスCP
            </v-col>
            <v-col style="white-space: nowrap;">
              {{ `${dynamaxNormal.min} ～ ${dynamaxNormal.max}` }}
            </v-col>
            <v-spacer v-if="!isXs" />
          </v-row>
          <v-row>
            <v-col class="text-body-2 text-left">
              <ul :class="$style.cp_annos">
                <li>※個体値の振れ幅は10~15。PLは20固定。</li>
                <li>※ダイマックスバトルは、レイドバトルとは異なり天候ブーストの影響はなし。</li>
              </ul>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col class="text-center">
              ダイマックス実装なし
            </v-col>
          </v-row>
        </template>
      </v-container>
      <h3>
        キョダイマックスCP
      </h3>
      <v-container>
        <template v-if="cDtoItem.resData.gigantamaxCatchCp">
          <v-row>
            <v-spacer v-if="!isXs" />
            <v-col class="col-title">
              キョダイマックスCP
            </v-col>
            <v-col style="white-space: nowrap;">
              {{ `${gigantamaxNormal.min} ～ ${gigantamaxNormal.max}` }}
            </v-col>
            <v-spacer v-if="!isXs" />
          </v-row>
          <v-row>
            <v-col class="text-body-2 text-left">
              <ul :class="$style.cp_annos">
                <li>※個体値の振れ幅は10~15。PLは20固定。</li>
                <li>※キョダイマックスバトルは、レイドバトルとは異なり天候ブーストの影響はなし。</li>
              </ul>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col class="text-center">
              キョダイマックス実装なし
            </v-col>
          </v-row>
        </template>
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
  type DynamaxResponse,
  DynamaxResultDtoItem,
  DynamaxResultSearchParams,
  get
} from '~/components/interface/dynamax'
import { IvRangeCp } from '~/components/interface/api/dto'
const searchPattern = 'dynamax'
// current dto item
const cDtoItem = ref<DynamaxResultDtoItem>(new DynamaxResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

const init = async () => {
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, DynamaxResultSearchParams)
  // dtoStoreからresDataを復元
  const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
  const rd: DynamaxResponse | null = restoredParams?.resData

  if (rd && rd.pokedexId) {
    // resDataが復元できた場合
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    // 入力チェック不要
    const ret = await get(cDtoItem.value.searchParams)
    if (!ret) {
      // resが正しくない場合
      throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
    }
    cDtoItem.value.resData = ret
  }

  isLoading.value = !cDtoItem.value.resData
}

const dynamaxNormal = computed(() => cDtoItem.value.resData.dynamaxCatchCp?.normal || new IvRangeCp())
const gigantamaxNormal = computed(() => cDtoItem.value.resData.gigantamaxCatchCp?.normal || new IvRangeCp())

const isXs = useDisplay().xs

await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = editUtils().getUrl(cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png')
  return {
    title: `${pokeName}のMAX,G-MAX勝利ボーナスCP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のMAX,G-MAX勝利ボーナスCP - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}のダイマックス、キョダイマックスバトル勝利ボーナスでゲットできるポケモンのCPを確認できます。` },
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
