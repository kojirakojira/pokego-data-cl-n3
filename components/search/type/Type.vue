<template>
  <span
    :style="`background-color: ${typeColorUtils.getRGB(type)};`"
    class="type"
  >
    {{ type }}
  </span>
</template>

<script setup lang="ts">
import { TypeColorUtils } from '#imports'

withDefaults(
  defineProps<{
    type: string
   }>(),
  {}
)

const constant: ConstantValue = constantUtils().get()
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)
</script>
