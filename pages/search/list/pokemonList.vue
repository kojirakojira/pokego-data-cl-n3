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
              id="row-hidden-bar"
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
          <v-col cols="4" class="text-right">
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
            <v-col
              v-for="chkItem in disabledChkboxes"
              :key="`chkbox-${chkItem.label}`"
              class="py-0"
              :cols="cDtoItem.tableControl.radioStatus === 'original' ? 3 : undefined"
            >
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
          <v-col class="py-0 body-2 text-right">
            {{ `絞り込み結果：${cDtoItem.resData.pfr.gpAndCpList.length}件` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              id="pokemon-filtered-list"
              v-model:sort-by="cDtoItem.tableControl.sortByArr"
              v-model:items-per-page="cDtoItem.tableControl.itemsPerPage"
              v-model:page="cDtoItem.tableControl.currentPage"
              :headers="headers"
              :items="cDtoItem.resData.pfr.gpAndCpList"
              :items-per-page-options="itemsPerPageOptions"
              multi-sort
              item-value="goPokedex.pokedexId"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              hover
              @click:row="screenControlMethods().onClickRow"
            >
              <template #[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>
              <template #[`item.goPokedex.pokedexId`]="{ item }">
                {{ editUtils().getPdxNo(item.goPokedex.pokedexId) }}
              </template>
              <template #[`item.goPokedex.image1`]="{ item }">
                <v-avatar :image="editUtils().getPokemonImageUrl(item.goPokedex.image1)" />
              </template>
              <template #[`item.goPokedex.name`]="{ item }">
                <div style="min-width: 140px;">
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
      <div class="fixed-radio">
        <v-radio-group v-model="cDtoItem.tableControl.radioStatus" inline hide-details>
          <v-radio label="GO" color="primary" value="go" />
          <v-radio label="原作" color="primary" value="original" />
        </v-radio-group>
      </div>
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
import { GppAndCp } from '~/components/interface/api/dto'

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
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData', 'tableControl'])
    const rd: FilterAllResponse | null = restoredParams?.resData
    const tableControl: TableControl | null = restoredParams?.tableControl

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
    // ラジオボタンの復元
    tc.radioStatus = tableControl?.radioStatus || tc.radioStatus
  }

  interface Item {
    index: number,
    item: GppAndCp
  }
  /**
   * v-data-tableの列をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: PointerEvent, selected: Item) => {
    useRouter().push({
      name: searchCommon().getRouteName('abundance', true),
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
// v-data-tableのページングで次ページに飛んだ場合、画面上部、前ページに飛んだ場合、画面下部までスクロールする
watch(() => cDtoItem.value.tableControl.currentPage, (newValue, oldValue) => {
  if (newValue > oldValue) {
    // 次ページに飛んだ場合、画面上部に移動
    const elem = document.getElementById('row-hidden-bar')
    elem?.scrollIntoView({ behavior: 'smooth' })
  } else {
    // 前ページに飛んだ場合、画面下部に移動（ページの更新を待つ）
    const elem = document.getElementById('pokemon-filtered-list')
    nextTick(() => {
      elem?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    })
  }
})
// hiddenColumnsAreaの表示・非表示
const showHiddenColumnsArea = ref<boolean>(false)

// 非表示にできる列（チェックボックスの値）の全候補
const baseDisabledChkboxes = readonly<Array<{ label: string, value: string }>>([
  { label: 'タイプ', value: 'goPokedex.type1' },
  { label: 'こうげき', value: 'goPokedex.attack' },
  { label: 'ぼうぎょ', value: 'goPokedex.defense' },
  { label: 'HP', value: 'goPokedex.hp' },
  { label: 'CP', value: 'cp' },
  { label: 'HP', value: 'pokedex.hp' },
  { label: 'こうげき', value: 'pokedex.attack' },
  { label: 'ぼうぎょ', value: 'pokedex.defense' },
  { label: 'とくこう', value: 'pokedex.specialAttack' },
  { label: 'とくぼう', value: 'pokedex.specialDefense' },
  { label: 'すばやさ', value: 'pokedex.speed' }
])

const disabledChkboxes = computed((): Array<{ label: string, value: string }> => {
  const radioStatus = cDtoItem.value.tableControl.radioStatus
  return baseDisabledChkboxes.filter((chk) => {
    if (radioStatus === 'go') {
      const gList = ['pokedex.hp', 'pokedex.attack', 'pokedex.defense', 'pokedex.specialAttack', 'pokedex.specialDefense', 'pokedex.speed']
      if (gList.includes(chk.value)) {
        return false
      }
    } else if (radioStatus === 'original') {
      const oList = ['goPokedex.attack', 'goPokedex.defense', 'goPokedex.hp', 'cp']
      if (oList.includes(chk.value)) {
        return false
      }
    }
    return true
  })
})

/** 列が全部そろったv-data-tableのヘッダ */
const baseHeaders = readonly<Array<any>>([
  { title: 'No', key: 'no', align: 'center', sortable: false },
  { title: '図鑑No', key: 'goPokedex.pokedexId', align: 'center' },
  { title: '', key: 'goPokedex.image1', sortable: false, width: '52px' },
  { title: 'ポケモン', key: 'goPokedex.name' },
  { title: 'タイプ', key: 'goPokedex.type1', sortable: false },
  { title: 'こうげき', key: 'goPokedex.attack' },
  { title: 'ぼうぎょ', key: 'goPokedex.defense' },
  { title: 'HP', key: 'goPokedex.hp' },
  { title: 'CP', key: 'cp' },
  { title: 'HP', key: 'pokedex.hp' },
  { title: 'こうげき', key: 'pokedex.attack' },
  { title: 'ぼうぎょ', key: 'pokedex.defense' },
  { title: 'とくこう', key: 'pokedex.specialAttack' },
  { title: 'とくぼう', key: 'pokedex.specialDefense' },
  { title: 'すばやさ', key: 'pokedex.speed' }
])

/*
 * ヘッダの表示制御（ラジオボタンに応じて表示項目を切り替える）
 */
const headers = computed((): Array<any> => {
  const tableControl = cDtoItem.value.tableControl
  const selectedArr: Array<string> = tableControl.chkboxSelected
  return baseHeaders.filter((col) => {
    if (selectedArr.includes(col.key)) {
      return false
    }

    if (tableControl.radioStatus === 'go') {
      const gList = ['pokedex.hp', 'pokedex.attack', 'pokedex.defense', 'pokedex.specialAttack', 'pokedex.specialDefense', 'pokedex.speed']
      if (gList.includes(col.key)) {
        return false
      }
    } else if (tableControl.radioStatus === 'original') {
      const oList = ['goPokedex.attack', 'goPokedex.defense', 'goPokedex.hp', 'cp']
      if (oList.includes(col.key)) {
        return false
      }
    }
    return true
  })
})

watch(
  () => cDtoItem.value.tableControl.radioStatus,
  (newValue) => {
    const tc = cDtoItem.value.tableControl
    const removeList = newValue === 'go'
      ? ['pokedex.hp', 'pokedex.attack', 'pokedex.defense', 'pokedex.specialAttack', 'pokedex.specialDefense', 'pokedex.speed']
      : ['goPokedex.attack', 'goPokedex.defense', 'goPokedex.hp', 'cp']
    tc.sortByArr = tc.sortByArr.filter(sItem => !removeList.includes(sItem.key))
  }
)

const itemsPerPageOptions = computed((): Array<number> => {
  const retArr: Array<number> = []
  const count = cDtoItem.value.resData.pfr.gpAndCpList.length

  const limit = 200
  if (count > limit) {
    for (let i = limit; i < count; i += limit) {
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

.fixed-radio {
  background-color: white;
  padding: 5px 20px 5px 5px;
  position: fixed;
  bottom: 25px;
  left: 25px;
  z-index: 50;
  border-radius: 25px;
  border: thin solid;
}

.fixed-radio:hover {
  border-color: blue;
}
</style>
