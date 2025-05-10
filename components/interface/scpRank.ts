import { PokemonSearchResult, ScpRankAllInOne } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class ScpRankResponse extends ResearchResponse {
  targetScpRank: ScpRankAllInOne
  afEvolScpRankList: Array<ScpRankAllInOne>
  anotherFormScpRankList: Array<ScpRankAllInOne>

  constructor () {
    super()
    this.targetScpRank = new ScpRankAllInOne()
    this.afEvolScpRankList = []
    this.anotherFormScpRankList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class ScpRankSearchParams extends ResearchRequest {
  override pid: string
  override name: string
  iv: string

  constructor () {
    super()
    this.pid = ''
    this.name = ''
    this.iv = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class ScpRankSearchDtoItem implements SearchDtoItem {
  searchParams: ScpRankSearchParams
  pokemonSearchResult?: PokemonSearchResult

  constructor () {
    this.searchParams = new ScpRankSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class ScpRankResultSearchParams {
  pid: string
  iv: string

  constructor () {
    this.pid = ''
    this.iv = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class ScpRankResultDtoItem implements ResultDtoItem {
  searchParams: ScpRankResultSearchParams
  resData: ScpRankResponse

  constructor () {
    this.searchParams = new ScpRankResultSearchParams()
    this.resData = new ScpRankResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: ScpRankSearchParams | ScpRankResultSearchParams
): Promise<ScpRankResponse | void> => {
  const query: Record<string, any> = {
    iva: searchParams.iv.substring(0, 2),
    ivd: searchParams.iv.substring(2, 4),
    ivh: searchParams.iv.substring(4, 6)
  }
  if ('pid' in searchParams) { query.pid = searchParams.pid }
  if ('name' in searchParams) { query.name = searchParams.name }

  const res = await fetchCommon('/api/scpRank', 'GET', { query })
  const rd: ScpRankResponse | null = res.data as ScpRankResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: ScpRankSearchParams | ScpRankResultSearchParams): string => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.iv, itemName: '個体値' })
  msg += validateUtils().checkIv({ item: searchParams.iv, itemName: '個体値' })
  return msg
}
