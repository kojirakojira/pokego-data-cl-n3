import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort'
import { MoveSearchResult, FastAttackDetails, ChargedAttackDetails } from './api/dto'
import { Response } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class MoveLookupResponse extends Response {
  moveSearchResult: MoveSearchResult
  moveId: string
  name: string
  fastAttackDetails: FastAttackDetails
  chargedAttackDetails: ChargedAttackDetails

  constructor () {
    super()
    this.moveSearchResult = new MoveSearchResult()
    this.moveId = ''
    this.name = ''
    this.fastAttackDetails = new FastAttackDetails()
    this.chargedAttackDetails = new ChargedAttackDetails()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class MoveLookupSearchParams {
  mid: string
  name: string

  constructor () {
    this.mid = ''
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class MoveLookupSearchDtoItem implements SearchDtoItem {
  searchParams: MoveLookupSearchParams
  moveSearchResult?: MoveSearchResult

  constructor () {
    this.searchParams = new MoveLookupSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class MoveLookupResultSearchParams {
  mid: string

  constructor () {
    this.mid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export type RadioStatus = 'gymRaid' | 'pvp'
export interface TableControl {
  faLearnPokemonSortByArr: Array<SortItem>,
  caLearnPokemonSortByArr: Array<SortItem>,
  faLearnPokemonScrollTop: number,
  caLearnPokemonScrollTop: number,
  radioStatus: RadioStatus,
  faSameTypeSortByArr: Array<SortItem>,
  caSameTypeSortByArr: Array<SortItem>,
  faSameTypeScrollTop: number,
  caSameTypeScrollTop: number
}
export class MoveLookupResultDtoItem implements ResultDtoItem {
  searchParams: MoveLookupResultSearchParams
  resData: MoveLookupResponse
  // tableの制御用（主に戻るボタン押下時の画面復元用）
  tableControl: TableControl

  constructor () {
    this.searchParams = new MoveLookupResultSearchParams()
    this.resData = new MoveLookupResponse()
    this.tableControl = {
      faLearnPokemonSortByArr: [],
      caLearnPokemonSortByArr: [],
      faLearnPokemonScrollTop: 0,
      caLearnPokemonScrollTop: 0,
      radioStatus: 'gymRaid',
      faSameTypeSortByArr: [],
      caSameTypeSortByArr: [],
      faSameTypeScrollTop: 0,
      caSameTypeScrollTop: 0
    }
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: MoveLookupSearchParams | MoveLookupResultSearchParams
): Promise<MoveLookupResponse | void> => {
  const res = await fetchCommon('/api/moveLookup', 'GET', {
    query: searchParams
  })
  const rd: MoveLookupResponse | null = res.data as MoveLookupResponse
  if (!rd) {
    throw createError({ statusCode: 500, message: 'An error occurred.', fatal: true })
  }
  // 個別機能由来のメッセージ
  let success = searchCommon().resErrHandle(
    rd.message,
    rd.msgLevel)
  if (!success) {
    success = false
    return
  }

  // 検索機能由来のメッセージ
  if ('moveSearchResult' in rd && rd.moveSearchResult) {
    const searchSuccess = searchCommon().resErrHandle(
      rd.moveSearchResult.message,
      rd.moveSearchResult.msgLevel)
    if (!searchSuccess) {
      success = false
    }
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: MoveLookupSearchParams) => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: '技名' })
}
