import { type EvolutionEdge } from './api/dto'
import { Response } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class EvoCostResponse extends Response {
  costs: string
  costTypeMap: Record<string, Record<string, Array<EvolutionEdge>>>

  constructor () {
    super()
    this.costs = ''
    this.costTypeMap = {}
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class EvoCostSearchParams {
  costs: string

  constructor () {
    this.costs = 'candy'
  }
}
/**
 * 検索画面用DTOの定義
 */
export class EvoCostSearchDtoItem implements SearchDtoItem {
  searchParams: EvoCostSearchParams
  resData?: EvoCostResponse

  constructor () {
    this.searchParams = new EvoCostSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class EvoCostResultSearchParams {
  costs: string

  constructor () {
    this.costs = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class EvoCostResultDtoItem implements ResultDtoItem {
  searchParams: EvoCostResultSearchParams
  resData: EvoCostResponse
  openDic: Record<string, Array<string>>

  constructor () {
    this.searchParams = new EvoCostResultSearchParams()
    this.resData = new EvoCostResponse()
    this.openDic = {}
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: EvoCostResultSearchParams
): Promise<EvoCostResponse | void> => {
  const res = await fetchCommon('/api/evoCost', 'GET', {
    query: searchParams
  })
  const rd: EvoCostResponse | null = res.data as EvoCostResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
// 入力チェック不要
