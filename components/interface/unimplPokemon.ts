import { type SimpPokemon } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class UnimplPokemonResponse extends ResearchResponse {
  unimplList: Array<SimpPokemon>
  lastUpdated: string

  constructor () {
    super()
    this.unimplList = []
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
export class UnimplPokemonResultDtoItem implements ResultDtoItem {
  searchParams: Record<string, any>
  resData: UnimplPokemonResponse

  constructor () {
    this.searchParams = {}
    this.resData = new UnimplPokemonResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (): Promise<UnimplPokemonResponse> => {
  const res = await fetchCommon('/api/unimplPokemon', 'GET')
  const rd: UnimplPokemonResponse = res.data as UnimplPokemonResponse
  return rd
}
