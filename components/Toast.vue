<template>
  <v-snackbar
    v-model="dispFlg"
    bottom
    rounded="pill"
    :timeout="waitMsgArr[0]?.timeout"
    :color="waitMsgArr[0]?.color"
  >
    {{ msg }}
    <template #actions>
      <v-btn
        color="pink"
        variant="text"
        style="font-weight:bold;"
        @click="closeToast()"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { toastStore } from '@/stores/toastStore'

const msg = ref<any>('')
const dispFlg = ref<boolean>(false) // closeToastで手動でトーストを閉じた場合の考慮

const waitMsgArr = computed(() => JSON.parse(JSON.stringify(toastStore().waitingMsgs.arr)))

watch(waitMsgArr, (newValue) => {
  if (!newValue.length || dispFlg.value) {
    // 要素数が0件の場合、表示中の場合は中断。
    return
  }
  // 表示処理
  msg.value = newValue[0]?.msg
  dispFlg.value = true
})

watch(dispFlg, (newValue) => {
  if (newValue) { return }
  // トーストが閉じられた際の処理
  setTimeout(() => {
    // 表示していたメッセージの要素を削除する。（queue）
    toastStore().shiftToast()
    // 削除後、メッセージが存在する場合は次のメッセージを表示させる。
    if (waitMsgArr.value.length) {
      msg.value = waitMsgArr.value[0]?.msg
      dispFlg.value = true
    }
  }, 100)
})

const closeToast = () => {
  dispFlg.value = false
}

</script>
