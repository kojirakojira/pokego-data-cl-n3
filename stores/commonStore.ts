import { defineStore } from 'pinia'

export const commonStore = defineStore(
  'commonStore',
  () => {
    const commonValue = ref<{ staticUrl: string }>({
      staticUrl: ''
    })

    const setStaticUrl = (staticUrl: string) => {
      commonValue.value.staticUrl = staticUrl
    }

    const getStaticUrl = () => {
      return commonValue.value.staticUrl
    }

    return {
      setStaticUrl,
      getStaticUrl
    }
  })
