import type { TypeInfo } from '~/components/interface/api/dto'
import { toastStore } from '~/stores/toastStore'
import { constantStore } from '~/stores/constantStore'

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
/**
 * constantUtils
 *
 * クライアントアプリ実行時、常に保持しておく情報。サーバ側から取得する。
 */
export default () => {
  const init = async () => {
    await Promise.all([
      fetchCommon('/api/typeConst', 'GET'),
      fetchCommon('/api/regionConst', 'GET'),
      fetchCommon('/api/genConst', 'GET'),
      fetchCommon('/api/filterItemsConst', 'GET'),
      fetchCommon('/api/plConst', 'GET'),
      fetchCommon('/api/situationConst', 'GET')
    ])
      .then((res: any) => {
        const store = constantStore()
        // 初期化
        store.clear()

        // レスポンスをそれぞれセットしていく
        store.setType(Object.entries(res[0].data).map((arr: Array<any>) => arr[1]))
        store.setRegion(Object.entries(res[1].data).map(([k, v]: Array<any>) => { return { k, v } }))
        store.setGen(Object.entries(res[2].data).map(([k, v]: Array<any>) => { return { k, v } }))
        store.setFilterItems(Object.entries(res[3].data).map(([k, v]: Array<any>) => { return { k, v } }))
        store.setPl(Object.entries(res[4].data).map((arr: Array<any>) => arr[1]))
        store.setSituation(Object.entries(res[5].data).map(([k, v]: Array<any>) => { return { k, v } }))
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          toastStore().pushToast({ msg: 'サーバとの通信に失敗しました。' })
        }
      })
  }
  const get = () => constantStore().get()

  return {
    init,
    get
  }
}
