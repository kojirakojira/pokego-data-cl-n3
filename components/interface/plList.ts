import { type PlCp } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class PlListResponse extends ResearchResponse {
  iva: number
  ivd: number
  ivh: number
  plList: Array<PlCp>

  constructor () {
    super()
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.plList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class PlListSearchParams {
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
export class PlListSearchDtoItem implements SearchDtoItem {
  searchParams: PlListSearchParams
  resData?: PlListResponse

  constructor () {
    this.searchParams = new PlListSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class PlListResultSearchParams {
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
export class PlListResultDtoItem implements ResultDtoItem {
  searchParams: PlListResultSearchParams
  resData: PlListResponse

  constructor () {
    this.searchParams = new PlListResultSearchParams()
    this.resData = new PlListResponse()
  }
}
