import { type PlCp } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class PlListResponse extends ResearchResponse {
  iva: number
  ivd: number
  ivh: number
  plList: Array<PlCp>

  constructor () {
    super()
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.plList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class PlListSearchParams extends ResearchRequest {
  name: string
  iv: string

  constructor () {
    super()
    this.name = ''
    this.iv = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class PlListSearchDtoItem implements SearchDtoItem {
  searchParams: PlListSearchParams
  resData?: PlListResponse

  constructor () {
    this.searchParams = new PlListSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class PlListResultSearchParams {
  pid: string
  iv: string

  constructor () {
    this.pid = ''
    this.iv = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class PlListResultDtoItem implements ResultDtoItem {
  searchParams: PlListResultSearchParams
  resData: PlListResponse

  constructor () {
    this.searchParams = new PlListResultSearchParams()
    this.resData = new PlListResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: PlListSearchParams | PlListResultSearchParams
): Promise<PlListResponse | void> => {
  const query: Record<string, any> = {
    iva: searchParams.iv.substring(0, 2),
    ivd: searchParams.iv.substring(2, 4),
    ivh: searchParams.iv.substring(4, 6)
  }
  if ('pid' in searchParams) { query.pid = searchParams.pid }
  if ('name' in searchParams) { query.name = searchParams.name }

  const res = await fetchCommon('/api/plList', 'GET', { query })
  const rd: PlListResponse | null = res.data as PlListResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: PlListSearchParams | PlListResultSearchParams) => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.iv, itemName: '個体値' })
  msg += validateUtils().checkIv({ item: searchParams.iv, itemName: '個体値' })
  return msg
}
