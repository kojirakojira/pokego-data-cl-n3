import { defineStore } from 'pinia'

export interface ScreenInfo {
  url: string
  params: any
}
export const historyStore = defineStore(
  'historyStore',
  () => {
    const state = ref<Record<string, Array<ScreenInfo>>>({
      history: []
    })

    const getHistory = (): Array<ScreenInfo> => state.value.history

    const clearHistory = () => {
      // 全削除
      state.value.history.splice(0)
    }

    /**
     * 指定したURLのScreenInfoを取得する。
     * 取得したScreenInfoは削除される。
     * Historyの後ろから削除していく。
     *
     * @param url
     * @returns
     */
    const getScreenInfo = (url: string): ScreenInfo | null => {
      let ret = null

      const lastIdx = state.value.history.length - 1
      for (let i = lastIdx; i >= 0; i--) {
        if (url === state.value.history[i].url) {
          ret = state.value.history.splice(i, 1)[0]
          break
        }
      }
      return ret
    }

    const pushScreenInfo = (si: ScreenInfo): void => {
      state.value.history.push(si)
    }

    return { getHistory, clearHistory, getScreenInfo, pushScreenInfo }
  }, {
    persist: true
  })
