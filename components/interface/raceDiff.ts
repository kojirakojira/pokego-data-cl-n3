import { Race, MultiSearchResult } from './api/dto'
import { Response } from './api/response'

/**
 * 検索画面の入力ボックス用の型（機能独自）
 */
export interface TextFieldValue {
  name: string,
  errMsg: string,
  pid?: string
}
/**
 * レスポンスの型（API依存の部分）
 */
export class RaceDiffResponse extends Response {
  msr?: MultiSearchResult
  raceArr: Array<Race>
  searchedById: boolean
  goTotalCount: number
  oriTotalCount: number

  constructor () {
    super()
    this.msr = new MultiSearchResult()
    this.raceArr = []
    this.searchedById = false
    this.goTotalCount = 1
    this.oriTotalCount = 1
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class RaceDiffSearchParams {
  textFieldValues: Array<TextFieldValue>

  constructor () {
    this.textFieldValues = []
  }
}
/**
 * 検索画面用DTOの定義
 */
export class RaceDiffSearchDtoItem implements SearchDtoItem {
  searchParams: RaceDiffSearchParams
  resData?: RaceDiffResponse

  constructor () {
    this.searchParams = new RaceDiffSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class RaceDiffResultSearchParams {
  pid1: string
  pid2: string
  pid3: string
  pid4: string
  pid5: string
  pid6: string

  constructor () {
    this.pid1 = ''
    this.pid2 = ''
    this.pid3 = ''
    this.pid4 = ''
    this.pid5 = ''
    this.pid6 = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class RaceDiffResultDtoItem implements ResultDtoItem {
  searchParams: RaceDiffResultSearchParams
  resData: RaceDiffResponse

  constructor () {
    this.searchParams = new RaceDiffResultSearchParams()
    this.resData = new RaceDiffResponse()
  }
}

export interface RaceDiffRequestQuery {
  pidArr?: Array<string>,
  nameArr?: Array<string>
}
/**
 * searchParamsからid(or name)を抽出し配列化する。
 *
 * @param searchParams
 * @returns
 */
export const createRaceDiffRequestQuery = (
  searchParams: RaceDiffSearchParams | RaceDiffResultSearchParams
): RaceDiffRequestQuery => {
  const ret: RaceDiffRequestQuery = {}
  if ('pid1' in searchParams) {
    // 結果画面からの呼び出し
    ret.pidArr = Object.entries(searchParams)
      .filter(([k, v]) => k.match(/pid[1-6]$/) && v)
      .sort(([k1], [k2]) => {
        const num1 = Number(k1.substring(k1.length - 1))
        const num2 = Number(k2.substring(k2.length - 1))
        return num1 - num2
      })
      .map(entry => entry[1])
  } else if ('textFieldValues' in searchParams) {
    // 検索画面からの呼び出し
    if (searchParams.textFieldValues.filter(tfv => !tfv.pid).length) {
      ret.nameArr = searchParams.textFieldValues
        .map(tfv => tfv.name)
    } else {
      // pidがすべて揃っている場合は、idArrで返却する。
      ret.pidArr = searchParams.textFieldValues
        .map(tfv => tfv.pid as string)
    }
  }

  return ret
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: RaceDiffSearchParams | RaceDiffResultSearchParams
): Promise<RaceDiffResponse> => {
  // リクエスト用queryの作成
  const query: Record<string, any> = createRaceDiffRequestQuery(searchParams)

  const res = await fetchCommon('/api/raceDiff', 'GET', { query })
  const rd: RaceDiffResponse | null = res.data as RaceDiffResponse
  // 個別機能由来のメッセージ
  searchCommon().resErrHandle(rd.message, rd.msgLevel)
  // 検索機能由来のメッセージ
  searchCommon().resErrHandle(rd.msr?.message, rd.msr?.msgLevel)

  console.log(rd)

  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
// すべてサーバ側でやる
