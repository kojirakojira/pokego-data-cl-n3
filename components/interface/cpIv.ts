import { VersatilityIv } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class CpIvResponse extends ResearchResponse {
  situation: string
  ivList: Array<VersatilityIv>
  cp: number
  wbFlg: boolean

  constructor () {
    super()
    this.situation = ''
    this.ivList = []
    this.cp = 0
    this.wbFlg = false
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class CpIvSearchParams extends ResearchRequest {
  name: string
  situation: string
  cp: string
  wbFlg: boolean

  constructor () {
    super()
    this.name = ''
    this.situation = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 検索画面用DTOの定義
 */
export class CpIvSearchDtoItem implements SearchDtoItem {
  searchParams: CpIvSearchParams
  resData?: CpIvResponse

  constructor () {
    this.searchParams = new CpIvSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class CpIvResultSearchParams {
  pid: string
  situation: string
  cp: string
  wbFlg: boolean

  constructor () {
    this.pid = ''
    this.situation = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 結果画面用DTOの定義
 */
export class CpIvResultDtoItem implements ResultDtoItem {
  searchParams: CpIvResultSearchParams
  resData: CpIvResponse

  constructor () {
    this.searchParams = new CpIvResultSearchParams()
    this.resData = new CpIvResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: CpIvSearchParams | CpIvResultSearchParams
): Promise<CpIvResponse | void> => {
  const res = await fetchCommon('/api/cpIv', 'GET', {
    query: searchParams
  })
  const rd: CpIvResponse | null = res.data as CpIvResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: CpIvSearchParams | CpIvResultSearchParams) => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.cp, itemName: 'CP' })
  msg += validateUtils().checkNumeric({ item: searchParams.cp, itemName: 'CP' })
  return msg
}
