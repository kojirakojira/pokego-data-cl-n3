<template>
  <v-text-field
    v-model="model"
    label="例：101508(攻撃,防御,HPを6桁で入力)"
    :rules="searchCommon().rules.iv"
    :counter="6"
    maxlength="6"
    autocomplete="off"
    type="number"
    @keyup.enter.exact="keyupEnter"
  />
</template>

<script setup lang="ts">
const model = defineModel()
withDefaults(
  defineProps<{
    keyupEnter?: Function // Enterイベント（任意）
   }>(),
  { keyupEnter: () => {} }
)
</script>

<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance:textfield;
}
</style>
