<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <SearchInputFilteredItems :items="cDtoItem.resData.pfr.filteredItems" />
      <v-container
        :class="[
          theme === 'dark' ? 'bg-grey-darken-3' : 'bg-grey-lighten-3',
          'column-disabled-area',
          'pa-4',
          'my-4'
        ]"
      >
        <v-row class="body-1">
          <v-col cols="8">
            <v-btn
              rounded
              class="px-4"
              color="success"
              density="comfortable"
              size="small"
              @click="showHiddenColumnsArea = !showHiddenColumnsArea"
            >
              列を非表示にする
            </v-btn>
          </v-col>
          <v-col cols="4" align="right">
            <v-btn
              rounded
              variant="outlined"
              class="px-4"
              style="background-color: white;"
              color="error"
              density="comfortable"
              size="small"
              title="列の絞り込みをクリア"
              @click="clear()"
            >
              <span class="caption">クリア</span>
            </v-btn>
          </v-col>
        </v-row>
        <transition name="fade">
          <v-row v-show="showHiddenColumnsArea">
            <v-col v-for="chkItem in disabledChkboxes" :key="`chkbox-${chkItem.label}`" class="py-0">
              <v-checkbox
                v-model="cDtoItem.tableControl.chkboxSelected"
                hide-details
                :label="chkItem.label"
                :value="chkItem.value"
                style="white-space: nowrap;"
              />
            </v-col>
          </v-row>
        </transition>
      </v-container>
      <v-container>
        <v-row>
          <v-col class="py-0 body-2" align="right">
            {{ `絞り込み結果：${cDtoItem.resData.pfr.gpAndCpList.length}件` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              v-model:sort-by="cDtoItem.tableControl.sortByArr"
              v-model:items-per-page="cDtoItem.tableControl.itemsPerPage"
              v-model:page="cDtoItem.tableControl.currentPage"
              :headers="headers"
              :items="cDtoItem.resData.pfr.gpAndCpList"
              :items-per-page-options="itemsPerPageOptions"
              item-value="goPokedex.pokedexId"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              hover
              @click:row="screenControlMethods().onClickRow"
            >
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image`]="{ item }">
                <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image)" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div>
                  {{ item.goPokedex.name }}
                  <p v-if="item.goPokedex.remarks" class="text-caption">
                    {{ `(${item.goPokedex.remarks})` }}
                  </p>
                </div>
              </template>
              <template #[`item.goPokedex.type1`]="{ item }">
                <SearchType :type="item.goPokedex.type1" />
                <SearchType
                  v-if="item.goPokedex.type2"
                  :type="item.goPokedex.type2"
                  style="margin-left:5px;"
                />
              </template>
            </v-data-table>
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
import { useTheme } from 'vuetify'
import {
  type FilterAllResponse,
  FilterAllResultDtoItem,
  FilterAllResultSearchParams,
  type TableControl,
  get
} from '~/components/interface/filterAll'
import { GoPokedexAndCp } from '~/components/interface/api/dto'

const searchPattern = 'filterAll'
// current dto item
const cDtoItem = ref<FilterAllResultDtoItem>(new FilterAllResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
/**
 * 画面制御用機能
 */
const screenControlMethods = () => {
  const init = async () => {
    // route.queryからsearchParamsを復元
    cDtoItem.value.searchParams = searchCommon()
      .restoreSearchParams(useRoute().query, FilterAllResultSearchParams)
    // dtoStoreからresDataを復元
    const rd: FilterAllResponse | null = searchCommon().restoreResData(false) as FilterAllResponse
    const tableControl: TableControl | null =
    searchCommon().restoreCurrentScreen(['tableControl'])?.tableControl

    if (rd) {
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      // 入力チェック不要
      const ret = await get(cDtoItem.value.searchParams)
      if (!ret) { return }
      cDtoItem.value.resData = ret
    }

    // v-data-tableの復元
    restoreTableControl(tableControl)

    isLoading.value = !cDtoItem.value.resData
  }

  /**
   * v-data-tableの復元
   * @param tableControl
   */
  const restoreTableControl = (tableControl: TableControl | null) => {
    const tc = cDtoItem.value.tableControl
    // チェックボックスの復元
    tc.chkboxSelected = tableControl?.chkboxSelected || tc.chkboxSelected
    // ソートの復元
    tc.sortByArr = tableControl?.sortByArr || tc.sortByArr
    // 現在の1ページ当たり表示件数の復元
    tc.itemsPerPage = tableControl?.itemsPerPage || itemsPerPageOptions.value[0]
    // 現在のページ
    tc.currentPage = tableControl?.currentPage || 1
  }

  interface Item {
    index: number,
    item: GoPokedexAndCp
  }
  /**
   * v-data-tableの列をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: PointerEvent, selected: Item) => {
    useRouter().push({
      name: 'search-result-abundance',
      query: {
        pid: selected.item.goPokedex.pokedexId
      }
    })
  }
  return {
    init,
    onClickRow
  }
}

/**
 * table制御用機能
 */
// hiddenColumnsAreaの表示・非表示
const showHiddenColumnsArea = ref<boolean>(false)

// 非表示にできる列（チェックボックスの値）
const disabledChkboxes = ref<Array<{ label: string, value: string }>>([
  { label: 'タイプ', value: 'goPokedex.type1' },
  { label: 'こうげき', value: 'goPokedex.attack' },
  { label: 'ぼうぎょ', value: 'goPokedex.defense' },
  { label: 'HP', value: 'goPokedex.hp' },
  { label: 'CP', value: 'cp' }
])

/** 列が全部そろったv-data-tableのヘッダ */
const baseHeaders = readonly<Array<any>>([
  { title: '図鑑№', key: 'goPokedex.pokedexId', align: 'center' },
  { title: '', key: 'goPokedex.image', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name' },
  { title: 'タイプ', key: 'goPokedex.type1', sortable: false },
  { title: 'こうげき', key: 'goPokedex.attack' },
  { title: 'ぼうぎょ', key: 'goPokedex.defense' },
  { title: 'HP', key: 'goPokedex.hp' },
  { title: 'CP', key: 'cp' }
])

const headers = computed((): Array<any> => {
  const selectedArr: Array<string> = cDtoItem.value.tableControl.chkboxSelected
  return baseHeaders.filter(col => !selectedArr.includes(col.key))
})

const itemsPerPageOptions = computed((): Array<number> => {
  const retArr: Array<number> = []
  const count = cDtoItem.value.resData.pfr.gpAndCpList.length

  if (count > 200) {
    for (let i = 200; i < count; i = i + 200) {
      retArr.push(i)
    }
  }
  retArr.push(-1)

  return retArr
})

// Vuetifyのテーマを取得する（light or dark）
const theme = computed((): string => {
  return useTheme().global.name.value
})

const clear = () => {
  cDtoItem.value.tableControl.chkboxSelected.splice(0)
  showHiddenColumnsArea.value = false
}

await screenControlMethods().init()

// Header
useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: '絞り込み条件を複合的に設定し、対象のポケモンの一覧を確認することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.column-disabled-area {
  max-width: 700px;
  border-radius: 20px;
}
</style>
