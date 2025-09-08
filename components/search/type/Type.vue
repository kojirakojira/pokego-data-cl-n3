<template>
  <span
    :style="`background-color: ${typeColorUtils.getRGB(type)};`"
    :class="$style.type"
  >
    {{ dispType }}
  </span>
</template>

<script setup lang="ts">
import { TypeColorUtils, ConstantAccessor } from '#imports'

const props = withDefaults(
  defineProps<{
    type: string
   }>(),
  {}
)

const constant: ConstantValue = constantUtils().get()
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)

// props.typeが英語名だった場合、日本語名に変換する。
const dispType = computed(() => {
  return constant.TYPE.filter(t => t.type.includes(props.type)).length > 0
    ? constantAccessor.getTypeJpn(props.type)
    : props.type
})
</script>

<style module>
.type {
  display: inline-block;
  vertical-align: top;
  color: white;
  font-weight: bold;
  padding: 1px 3px !important;
  font-size: 80%;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
