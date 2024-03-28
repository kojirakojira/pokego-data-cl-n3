<template>
  <div>
    <div class="pa-3">
      タイプ1:
      <SearchType :type="constantAccessor.getTypeJpn(type1)" />
      <div v-if="type2">
        タイプ2:
        <SearchType :type="constantAccessor.getTypeJpn(type2)" />
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
import { ConstantAccessor } from '#imports'

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
</script>
