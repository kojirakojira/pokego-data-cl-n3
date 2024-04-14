<template>
  <v-container>
    <p />
    <h2 class="display-1">
      <v-row>
        <v-col :class="`h2-title ${className}`">
          <slot />
        </v-col>
      </v-row>
    </h2>
  </v-container>
</template>

<script setup>
const brainImages = [
  'brain-juice-cat',
  'brain-juice-cat2',
  'brain-juice'
]
const className = 'h2-brain-icon'
onBeforeMount(() => {
  createStyle()
})
/**
 * Styleを生成する。
 */
const createStyle = () => {
  // styleが既に設定されている場合は取得
  const styleElem = document.getElementById(className)

  // プロパティを指定
  const style = `.${className} {\
        background-image: url(${imageSelector()}), url(${imageSelector(true)});\
        background-size: 65px;\
        background-position-x: 98%, 2%;
        text-stroke: 0.5px black;
        -webkit-text-stroke: 0.5px black; }`

  if (styleElem) {
    // styleが既に設定されている場合
    styleElem.innerHTML = style
  } else {
    // styleが設定されていない場合
    const newStyle = document.createElement('style')

    newStyle.id = className
    newStyle.innerHTML = style
    document.getElementsByTagName('head').item(0).appendChild(newStyle)
  }
}
/**
 * ランダムにイメージを取得する。
 * brainImagesの配列に設定されている中から設定する。
 */
const imageSelector = (flipFlg) => {
  const idx = Math.floor(Math.random() * brainImages.length)
  let imgPath = editUtils().getUrl('brainjuice/' + brainImages[idx])
  imgPath += (flipFlg ? '-flip' : '')
  imgPath += '.png'
  return imgPath
}
</script>
