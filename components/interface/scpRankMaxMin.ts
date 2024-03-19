import { ScpRank } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class ScpRankMaxMinResponse extends ResearchResponse {
  scpSlRankMax: ScpRank
  scpSlRankMin: ScpRank
  scpHlRankMax: ScpRank
  scpHlRankMin: ScpRank
  scpMlRankMax: ScpRank
  scpMlRankMin: ScpRank

  constructor () {
    super()
    this.scpSlRankMax = new ScpRank()
    this.scpSlRankMin = new ScpRank()
    this.scpHlRankMax = new ScpRank()
    this.scpHlRankMin = new ScpRank()
    this.scpMlRankMax = new ScpRank()
    this.scpMlRankMin = new ScpRank()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class ScpRankMaxMinSearchParams extends ResearchRequest {
  name: string

  constructor () {
    super()
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class ScpRankMaxMinSearchDtoItem implements SearchDtoItem {
  searchParams: ScpRankMaxMinSearchParams
  resData?: ScpRankMaxMinResponse

  constructor () {
    this.searchParams = new ScpRankMaxMinSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class ScpRankMaxMinResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class ScpRankMaxMinResultDtoItem implements ResultDtoItem {
  searchParams: ScpRankMaxMinResultSearchParams
  resData: ScpRankMaxMinResponse

  constructor () {
    this.searchParams = new ScpRankMaxMinResultSearchParams()
    this.resData = new ScpRankMaxMinResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: ScpRankMaxMinSearchParams | ScpRankMaxMinResultSearchParams
): Promise<ScpRankMaxMinResponse | void> => {
  const res = await fetchCommon('/api/scpRankMaxMin', 'GET', {
    query: searchParams
  })
  const rd: ScpRankMaxMinResponse | null = res.data as ScpRankMaxMinResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: ScpRankMaxMinSearchParams): string => {
  let msg = ''
  msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  return msg
}
