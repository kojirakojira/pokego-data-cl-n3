<template>
  <v-text-field
    :id="id"
    v-model="modelName"
    :label="label"
    outlined
    dense
    rows="1"
    :rules="searchCommon().rules.name"
    :counter="20"
    :append-inner-icon="modelMid ? 'mdi-check' : ''"
    maxlength="20"
    autocomplete="off"
    @update:model-value="onChangeText()"
    @keydown.enter.exact="onSubmit"
  />
</template>

<script setup lang="ts">
const modelName = defineModel('name')
const modelMid = defineModel('mid')
const props = withDefaults(
  defineProps<{
    id?: string,
    label?: string, // ラベル（任意）
    keyupEnter?: Function, // Enterイベント（任意）
    autoFocus?: boolean
   }>(),
  {
    id: 'move-name',
    label: '例：サイコブレイク',
    keyupEnter: () => {},
    autoFocus: true
  }
)
const onChangeText = () => {
  // midを削除する。
  modelMid.value = ''
}
onMounted(() => {
  if (props.autoFocus) {
    document.getElementById(props.id)?.focus()
  }
})
const onSubmit = (e: Event) => {
  if (e instanceof KeyboardEvent && e.isComposing) {
    // 変換中の場合
    return
  }
  props.keyupEnter()
}
</script>
