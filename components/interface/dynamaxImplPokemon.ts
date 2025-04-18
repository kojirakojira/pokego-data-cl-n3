import { type GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class DynamaxImplPokemonResponse extends ResearchResponse {
  dynamaxList: Array<GoPokedex>
  lastUpdated: string

  constructor () {
    super()
    this.dynamaxList = []
    this.lastUpdated = ''
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
// 検索画面、結果画面の分けなし

/**
 * 検索画面用DTOの定義
 */
// 検索画面、結果画面の分けなし

/**
 * 結果画面用クエリパラメータの定義
 */
// 検索画面、結果画面の分けなし

/**
 * 結果画面用DTOの定義
 */
export class DynamaxImplPokemonResultDtoItem implements ResultDtoItem {
  searchParams: Record<string, any>
  resData: DynamaxImplPokemonResponse

  constructor () {
    this.searchParams = {}
    this.resData = new DynamaxImplPokemonResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (): Promise<DynamaxImplPokemonResponse> => {
  const res = await fetchCommon('/api/dynamaxImplPokemon', 'GET')
  const rd: DynamaxImplPokemonResponse = res.data as DynamaxImplPokemonResponse
  return rd
}
