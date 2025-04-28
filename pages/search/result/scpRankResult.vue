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
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      個体値<br>(攻撃 - 防御 - HP)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `${cDtoItem.resData.targetScpRank.sl.iva} - ${cDtoItem.resData.targetScpRank.sl.ivd} - ${cDtoItem.resData.targetScpRank.sl.ivh}` }}
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
          <v-col>
            <h3>
              {{ editUtils().appendRemarks(cDtoItem.resData.name, cDtoItem.resData.remarks) }}のPvP順位
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <p>{{ `スーパーリーグ：${cDtoItem.resData.targetScpRank.sl.rank}位` }}</p>
            <p>{{ `ハイパーリーグ：${cDtoItem.resData.targetScpRank.hl.rank}位` }}</p>
            <p>{{ `マスターリーグ：${cDtoItem.resData.targetScpRank.ml.rank}位` }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="targetHeaders"
              :items="[
                cDtoItem.resData.targetScpRank.sl,
                cDtoItem.resData.targetScpRank.hl,
                cDtoItem.resData.targetScpRank.ml
              ]"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
            >
              <template #[`item.league`]="{ item }">
                {{ leagueDic[item.league] }}
              </template>
              <template #[`item.percent`]="{ item }">
                {{ item.percent + '%' }}
              </template>
              <template #bottom />
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <h3>
              進化後のポケモン
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              v-if="cDtoItem.resData.afEvolScpRankList.length"
              :headers="anotherHeaders"
              :items="cDtoItem.resData.afEvolScpRankList"
              items-per-page="-1"
              class="body-2"
              @click:row="screenControlMethods().onClickRow"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image1)" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width:120px;">
                  {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
                </div>
              </template>
              <template #bottom />
            </v-data-table>
            <div v-else class="pl-4" align="center">
              なし
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <h3>
              同系統のポケモン
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              v-if="cDtoItem.resData.anotherFormScpRankList.length"
              :headers="anotherHeaders"
              :items="cDtoItem.resData.anotherFormScpRankList"
              items-per-page="-1"
              class="body-2"
              @click:row="screenControlMethods().onClickRow"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image1)" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width:120px;">
                  {{ editUtils().appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
                </div>
              </template>
              <template #bottom />
            </v-data-table>
            <div v-else class="pl-4" align="center">
              なし
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading v-if="isValidInput" split-scr />
      <div v-else class="text-center">
        <MajorPartsInvalidInputBackLink />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MetaObject } from 'nuxt/schema'
import type { ScpRankAllInOne } from '~/components/interface/api/dto'
import {
  type ScpRankResponse,
  ScpRankResultDtoItem,
  ScpRankResultSearchParams,
  get,
  check
} from '~/components/interface/scpRank'
const searchPattern = 'scpRank'

// current dto item
const cDtoItem = ref<ScpRankResultDtoItem>(new ScpRankResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
const isValidInput = ref<boolean>(true)

const targetHeaders = readonly<any>([
  { title: 'リーグ', key: 'league' },
  { title: '順位', key: 'rank' },
  { title: 'PL', key: 'pl' },
  { title: 'CP', key: 'cp' },
  { title: '%', key: 'percent' },
  { title: '(SCP)', key: 'scp' },
  { title: '(ステ積)', key: 'sp' }])
const leagueDic = readonly<Record<string, string>>({
  sl: 'スーパー',
  hl: 'ハイパー',
  ml: 'マスター'
})

const anotherHeaders = readonly<any>([
  { title: '図鑑№', key: 'goPokedex.pokedexId', sortable: false },
  { title: '', key: 'goPokedex.image1', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name', sortable: false },
  { title: 'スーパーリーグ順位', key: 'sl.rank', sortable: false },
  { title: 'ハイパーリーグ順位', key: 'hl.rank', sortable: false },
  { title: 'マスターリーグ順位', key: 'ml.rank', sortable: false }])

const screenControlMethods = () => {
  const init = async () => {
  // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, ScpRankResultSearchParams)
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
    const rd: ScpRankResponse | null = restoredParams?.resData

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
    isLoading.value = !cDtoItem.value.resData
  }

  interface Item {
    index: number,
    item: ScpRankAllInOne
  }
  /**
   * v-data-tableの列をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: PointerEvent, selected: Item) => {
    useRouter().push({
      name: 'search-result-scpRankResult',
      query: {
        pid: selected.item.goPokedex.pokedexId,
        iv: cDtoItem.value.searchParams.iv
      }
    })
  }

  return {
    init,
    onClickRow
  }
}

// created
await screenControlMethods().init()
// 自画面遷移時
watch(() => useRoute().fullPath, async () => {
  isLoading.value = true
  await screenControlMethods().init()
  // evoInfoRef.value.refresh()
  if (process.client) { scrollTo(0, 0) }
  isLoading.value = false
})

// Header
const thisPath = useRuntimeConfig().public.url + useRoute().path
const metaObject = computed((): MetaObject => {
  const pokeName = cDtoItem.value.resData.name || ''
  const pokeImage = editUtils().getUrl(cDtoItem.value.resData.image2 || 'pokego/peripper-eyes.png')
  return {
    title: `${pokeName}のPvP順位`,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${pokeName}のPvP順位 - ペリずかん` },
      { property: 'og:url', content: thisPath },
      { property: 'og:site_name', content: 'ペリずかん' },
      { property: 'og:description', content: `${pokeName}のPvP順位を確認できます。` },
      { property: 'og:image', content: pokeImage }
    ]
  }
})
useHead(metaObject)
</script>
