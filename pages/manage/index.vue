<template>
  <div>
    <MajorPartsH2Common>
      管理
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              @click="useRouter().push({ name: 'manage-moveRegistration' })"
            >
              技登録
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isBtnClick"
              @click="onClickBtn('cleanupRedis')"
            >
              人気な〜のRedisクリーンアップ実行
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref<boolean>(true)
const isBtnClick = ref<boolean>(false)

onMounted(async () => {
  await screenControlMethods().init()
})

const onClickBtn = async (endpoint: string) => {
  isBtnClick.value = true
  const userId: string = manageStore().getUserId()
  const jwt: string = manageStore().getJwt()
  const yn = confirm(`実行します。よろしいですか？endpoint: ${endpoint}`)
  if (!yn) {
    isBtnClick.value = false
    return
  }
  const res = await fetchCommon(`/api/secure/${endpoint}`, 'POST', {
    query: { userId },
    headers: {
      'Content-Type': 'application/json',
      Authorization: jwt
    }
  })
  alert(`実行結果：${res.data}`)
  isBtnClick.value = false
}

const screenControlMethods = () => {
  const init = async (): Promise<void> => {
    const userId: string = manageStore().getUserId()
    const jwt: string = manageStore().getJwt()
    if (!userId || !jwt) {
      alert('不正なアクセスです。')
      useRouter().push({ name: 'manage-login' })
      return
    }

    const res = await fetchCommon('/api/secure/manage', 'POST', {
      query: { userId },
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    })
    if (!res.data) {
      alert('不正なアクセスです。')
      manageStore().clear()
      useRouter().push({ name: 'manage-login' })
      return
    }

    isLoading.value = false
  }
  return {
    init
  }
}

</script>
