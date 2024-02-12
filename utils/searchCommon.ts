import { readonly } from 'vue'
import {
  type RouteLocationNormalizedLoaded,
  type RouteRecordName,
  type LocationQuery
} from 'vue-router'
import { toastStore } from '~/stores/toastStore'
// import { historyStore, ScreenInfo } from '~/stores/historyStore'
import { dtoStore, type ScreenInfo } from '~/stores/dtoStore'

/**
 * 検索系の画面(pageがsearch配下の画面)でperiDtoStoreに値を追加するときは、
 * このインターフェースを使用する。
 */
export interface SearchDtoItem extends Record<string, any> {
  searchParams: Record<string, any>
  resData?: Record<string, any>
}
/**
 * 検索系の画面(pageがsearch配下の画面)でperiDtoStoreに値を追加するときは、
 * このインターフェースを使用する。
 * ※psrを使用する場合はこっちの型を使用する。
 */
export interface OnePokeDtoItem extends SearchDtoItem {
  psr: {
    goPokedexList: Array<any>
    maybe: boolean
  }
}
/**
 * 結果画面で使用する。
 */
export interface ResultDtoItem extends Record<string, any> {
  searchParams: Record<string, any>
  resData: Record<string, any>
}
export default () => {
  const searchPatternNames = readonly({
    main: {
      name: '一般',
      patternNames: {
        searchAll: 'ポケモン検索',
        filterAll: '全ポケ絞り込み'
      }
    },
    captureCp: {
      name: '捕獲時CP',
      patternNames: {
        raid: 'レイドボス勝利ボーナスCP',
        fRTask: 'フィールドリサーチCP',
        eggs: 'タマゴCP',
        rocket: 'ロケット団勝利ボーナスCP'
      }
    },
    race: {
      name: '種族値',
      patternNames: {
        race: '種族値検索',
        raceDiff: '種族値比較'
      }
    },
    iv: {
      name: '個体値',
      patternNames: {
        scpRank: 'PvP順位',
        scpRankList: 'PvP順位一覧',
        scpRankMaxMin: 'PvP最高(最低)順位',
        afterEvoScpRank: '進化後PvP順位',
        afterEvoCp: '進化後CP',
        threeGalarBirds: 'ガラル三鳥の野生個体値',
        cpIv: 'CP→個体値検索',
        cp: '個体値→CP算出',
        plList: 'PLごとのCP一覧',
        cpRank: 'CP順位',
        cpRankList: 'CPランキング'
      }
    },
    type: {
      name: 'タイプ',
      patternNames: {
        typeScore: 'タイプ評価',
        xType: 'Xタイプ検索',
        iroiroTypeRank: '色々タイプランキング'
      }
    },
    others: {
      name: 'その他',
      patternNames: {
        unimplPokemon: '未実装ポケモン一覧',
        evoCost: '進化コスト',
        evolution: '進化ツリーと別のすがた'
      }
    }
  })

  const rules = readonly({
    name: [
      (v: string) => (v || '').length <= 20 || 'ポケモンは20文字以内で入力してください。'
    ],
    iv: [
      (v: string) =>
        ((v || '').length === 6 || (v || '').length === 0) || '個体値は6桁で入力してください。'
    ]
  })

  const restoreSearchScreen = (keys: Array<string>, dto: Record<string, any>): void => {
    const navigation: string = dtoStore().getNavigation()
    const currentSi: ScreenInfo | null = dtoStore().currentScreenInfo()
    if (navigation === 'reload') {
      // リロードの場合
      if (keys.includes('searchParams')) {
        const spKeys = Object.keys(dto.searchParams) // searchParamsに定義したキー
        for (const [k, v] of Object.entries(useRoute().query)) {
          if (spKeys.includes(k)) {
            // searchParamsに定義したキーしか復元しない。
            dto.searchParams[k] = v
          }
        }
      }
    } else if (currentSi) {
      // リロード以外の場合
      for (const [k, v] of Object.entries(currentSi.params)) {
        if (keys.includes(k)) {
          dto[k] = v
        }
      }
    }
  }

  /**
   * resDataを復元する。主に結果画面を復元するために使用する。
   * dtoStoreにおける現在画面にresDataがあれば、それを返却する。（戻るボタンで戻ってきた場合）
   * 現在画面が無く、前画面にresDataがあれば、それを返却する。（画面遷移で遷移してきた場合）
   * resDataが現在画面、前画面の双方に存在しない場合は、nullを返却する。
   *
   */
  const restoreResData = (): Record<string, any> | null => {
    // routeの取得
    const route: RouteLocationNormalizedLoaded = useRoute()
    const routeName: RouteRecordName | undefined | null = route.name
    const routeQuery: LocationQuery = route.query

    const beforeSi: ScreenInfo | null = dtoStore().beforeScreenInfo()
    const currentSi: ScreenInfo | null = dtoStore().currentScreenInfo()

    // 現在画面からの復元
    if (currentSi &&
        compareQuery(routeQuery, currentSi.query) &&
        Object.keys(currentSi.params).length &&
        Object.keys(currentSi.params.resData).length) {
      // queryが一致し、現在画面DTOにparamsが存在する場合
      return currentSi.params.resData
    }

    // 現在画面と前画面のsearchPatternNameを取得
    const befSpnMatch: RegExpMatchArray | null | undefined = beforeSi?.pathName.match(/[^-]*$/)
    const befSpn: string | null = befSpnMatch ? befSpnMatch[befSpnMatch.length - 1].toString() : null
    const spnMatch: RegExpMatchArray | null | undefined = routeName?.toString().match(/-([a-zA-Z]+)Result*$/)
    const spn: string | null = spnMatch ? spnMatch[1].toString() : null

    // 前画面からの復元
    if (beforeSi &&
        spn === befSpn &&
        beforeSi.params.resData.pokedexId === routeQuery.pid &&
        Object.keys(beforeSi.params.resData).length) {
      // ちゃんと前画面が検索画面で、前画面DTOにparamsが存在する場合
      return beforeSi.params.resData
    }

    return null
  }

  /**
   * 機能の日本語名を取得する。
   */
  const getSearchPatternName = (searchPattern: string) => {
    let ret: string = ''
    Object.entries(searchPatternNames).forEach(([, v]) => {
      Object.entries(v).forEach(([, v2]) => {
        ret = v2[searchPattern] || ret
      })
    })
    return ret
  }

  /**
   * ダイアログを表示する。
   * resData.msgLevelが'error'の場合はfalseを返却する。
   *
   * @param {Object} resData
   * @returns
   */
  const dispDialog = (resData: {
    message: string,
    msgLevel: string
  }) => {
    let success = true
    if (resData.message) {
      // メッセージがある場合はalertで表示する。
      alert(resData.message)
    }
    if (resData.msgLevel === 'error') {
      // errorの場合は画面を描画せず前画面に戻す。
      useRouter().back()
      success = false
    }
    return success
  }
  /**
   * メッセージ(msg)が存在する場合、トーストを表示する。
   * メッセージレベルがerrorの場合はfalseを返却する。（第2引数は省略可能）
   *
   * @param msg
   * @param msgLevel
   */
  const pushToast = (msg: string, msgLevel: string, isSearchBtnClick?: Ref<boolean>) => {
    let success = true
    if (msg) {
      toastStore().pushToast({ msg })
      if (msgLevel === 'error') {
        if (isSearchBtnClick) {
          isSearchBtnClick.value = false
        }
        success = false
      }
    }
    return success
  }

  /**
   * 汎用的なメッセージ処理をハンドリングする。
   *
   * @param {*} resData
   * @returns
   */
  const handleApiMessage = (resData: {
    message: string,
    msgLevel: string,
    pokemonSearchResult: {
      message: string,
      msgLevel: string
    }
  }) => {
    // 個別機能由来のメッセージ
    let success = pushToast(
      resData.message,
      resData.msgLevel)
    if (!success) {
      success = false
      return success
    }

    // 検索機能由来のメッセージ
    const searchSuccess = pushToast(
      resData.pokemonSearchResult.message,
      resData.pokemonSearchResult.msgLevel)
    if (!searchSuccess) {
      success = false
    }
    return success
  }

  /**
   * ResultListでポケモンを選択したときの処理
   *
   * @see ResultList.vue
   */
  const clickRowResultList = (
    pid: string | null | undefined,
    searchPattern: string,
    searchParams: Record<string, any>
  ): void => {
    if (!pid) { return }
    // 遷移後の画面のqueryを作成する
    const query = makeQuery(pid, searchParams)
    // 遷移
    useRouter().push({
      name: `search-result-${searchPattern}Result`,
      query
    })
  }

  /**
   * クエリパラメータをRecord<string, string>に変換する。
   * TODO: 配列には対応していない。
   *
   * @param dic
   * @returns
   */
  const convQuery = (dic: Record<string, any>): Record<string, string> => {
    const retDic: Record<string, string> = {}
    for (const [k, v] of Object.entries(dic)) {
      retDic[k] = String(v)
    }
    return retDic
  }

  /**
   * Result画面用のquery（連想配列）を作成する。
   * 遷移前の画面のクエリからnameを削除。pidを追加して返却する。
   *
   */
  const makeQuery = (pid: string, searchParams: Record<string, any>) => {
    const query: Record<string, any> = {}
    for (const [k, v] of Object.entries(searchParams)) {
      if (query[k]) {
        // queryパラメータにキーが重複している場合は、配列を表現している。
        if (Array.isArray(query[k])) {
          // 既に配列に入っている場合
          query[k].push(v)
        } else {
          // 配列でない場合は配列を作成して追加する。
          const tmpV = query[k]
          query[k] = [tmpV, v]
        }
      } else {
        // 配列項目以外のすべての場合
        query[k] = v
      }
    }

    if (pid) {
      query.pid = pid
      delete query.name
    }

    return query
  }

  /**
   * URL(GET)作成関数。配列があった場合展開する。
   * 例：values=[a, b]→values=a&values=b
   * ※APIにリクエストを投げる用（たしかSpringの仕様に準拠してたはず…）
   *
   * @param dictionary
   * @return
   */
  const spreadArray = (dictionary: {[key: string]: any}) => {
    const entries = Object.entries(dictionary)
    if (!entries.length) {
      return ''
    }
    let queryStr = '?'
    entries.forEach(([k, v]) => {
      if (v) {
        if (Array.isArray(v)) {
          v.forEach((e) => {
            queryStr += `${k}=${e}&`
          })
        } else {
          queryStr += `${k}=${v}&`
        }
      }
    })
    return queryStr.slice(0, -1)
  }

  /**
   * クエリパラメータに差分があるかどうかを判定する。
   * 一致する場合はtrue, 差異がある場合はfalseを返却する。
   *
   * @param before
   * @param after
   * @return
   */
  const compareQuery = (before: {[key: string]: any}, after: {[key: string]: any}) => {
    let bool = true
    // 相互比較
    Object.entries(before).forEach(([k]) => { if (before[k] !== after[k]) { bool = false } })
    Object.entries(after).forEach(([k]) => { if (before[k] !== after[k]) { bool = false } })
    return bool
  }

  return {
    searchPatternNames,
    rules,
    restoreSearchScreen,
    restoreResData,
    getSearchPatternName,
    dispDialog,
    pushToast,
    handleApiMessage,
    clickRowResultList,
    convQuery,
    makeQuery,
    spreadArray,
    compareQuery
  }
}
