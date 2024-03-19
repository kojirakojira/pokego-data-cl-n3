import { VersatilityIv } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class ThreeGalarBirdsResponse extends ResearchResponse {
  ivList: Array<VersatilityIv>
  cp: number
  wbFlg: boolean

  constructor () {
    super()
    this.ivList = []
    this.cp = 0
    this.wbFlg = false
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class ThreeGalarBirdsSearchParams extends ResearchRequest {
  name: string
  cp: string
  wbFlg: boolean

  constructor () {
    super()
    this.name = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 検索画面用DTOの定義
 */
export class ThreeGalarBirdsSearchDtoItem implements SearchDtoItem {
  searchParams: ThreeGalarBirdsSearchParams
  resData?: ThreeGalarBirdsResponse

  constructor () {
    this.searchParams = new ThreeGalarBirdsSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class ThreeGalarBirdsResultSearchParams {
  pid: string
  cp: string
  wbFlg: boolean

  constructor () {
    this.pid = ''
    this.cp = ''
    this.wbFlg = false
  }
}
/**
 * 結果画面用DTOの定義
 */
export class ThreeGalarBirdsResultDtoItem implements ResultDtoItem {
  searchParams: ThreeGalarBirdsResultSearchParams
  resData: ThreeGalarBirdsResponse

  constructor () {
    this.searchParams = new ThreeGalarBirdsResultSearchParams()
    this.resData = new ThreeGalarBirdsResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: ThreeGalarBirdsSearchParams | ThreeGalarBirdsResultSearchParams
): Promise<ThreeGalarBirdsResponse | void> => {
  const res = await fetchCommon('/api/threeGalarBirds', 'GET', {
    query: searchParams
  })
  const rd: ThreeGalarBirdsResponse | null = res.data as ThreeGalarBirdsResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: ThreeGalarBirdsSearchParams | ThreeGalarBirdsResultSearchParams) => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.cp, itemName: 'CP' })
  msg += validateUtils().checkNumeric({ item: searchParams.cp, itemName: 'CP' })
  return msg
}
