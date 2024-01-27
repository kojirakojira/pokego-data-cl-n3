<template>
  <v-text-field
    v-model="model"
    :label="label"
    outlined
    dense
    rows="1"
    :rules="searchCommon().rules.name"
    :counter="20"
    maxlength="20"
    autocomplete="off"
    @keyup.enter.exact="keyupEnter"
  />
</template>

<script setup lang="ts">
const model = defineModel()
withDefaults(
  defineProps<{
    label?: string, // ラベル（任意）
    keyupEnter?: Function // Enterイベント（任意）
   }>(),
  {
    label: '例：ミュウツー',
    keyupEnter: () => {}
  }
)
</script>
