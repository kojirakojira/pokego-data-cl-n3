import { defineStore } from 'pinia'

export interface ScreenInfo {
  pathName: string
  position: number // window.history.stateで管理している、positionを識別するための番号
  query: Record<string, any>
  params: Record<string, any>
}
export const dtoStore = defineStore(
  'dtoStore',
  () => {
    const historyState = ref<Record<string, Array<ScreenInfo>>>({
      history: []
    })
    // 現在の画面のposition
    const positionState = ref<number>(0)
    // 現在のwindow.historyの桁数
    const lenState = ref<number>(0)
    // 直前の操作
    const navigationState = ref<string>('reload')

    const history = historyState.value.history

    const getHistory = (): Array<ScreenInfo> => history

    const clearHistory = (): void => {
      // 全削除
      history.splice(0)
    }

    const getNavigation = (): string => navigationState.value
    /**
     * 画面に遷移してきたときの処理
     */
    const afterEachAction = (si: ScreenInfo) => {
      if (!history.length) {
        // historyが0件の場合は有無を言わず追加。
        history.push(si)
      } else {
        // historyが1件以上
        const idx = indexOf(si.position)

        if (idx < 0) {
          // historyにpositionが存在しない場合
          // 挿入する位置を求める
          let splicePoint: number = history.length
          for (const i in history) {
            if (si.position < history[i].position) {
              splicePoint = Number(i)
              break
            }
          }
          // 挿入（戻るボタンでアプリに遷移してきた場合を考慮してpushでなくspliceで挿入している）
          history.splice(splicePoint, 0, si)
        } else if (positionState.value <= si.position) {
          // historyにpositionが存在する場合、かつ戻る以外の操作の場合は、上書きする
          if (history[idx].pathName === si.pathName &&
            compareDic(history[idx].query, si.query)) {
            // pathNameとqueryが一致している場合は、positionだけ更新する。（念のため）
            history[idx].position = si.position
          } else {
            // それ以外はすべて更新
            history[idx] = si
          }
        }

        // historyがpushされていて、不要になった履歴がある場合は削除する。
        if (window.history.length < lenState.value && idx < history.length) {
          history.splice(idx + 1, history.length)
        }
      }

      // 画面操作を判定する。
      if (positionState.value) {
        navigationState.value = positionState.value <= si.position ? 'forward' : 'backward'
      }
      // 現在の画面のpositionを退避させる
      positionState.value = si.position
      // 現在のwindow.historyの要素数を退避させる
      lenState.value = window.history.length

      console.log(history) // eslint-disable-line no-console
    }

    /**
     * 画面から離れるときの処理
     * ※引数に指定されたScreenInfoのpositionは参照しない。
     * beforeEachよりも後にrouter.pushが呼ばれるため、遷移 or 進む戻るでwindow.history.positionの値が異なるため。
     */
    const beforeEachAction = (si: ScreenInfo) => {
      let idx = indexOf(positionState.value)
      if (idx < 0) {
        // 例外的な挙動をした場合
        clearHistory()
        return
      }
      if (history[idx].pathName !== si.pathName) {
        // 画面遷移後すぐに戻るボタンを押すと画面が戻らないことがある。（開発環境固有？）
        if (history[idx + 1].pathName !== si.pathName) { return }
        idx++
      }

      history[idx].query = si.query
      history[idx].params = si.params
    }

    /**
     * 1つ前のScreenInfoを取得する。存在しない場合は、nullが返却される。
     *
     * @returns
     */
    const beforeScreenInfo = (): ScreenInfo | null => {
      const index = indexOf(positionState.value)
      if (!history.length || index < 1) {
        // historyが0件、または前の画面が存在しない場合
        return null
      }
      return history[index - 1]
    }

    /**
     * 現在の画面のScreenInfoを取得する。存在しない場合は、nullが返却される。
     *
     * @returns
     */
    const currentScreenInfo = (): ScreenInfo | null => {
      if (!history.length) {
        // historyが0件の場合
        return null
      }
      const index = indexOf(positionState.value)
      return history[index]
    }

    /**
     * historyのpositionの位置を求める。
     * 存在しない場合は-1を返却する。
     *
     * @param position
     * @returns
     */
    const indexOf = (position: number): number => {
      let ret = -1
      for (const i in history) {
        if (history[i].position === position) {
          ret = Number(i)
          break
        }
      }
      return ret
    }

    /**
   * 連想配列が一致しているかどうか判定する。一致してたらtrue
   *
   * @param before
   * @param after
   * @returns
   */
    const compareDic = (before: {[key: string]: any}, after: {[key: string]: any}) => {
      let bool = true
      // 相互比較
      Object.entries(before).forEach(([k]) => { if (before[k] !== after[k]) { bool = false } })
      Object.entries(after).forEach(([k]) => { if (before[k] !== after[k]) { bool = false } })
      return bool
    }

    return {
      getHistory,
      getNavigation,
      afterEachAction,
      beforeEachAction,
      clearHistory,
      beforeScreenInfo,
      currentScreenInfo
    }
  }, {
    persist: true
  })
