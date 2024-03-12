<template>
  <div>
    <div class="pa-3">
      タイプ1:
      <span :style="`background-color: ${typeColorUtils.getRGB(type1)};'}`" class="type">
        {{ constantAccessor.getTypeJpn(type1) }}
      </span>
      <div v-if="type2">
        タイプ2:
        <span :style="`background-color: ${typeColorUtils.getRGB(type2)};'}`" class="type">
          {{ constantAccessor.getTypeJpn(type2) }}
        </span>
      </div>
    </div>
    <SearchTypeDefTable
      :def-type1="type1"
      :def-type2="type2"
      :atk-type-dic="atkTypeDic"
      style="margin-bottom: 36px;"
    />
  </div>
</template>

<script setup lang="ts">
import { TypeColorUtils, ConstantAccessor } from '#imports'

withDefaults(
  defineProps<{
    type1: string,
    type2?: string,
    atkTypeDic: Record<string, Array<string>>
   }>(),
  { type2: '' }
)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)
</script>
