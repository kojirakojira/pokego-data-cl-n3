<template>
  <v-container data-allow-mismatch :class="[ dispDelay || $style.h2_whole_leave, !dispDelay || $style.h2_whole_arrival ]">
    <h2 class="display-1">
      <v-row style="position: relative;">
        <v-col :class="[ $style.h2_title, $style.split_peripper ]">
          <div :class="$style.row" />
          <span :class="[ dispDelay || $style.text_leave, !dispDelay || $style.text_arrival ]">
            <slot />
          </span>
        </v-col>
      </v-row>
    </h2>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const frontImgPath = `url(${editUtils().getUrl('pokego/peripper-front2.png')})`
const backImgPath = `url(${editUtils().getUrl('pokego/peripper-back2.png')})`

const isClient = ref<boolean>(false)
const dispDelay = ref<boolean>(false)

const { name } = useDisplay()

// ペリッパーの黄色と白の境界の斜線の傾きを制御する。
const linearGradient = computed(() => {
  let diagonal = 4
  switch (name.value) {
    case 'xs': diagonal = 4
      break
    case 'sm': diagonal = 2
      break
    case 'md': diagonal = 2
      break
    case 'lg': diagonal = 1
      break
    case 'xl': diagonal = 1
      break
    case 'xxl': diagonal = 1
      break
  }
  return `linear-gradient(-${diagonal}deg, #f9ff3e 0%, #f9ff3e 45%, white 45%, white 100%)`
})

// transitionの発火
onMounted(() => {
  isClient.value = true
  setTimeout(() => {
    dispDelay.value = true
  }, 1)
})
</script>

<style lang="css" module>
.h2_whole_leave {
  width: 30% !important;
}
.h2_whole_arrival {
  width: 100% !important;
  transition: width 0.5s ease-out;
}
.text_leave {
  opacity: 0;
}
.text_arrival {
  opacity: 1;
  transition: opacity 0.5s ease-out;
  transition-delay: 0.5s;
}
.h2_title {
  font-weight: bold;
  background: v-bind(linearGradient);
  color: black;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  text-align: center;
  padding: 8px;
  margin: 0px 70px;
  height: 63px;
  position: relative;
}
.row {
  position: absolute;
  top: 0;
  left: 0;
  border-top: 5px solid #69dce0;
  width: 100%;
}
.split_peripper::before {
  content: '';
  display: inline-block;
  position: absolute;
  background-image: v-bind(frontImgPath);
  background-size: contain;
  width: 80px;
  height: 80px;
  top: -3px;
  left: -73px;
}
.split_peripper::after {
  content: '';
  display: inline-block;
  position: absolute;
  background-image: v-bind(backImgPath);
  background-size: contain;
  width: 78px;
  height: 78px;
  top: -3px;
  right: -78px;
}
</style>
