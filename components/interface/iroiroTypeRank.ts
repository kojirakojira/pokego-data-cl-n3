import { type IroiroTypeRankElement } from './api/dto'
import { Response } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class IroiroTypeRankResponse extends Response {
  searchPattern: string
  typeRankList: Array<IroiroTypeRankElement>
  typeComments: Array<string>
  msgsHeader: string
  msgDecoration: boolean

  constructor () {
    super()
    this.searchPattern = ''
    this.typeRankList = []
    this.typeComments = []
    this.msgsHeader = ''
    this.msgDecoration = false
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class IroiroTypeRankSearchParams {
  sp: string

  constructor () {
    this.sp = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class IroiroTypeRankSearchDtoItem implements SearchDtoItem {
  searchParams: IroiroTypeRankSearchParams
  resData?: IroiroTypeRankResponse

  constructor () {
    this.searchParams = new IroiroTypeRankSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class IroiroTypeRankResultSearchParams {
  sp: string

  constructor () {
    this.sp = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class IroiroTypeRankResultDtoItem implements ResultDtoItem {
  searchParams: IroiroTypeRankResultSearchParams
  resData: IroiroTypeRankResponse

  constructor () {
    this.searchParams = new IroiroTypeRankResultSearchParams()
    this.resData = new IroiroTypeRankResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: IroiroTypeRankSearchParams | IroiroTypeRankResultSearchParams
): Promise<IroiroTypeRankResponse | void> => {
  const res = await fetchCommon('/api/iroiroTypeRank', 'GET', {
    query: searchParams
  })
  const rd: IroiroTypeRankResponse | null = res.data as IroiroTypeRankResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
// なし

/**
 * 色々タイプランキング機能で検索可能なパターンを取得する。
 *
 * @returns searchPatternArr
 */
export const getSearchPatternArr = async (): Promise<Array<{id: string, jpn: string}>> => {
  // 送信
  const res = await fetchCommon('/api/iroiroTypeSearchPattern', 'GET')
  const rd: Record<string, string> | null = res.data as Record<string, string>
  return Object.entries(rd).map(([k, v]) => ({ id: k, jpn: v }))
}
