<template>
  <span :class="!patternId || patternId === 'normal' ? null : $style.learning_pattern">
    {{ patternName }}
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ patternId?: string, patternName?: string }>(),
  { patternId: '', patternName: '' }
)
</script>

<style lang="scss" module>
.learning_pattern {
  background-color: black;
  font-size: 70%;
  display: inline-block;
  vertical-align: top;
  color: white;
  font-weight: bold;
  padding: 1px 3px !important;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
