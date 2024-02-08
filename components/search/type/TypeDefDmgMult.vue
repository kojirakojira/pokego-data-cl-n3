<template>
  <div>
    <div class="pa-3">
      タイプ1:
      <span :style="`background-color: ${editUtils().getRGB(type1)};'}`" class="type">
        {{ constantUtils().getValue(type1, constantUtils().value.TYPE) }}
      </span>
      <div v-if="type2">
        タイプ2:
        <span :style="`background-color: ${editUtils().getRGB(type2)};'}`" class="type">
          {{ constantUtils().getValue(type2, constantUtils().value.TYPE) }}
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
withDefaults(
  defineProps<{
    type1: string,
    type2?: string,
    atkTypeDic: Record<string, Array<string>>
   }>(),
  { type2: '' }
)
</script>
