import { CatchCp, GoPokedex } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class FrTaskResponse extends ResearchResponse {
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
export class FrTaskSearchParams extends ResearchRequest {
  name: string

  constructor () {
    super()
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class FrTaskSearchDtoItem implements SearchDtoItem {
  searchParams: FrTaskSearchParams
  resData?: FrTaskResponse

  constructor () {
    this.searchParams = new FrTaskSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class FrTaskResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class FrTaskResultDtoItem implements ResultDtoItem {
  searchParams: FrTaskResultSearchParams
  resData: FrTaskResponse

  constructor () {
    this.searchParams = new FrTaskResultSearchParams()
    this.resData = new FrTaskResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: FrTaskSearchParams | FrTaskResultSearchParams
): Promise<FrTaskResponse | void> => {
  const res = await fetchCommon('/api/frTask', 'GET', {
    query: searchParams
  })
  const rd: FrTaskResponse | null = res.data as FrTaskResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: FrTaskSearchParams) => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
}
