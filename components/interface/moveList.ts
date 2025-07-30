import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort'
import type { DispFastAttack, DispChargedAttack } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class MoveListResponse extends ResearchResponse {
  faList: Array<DispFastAttack>
  caList: Array<DispChargedAttack>

  constructor () {
    super()
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
// 検索画面、結果画面の分けなし

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
  searchParams: Record<string, any>
  resData: MoveListResponse
  // tableの制御用（主に戻るボタン押下時の画面復元用）
  tableControl: TableControl

  constructor () {
    this.searchParams = {}
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

/**
 * APIアクセス用get関数
 */
export const get = async (): Promise<MoveListResponse> => {
  const res = await fetchCommon('/api/moveList', 'GET')
  const rd: MoveListResponse = res.data as MoveListResponse
  return rd
}
