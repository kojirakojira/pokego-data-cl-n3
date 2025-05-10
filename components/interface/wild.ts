import { CatchCp, PokemonSearchResult } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class WildResponse extends ResearchResponse {
  catchCp: CatchCp

  constructor () {
    super()
    this.catchCp = new CatchCp()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class WildSearchParams extends ResearchRequest {
  override pid: string
  override name: string

  constructor () {
    super()
    this.pid = ''
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class WildSearchDtoItem implements SearchDtoItem {
  searchParams: WildSearchParams
  pokemonSearchResult?: PokemonSearchResult

  constructor () {
    this.searchParams = new WildSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class WildResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class WildResultDtoItem implements ResultDtoItem {
  searchParams: WildResultSearchParams
  resData: WildResponse

  constructor () {
    this.searchParams = new WildResultSearchParams()
    this.resData = new WildResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: WildSearchParams | WildResultSearchParams
): Promise<WildResponse | void> => {
  const res = await fetchCommon('/api/wild', 'GET', {
    query: searchParams
  })
  const rd: WildResponse | null = res.data as WildResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: WildSearchParams) => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
}
