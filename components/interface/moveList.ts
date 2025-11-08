import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort'
import type { DispFastAttack, DispChargedAttack, DispFilterParam } from './api/dto'
import { Response } from './api/response'
import { FilterAllMoveSearchParams } from './filterAllMove'

/**
 * レスポンスの型（API依存の部分）
 */
export class MoveListResponse extends Response {
  filteredItems: Array<DispFilterParam>
  faList: Array<DispFastAttack>
  caList: Array<DispChargedAttack>

  constructor () {
    super()
    this.filteredItems = []
    this.faList = []
    this.caList = []
  }
}

/**
 * 検索画面用クエリパラメータの定義
 */
// 検索画面、結果画面の分けなし

/**
 * 検索画面用DTOの定義
 */
// 検索画面、結果画面の分けなし

/**
 * 結果画面用クエリパラメータの定義
 */
export class MoveListResultSearchParams extends FilterAllMoveSearchParams {
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
export class MoveListResultDtoItem implements ResultDtoItem {
  searchParams: MoveListResultSearchParams
  resData: MoveListResponse
  // tableの制御用（主に戻るボタン押下時の画面復元用）
  tableControl: TableControl

  constructor () {
    this.searchParams = new MoveListResultSearchParams()
    this.resData = new MoveListResponse()
    this.tableControl = {
      radioStatus: 'gymRaid',
      faSortByArr: [],
      caSortByArr: [],
      faScrollTop: 0,
      caScrollTop: 0
    }
  }
}
