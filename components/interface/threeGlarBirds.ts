import { VersatilityIv } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class ThreeGalarBirdsResponse extends ResearchResponse {
  ivList: Array<VersatilityIv>
  cp: number
  wbFlg: boolean

  constructor () {
    super()
    this.ivList = []
    this.cp = 0
    this.wbFlg = false
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class ThreeGalarBirdsSearchParams {
  name: string
  cp: string
  wbFlg: boolean

  constructor () {
    this.name = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 検索画面用DTOの定義
 */
export class ThreeGalarBirdsSearchDtoItem implements SearchDtoItem {
  searchParams: ThreeGalarBirdsSearchParams
  resData?: ThreeGalarBirdsResponse

  constructor () {
    this.searchParams = new ThreeGalarBirdsSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class ThreeGalarBirdsResultSearchParams {
  pid: string
  cp: string
  wbFlg: boolean

  constructor () {
    this.pid = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 結果画面用DTOの定義
 */
export class ThreeGalarBirdsResultDtoItem implements ResultDtoItem {
  searchParams: ThreeGalarBirdsResultSearchParams
  resData: ThreeGalarBirdsResponse

  constructor () {
    this.searchParams = new ThreeGalarBirdsResultSearchParams()
    this.resData = new ThreeGalarBirdsResponse()
  }
}
