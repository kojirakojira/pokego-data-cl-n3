import { PokemonFilterResult } from './api/dto'
import { ResearchRequest } from './api/request'
import { Response } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class FilterAllResponse extends Response {
  pfr: PokemonFilterResult

  constructor () {
    super()
    this.pfr = new PokemonFilterResult()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class FilterAllSearchParams extends ResearchRequest {
  // ResearchRequestと同一
}
/**
 * 検索画面用DTOの定義
 */
export class FilterAllSearchDtoItem implements SearchDtoItem {
  searchParams: FilterAllSearchParams
  resData?: FilterAllResponse

  constructor () {
    this.searchParams = new FilterAllSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class FilterAllResultSearchParams extends FilterAllSearchParams {
  // ResearchRequest, FilterAllSearchParamsと同一。形式上定義している。
}

/**
 * 結果画面用DTOの定義
 */
type SortItem = { key: string, order?: boolean | 'asc' | 'desc' }
export interface TableControl {
  chkboxSelected: Array<string>, // 列を非表示にするチェックボックス
  sortByArr: Array<SortItem>, // v-data-tableのソート中のItem
  itemsPerPage: number, // 現在の1ページ当たり表示件数
  currentPage: number // 現在のページ
}
export class FilterAllResultDtoItem implements ResultDtoItem {
  searchParams: FilterAllResultSearchParams
  resData: FilterAllResponse
  // tableの制御用（主に戻るボタン押下時の画面復元用）
  tableControl: TableControl

  constructor () {
    this.searchParams = new FilterAllResultSearchParams()
    this.resData = new FilterAllResponse()
    this.tableControl = {
      chkboxSelected: [],
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
  searchParams: FilterAllSearchParams | FilterAllResultSearchParams
): Promise<FilterAllResponse | void> => {
  const res = await fetchCommon(
    '/api/filterAll' + searchCommon().spreadArray(searchParams),
    'GET'
  )
  const rd: FilterAllResponse | null = res.data as FilterAllResponse
  // 個別機能由来のメッセージ
  if (!searchCommon().resErrHandle(rd.message, rd.msgLevel)) {
    return
  }
  // 検索機能由来のメッセージ
  if (!searchCommon().resErrHandle(rd.pfr.message, rd.pfr.msgLevel)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
// 入力チェック不要
