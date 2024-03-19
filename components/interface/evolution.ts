import { type Hierarchy, type Race } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class EvolutionResponse extends ResearchResponse {
  pid: string
  evoTreeInfo: Array<Array<Array<Hierarchy>>>
  anotherForms: Array<string>
  bfAfAotForms: Array<string>
  raceMap: Record<string, Race>
  evoTreeAnnotations: Array<string>

  constructor () {
    super()
    this.pid = ''
    this.evoTreeInfo = []
    this.anotherForms = []
    this.bfAfAotForms = []
    this.raceMap = {}
    this.evoTreeAnnotations = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class EvolutionSearchParams extends ResearchRequest {
  name: string

  constructor () {
    super()
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class EvolutionSearchDtoItem implements SearchDtoItem {
  searchParams: EvolutionSearchParams
  resData?: EvolutionResponse

  constructor () {
    this.searchParams = new EvolutionSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class EvolutionResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class EvolutionResultDtoItem implements ResultDtoItem {
  searchParams: EvolutionResultSearchParams
  resData: EvolutionResponse

  constructor () {
    this.searchParams = new EvolutionResultSearchParams()
    this.resData = new EvolutionResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: EvolutionSearchParams | EvolutionResultSearchParams
): Promise<EvolutionResponse | void> => {
  const res = await fetchCommon('/api/evolution', 'GET', {
    query: searchParams
  })
  const rd: EvolutionResponse | null = res.data as EvolutionResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: EvolutionSearchParams) => {
  let msg = ''
  msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  return msg
}
