import { AfterEvoIv, GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class AfterEvoScpRankResponse extends ResearchResponse {
  searchPokemon: GoPokedex
  iva: number
  ivd: number
  ivh: number
  cp: number
  pl: string
  afEvoList: Array<AfterEvoIv>

  constructor () {
    super()
    this.searchPokemon = new GoPokedex()
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.cp = 0
    this.pl = ''
    this.afEvoList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class AfterEvoScpRankSearchParams {
  name: string
  iv: string
  cp: string

  constructor () {
    this.name = ''
    this.iv = ''
    this.cp = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class AfterEvoScpRankSearchDtoItem implements SearchDtoItem {
  searchParams: AfterEvoScpRankSearchParams
  resData?: AfterEvoScpRankResponse

  constructor () {
    this.searchParams = new AfterEvoScpRankSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class AfterEvoScpRankResultSearchParams {
  pid: string
  iv: string
  cp: string

  constructor () {
    this.pid = ''
    this.iv = ''
    this.cp = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class AfterEvoScpRankResultDtoItem implements ResultDtoItem {
  searchParams: AfterEvoScpRankResultSearchParams
  resData: AfterEvoScpRankResponse

  constructor () {
    this.searchParams = new AfterEvoScpRankResultSearchParams()
    this.resData = new AfterEvoScpRankResponse()
  }
}
