import { GoPokedex } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class CpResponse extends ResearchResponse {
  goPokedex: GoPokedex
  iva: number
  ivd: number
  ivh: number
  pl: string
  cp: number

  constructor () {
    super()
    this.goPokedex = new GoPokedex()
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.pl = ''
    this.cp = 0
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class CpSearchParams extends ResearchRequest {
  name: string
  iv: string
  pl: string

  constructor () {
    super()
    this.name = ''
    this.iv = ''
    this.pl = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class CpSearchDtoItem implements SearchDtoItem {
  searchParams: CpSearchParams
  resData?: CpResponse

  constructor () {
    this.searchParams = new CpSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class CpResultSearchParams {
  pid: string
  iv: string
  pl: string

  constructor () {
    this.pid = ''
    this.iv = ''
    this.pl = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class CpResultDtoItem implements ResultDtoItem {
  searchParams: CpResultSearchParams
  resData: CpResponse

  constructor () {
    this.searchParams = new CpResultSearchParams()
    this.resData = new CpResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: CpSearchParams | CpResultSearchParams
): Promise<CpResponse | void> => {
  const query: Record<string, any> = {
    iva: searchParams.iv.substring(0, 2),
    ivd: searchParams.iv.substring(2, 4),
    ivh: searchParams.iv.substring(4, 6),
    pl: searchParams.pl
  }
  if ('pid' in searchParams) { query.pid = searchParams.pid }
  if ('name' in searchParams) { query.name = searchParams.name }
  const res = await fetchCommon('/api/cp', 'GET', { query })

  const rd: CpResponse | null = res.data as CpResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: CpSearchParams | CpResultSearchParams) => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.iv, itemName: '個体値' })
  msg += validateUtils().checkRequired({ item: searchParams.pl, itemName: 'PL' })
  msg += validateUtils().checkIv({ item: searchParams.iv, itemName: '個体値' })
  return msg
}
