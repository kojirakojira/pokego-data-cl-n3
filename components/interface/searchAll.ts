import { PokemonSearchResult } from './api/dto'
import { ResearchRequest } from './api/request'
import { Response } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class SearchAllResponse extends Response {
  pokemonSearchResult: PokemonSearchResult

  constructor () {
    super()
    this.pokemonSearchResult = new PokemonSearchResult()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class SearchAllSearchParams extends ResearchRequest {
  name: string

  constructor () {
    super()
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class SearchAllSearchDtoItem implements SearchDtoItem {
  searchParams: SearchAllSearchParams
  resData?: SearchAllResponse

  constructor () {
    this.searchParams = new SearchAllSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
// 検索結果はabundance機能で定義する。

/**
 * 結果画面用DTOの定義
 */
// 検索結果はabundance機能で定義する。

/**
 * APIアクセス用get関数
 */
export const get = async (searchParams: SearchAllSearchParams): Promise<SearchAllResponse | void> => {
  const res = await fetchCommon('/api/searchAll', 'GET', {
    query: searchParams
  })
  const rd: SearchAllResponse | null = res.data as SearchAllResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
// 入力チェックなし
