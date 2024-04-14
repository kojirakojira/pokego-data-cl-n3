<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <client-only>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
              <v-icon>
                mdi-pen
              </v-icon>
              ポケモン
            </v-col>
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-container class="px-0">
                <v-row>
                  <v-col
                    v-for="(item, idx) in cDtoItem.searchParams.textFieldValues"
                    :key="`name-field-${idx * 1 + 1}`"
                    cols="12"
                    md="12"
                    lg="12"
                    xl="6"
                    class="py-0"
                  >
                    <v-text-field
                      v-model="item.name"
                      :label="`ポケモン${idx * 1 + 1}体目`"
                      outlined
                      density="compact"
                      :rules="searchCommon().rules.name"
                      :counter="20"
                      maxlength="20"
                      autocomplete="off"
                      clearable
                      :error-messages="item.errMsg"
                      style="max-width: calc(20em + 140px);"
                      class="mx-auto"
                      :append-inner-icon="item.pid ? 'mdi-check' : ''"
                      @update:model-value="textFieldMethods().onChangeText(idx)"
                      @keyup.enter.exact="screenControlMethods().clickSearchBtn"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" align="right">
              <v-btn
                class="mx-2"
                size="small"
                icon="mdi-plus"
                :color="cDtoItem.searchParams.textFieldValues.length >= 6 ? '' : 'info'"
                :disabled="cDtoItem.searchParams.textFieldValues.length >= 6"
                elevation="2"
                @click="() => {
                  cDtoItem.searchParams.textFieldValues.push({ name: '', errMsg: '' })
                }"
              />
              <v-btn
                class="mx-2"
                size="small"
                icon="mdi-minus"
                :color="cDtoItem.searchParams.textFieldValues.length <= 2 ? '' : 'red'"
                :disabled="cDtoItem.searchParams.textFieldValues.length <= 2"
                elevation="2"
                @click="() => {
                  cDtoItem.searchParams.textFieldValues.pop()
                }"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn
                rounded
                min-width="50%"
                color="success"
                :disabled="isSearchBtnClick"
                @click="screenControlMethods().clickSearchBtn"
              >
                検索
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-dialog
          :model-value="dialogFlg"
          scrollable
          max-width="600px"
          persistent
          transition="dialog-bottom-transition"
        >
          <SearchResultListDialog
            :psr="notUniquePsrArr[0]?.psr"
            :header-background-color="notUniquePsrArr[0] && notUniquePsrArr[0].msrIdx % 2 === 0 ? 'info' : 'success'"
            @selected="(pid) => { textFieldMethods().selected(notUniquePsrArr[0]?.msrIdx, pid) }"
            @close="() => {
              notUniquePsrArr.splice(0)
              dialogFlg = false
              isSearchBtnClick = false
            }"
          >
            {{ `ポケモン${notUniquePsrArr[0]?.msrIdx + 1}体目` }}
          </SearchResultListDialog>
        </v-dialog>
      </client-only>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PokemonSearchResult, type MultiSearchResult, GoPokedex } from '~/components/interface/api/dto'
import {
  RaceDiffSearchDtoItem,
  type RaceDiffResponse,
  get,
  type TextFieldValue
} from '~/components/interface/raceDiff'

const searchPattern = 'raceDiff'
/**
 * 画面制御用機能
 */
// current dto item
const cDtoItem = ref<RaceDiffSearchDtoItem>(new RaceDiffSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem
const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)
const screenControlMethods = () => {
  /** 初期表示時の処理 */
  const init = (): void => {
    searchCommon().restoreSearchScreen(['searchParams', 'resData'], cDtoItem.value)

    textFieldMethods().init()
  }

  /** 検索ボタン押下時の処理 */
  const clickSearchBtn = async () => {
    isSearchBtnClick.value = true
    // パラメータcheck不要（全部サーバ側でやる）
    isLoading.value = true
    textFieldMethods().clearErrMsg() // エラーメッセージをクリア
    const res = await get(cDtoItem.value.searchParams)
    handleApiResult(res)
  }

  /** APIのレスポンスを処理する。 */
  const handleApiResult = (rd: RaceDiffResponse) => {
    if (rd.success) {
      cDtoItem.value.resData = rd

      if (!rd.searchedById && !handleApiNameSearchResult(rd)) {
        // nameから検索していて、遷移不可能と判定された場合
        isLoading.value = false
        isSearchBtnClick.value = false
        return
      }

      // idから検索した場合、またはnameから検索して遷移可能な場合
      transResultPage(cDtoItem.value.searchParams.textFieldValues)
    }
  }

  /**
   * APIでnameから検索した場合にのみ実行する処理
   * @returns result画面に遷移可能かどうか（true: 可能, false: 不可能）
   */
  const handleApiNameSearchResult = (rd: RaceDiffResponse): boolean => {
    const msr: MultiSearchResult = rd.msr as MultiSearchResult
    // ヒットしていないnameが存在した場合
    if (msr.psrArr.filter(psr => !psr.hit).length) {
      // エラーメッセージをセット
      msr.psrArr.forEach((psr, i) => {
        if (psr.msgLevel === 'error') {
          cDtoItem.value.searchParams.textFieldValues[i].errMsg = psr.message
        }
      })

      return false
    }

    // 検索結果をtextFieldValuesに適用させる。
    msr.psrArr.forEach((psr, i) => {
      if (psr.unique) {
        // ポケモンが一意の場合は、pidをセットする。
        cDtoItem.value.searchParams.textFieldValues[i].pid = psr.goPokedex.pokedexId
      } else {
        // ポケモンが一意に特定できていない場合
        notUniquePsrArr.value.push({ psr, msrIdx: i })
      }
    })

    if (!msr.allUnique) {
      // ユニークじゃないポケモンがいた場合
      dialogFlg.value = true
      return false
    }
    return true
  }

  /** result画面に遷移するための処理 */
  const transResultPage = (textFieldValues: Array<TextFieldValue>): void => {
    const dic: Record<string, string> = {}
    textFieldValues.forEach((tfv: TextFieldValue, i: number) => {
      dic[`pid${i + 1}`] = tfv.pid as string
    })

    useRouter().push({
      name: 'search-result-raceDiffResult',
      query: dic
    })
  }
  return {
    init,
    clickSearchBtn,
    transResultPage
  }
}

/**
 * 入力ボックス用機能
 *
 * ※種族値比較機能では、入力ボックス用の変数に配列を使うが、配列はURLのqueryとの相性が悪い。
 * そのため、表示用⇔RaceDiffSearchDtoItemでの変換処理を行う仕様としている。
 */
interface NotUniquePsr {
  psr: PokemonSearchResult,
  msrIdx: number
}
const dialogFlg = ref<boolean>(false)
const notUniquePsrArr = ref<Array<NotUniquePsr>>([])
const textFieldMethods = () => {
  /** 入力ボックスの初期化処理 */
  const init = (): void => {
    const textFieldValues = cDtoItem.value.searchParams.textFieldValues

    if (textFieldValues.length) {
      // textFiledValuesが復元できている場合
      return
    }

    // 初期表示時の入力ボックスは2個
    textFieldValues.push({ name: '', errMsg: '' })
    textFieldValues.push({ name: '', errMsg: '' })
  }

  /** 入力ボックスの値が変更されたときの処理 */
  const onChangeText = (idx: number) => {
    // pidを削除する。
    const textFieldValues = cDtoItem.value.searchParams.textFieldValues
    delete textFieldValues[idx].pid
  }

  /** 入力されたポケモンに対して検索結果が複数ヒットした状況で、ポケモンが選択された場合の処理 */
  const selected = (msrIdx: number, pid: string) => {
    const msr: MultiSearchResult = cDtoItem.value.resData?.msr as MultiSearchResult
    const targetGp: GoPokedex = msr.psrArr[msrIdx].goPokedexList
      .filter(gp => pid === gp.pokedexId)[0]
    // 入力ボックスに値をセットする。
    /**
     * TODO: emitイベント中にrefの値を更新するとバグるっぽい……。Vue.jsのバグの可能性が高い…。
     * client-onlyで対処中。
     * 再現手順：
     * ①この画面を開く
     * ②リロードする。
     * ③ミュウツー、ニャースを入力する。
     * ④ダイアログで選択して遷移する。
     */
    const targetTfv = cDtoItem.value.searchParams.textFieldValues[msrIdx]
    targetTfv.name = editUtils().appendRemarks(targetGp.name, targetGp.remarks)
    targetTfv.errMsg = ''
    targetTfv.pid = targetGp.pokedexId

    // 先頭の要素を削除
    notUniquePsrArr.value.shift()

    dialogFlg.value = false

    if (notUniquePsrArr.value.length) {
      // まだuniqueでないpsrがある場合
      // ダイアログのアニメーションを考慮して少し遅延させて、次のダイアログを開く
      setTimeout(() => { dialogFlg.value = true }, 200)
    } else {
      // 全てuniqueになった場合
      // idから種族値比較用の情報を取得
      get(cDtoItem.value.searchParams)
        .then((res) => {
          cDtoItem.value.resData = res
          screenControlMethods().transResultPage(cDtoItem.value.searchParams.textFieldValues)
        })
    }
  }
  const clearErrMsg = () => {
    cDtoItem.value.searchParams.textFieldValues.forEach((tfv) => {
      tfv.errMsg = ''
    })
  }
  return {
    init,
    onChangeText,
    selected,
    clearErrMsg
  }
}

// created
screenControlMethods().init()

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'ポケモンの種族値を調べることができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
