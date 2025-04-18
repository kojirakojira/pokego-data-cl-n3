<template>
  <v-tooltip location="bottom" open-on-click>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :class="['ma-2', !(canMega || mega) || $style.campfire]"
        :color="(canMega || mega) ? '#c05c81' : '#ccc'"
        size="small"
        :icon="MegaSvg"
      />
    </template>
    <span>{{ msg }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import MegaSvg from '~/components/icon/awakeningIcon/MegaSvg.vue'

withDefaults(
  defineProps<{
    msg: string,
    mega: boolean,
    canMega: boolean
  }>(),
  {})
</script>

<style lang="scss" module>
.campfire:hover {
  box-shadow:
    0 0 25px rgba(255, 80, 100, 0.8),
    0 -5px 45px rgba(255, 140, 100, 0.6),
    0 0 5px black;
  animation: campfireFlicker 2s infinite alternate;
}
@keyframes campfireFlicker {
  0% {
    box-shadow:
      8px -3px 22px rgba(255, 60, 100, 0.7),
      0 -9px 42px rgba(255, 120, 100, 0.5),
      0 0 20px #ff4d00,
      0 0 40px #ff1a1a,
      0 0 60px #e60000,
      0 0 5px black;
  }
  50% {
    box-shadow:
      0 -3px 28px rgba(255, 100, 100, 0.9),
      0 9px 48px rgba(255, 160, 100, 0.7),
      0 0 25px #ff4d00,
      0 0 60px #ff1a1a,
      0 0 70px #e60000,
      0 0 5px black;
  }
  100% {
    box-shadow:
      -8px -3px 25px rgba(255, 80, 100, 0.8),
      0 -9px 45px rgba(255, 140, 100, 0.6),
      0 0 20px #ff4d00,
      0 0 40px #ff1a1a,
      0 0 80px #e60000,
      0 0 5px black;
  }
}
</style>
