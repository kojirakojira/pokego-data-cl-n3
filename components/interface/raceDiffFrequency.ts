import { PokemonSearchResult, RaceDiffElem } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class RaceDiffFrequencyResponse extends ResearchResponse {
  raceDiffElemArr: Array<RaceDiffElem>
  goTotalCount: number

  constructor () {
    super()
    this.raceDiffElemArr = []
    this.goTotalCount = 1
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class RaceDiffFrequencySearchParams extends ResearchRequest {
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
export class RaceDiffFrequencySearchDtoItem implements SearchDtoItem {
  searchParams: RaceDiffFrequencySearchParams
  pokemonSearchResult?: PokemonSearchResult

  constructor () {
    this.searchParams = new RaceDiffFrequencySearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class RaceDiffFrequencyResultSearchParams extends ResearchRequest {
  override pid: string

  constructor () {
    super()
    this.pid = ''
  }
}

/**
 * 結果画面用DTOの定義
 */
export class RaceDiffFrequencyResultDtoItem implements ResultDtoItem {
  searchParams: RaceDiffFrequencyResultSearchParams
  resData: RaceDiffFrequencyResponse

  constructor () {
    this.searchParams = new RaceDiffFrequencyResultSearchParams()
    this.resData = new RaceDiffFrequencyResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: RaceDiffFrequencySearchParams | RaceDiffFrequencyResultSearchParams
): Promise<RaceDiffFrequencyResponse | void> => {
  const query: RaceDiffFrequencySearchParams = { ...searchParams } as RaceDiffFrequencySearchParams
  const res = await fetchCommon('/api/raceDiffFrequency', 'GET', {
    query
  })
  const rd: RaceDiffFrequencyResponse | null = res.data as RaceDiffFrequencyResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: RaceDiffFrequencySearchParams) => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
}
