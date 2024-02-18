import { ScpRank } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class ScpRankListResponse extends ResearchResponse {
  scpRankList: Array<ScpRank>
  league: string

  constructor () {
    super()
    this.scpRankList = []
    this.league = ''
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class ScpRankListSearchParams {
  name: string
  league: string

  constructor () {
    this.name = ''
    this.league = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class ScpRankListSearchDtoItem implements SearchDtoItem {
  searchParams: ScpRankListSearchParams
  resData?: ScpRankListResponse

  constructor () {
    this.searchParams = new ScpRankListSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class ScpRankListResultSearchParams {
  pid: string
  league: string

  constructor () {
    this.pid = ''
    this.league = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class ScpRankListResultDtoItem implements ResultDtoItem {
  searchParams: ScpRankListResultSearchParams
  resData: ScpRankListResponse

  constructor () {
    this.searchParams = new ScpRankListResultSearchParams()
    this.resData = new ScpRankListResponse()
  }
}
