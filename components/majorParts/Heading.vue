<template>
  <component :is="tagName" :class="className" :style="styleName">
    <slot />
  </component>
</template>

<script setup lang="ts">
// classとstyleが適用できない…。一旦保留。
type TagName = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
withDefaults(
  defineProps<{
    tagName: TagName,
    className?: string | null | undefined,
    styleName?: string | null | undefined
   }>(),
  { className: null, styleName: null })
</script>
