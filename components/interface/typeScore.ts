import { ResearchRequest } from './api/request'
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
export class TypeScoreSearchParams extends ResearchRequest {
  type1: string
  type2: string
  name: string
  isPoke: boolean

  constructor () {
    super()
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

/**
 * APIアクセス用クエリパラメータ生成関数
 * TypeScoreはリクエストにisPokeを含まない（searchParams≠requestQuery）ため、この処理をおこなう。
 */
export const createRequestQuery = (
  searchParams: TypeScoreSearchParams | TypeScoreResultSearchParams
): TypeScoreSearchParams | TypeScoreResultSearchParams | void => {
  let requestQuery: TypeScoreSearchParams | TypeScoreResultSearchParams
  if ('name' in searchParams) {
    // 検索画面
    requestQuery = new TypeScoreSearchParams()

    // ポケモンでの検索
    if (searchParams.isPoke) { requestQuery.name = searchParams.name }
  } else if ('pid' in searchParams) {
    // 結果画面
    requestQuery = new TypeScoreResultSearchParams()

    // ポケモンでの検索
    if (searchParams.isPoke) { requestQuery.pid = searchParams.pid }
  } else {
    throw createError({ statusCode: 500, message: 'Failed to create RequestQuery', fatal: true })
  }

  if (!searchParams.isPoke) {
    // タイプでの検索
    const sp = searchParams
    if (sp.type1) { requestQuery.type1 = sp.type1 }
    if (sp.type2) { requestQuery.type2 = sp.type2 }
  }
  return requestQuery
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: TypeScoreSearchParams | TypeScoreResultSearchParams
): Promise<TypeScoreResponse | void> => {
  const res = await fetchCommon('/api/typeScore', 'GET', {
    query: searchParams
  })
  const rd: TypeScoreResponse | null = res.data as TypeScoreResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (
  searchParams: TypeScoreSearchParams | TypeScoreResultSearchParams
) => {
  let msg = ''
  if (searchParams.isPoke) {
    if ('name' in searchParams) {
      msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
    }
  } else if (!searchParams.type1 && !searchParams.type2) {
    msg += '「タイプ」は少なくともどちらか一方を入力してください。'
  }
  return msg
}
