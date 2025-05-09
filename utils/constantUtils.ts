import type { TypeInfo } from '~/components/interface/api/dto'
import { constantStore } from '~/stores/constantStore'

export interface Constants {
  typeList: Array<string>,
  regionMap: Record<string, string>,
  genMap: Record<string, string>,
  filterItemMap: Record<string, string>,
  plList: Array<string>,
  situationMap: Record<string, string>
}
export interface SimpEntry {
  k: string,
  v: string
}
export type ConstantItem = 'TYPE' | 'REGION' | 'GEN' | 'FILTER_ITEMS' | 'PL' | 'SITUATION'
export type SimpEntryItem = 'REGION' | 'GEN' | 'FILTER_ITEMS' | 'SITUATION'
export interface ConstantValue extends Record<ConstantItem, Array<any>> {
  TYPE: Array<TypeInfo>,
  REGION: Array<SimpEntry>,
  GEN: Array<SimpEntry>,
  FILTER_ITEMS: Array<SimpEntry>,
  PL: Array<string>,
  SITUATION: Array<SimpEntry>
}
export class ConstantAccessor {
  constant: ConstantValue

  constructor (constant: ConstantValue) {
    this.constant = constant
  }

  getValue (k: string, target: SimpEntryItem) {
    const arr = this.constant[target]
    for (const item of arr) {
      if (k === item.k) {
        return item.v
      }
    }
  }

  getTypeJpn (type: string): string {
    const arr = this.constant.TYPE.filter(ti => ti.type === type)
    return arr[0]?.jpn
  }
}

export default () => {
  const get = () => constantStore().get()

  /**
   * クライアントアプリ実行時、常に保持しておく情報。サーバ側から取得する。
   *
   * @returns
   */
  const getConstants = async (): Promise<Constants> => {
    const res = await fetchCommon('/api/constants', 'GET', {}, true)
    return res.data as Constants
  }

  return {
    get,
    getConstants
  }
}
