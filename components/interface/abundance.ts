import { CatchCp, Color, GoPokedex } from './api/dto'
import { ResearchResponse } from './api/response'
import { EvolutionResponse } from './evolution'
import { RaceResponse } from './race'
import { TypeScoreResponse } from './typeScore'

/**
 * レスポンスの型（API依存の部分）
 */
export class AbundanceResponse extends ResearchResponse {
  goPokedex: GoPokedex
  cp40: number
  cp50: number
  maxCp: number
  raid: CatchCp
  rocket: CatchCp
  frTask: CatchCp
  egg: CatchCp
  tooStrong: boolean
  type1Color: Color
  type2Color: Color
  mega: boolean

  constructor () {
    super()
    this.goPokedex = new GoPokedex()
    this.cp40 = 0
    this.cp50 = 0
    this.maxCp = 0
    this.raid = new CatchCp()
    this.rocket = new CatchCp()
    this.frTask = new CatchCp()
    this.egg = new CatchCp()
    this.tooStrong = false
    this.type1Color = new Color()
    this.type2Color = new Color()
    this.mega = false
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
  evoResData: EvolutionResponse
  typeScoreResData: TypeScoreResponse

  constructor () {
    this.searchParams = new AbundanceResultSearchParams()
    this.resData = new AbundanceResponse()
    this.raceResData = new RaceResponse()
    this.evoResData = new EvolutionResponse()
    this.typeScoreResData = new TypeScoreResponse()
  }
}

export type AbundanceResData = 'resData' | 'raceResData' | 'evoResData' | 'typeScoreResData'
/**
 * APIアクセス用get関数
 */
export const get = async (
  endpoint: string,
  dtoItem: AbundanceResultDtoItem,
  reqParam: Record<string, any>,
  resDataNm: AbundanceResData): Promise<void> => {
  const res = await fetchCommon(endpoint, 'GET', {
    query: reqParam
  })
  const rd: ResearchResponse | null = res.data as ResearchResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  // AbundanceResultDtoItemにセットする。
  dtoItem[resDataNm] = rd as any
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
// 入力チェックなし
