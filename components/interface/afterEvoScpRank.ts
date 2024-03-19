import { AfterEvoIv, GoPokedex } from './api/dto'
import { ResearchRequest } from './api/request'
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
export class AfterEvoScpRankSearchParams extends ResearchRequest {
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

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: AfterEvoScpRankSearchParams | AfterEvoScpRankResultSearchParams
): Promise<AfterEvoScpRankResponse | void> => {
  const query: Record<string, any> = {
    iva: searchParams.iv.substring(0, 2),
    ivd: searchParams.iv.substring(2, 4),
    ivh: searchParams.iv.substring(4, 6),
    cp: searchParams.cp
  }
  if ('pid' in searchParams) { query.pid = searchParams.pid }
  if ('name' in searchParams) { query.name = searchParams.name }

  const res = await fetchCommon('/api/afterEvoScpRank', 'GET', { query })
  const rd: AfterEvoScpRankResponse | null = res.data as AfterEvoScpRankResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: AfterEvoScpRankSearchParams | AfterEvoScpRankResultSearchParams) => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.iv, itemName: '個体値' })
  msg += validateUtils().checkIv({ item: searchParams.iv, itemName: '個体値' })
  // 任意項目
  msg += validateUtils().checkNumeric({ item: searchParams.cp, itemName: 'CP' })
  return msg
}
