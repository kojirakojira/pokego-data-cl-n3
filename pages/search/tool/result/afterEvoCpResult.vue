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
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      個体値<br>(こうげき - ぼうぎょ - HP)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `${cDtoItem.resData.iva} - ${cDtoItem.resData.ivd} - ${cDtoItem.resData.ivh}` }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      CP
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ cDtoItem.resData.cp }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      (PL)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `(${cDtoItem.resData.pl})` }}
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
          <v-col cols="12">
            <h3>
              進化後のポケモン
            </h3>
            <v-data-table
              v-if="cDtoItem.resData.afEvolCpList.length"
              :headers="headers"
              :items="cDtoItem.resData.afEvolCpList"
              items-per-page="-1"
              class="body-2"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="`${staticUrl}/public/${(item.goPokedex.image1) || 'no-image.png'}`" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width:120px;">
                  {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
                </div>
              </template>
              <template #bottom />
            </v-data-table>
            <div v-else class="pl-4">
              なし
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3>
              別のすがた
            </h3>
            <v-data-table
              v-if="cDtoItem.resData.anotherFormList.length"
              :headers="headers"
              :items="cDtoItem.resData.anotherFormList"
              items-per-page="-1"
              class="body-2"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="`${staticUrl}/public/${(item.goPokedex.image1) || 'no-image.png'}`" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width:120px;">
                  {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
                </div>
              </template>
              <template #bottom />
            </v-data-table>
            <div v-else class="pl-4">
              なし
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading v-if="isValidInput" split-scr />
      <div v-else>
        <MajorPartsInvalidInputBackLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import {
  type AfterEvoCpResponse,
  AfterEvoCpResultDtoItem,
  AfterEvoCpResultSearchParams,
  get,
  check
} from '~/components/interface/afterEvoCp'
const searchPattern = 'afterEvoCp'

// current dto item
const cDtoItem = ref<AfterEvoCpResultDtoItem>(new AfterEvoCpResultDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const headers = ref<any>([
  { title: '図鑑№', key: 'goPokedex.pokedexId', sortable: false },
  { title: '', key: 'goPokedex.image1', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name', sortable: false },
  { title: 'CP', key: 'cp', sortable: false }])

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const init = async () => {
  /**
   * searchParams, resDataのセット
   */
  // route.queryからsearchParamsを復元
  cDtoItem.value.searchParams = searchCommon()
    .restoreSearchParams(useRoute().query, AfterEvoCpResultSearchParams)
  // dtoStoreからresDataを復元
  const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
  const rd: AfterEvoCpResponse | null = restoredParams?.resData

  if (rd && rd.pokedexId) {
    // resDataが復元できた場合
    cDtoItem.value.resData = rd
  } else {
    // 存在しない場合は取得する
    if (check(cDtoItem.value.searchParams)) {
      throw createError({ statusCode: 400, message: '不正なパラメータが指定されました。', fatal: true })
    }

    const ret = await get(cDtoItem.value.searchParams)
    if (!ret) {
      isValidInput.value = false
      return
    }
    cDtoItem.value.resData = ret
  }

  if (!cDtoItem.value.searchParams.cp && headers.value[headers.value.length - 1].key === 'cp') {
  // cpが未入力の場合はcp列を削除する。
    headers.value.pop()
  }
  isLoading.value = !cDtoItem.value.resData
}
await init()

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const staticUrl = commonStore().getStaticUrl()
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = `${staticUrl}/public/${cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png'}`
  return {
    title: `${pokeName}の進化後CP`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}の進化後CP - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}の進化後のCPを確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
