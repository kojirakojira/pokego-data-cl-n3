import { readonly } from 'vue'
import {
  // type RouteLocationNormalizedLoaded,
  // type RouteRecordName,
  type LocationQuery
} from 'vue-router'
import { toastStore } from '~/stores/toastStore'
import { dtoStore, type ScreenInfo } from '~/stores/dtoStore'
import type { Response, ResearchResponse, MsgLevel, NotValidResponse } from '~/components/interface/api/response'
import type { ResearchRequest } from '~/components/interface/api/request'

export interface ResData extends Record<string, any> {}
/**
 * 検索系の画面(pageがsearch配下の画面)でdtoStoreに値を追加するときは、
 * このインターフェースを使用する。
 */
export interface SearchDtoItem {
  searchParams: Record<string, any>
  resData?: ResData
}
/**
 * 結果画面で使用する。
 */
export interface ResultDtoItem {
  searchParams: Record<string, any>
  resData: ResData
}
export interface RestoreCondition {
  resDataKey: string,
  routeKey: string
}
export default () => {
  const searchPatternNames = readonly({
    main: {
      name: '一般',
      patternNames: {
        searchAll: 'ポケモン検索',
        filterAll: 'ポケモン一覧'
      }
    },
    pinnacle: {
      name: '最強ポケモンランキング',
      patternNames: {
        gymRaidPinnacleRank: 'ジム・レイド対策ポケモンランキング'
      }
    },
    captureCp: {
      name: '捕獲時CP',
      patternNames: {
        wild: '野生CP',
        raid: 'レイドボス勝利ボーナスCP',
        frTask: 'フィールドリサーチCP',
        eggs: 'タマゴCP',
        rocket: 'ロケット団勝利ボーナスCP',
        dynamax: 'MAX,G-MAX勝利ボーナスCP'
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
        scpRankList: 'PvP順位ランキング',
        scpRankMaxMin: 'PvP最高(最低)順位',
        afterEvoScpRank: '進化後PvP順位',
        afterEvoCp: '進化後CP',
        threeGalarBirds: 'ガラル三鳥の野生個体値',
        cpIv: 'CP→個体値検索',
        cp: '個体値→CP算出',
        plList: 'PLごとのCPリスト',
        cpRank: 'CP順位',
        cpRankList: 'CPランキング'
      }
    },
    moves: {
      name: '技',
      patternNames: {
        moveLookup: '技検索',
        filterAllMove: '技一覧',
        pokemonAttack: 'ポケモンが覚える技',
        gymRaidPokeMoveCombi: '技の組み合わせランキング(ジム・レイド)'
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
        unimplPokemon: '未実装ポケモンリスト',
        dynamaxImplPokemon: 'MAX,G-MAX実装済みリスト',
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

  const restoreSearchScreen = (keys: Array<string>, dto: Record<string, any>): boolean => {
    const navigation: string = dtoStore().getNavigation()
    const currentSi: ScreenInfo | null = dtoStore().currentScreenInfo()
    let restoreFlg = false
    if (navigation === 'reload') {
      // リロードの場合
      if (keys.includes('searchParams')) {
        const spKeys = Object.keys(dto.searchParams) // searchParamsに定義したキー
        for (const [k, v] of Object.entries(useRoute().query)) {
          if (spKeys.includes(k)) {
            // searchParamsに定義したキーしか復元しない。
            dto.searchParams[k] = v
            restoreFlg = true
          }
        }
      }
    } else if (currentSi) {
      // リロード以外の場合
      for (const [k, v] of Object.entries(currentSi.params)) {
        if (keys.includes(k)) {
          dto[k] = v
          restoreFlg = true
        }
      }
    }
    return restoreFlg
  }

  /**
   * useRoute().queryから取得した値を使用し、～ResultSearchParamsクラスのインスタンスを生成する。
   *
   * @param routeQuery useRoute().query
   * @param ResultSearchParams ～ResultSearchParamsの型
   * @returns
   */
  const restoreSearchParams = <T>(routeQuery: LocationQuery, ResultSearchParams: new () => T): T => {
    const rsp: T = new ResultSearchParams()
    for (const k in rsp) {
      if (routeQuery[k]) {
        switch (typeof rsp[k]) {
          case 'boolean':
            rsp[k] = (routeQuery[k] === 'true') as any
            break
          case 'number':
            rsp[k] = Number(routeQuery[k]) as any
            break
          case 'string':
            rsp[k] = routeQuery[k] as any
            break
          default:
            if (Array.isArray(rsp[k])) {
              // push元、push先が両方配列の場合は展開してpush、push元が配列じゃない場合は1要素のみの配列にしてpush
              (rsp[k] as Array<any>).push(...(Array.isArray(routeQuery[k]) ? routeQuery[k] : [routeQuery[k]]))
            } else {
              throw createError({ statusCode: 500, message: `An unexpected type was specified. type:${typeof rsp[k]}`, fatal: true })
            }
        }
      }
    }

    return rsp
  }

  /**
   * 現在画面の値を取得する。
   *
   * @param keys 取得する値のキー名
   * @returns
   */
  const restoreCurrentScreen = (keys: Array<string>): Record<string, any> | null => {
    const currentSi: ScreenInfo | null = dtoStore().currentScreenInfo()
    // routeの取得
    const routeName: string = useRoute().name as string

    if (!(currentSi && currentSi.pathName === routeName && Object.keys(currentSi.params).length)) {
      // currentSiがnull、または現在のrouteと違う、またはparamsが存在しない場合はnullを返す。
      return null
    }

    const dic: Record<string, any> = {}
    for (const [k, v] of Object.entries(currentSi.params)) {
      if (keys.includes(k)) {
        dic[k] = v
      }
    }
    return dic
  }

  // const mountQuery = (params: Record<string, any>): boolean => {
  //   // routeの取得
  //   const route: RouteLocationNormalizedLoaded = useRoute()
  //   const routeQuery: LocationQuery = route.query
  //   let mountFlg = false
  //   for (const [k] of Object.entries(params)) {
  //     const queryValue = routeQuery[k]
  //     if (queryValue) {
  //       params[k] = routeQuery[k]
  //       mountFlg = true
  //     }
  //   }
  //   return mountFlg
  // }

  /**
   * resDataを復元する。主に結果画面を復元するために使用する。
   * ①dtoStoreにおける現在画面にresDataがあれば、それを返却する。（戻るボタンで戻ってきた場合）
   * ②現在画面が無く、前画面にresDataがあれば、それを返却する。（画面遷移で遷移してきた場合）
   * ③resDataが現在画面、前画面の双方に存在しない場合は、nullを返却する。
   *
   * @param prevScrChkFlg 前画面の画面名との整合性をチェックするかどうかのフラグ
   * @param rcArr 前画面のresDataを復元する条件
   * @returns
   */
  // const restoreResData = (
  //   prevScrChkFlg: boolean,
  //   prevScrRcArr?: Array<RestoreCondition>
  // ): Record<string, any> | null => {
  //   // routeの取得
  //   const route: RouteLocationNormalizedLoaded = useRoute()
  //   const routeName: RouteRecordName | undefined | null = route.name
  //   const routeQuery: LocationQuery = route.query

  //   const prevSi: ScreenInfo | null = dtoStore().prevScreenInfo()
  //   const currentSi: ScreenInfo | null = dtoStore().currentScreenInfo()

  //   // 現在画面からの復元
  //   if (currentSi &&
  //       compareQuery(routeQuery, currentSi.query) &&
  //       Object.keys(currentSi.params).length &&
  //       Object.keys(currentSi.params.resData).length) {
  //     // queryが一致し、現在画面DTOにparamsが存在する場合
  //     return currentSi.params.resData
  //   }

  //   // 現在画面と前画面のsearchPatternNameを取得
  //   const prevSpnMatch: RegExpMatchArray | null | undefined = prevSi?.pathName.match(/[^-]*$/)
  //   const prevSpn: string | null = prevSpnMatch ? prevSpnMatch[prevSpnMatch.length - 1].toString() : null
  //   const spnMatch: RegExpMatchArray | null | undefined = routeName?.toString().match(/-([a-zA-Z]+)Result*$/)
  //   const spn: string | null = spnMatch ? spnMatch[1].toString() : null

  //   const prevScrRcChkFlg = prevScrRcArr && prevScrRcArr.length

  //   // 前画面からの復元
  //   if (prevSi?.params.resData &&
  //       Object.keys(prevSi.params.resData).length &&
  //       (!prevScrChkFlg || spn === prevSpn) &&
  //       (!prevScrRcChkFlg || checkConsistency(prevScrRcArr, prevSi.params.resData))) {
  //     // ちゃんと前画面が検索画面で、前画面DTOにparamsが存在する場合
  //     return prevSi.params.resData
  //   }

  //   return null
  // }

  /**
   * 前画面が復元可能かを確認する。
   *
   * @param rcArr
   * @param prevResData
   * @returns
   */
  // const checkConsistency = (rcArr: Array<RestoreCondition>, prevResData: Record<string, any>): boolean => {
  //   const route: RouteLocationNormalizedLoaded = useRoute()
  //   const routeQuery: Record<string, string> = route.query as Record<string, string>

  //   const mismatchArr = rcArr.filter((rc) => {
  //     return routeQuery[rc.routeKey] !== editUtils().getValueFromDic(rc.resDataKey, prevResData)
  //   })
  //   return !mismatchArr.length
  // }

  /**
   * ResData(ResearchResponse)を復元する。
   *
   * @returns
   */
  // const restoreResearchResData = (): Record<string, any> | null => {
  //   return restoreResData(true, [{ resDataKey: 'pokedexId', routeKey: 'pid' }])
  // }

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
   * メッセージ(msg)が存在する場合、トーストを表示させる。
   * メッセージレベルがerrorの場合はfalseを返却する。（第3引数は省略可能）
   *
   * @param msg
   * @param msgLevel
   * @param isSearchBtnClick
   */
  const resErrHandle = (
    msg: string | undefined,
    msgLevel: MsgLevel | undefined,
    isSearchBtnClick?: Ref<boolean>
  ) => {
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
   * 入力チェックエラーの有無判定とエラー処理
   *
   * @param resData
   * @returns
   */
  const handleValidError = (resData: NotValidResponse | Response) => {
    let success = true
    if ('validationError' in resData) {
      const message = resData.messages.join('\n')
      if (import.meta.server) {
        // サーバ側
        throw createError({ statusCode: 422, message, fatal: true })
      } else {
        // クライアント側
        success = resErrHandle(
          message,
          resData.msgLevel)
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
  const handleApiMessage = (resData: Response | ResearchResponse | NotValidResponse | null | undefined) => {
    if (!resData) {
      throw createError({ statusCode: 500, message: 'An error occurred.', fatal: true })
    }

    let success = handleValidError(resData)
    if (!success) {
      return success
    }

    // 個別機能由来のメッセージ
    success = resErrHandle(
      resData.message,
      resData.msgLevel)
    if (!success) {
      return success
    }

    // 検索機能由来のメッセージ（ResearchResponse継承の場合のみ）
    if ('pokemonSearchResult' in resData && resData.pokemonSearchResult) {
      const searchSuccess = resErrHandle(
        resData.pokemonSearchResult.message,
        resData.pokemonSearchResult.msgLevel)
      if (!searchSuccess) {
        success = false
      }
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
    searchParams: ResearchRequest
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
   * Result画面用のquery（連想配列）を作成する。
   * 使用方法は2パターンある。
   * ①：makeQuery(string | null | undefined, ResearchRequest)
   *  →遷移前の画面のクエリからnameを削除。pidを追加して返却する。
   * ②：makeQuery(Record<string, any>)
   */
  const makeQuery = (arg1: string | null | undefined | Object, searchParams?: Record<string, any>) => {
    let pid: string | null | undefined = null
    let queryParams: Record<string, any> = {}
    if (arg1 && typeof arg1 !== 'string') {
      queryParams = arg1
    } else if (searchParams) {
      queryParams = searchParams
      pid = arg1
    } else {
      throw createError({ statusCode: 500, message: 'An error occurred.', fatal: true })
    }

    const query: Record<string, any> = {}
    for (const [k, v] of Object.entries(queryParams)) {
      if (!v || (Array.isArray(v) && v.length === 0)) {
        continue
      }
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
  // const compareQuery = (before: {[key: string]: any}, after: {[key: string]: any}) => {
  //   let bool = true
  //   // 相互比較
  //   Object.entries(before).forEach(([k]) => { if (before[k] !== after[k]) { bool = false } })
  //   Object.entries(after).forEach(([k]) => { if (before[k] !== after[k]) { bool = false } })
  //   return bool
  // }

  return {
    searchPatternNames,
    rules,
    // mountQuery,
    restoreSearchScreen,
    restoreSearchParams,
    restoreCurrentScreen,
    // restoreResData,
    // restoreResearchResData,
    getSearchPatternName,
    resErrHandle,
    handleValidError,
    handleApiMessage,
    clickRowResultList,
    makeQuery,
    spreadArray
  }
}
