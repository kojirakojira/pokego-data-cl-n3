import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ToastItem {
  msg: any,
  timeout?: number,
  color?: string
}
export const toastStore = defineStore(
  'toastStore',
  () => {
    const waitingMsgs = ref({ arr: [] as Array<ToastItem> })

    const pushToast = (elem: ToastItem) => {
      elem.color = elem.color || 'black'
      elem.timeout = elem.timeout || 4000
      waitingMsgs.value.arr.push(elem)
    }

    const shiftToast = () => {
      waitingMsgs.value.arr.shift()
    }

    const clearToast = () => {
      waitingMsgs.value.arr.splice(0)
    }
    return {
      waitingMsgs,
      pushToast,
      shiftToast,
      clearToast
    }
  })
