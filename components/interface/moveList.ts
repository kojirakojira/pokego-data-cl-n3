import type { DispFastAttack, DispChargedAttack } from './api/dto'
import { ResearchResponse } from './api/response'

/**
 * レスポンスの型（API依存の部分）
 */
export class MoveListResponse extends ResearchResponse {
  faList: Array<DispFastAttack>
  caList: Array<DispChargedAttack>

  constructor () {
    super()
    this.faList = []
    this.caList = []
  }
}
/**
 * 検索画面用クエリパラメータの定義
 */
export class MoveListSearchParams {
  scene: String

  constructor () {
    this.scene = 'pvp'
  }
}

/**
 * 検索画面用DTOの定義
 */
export class MoveListSearchDtoItem implements SearchDtoItem {
  searchParams: MoveListSearchParams
  resData?: MoveListResponse

  constructor () {
    this.searchParams = new MoveListSearchParams()
  }
}

/**
 * 結果画面用クエリパラメータの定義
 */
export class MoveListResultSearchParams {
  scene: String

  constructor () {
    this.scene = ''
  }
}

/**
 * 結果画面用DTOの定義
 */
export class MoveListResultDtoItem implements ResultDtoItem {
  searchParams: MoveListResultSearchParams
  resData: MoveListResponse

  constructor () {
    this.searchParams = new MoveListResultSearchParams()
    this.resData = new MoveListResponse()
  }
}

/**
 * APIアクセス用get関数
 */
export const get = async (
  searchParams: MoveListSearchParams | MoveListResultSearchParams
): Promise<MoveListResponse> => {
  const res = await fetchCommon('/api/moveList', 'GET', {
    query: searchParams
  })
  const rd: MoveListResponse = res.data as MoveListResponse
  return rd
}
