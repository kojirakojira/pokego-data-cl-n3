import { CatchCp, Color, GoPokedex, GoPokedexAndCpPl } from './api/dto'
import { ResearchResponse } from './api/response'
import { EvolutionResponse } from './evolution'
import { RaceResponse } from './race'
import { ScpRankMaxMinResponse } from './scpRankMaxMin'
import { TypeScoreResponse } from './typeScore'

/**
 * レスポンスの型（API依存の部分）
 */
export class AbundanceResponse extends ResearchResponse {
  goPokedex: GoPokedex
  cp40: number
  cp50: number
  maxCp: number
  wild: CatchCp
  raid: CatchCp
  rocket: CatchCp
  frTask: CatchCp
  egg: CatchCp
  dynamax?: CatchCp
  dynamaxMsg: string
  gigantamax?: CatchCp
  gigantamaxMsg: string
  eggGp?: GoPokedex
  tooStrong: boolean
  type1Color: Color
  type2Color: Color
  finEvo: boolean
  mega: boolean
  canMega: boolean
  megaMsg: string
  superLeagueSafeCpList: Array<GoPokedexAndCpPl>
  hyperLeagueSafeCpList: Array<GoPokedexAndCpPl>

  constructor () {
    super()
    this.goPokedex = new GoPokedex()
    this.cp40 = 0
    this.cp50 = 0
    this.maxCp = 0
    this.wild = new CatchCp()
    this.raid = new CatchCp()
    this.rocket = new CatchCp()
    this.frTask = new CatchCp()
    this.egg = new CatchCp()
    this.dynamaxMsg = ''
    this.gigantamaxMsg = ''
    this.tooStrong = false
    this.type1Color = new Color()
    this.type2Color = new Color()
    this.finEvo = false
    this.mega = false
    this.canMega = false
    this.megaMsg = ''
    this.superLeagueSafeCpList = []
    this.hyperLeagueSafeCpList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
// 検索画面は存在しない。

/**
 * 検索画面用DTOの定義
 */
// 検索画面は存在しない。

/**
 * 結果画面用クエリパラメータの定義
 */
export class AbundanceResultSearchParams {
  pid: string

  constructor () {
    this.pid = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class AbundanceResultDtoItem implements ResultDtoItem {
  searchParams: AbundanceResultSearchParams
  resData: AbundanceResponse
  raceResData: RaceResponse
  scpRankMaxMinResData: ScpRankMaxMinResponse
  evoResData: EvolutionResponse
  typeScoreResData: TypeScoreResponse

  constructor () {
    this.searchParams = new AbundanceResultSearchParams()
    this.resData = new AbundanceResponse()
    this.raceResData = new RaceResponse()
    this.scpRankMaxMinResData = new ScpRankMaxMinResponse()
    this.evoResData = new EvolutionResponse()
    this.typeScoreResData = new TypeScoreResponse()
  }
}

export type AbundanceResData = 'resData' | 'raceResData' | 'scpRankMaxMinResData' | 'evoResData' | 'typeScoreResData'
/**
 * APIアクセス用get関数
 */
export const get = async (
  endpoint: string,
  dtoItem: AbundanceResultDtoItem,
  reqParam: Record<string, any>,
  resDataNm: AbundanceResData): Promise<ResearchResponse | null | undefined> => {
  const res = await fetchCommon(endpoint, 'GET', {
    query: reqParam
  })
  const rd: ResearchResponse | null = res.data as ResearchResponse
  if (searchCommon().handleApiMessage(rd)) {
    // success
    // AbundanceResultDtoItemにセットする。
    dtoItem[resDataNm] = rd as any
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
// 入力チェックなし
