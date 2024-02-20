import { ScpRank } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class ScpRankListResponse extends ResearchResponse {
  scpRankList: Array<ScpRank>
  league: string

  constructor () {
    super()
    this.scpRankList = []
    this.league = ''
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class ScpRankListSearchParams {
  name: string
  league: string

  constructor () {
    this.name = ''
    this.league = ''
  }
}
/**
 * 検索画面用DTOの定義
 */
export class ScpRankListSearchDtoItem implements SearchDtoItem {
  searchParams: ScpRankListSearchParams
  resData?: ScpRankListResponse

  constructor () {
    this.searchParams = new ScpRankListSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class ScpRankListResultSearchParams {
  pid: string
  league: string

  constructor () {
    this.pid = ''
    this.league = ''
  }
}
/**
 * 結果画面用DTOの定義
 */
export class ScpRankListResultDtoItem implements ResultDtoItem {
  searchParams: ScpRankListResultSearchParams
  resData: ScpRankListResponse

  constructor () {
    this.searchParams = new ScpRankListResultSearchParams()
    this.resData = new ScpRankListResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: ScpRankListSearchParams | ScpRankListResultSearchParams
): Promise<ScpRankListResponse | void> => {
  const res = await fetchCommon('/api/scpRankList', 'GET', {
    query: searchParams
  })
  const rd: ScpRankListResponse | null = res.data as ScpRankListResponse
  if (!searchCommon().handleApiMessage(rd)) {
    return
  }
  return rd
}

/**
 * 入力チェック関数
 * @returns エラーメッセージ
 */
export const check = (searchParams: ScpRankListSearchParams | ScpRankListResultSearchParams) => {
  let msg = ''
  if ('name' in searchParams) {
    msg += validateUtils().checkRequired({ item: searchParams.name, itemName: 'ポケモン' })
  }
  msg += validateUtils().checkRequired({ item: searchParams.league, itemName: 'リーグ' })
  return msg
}
