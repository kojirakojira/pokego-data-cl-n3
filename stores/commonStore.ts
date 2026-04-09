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
      if (!commonValue.value.staticUrl) {
        commonValue.value.staticUrl = useRuntimeConfig().public.staticUrl as string
      }
      return commonValue.value.staticUrl
    }

    return {
      setStaticUrl,
      getStaticUrl
    }
  })
