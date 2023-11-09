export default () => {
  const checkRequired = ({ item, itemName, additional }: Record<string, string>) => {
    if (!item) {
      let msg = `「${itemName}」は必須項目です。\n`
      if (additional) {
        msg = additional + msg
      }
      return msg
    }
    return ''
  }
  const checkIv = ({ item, itemName, additional }: Record<string, any>) => {
    const ivNames = ['攻撃', '防御', 'HP']
    let msg = ''

    if (item.length !== 6 || isNaN(item)) {
      msg += `「${itemName}」は数値6桁で入力してください。`
      msg = additional ? additional + msg : msg
      return msg
    }

    const ivArr = [item.substring(0, 2), item.substring(2, 4), item.substring(4, 6)]
    for (const i in ivArr) {
      if (!(ivArr[i] >= 0 && ivArr[i] <= 15)) {
        msg += `${ivNames[i]}は0~15の間で入力してください。\n`
      }
    }
    if (!msg) {
      return ''
    }

    return additional ? additional + msg : msg
  }
  const checkEmail = ({ item, additional }: Record<string, string>) => {
    if (!item) { return '' }

    let msg = ''
    if (!/^([a-zA-Z0-9])+([a-zA-Z0-9._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9._-]+)+$/.test(item)) {
      msg = 'メールアドレスの形式に合いません。\n'
      if (additional) {
        msg = additional + msg
      }
    }
    return msg
  }
  /**
   * 入力チェック用関数
   *
   * iArrの要素のパターン：
   * | key | value | 必須 | 型 | 備考 |
   * | valid | "required" or "iv" or "email" | 必須 | String or Array | 実行するチェックを指定する。 |
   * | item | チェックする値 | 必須 | validに応ず |  |
   * | itemName | itemの日本語名 | 必須 | String |  |
   * | additional | メッセージの前に付加する値 | 任意 | String |  |
   *
   *  [{valid: "required" or ["required", "email"], item: "", itemName: "", additional: "", }]
   * @param 判定する配列
   */
  const validate = (iArr: Array<Record<string, any>>) => {
    let msg = ''
    const getFuncName = (v: string): string => {
      return `check${v.charAt(0).toUpperCase() + v.slice(1)}`
    }
    const checkFuncDic: Record<string, Function> = {
      checkRequired,
      checkIv,
      checkEmail
    }
    const execFunc = (v: string, e: any) => {
      return checkFuncDic[getFuncName(v)](e)
    }

    iArr.forEach((elem) => {
      const valid = elem.valid
      if (typeof valid === 'string') {
        // validが文字列の場合
        msg += execFunc(valid, elem)
      } else if (Array.isArray(valid)) {
        // validが配列の場合
        for (const v of valid) {
          const tmpMsg = execFunc(v, elem)
          if (tmpMsg) {
            msg += tmpMsg
            break
          }
        }
      }
    })

    return msg
  }

  return {
    validate,
    checkRequired,
    checkIv,
    checkEmail
  }
}
