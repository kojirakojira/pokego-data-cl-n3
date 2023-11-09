import { toastStore } from '~/stores/toastStore'

export default async () => {
  const CONST = {
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

  // クライアント側でのみ取得する。
  if (process.client) {
    await Promise.all([
      fetchCommon('/api/typeConst', 'GET'),
      fetchCommon('/api/regionConst', 'GET'),
      fetchCommon('/api/genConst', 'GET'),
      fetchCommon('/api/filterItemsConst', 'GET'),
      fetchCommon('/api/plConst', 'GET'),
      fetchCommon('/api/situationConst', 'GET')
    ])
      .then((res: any) => {
        Object.entries(res[0].data).forEach(([k, v]: Array<any>) => {
          CONST.TYPE.push({
            k,
            v: v.jpn,
            r: v.r,
            g: v.g,
            b: v.b
          })
        })
        Object.entries(res[1].data).forEach(([k, v]: Array<any>) => { CONST.REGION.push({ k, v }) })
        Object.entries(res[2].data).forEach(([k, v]: Array<any>) => { CONST.GEN.push({ k, v }) })
        Object.entries(res[3].data).forEach(([k, v]: Array<any>) => { CONST.FILTER_ITEMS.push({ k, v }) })
        CONST.PL.push(...res[4].data)
        Object.entries(res[5].data).forEach(([k, v]: Array<any>) => { CONST.SITUATION.push({ k, v }) })
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          toastStore().pushToast({ msg: 'サーバとの通信に失敗しました。' })
        }
      })
  }

  return CONST
}
