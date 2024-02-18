import { GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class FRTaskResponse extends ResearchResponse {
  mega: boolean
  befMegaGp: GoPokedex
  shadow: boolean
  maxCp: number
  minCp: number

  constructor () {
    super()
    this.mega = false
    this.befMegaGp = new GoPokedex()
    this.shadow = false
    this.maxCp = 0
    this.minCp = 0
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class FRTaskSearchParams {
  name: string

  constructor () {
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class FRTaskSearchDtoItem implements SearchDtoItem {
  searchParams: FRTaskSearchParams
  resData?: FRTaskResponse

  constructor () {
    this.searchParams = new FRTaskSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class FRTaskResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class FRTaskResultDtoItem implements ResultDtoItem {
  searchParams: FRTaskResultSearchParams
  resData: FRTaskResponse

  constructor () {
    this.searchParams = new FRTaskResultSearchParams()
    this.resData = new FRTaskResponse()
  }
}
