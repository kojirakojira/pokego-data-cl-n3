import { defineStore } from 'pinia'

export const manageStore = defineStore(
  'manageStore',
  () => {
    interface AdminUser {
      userId: string,
      jwt: string
    }
    const dic = ref<AdminUser>({
      userId: '',
      jwt: ''
    })

    const setUserId = (userId: string) => {
      dic.value.userId = userId
    }

    const setJwt = (jwt: string) => {
      dic.value.jwt = jwt
    }

    const getUserId = () => {
      return dic.value.userId
    }

    const getJwt = () => {
      return dic.value.jwt
    }

    const clear = () => {
      dic.value = {
        userId: '',
        jwt: ''
      }
    }

    return {
      dic,
      setUserId,
      setJwt,
      getUserId,
      getJwt,
      clear
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage()
    }
  })
