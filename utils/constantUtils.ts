import { toastStore } from '~/stores/toastStore'

/**
 * constantUtils
 *
 * クライアントアプリ実行時、常に保持しておく情報。サーバ側から取得する。
 */
const value = {
  TYPE: [] as Array<Record<string, string>>, // タイプ
  REGION: [] as Array<Record<string, string>>, // 地域
  GEN: [] as Array<Record<string, string>>, // 世代
  FILTER_ITEMS: [] as Array<Record<string, string>>, // 絞り込み検索項目
  PL: [] as Array<string>, // PL
  SITUATION: [] as Array<Record<string, string>>, // ポケモンを捕まえるときのシチュエーション
  getValue: (k: string, arr: Array<Record<string, string>>) => {
    for (const item of arr) {
      if (k === item.k) {
        return item.v
      }
    }
  }
}
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
        // 初期化
        Object.entries(value).forEach(([k, v]) => {
          if (typeof v === 'function') { v = [] } // 関数以外は空の配列で初期化
          value[k] = v
        })

        // レスポンスをそれぞれセットしていく
        Object.entries(res[0].data).forEach(([k, v]: Array<any>) => {
          value.TYPE.push({
            k,
            v: v.jpn,
            r: v.r,
            g: v.g,
            b: v.b
          })
        })
        Object.entries(res[1].data).forEach(([k, v]: Array<any>) => { value.REGION.push({ k, v }) })
        Object.entries(res[2].data).forEach(([k, v]: Array<any>) => { value.GEN.push({ k, v }) })
        Object.entries(res[3].data).forEach(([k, v]: Array<any>) => { value.FILTER_ITEMS.push({ k, v }) })
        Object.entries(res[4].data).forEach((arr: Array<string>) => { value.PL.push(arr[1]) })
        Object.entries(res[5].data).forEach(([k, v]: Array<any>) => { value.SITUATION.push({ k, v }) })
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          toastStore().pushToast({ msg: 'サーバとの通信に失敗しました。' })
        }
      })
  }

  return {
    value,
    init
  }
}
