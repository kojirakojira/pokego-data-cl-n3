import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort'
import { PokemonSearchResult, type PokemonAttackCombination } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class GymRaidPinnacleRankResponse extends ResearchResponse {
  combiList: Array<PokemonAttackCombination>
  typeComments: Array<string>
  wbTypeList: Array<string>

  constructor () {
    super()
    this.combiList = []
    this.typeComments = []
    this.wbTypeList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export type SelectPattern = 'include' | 'except' | 'only'
export const selectPatternDic: Record<SelectPattern, string> = {
  include: '含む',
  except: '除く',
  only: 'だけにする'
}
export type Order = 'desc' | 'asc'
export const orderDic: Record<Order, string> = {
  desc: '最強',
  asc: '最弱'
}
// export class GymRaidPinnacleRankSearchParams extends ResearchRequest {
export class GymRaidPinnacleRankSearchParams {
  defenderType1: string
  defenderType2: string
  weather: string
  megaSelected: SelectPattern
  shadowSelected: SelectPattern
  order: Order
  unique: boolean
  // override pid: string
  // override name: string
  // iv: string
  // pl: string

  constructor () {
    // super()
    this.defenderType1 = ''
    this.defenderType2 = ''
    this.weather = ''
    this.megaSelected = 'include'
    this.shadowSelected = 'include'
    this.order = 'desc'
    this.unique = false
    // this.pid = ''
    // this.name = ''
    // this.iv = ''
    // this.pl = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class GymRaidPinnacleRankSearchDtoItem implements SearchDtoItem {
  searchParams: GymRaidPinnacleRankSearchParams
  pokemonSearchResult?: PokemonSearchResult

  constructor () {
    this.searchParams = new GymRaidPinnacleRankSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class GymRaidPinnacleRankResultSearchParams {
  defenderType1: string
  defenderType2: string
  weather: string
  megaSelected: SelectPattern
  shadowSelected: SelectPattern
  order: Order
  unique: boolean

  constructor () {
    this.defenderType1 = ''
    this.defenderType2 = ''
    this.weather = ''
    this.megaSelected = 'include'
    this.shadowSelected = 'include'
    this.order = 'desc'
    this.unique = false
  }
}
/**
 * 結果画面用DTOの定義
 */
export interface TableControl {
  sortByArr: Array<SortItem>, // v-data-tableのソート中のItem
  itemsPerPage: number, // 現在の1ページ当たり表示件数
  currentPage: number // 現在のページ
}
export class GymRaidPinnacleRankResultDtoItem implements ResultDtoItem {
  searchParams: GymRaidPinnacleRankResultSearchParams
  resData: GymRaidPinnacleRankResponse
  tableControl: TableControl

  constructor () {
    this.searchParams = new GymRaidPinnacleRankResultSearchParams()
    this.resData = new GymRaidPinnacleRankResponse()
    this.tableControl = {
      sortByArr: [],
      itemsPerPage: -1,
      currentPage: 1
    }
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: GymRaidPinnacleRankSearchParams | GymRaidPinnacleRankResultSearchParams
): Promise<GymRaidPinnacleRankResponse | void> => {
  const query: Record<string, any> = { ...searchParams }
  // タイプ2が設定されていない場合はnullに置き換える
  query.defenderType2 = searchParams.defenderType2 || null
  const res = await fetchCommon('/api/gymRaidPinnacleRank', 'GET', { query })

  const rd: GymRaidPinnacleRankResponse | null = res.data as GymRaidPinnacleRankResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: GymRaidPinnacleRankSearchParams | GymRaidPinnacleRankResultSearchParams) => {
  let msg = ''
  // if ('name' in searchParams) {
  //   msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  // }
  msg += validateUtils().checkRequired({ item: searchParams.defenderType1, itemName: 'タイプ1' })
  return msg
}
