import { type XTypeElement } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class XTypeResponse extends ResearchResponse {
  own1: string
  own2: string
  opp1: string
  opp2: string
  emphasis: string
  typeRankList: Array<XTypeElement>
  typeComments: Array<string>

  constructor () {
    super()
    this.own1 = ''
    this.own2 = ''
    this.opp1 = ''
    this.opp2 = ''
    this.emphasis = ''
    this.typeRankList = []
    this.typeComments = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class XTypeSearchParams {
  own1: string
  own2: string
  opp1: string
  opp2: string
  emphasis: string

  constructor () {
    this.own1 = ''
    this.own2 = ''
    this.opp1 = ''
    this.opp2 = ''
    this.emphasis = 'none'
  }
}
/**
 * 検索画面用DTOの定義
 */
export class XTypeSearchDtoItem implements SearchDtoItem {
  searchParams: XTypeSearchParams
  resData?: XTypeResponse

  constructor () {
    this.searchParams = new XTypeSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class XTypeResultSearchParams {
  own1: string
  own2: string
  opp1: string
  opp2: string
  emphasis: string

  constructor () {
    this.own1 = ''
    this.own2 = ''
    this.opp1 = ''
    this.opp2 = ''
    this.emphasis = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class XTypeResultDtoItem implements ResultDtoItem {
  searchParams: XTypeResultSearchParams
  resData: XTypeResponse

  constructor () {
    this.searchParams = new XTypeResultSearchParams()
    this.resData = new XTypeResponse()
  }
}
