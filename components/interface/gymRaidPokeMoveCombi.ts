import { GoPokedex, PokemonSearchResult, type MoveCombination } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class GymRaidPokeMoveCombiResponse extends ResearchResponse {
  goPokedex: GoPokedex
  preMegaGp: GoPokedex
  moveCombiList: Array<MoveCombination>

  constructor () {
    super()
    this.goPokedex = new GoPokedex()
    this.preMegaGp = new GoPokedex()
    this.moveCombiList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class GymRaidPokeMoveCombiSearchParams extends ResearchRequest {
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
export class GymRaidPokeMoveCombiSearchDtoItem implements SearchDtoItem {
  searchParams: GymRaidPokeMoveCombiSearchParams
  pokemonSearchResult?: PokemonSearchResult

  constructor () {
    this.searchParams = new GymRaidPokeMoveCombiSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class GymRaidPokeMoveCombiResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class GymRaidPokeMoveCombiResultDtoItem implements ResultDtoItem {
  searchParams: GymRaidPokeMoveCombiResultSearchParams
  resData: GymRaidPokeMoveCombiResponse

  constructor () {
    this.searchParams = new GymRaidPokeMoveCombiResultSearchParams()
    this.resData = new GymRaidPokeMoveCombiResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: GymRaidPokeMoveCombiSearchParams | GymRaidPokeMoveCombiResultSearchParams
): Promise<GymRaidPokeMoveCombiResponse | void> => {
  const res = await fetchCommon('/api/gymRaidPokeMoveCombi', 'GET', {
    query: searchParams
  })
  const rd: GymRaidPokeMoveCombiResponse | null = res.data as GymRaidPokeMoveCombiResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: GymRaidPokeMoveCombiSearchParams) => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
}
