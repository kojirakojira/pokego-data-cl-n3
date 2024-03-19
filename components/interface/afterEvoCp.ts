import { GoPokedex, type GoPokedexAndCp } from './api/dto'
import { ResearchRequest } from './api/request'
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
export class AfterEvoCpSearchParams extends ResearchRequest {
  name: string
  iv: string
  cp: string

  constructor () {
    super()
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

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: AfterEvoCpSearchParams | AfterEvoCpResultSearchParams
): Promise<AfterEvoCpResponse | void> => {
  const query: Record<string, any> = {
    iva: searchParams.iv.substring(0, 2),
    ivd: searchParams.iv.substring(2, 4),
    ivh: searchParams.iv.substring(4, 6),
    cp: searchParams.cp
  }
  if ('pid' in searchParams) { query.pid = searchParams.pid }
  if ('name' in searchParams) { query.name = searchParams.name }

  const res = await fetchCommon('/api/afterEvoCp', 'GET', { query })
  const rd: AfterEvoCpResponse | null = res.data as AfterEvoCpResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: AfterEvoCpSearchParams | AfterEvoCpResultSearchParams): string => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.iv, itemName: '個体値' })
  msg += validateUtils().checkRequired({ item: searchParams.cp, itemName: 'CP' })
  msg += validateUtils().checkIv({ item: searchParams.iv, itemName: '個体値' })
  msg += validateUtils().checkNumeric({ item: searchParams.cp, itemName: 'CP' })
  return msg
}
