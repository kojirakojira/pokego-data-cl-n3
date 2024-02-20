import { type XTypeElement } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class XTypeResponse extends ResearchResponse {
  own1: string
  own2: string
  opp1: string
  opp2: string
  emphasis: string
  typeRankList: Array<XTypeElement>
  typeComments: Array<string>

  constructor () {
    super()
    this.own1 = ''
    this.own2 = ''
    this.opp1 = ''
    this.opp2 = ''
    this.emphasis = ''
    this.typeRankList = []
    this.typeComments = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class XTypeSearchParams {
  own1: string
  own2: string
  opp1: string
  opp2: string
  emphasis: string

  constructor () {
    this.own1 = ''
    this.own2 = ''
    this.opp1 = ''
    this.opp2 = ''
    this.emphasis = 'none'
  }
}
/**
 * 検索画面用DTOの定義
 */
export class XTypeSearchDtoItem implements SearchDtoItem {
  searchParams: XTypeSearchParams
  resData?: XTypeResponse

  constructor () {
    this.searchParams = new XTypeSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class XTypeResultSearchParams {
  own1: string
  own2: string
  opp1: string
  opp2: string
  emphasis: string

  constructor () {
    this.own1 = ''
    this.own2 = ''
    this.opp1 = ''
    this.opp2 = ''
    this.emphasis = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class XTypeResultDtoItem implements ResultDtoItem {
  searchParams: XTypeResultSearchParams
  resData: XTypeResponse

  constructor () {
    this.searchParams = new XTypeResultSearchParams()
    this.resData = new XTypeResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: XTypeSearchParams | XTypeResultSearchParams
): Promise<XTypeResponse | void> => {
  const res = await fetchCommon('/api/xType', 'GET', {
    query: searchParams
  })
  const rd: XTypeResponse | null = res.data as XTypeResponse
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
  searchParams: XTypeResultSearchParams | XTypeResultSearchParams
) => {
  let msg = ''
  const sp = searchParams
  if (!sp.own1 && !sp.own2) {
    msg += '「じぶんのポケモン」は少なくともどちらか一方を入力してください。\n'
  }
  if (!sp.opp1 && !sp.opp2) {
    msg += '「あいてのポケモン」は少なくともどちらか一方を入力してください。\n'
  }
  // Xは1個だけしか置けない。NOT(at1 XOR at2 XOR df1 XOR df2)
  const isX = (t: string | null | undefined): boolean => t === 'x'
  if (!(isX(sp.own1) !== isX(sp.own2) !== isX(sp.opp1) !== isX(sp.opp2))) {
    msg += '「じぶんのポケモン」「あいてのポケモン」どちから一方に1つだけXを置いてください。\n'
  }

  return msg
}
