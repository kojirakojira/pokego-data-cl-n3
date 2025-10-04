<template>
  <div :class="$style.energy_bar">
    <div v-if="divide >= 2" :class="$style.separator" />
    <div v-if="divide >= 3" :class="$style.separator" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ divide: number }>(),
  { }
)
</script>

<style lang="scss" module>
.energy_bar {
  position: relative;
  background-color: darkgrey;
  height: 10px;
  overflow: hidden;
  display: flex;
  justify-content: space-evenly;
  width: 100%;

  .separator {
    position: relative;
    top: -1px;
    background-color: white;
    height: 12px;
    width: 4px;
    transform: rotate(25deg);
  }
}</style>
