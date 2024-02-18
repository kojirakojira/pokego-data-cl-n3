import { CpRank, GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class CpRankResponse extends ResearchResponse {
  goPokedex: GoPokedex
  iva: number
  ivd: number
  ivh: number
  cpRank: CpRank

  constructor () {
    super()
    this.goPokedex = new GoPokedex()
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.cpRank = new CpRank()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class CpRankSearchParams {
  name: string
  iv: string
  pl: string

  constructor () {
    this.name = ''
    this.iv = ''
    this.pl = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class CpRankSearchDtoItem implements SearchDtoItem {
  searchParams: CpRankSearchParams
  resData?: CpRankResponse

  constructor () {
    this.searchParams = new CpRankSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class CpRankResultSearchParams {
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
export class CpRankResultDtoItem implements ResultDtoItem {
  searchParams: CpRankResultSearchParams
  resData: CpRankResponse

  constructor () {
    this.searchParams = new CpRankResultSearchParams()
    this.resData = new CpRankResponse()
  }
}
