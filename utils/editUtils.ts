export default () => {
  /**
   * 図鑑IDから図鑑Noを取得する。
   *
   */
  const getPdxNo = (pdxId: string): string => {
    return pdxId ? pdxId.substring(0, 4).replace(/^0+/, '') : ''
  }
  /**
   * ポケモン名に備考を連結させる。
   *
   * @returns
   */
  const appendRemarks = (name: string, remarks: string): string => {
    let val = name
    if (remarks) {
      val = val + `(${remarks})`
    }
    return val
  }
  /**
   * タイプのrgb(999, 999, 999)を取得します。
   * 英語名、日本語名の両方から取得できます。
   *
   */
  const getRGB = (type1: string, type2?: string | null | undefined) => {
    let rgb1: Record<string, any> = { r: 0, g: 0, b: 0 }
    let rgb2: Record<string, any> = { r: 0, g: 0, b: 0 }
    for (const t of (constantUtils()).value.TYPE) {
      if (type1 === t.v || type1 === t.k) { rgb1 = t }
      if (type2 === t.v || type2 === t.k) { rgb2 = t }
    }
    const createColor = (c1: number, c2: number) => { return (c1 * 1 + c2 * 1) / 2 }
    const r = type2 ? createColor(rgb1.r, rgb2.r) : rgb1.r
    const g = type2 ? createColor(rgb1.g, rgb2.g) : rgb1.g
    const b = type2 ? createColor(rgb1.b, rgb2.b) : rgb1.b
    return `rgb(${r}, ${g}, ${b})`
  }
  /**
     * タイプのrgba(999, 999, 999, alpha)を取得します。
     * 英語名、日本語名の両方から取得できます。
     *
     * @param alpha 透明度
     * @param type1 タイプ１
     * @param type2 タイプ２
     */
  const getRGBA = (alpha: number, type1: string, type2: string | null | undefined) => {
    let rgb1: Record<string, any> = { r: 0, g: 0, b: 0 }
    let rgb2: Record<string, any> = { r: 0, g: 0, b: 0 }
    for (const t of (constantUtils()).value.TYPE) {
      if (type1 === t.v || type1 === t.k) { rgb1 = t }
      if (type2 === t.v || type2 === t.k) { rgb2 = t }
    }
    const createColor = (c1: number, c2: number) => { return (c1 * 1 + c2 * 1) / 2 }
    const r = type2 ? createColor(Number(rgb1?.r), Number(rgb2?.r)) : rgb1.r
    const g = type2 ? createColor(Number(rgb1?.g), Number(rgb2?.g)) : rgb1.g
    const b = type2 ? createColor(Number(rgb1?.b), Number(rgb2?.b)) : rgb1.b
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  /**
   * styleを追加します。
   * 追加したstyleはSPAの画面遷移では削除されないため、自前で管理する必要があります。
   * そのため、第3引数に指定した配列に追加したstyleのidをpushします。
   *
   * @param {String} id styleに指定するHTMLにおけるid属性
   * @param {String} style 設定するstyle
   * @param {Array} styleIdArr
   */
  const createStyleElem = (id: string, style: string, styleIdArr: Array<string>) => {
    if (process.server) { return }
    // styleを追加
    const newStyle = document.createElement('style')
    newStyle.id = id
    newStyle.innerHTML = style
    document.getElementsByTagName('head').item(0)?.appendChild(newStyle)

    // styleのid名を配列に追加
    styleIdArr.push(id)
  }
  /**
   * styleIdArrのidのうち、prefixに該当するstyleをHTML上から削除します。
   * 削除後の配列を返却値として受け取ってください。
   *
   * @param {Array} styleIdArr
   * @param {String} prefix 該当した接頭辞のみ削除する（省略可）
   */
  const deleteStyleElem = (styleIdArr: Array<string>, prefix?: string) => {
    if (process.server) { return styleIdArr }
    // styleの削除
    styleIdArr.forEach((id) => {
      if (!prefix || !id.indexOf(prefix)) {
        const elem: HTMLElement | null = document.getElementById(id)
        elem?.remove()
      }
    })

    // styleIdArrからの該当のidの削除
    return styleIdArr.filter((id) => { return prefix && id.indexOf(prefix) })
  }

  /**
     * 引数に渡した文字列にタイプ名が含まれていた場合にデコレーションします。
     *
     * @param {String} value タイプコメントの1つ
     */
  const typeDecoration = (value: string) => {
    const regex = new RegExp((constantUtils()).value.TYPE.map(elem => elem.v).join('|'), 'g')
    return value.replace(regex, (match) => {
      return '<span class="type" style="background-color: ' +
        `${getRGB(match)}">${match}</span>`
    }).replaceAll('>,', '>')
  }

  /**
   * pathnameからURLを取得する。
   * Nuxtアプリ内に静的ファイルを配置している場合に使用する。
   *
   * @param pathname
   * @returns
   */
  const getUrl = (pathname: string): string | null => {
    let url: string | null = null
    if (process.client) {
      url = window.location.origin + import.meta.env.BASE_URL.slice(0, -1) + pathname
    }
    return url
  }

  /**
   * ポケモンの画像のURLを取得する。
   *
   * @param pathname
   * @returns
   */
  const getPokemonImageUrl = (pathname: string | null | undefined): string => {
    let url: string = ''
    if (pathname) {
      url = useRuntimeConfig().public.staticUrl + pathname
    } else {
      url = getUrl('/img/no-image.png') || ''
    }
    return url
  }

  /**
   * 連想配列を配列に変換する。
   *
   * @param dic
   * @returns
   */
  const toArrayFromDic = (dic: Record<any, any>): Array<any> => {
    const arr : Array<any> = []
    for (const [, v] of Object.entries(dic)) {
      arr.push(v)
    }
    return arr
  }

  /**
   * String型に変換する。値が存在しない場合は、空文字を返却する。
   */
  const toString = (value: any): string => {
    return value ? String(value) : ''
  }

  return {
    getPdxNo,
    appendRemarks,
    getRGB,
    getRGBA,
    createStyleElem,
    deleteStyleElem,
    typeDecoration,
    getUrl,
    getPokemonImageUrl,
    toArrayFromDic,
    toString
  }
}
