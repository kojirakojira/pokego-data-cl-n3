import { GoPokedex, PokemonSearchResult, type DispPokemonChargedAttack, type DispPokemonFastAttack } from './api/dto'
import { ResearchRequest } from './api/request'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class PokemonAttackResponse extends ResearchResponse {
  fastAttackList: Array<DispPokemonFastAttack>
  chargedAttackList: Array<DispPokemonChargedAttack>
  goPokedex: GoPokedex
  preMegaGp?: GoPokedex

  constructor () {
    super()
    this.fastAttackList = []
    this.chargedAttackList = []
    this.goPokedex = new GoPokedex()
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class PokemonAttackSearchParams extends ResearchRequest {
  override pid: string
  override name: string

  constructor () {
    super()
    this.pid = ''
    this.name = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class PokemonAttackSearchDtoItem implements SearchDtoItem {
  searchParams: PokemonAttackSearchParams
  pokemonSearchResult?: PokemonSearchResult

  constructor () {
    this.searchParams = new PokemonAttackSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class PokemonAttackResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export type RadioStatus = 'gymRaid' | 'pvp'
export interface TableControl {
   radioStatus: RadioStatus
  }
export class PokemonAttackResultDtoItem implements ResultDtoItem {
  searchParams: PokemonAttackResultSearchParams
  resData: PokemonAttackResponse
  tableControl: TableControl

  constructor () {
    this.searchParams = new PokemonAttackResultSearchParams()
    this.resData = new PokemonAttackResponse()
    this.tableControl = {
      radioStatus: 'gymRaid'
    }
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: PokemonAttackSearchParams | PokemonAttackResultSearchParams
): Promise<PokemonAttackResponse | void> => {
  const res = await fetchCommon('/api/pokemonAttack', 'GET', {
    query: searchParams
  })
  const rd: PokemonAttackResponse | null = res.data as PokemonAttackResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: PokemonAttackSearchParams) => {
  return validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
}
