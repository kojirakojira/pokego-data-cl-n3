import { ScpRank } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class ScpRankResponse extends ResearchResponse {
  scpSlRank: ScpRank
  scpHlRank: ScpRank
  scpMlRank: ScpRank

  constructor () {
    super()
    this.scpSlRank = new ScpRank()
    this.scpHlRank = new ScpRank()
    this.scpMlRank = new ScpRank()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class ScpRankSearchParams {
  name: string
  iv: string

  constructor () {
    this.name = ''
    this.iv = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class ScpRankSearchDtoItem implements SearchDtoItem {
  searchParams: ScpRankSearchParams
  resData?: ScpRankResponse

  constructor () {
    this.searchParams = new ScpRankSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class ScpRankResultSearchParams {
  pid: string
  iv: string

  constructor () {
    this.pid = ''
    this.iv = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class ScpRankResultDtoItem implements ResultDtoItem {
  searchParams: ScpRankResultSearchParams
  resData: ScpRankResponse

  constructor () {
    this.searchParams = new ScpRankResultSearchParams()
    this.resData = new ScpRankResponse()
  }
}
