import { Race, PokemonStatisticsInfo, type DispFilterParam } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class RaceResponse extends ResearchResponse {
  race: Race
  statistics: PokemonStatisticsInfo
  tooStrong: boolean
  filteredItems: Array<DispFilterParam>
  included: boolean

  constructor () {
    super()
    this.race = new Race()
    this.statistics = new PokemonStatisticsInfo()
    this.tooStrong = false
    this.filteredItems = []
    this.included = true
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class RaceSearchParams extends ResearchRequest {
  name: string

  constructor () {
    super()
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class RaceSearchDtoItem implements SearchDtoItem {
  searchParams: RaceSearchParams
  resData?: RaceResponse

  constructor () {
    this.searchParams = new RaceSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class RaceResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class RaceResultDtoItem implements ResultDtoItem {
  searchParams: RaceResultSearchParams
  resData: RaceResponse

  constructor () {
    this.searchParams = new RaceResultSearchParams()
    this.resData = new RaceResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: RaceSearchParams | RaceResultSearchParams
): Promise<RaceResponse | void> => {
  const res = await fetchCommon('/api/race', 'GET', {
    query: searchParams
  })
  const rd: RaceResponse | null = res.data as RaceResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: RaceSearchParams) => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
}
