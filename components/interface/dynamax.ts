import { CatchCp, GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'
import { DynamaxImplPokemonResponse } from './dynamaxImplPokemon'

/**
 * レスポンスの型（API依存の部分）
 */
export class DynamaxResponse extends ResearchResponse {
  dynamaxGp: GoPokedex
  dynamaxCatchCp: CatchCp
  gigantamaxGp: GoPokedex
  gigantamaxCatchCp: CatchCp

  constructor () {
    super()
    this.dynamaxGp = new GoPokedex()
    this.dynamaxCatchCp = new CatchCp()
    this.gigantamaxGp = new GoPokedex()
    this.gigantamaxCatchCp = new CatchCp()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class DynamaxSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class DynamaxSearchDtoItem {
  resData?: DynamaxImplPokemonResponse
  openDic: Record<string, Array<string>>

  constructor () {
    this.openDic = {}
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class DynamaxResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class DynamaxResultDtoItem implements ResultDtoItem {
  searchParams: DynamaxResultSearchParams
  resData: DynamaxResponse

  constructor () {
    this.searchParams = new DynamaxResultSearchParams()
    this.resData = new DynamaxResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: DynamaxSearchParams | DynamaxResultSearchParams
): Promise<DynamaxResponse | void> => {
  const res = await fetchCommon('/api/dynamax', 'GET', {
    query: searchParams
  })
  const rd: DynamaxResponse | null = res.data as DynamaxResponse
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
