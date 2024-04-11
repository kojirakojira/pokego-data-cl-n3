import { CatchCp, GoPokedex } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class RaidResponse extends ResearchResponse {
  mega: boolean
  befMegaGp: GoPokedex

  catchCp: CatchCp

  constructor () {
    super()
    this.mega = false
    this.befMegaGp = new GoPokedex()
    this.catchCp = new CatchCp()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class RaidSearchParams extends ResearchRequest {
  name: string

  constructor () {
    super()
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class RaidSearchDtoItem implements SearchDtoItem {
  searchParams: RaidSearchParams
  resData?: RaidResponse

  constructor () {
    this.searchParams = new RaidSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class RaidResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class RaidResultDtoItem implements ResultDtoItem {
  searchParams: RaidResultSearchParams
  resData: RaidResponse

  constructor () {
    this.searchParams = new RaidResultSearchParams()
    this.resData = new RaidResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: RaidSearchParams | RaidResultSearchParams
): Promise<RaidResponse | void> => {
  const res = await fetchCommon('/api/raid', 'GET', {
    query: searchParams
  })
  const rd: RaidResponse | null = res.data as RaidResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: RaidSearchParams): string => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
}
