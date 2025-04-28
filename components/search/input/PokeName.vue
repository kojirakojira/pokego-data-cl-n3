<template>
  <v-text-field
    v-model="modelName"
    :label="label"
    outlined
    dense
    rows="1"
    :rules="searchCommon().rules.name"
    :counter="20"
    :append-inner-icon="modelPid ? 'mdi-check' : ''"
    maxlength="20"
    autocomplete="off"
    @update:model-value="onChangeText()"
    @keyup.enter.exact="keyupEnter"
  />
</template>

<script setup lang="ts">
const modelName = defineModel('name')
const modelPid = defineModel('pid')
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
const onChangeText = () => {
  // pidを削除する。
  modelPid.value = ''
}
</script>
