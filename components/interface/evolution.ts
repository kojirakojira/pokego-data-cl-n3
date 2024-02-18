import { type Hierarchy, type Race } from './api/dto'
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
export class EvolutionSearchParams {
  name: string

  constructor () {
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
