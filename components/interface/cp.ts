import { GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class CpResponse extends ResearchResponse {
  goPokedex: GoPokedex
  iva: number
  ivd: number
  ivh: number
  pl: string
  cp: number

  constructor () {
    super()
    this.goPokedex = new GoPokedex()
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.pl = ''
    this.cp = 0
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class CpSearchParams {
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
export class CpSearchDtoItem implements SearchDtoItem {
  searchParams: CpSearchParams
  resData?: CpResponse

  constructor () {
    this.searchParams = new CpSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class CpResultSearchParams {
  pid: string
  iv: string
  pl: string

  constructor () {
    this.pid = ''
    this.iv = ''
    this.pl = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class CpResultDtoItem implements ResultDtoItem {
  searchParams: CpResultSearchParams
  resData: CpResponse

  constructor () {
    this.searchParams = new CpResultSearchParams()
    this.resData = new CpResponse()
  }
}
