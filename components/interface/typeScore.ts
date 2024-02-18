import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class TypeScoreResponse extends ResearchResponse {
  executedType: boolean
  type1: string
  type2: string
  attacker1Score: boolean
  attacker2Score: boolean
  defenderScore: boolean
  attackerType1Map: Record<string, Array<string>>
  attackerType2Map: Record<string, Array<string>>
  defenderTypeMap: Record<string, Array<string>>
  typeComments: Array<string>

  constructor () {
    super()
    this.executedType = false
    this.type1 = ''
    this.type2 = ''
    this.attacker1Score = false
    this.attacker2Score = false
    this.defenderScore = false
    this.attackerType1Map = {}
    this.attackerType2Map = {}
    this.defenderTypeMap = {}
    this.typeComments = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class TypeScoreSearchParams {
  type1: string
  type2: string
  name: string
  isPoke: boolean

  constructor () {
    this.type1 = ''
    this.type2 = ''
    this.name = ''
    this.isPoke = false
  }
}
/**
 * 検索画面用DTOの定義
 */
export class TypeScoreSearchDtoItem implements SearchDtoItem {
  searchParams: TypeScoreSearchParams
  resData?: TypeScoreResponse

  constructor () {
    this.searchParams = new TypeScoreSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class TypeScoreResultSearchParams {
  type1: string
  type2: string
  pid: string
  isPoke: boolean

  constructor () {
    this.type1 = ''
    this.type2 = ''
    this.pid = ''
    this.isPoke = false
  }
}
/**
 * 結果画面用DTOの定義
 */
export class TypeScoreResultDtoItem implements ResultDtoItem {
  searchParams: TypeScoreResultSearchParams
  resData: TypeScoreResponse

  constructor () {
    this.searchParams = new TypeScoreResultSearchParams()
    this.resData = new TypeScoreResponse()
  }
}
