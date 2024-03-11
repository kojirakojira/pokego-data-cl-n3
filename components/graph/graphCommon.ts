// 順位の下から何番目かを求める。
export const reverseRank = <T>(val: T, arr: Array<T>) => {
  let r = 0
  arr.forEach((v, i) => {
    if (v === val) {
      r = i
    }
  })
  return r
}
