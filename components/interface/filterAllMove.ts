import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort'
import type { DispFastAttack, DispChargedAttack } from './api/dto'
import { Response } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class FilterAllMoveResponse extends Response {
  // filteredItems:
  faList: Array<DispFastAttack>
  shouldDispFaList: boolean
  caList: Array<DispChargedAttack>
  shouldDispCaList: boolean

  constructor () {
    super()
    this.faList = []
    this.caList = []

    this.shouldDispFaList = false
    this.shouldDispCaList = false
  }
}

/**
 * 検索画面用クエリパラメータの定義
 */
export type MoveDispType = '' | 'all' | 'fa' | 'ca'
export class FilterAllMoveSearchParams {
  types: Array<string>
  moveDispType: MoveDispType

  constructor () {
    this.types = []
    this.moveDispType = 'all'
  }
}
/**
 * 検索画面用DTOの定義
 */
export class FilterAllMoveSearchDtoItem implements SearchDtoItem {
  searchParams: FilterAllMoveSearchParams

  constructor () {
    this.searchParams = new FilterAllMoveSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class FilterAllMoveResultSearchParams {
  types: Array<string>
  moveDispType: MoveDispType

  constructor () {
    this.types = []
    this.moveDispType = ''
  }
}

/**
 * 結果画面用DTOの定義
 */
export type RadioStatus = 'gymRaid' | 'pvp'
export interface TableControl {
   radioStatus: RadioStatus,
   faSortByArr: Array<SortItem>,
   caSortByArr: Array<SortItem>,
   faScrollTop: number,
   caScrollTop: number
  }
export class FilterAllMoveResultDtoItem implements ResultDtoItem {
  searchParams: FilterAllMoveResultSearchParams
  resData: FilterAllMoveResponse
  // tableの制御用（主に戻るボタン押下時の画面復元用）
  tableControl: TableControl

  constructor () {
    this.searchParams = new FilterAllMoveResultSearchParams()
    this.resData = new FilterAllMoveResponse()
    this.tableControl = {
      radioStatus: 'gymRaid',
      faSortByArr: [],
      caSortByArr: [],
      faScrollTop: 0,
      caScrollTop: 0
    }
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: FilterAllMoveResultSearchParams
): Promise<FilterAllMoveResponse | undefined> => {
  const res = await fetchCommon(
    '/api/filterAllMove' + searchCommon().spreadArray(searchParams),
    'GET'
  )

  const rd: FilterAllMoveResponse | null = res.data as FilterAllMoveResponse
  // 個別機能由来のメッセージ
  searchCommon().resErrHandle(rd?.message, rd?.msgLevel)
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: FilterAllMoveResultSearchParams) => {
  let msg = ''
  msg += validateUtils().checkRequiredArray({ item: searchParams.types, itemName: 'タイプ' })
  return msg
}
