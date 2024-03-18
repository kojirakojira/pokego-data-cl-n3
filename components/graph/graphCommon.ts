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

export const colorArr: Array<{ r: number, g: number, b: number }> = [
  { r: 255, g: 0, b: 0 }, // blue
  { r: 0, g: 0, b: 255 }, // red
  { r: 0, g: 255, b: 0 }, // lime
  { r: 255, g: 0, b: 255 }, // fuchsia
  { r: 0, g: 0, b: 128 }, // navy
  { r: 255, g: 255, b: 0 } // aqua
]
