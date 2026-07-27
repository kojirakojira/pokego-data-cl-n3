<template>
  <v-text-field
    v-model="model"
    label="例：101508(攻撃,防御,HPを6桁で入力)"
    :rules="searchCommon().rules.iv"
    :counter="6"
    maxlength="6"
    autocomplete="off"
    type="number"
    @keydown.enter.exact="onSubmit"
  />
</template>

<script setup lang="ts">
const model = defineModel<string | number>()
const props = withDefaults(
  defineProps<{
    keyupEnter?: (e?: Event) => void // Enterイベント（任意）
   }>(),
  { keyupEnter: () => {} }
)
const onSubmit = (e: Event) => {
  if (e instanceof KeyboardEvent && e.isComposing) {
    // 変換中の場合
    return
  }
  props.keyupEnter()
}
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
