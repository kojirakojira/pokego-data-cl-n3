import { GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class RocketResponse extends ResearchResponse {
  mega: boolean
  befMegaGp: GoPokedex
  sakaki: boolean
  maxCp: number
  minCp: number
  wbMaxCp: number
  wbMinCp: number

  constructor () {
    super()
    this.mega = false
    this.befMegaGp = new GoPokedex()
    this.sakaki = false
    this.maxCp = 0
    this.minCp = 0
    this.wbMaxCp = 0
    this.wbMinCp = 0
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class RocketSearchParams {
  name: string
  sakaki: boolean

  constructor () {
    this.name = ''
    this.sakaki = false
  }
}
/**
 * 検索画面用DTOの定義
 */
export class RocketSearchDtoItem implements SearchDtoItem {
  searchParams: RocketSearchParams
  resData?: RocketResponse

  constructor () {
    this.searchParams = new RocketSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class RocketResultSearchParams {
  pid: string
  sakaki: boolean

  constructor () {
    this.pid = ''
    this.sakaki = false
  }
}
/**
 * 結果画面用DTOの定義
 */
export class RocketResultDtoItem implements ResultDtoItem {
  searchParams: RocketResultSearchParams
  resData: RocketResponse

  constructor () {
    this.searchParams = new RocketResultSearchParams()
    this.resData = new RocketResponse()
  }
}
