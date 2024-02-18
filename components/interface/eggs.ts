import { GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class EggsResponse extends ResearchResponse {
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
export class EggsSearchParams {
  name: string

  constructor () {
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class EggsSearchDtoItem implements SearchDtoItem {
  searchParams: EggsSearchParams
  resData?: EggsResponse

  constructor () {
    this.searchParams = new EggsSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class EggsResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class EggsResultDtoItem implements ResultDtoItem {
  searchParams: EggsResultSearchParams
  resData: EggsResponse

  constructor () {
    this.searchParams = new EggsResultSearchParams()
    this.resData = new EggsResponse()
  }
}
