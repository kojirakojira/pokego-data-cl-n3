import { CpRank, GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class CpRankListResponse extends ResearchResponse {
  goPokedex: GoPokedex
  cpRankList: Array<CpRank>

  constructor () {
    super()
    this.goPokedex = new GoPokedex()
    this.cpRankList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class CpRankListSearchParams {
  name: string

  constructor () {
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class CpRankListSearchDtoItem implements SearchDtoItem {
  searchParams: CpRankListSearchParams
  resData?: CpRankListResponse

  constructor () {
    this.searchParams = new CpRankListSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class CpRankListResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class CpRankListResultDtoItem implements ResultDtoItem {
  searchParams: CpRankListResultSearchParams
  resData: CpRankListResponse

  constructor () {
    this.searchParams = new CpRankListResultSearchParams()
    this.resData = new CpRankListResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: CpRankListSearchParams | CpRankListResultSearchParams
): Promise<CpRankListResponse | void> => {
  const res = await fetchCommon('/api/cpRankList', 'GET', {
    query: searchParams
  })
  const rd: CpRankListResponse | null = res.data as CpRankListResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: CpRankListSearchParams) => {
  let msg = ''
  msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  return msg
}
