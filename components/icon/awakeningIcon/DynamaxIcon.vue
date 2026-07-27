<template>
  <v-tooltip location="bottom" open-on-click>
    <template #activator="{ 'props': tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :class="['ma-2', !implFlg || $style.dark_flame]"
        :color="implFlg ? colorSelector : '#ccc'"
        size="small"
        :icon="iconSelector"
      />
    </template>
    <span>{{ msg }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import DynamaxSvg from '~/components/icon/awakeningIcon/DynamaxSvg.vue'
import GigantamaxSvg from '~/components/icon/awakeningIcon/GigantamaxSvg.vue'
type iconType = 'Dynamax' | 'Gigantamax'
const props = withDefaults(
  defineProps<{
    msg: string,
    implFlg: boolean
    type: iconType
  }>(),
  {})

const iconSelector = computed(() => {
  return props.type === 'Gigantamax' ? GigantamaxSvg : DynamaxSvg
})

const colorSelector = computed(() => {
  return props.type === 'Gigantamax' ? '#992366' : '#cb2f85'
})
</script>

<style lang="scss" module>
.dark_flame:hover {
  box-shadow:
      0 -3px 25px rgba(180, 0, 120, 0.8),
      0 -8px 45px rgba(120, 0, 180, 0.6),
      0 0 20px #ff6ec4,
      0 0 40px #7873f5,
      0 0 60px #d66efd,
      0 0 5px black;
  animation: darkFlicker 2s infinite alternate;
}

@keyframes darkFlicker {
  0% {
    box-shadow:
      0 -3px 25px rgba(180, 0, 120, 0.8),
      25px -8px 45px rgba(120, 0, 180, 0.6),
      0 0 30px #ff6ec4,
      0 0 40px #7873f5,
      0 0 60px #d66efd,
      0 0 5px black;
  }
  50% {
    box-shadow:
      0 -3px 28px rgba(220, 0, 180, 0.9),
      0 -12px 48px rgba(150, 0, 220, 0.7),
      0 0 25px #ff9de4,
      0 0 60px #a18eff,
      0 0 70px #ffb6f9,
      0 0 5px black;
  }
  100% {
    box-shadow:
      0 -3px 22px rgba(255, 0, 180, 0.7),
      -25px -18px 42px rgba(180, 0, 200, 0.5),
      0 0 20px #ff6ec4,
      0 0 40px #7873f5,
      0 0 80px #d66efd,
      0 0 5px black;
  }
}

// .dark_flame:hover {
// box-shadow:
//     0 0 20px #ff6ec4,
//     0 0 40px #7873f5,
//     0 0 60px #d66efd,
//     0 0 5px black;
//   animation: pulse-glow 2s ease-in-out infinite;
// }
// /* アニメーション */
// @keyframes pulse-glow {
//   0% {
//     box-shadow:
//       0 0 20px #ff6ec4,
//       0 0 40px #7873f5,
//       0 0 60px #d66efd,
//       0 0 5px black;
//   }
//   50% {
//     box-shadow:
//       0 0 30px #ff9de4,
//       0 0 60px #a18eff,
//       0 0 80px #ffb6f9,
//       0 0 5px black;
//   }
//   100% {
//     box-shadow:
//       0 0 20px #ff6ec4,
//       0 0 40px #7873f5,
//       0 0 60px #d66efd,
//       0 0 5px black;
//   }
// }
</style>
