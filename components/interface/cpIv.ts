import { VersatilityIv } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class CpIvResponse extends ResearchResponse {
  situation: string
  ivList: Array<VersatilityIv>
  cp: number
  wbFlg: boolean

  constructor () {
    super()
    this.situation = ''
    this.ivList = []
    this.cp = 0
    this.wbFlg = false
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class CpIvSearchParams {
  name: string
  situation: string
  cp: string
  wbFlg: boolean

  constructor () {
    this.name = ''
    this.situation = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 検索画面用DTOの定義
 */
export class CpIvSearchDtoItem implements SearchDtoItem {
  searchParams: CpIvSearchParams
  resData?: CpIvResponse

  constructor () {
    this.searchParams = new CpIvSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class CpIvResultSearchParams {
  pid: string
  situation: string
  cp: string
  wbFlg: boolean

  constructor () {
    this.pid = ''
    this.situation = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 結果画面用DTOの定義
 */
export class CpIvResultDtoItem implements ResultDtoItem {
  searchParams: CpIvResultSearchParams
  resData: CpIvResponse

  constructor () {
    this.searchParams = new CpIvResultSearchParams()
    this.resData = new CpIvResponse()
  }
}
