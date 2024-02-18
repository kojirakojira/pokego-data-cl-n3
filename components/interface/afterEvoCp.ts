import { GoPokedex, type GoPokedexAndCp } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class AfterEvoCpResponse extends ResearchResponse {
  searchPokemon: GoPokedex
  iva: number
  ivd: number
  ivh: number
  cp: number
  pl: string
  afEvoList: Array<GoPokedexAndCp>
  anotherFormList: Array<GoPokedexAndCp>

  constructor () {
    super()
    this.searchPokemon = new GoPokedex()
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.cp = 0
    this.pl = ''
    this.afEvoList = []
    this.anotherFormList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class AfterEvoCpSearchParams {
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
export class AfterEvoCpSearchDtoItem implements SearchDtoItem {
  searchParams: AfterEvoCpSearchParams
  resData?: AfterEvoCpResponse

  constructor () {
    this.searchParams = new AfterEvoCpSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class AfterEvoCpResultSearchParams {
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
export class AfterEvoCpResultDtoItem implements ResultDtoItem {
  searchParams: AfterEvoCpResultSearchParams
  resData: AfterEvoCpResponse

  constructor () {
    this.searchParams = new AfterEvoCpResultSearchParams()
    this.resData = new AfterEvoCpResponse()
  }
}
