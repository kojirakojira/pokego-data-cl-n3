import { ScpRank } from './api/dto'
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
export class ScpRankMaxMinSearchParams {
  name: string

  constructor () {
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
