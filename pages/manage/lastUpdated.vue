<template>
  <div>
    <MajorPartsH2Common>
      マスタファイル解析
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col>
            <v-textarea v-model="ymdStr" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isBtnClick || !ymdStr"
              @click="onClickBtn"
            >
              送信
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

const ymdStr = ref<string>('')

onMounted(async () => {
  await screenControlMethods().init()
})

const onClickBtn = async () => {
  isBtnClick.value = true
  const userId: string = manageStore().getUserId()
  const jwt: string = manageStore().getJwt()

  const res = await fetchCommon('/api/secure/manage/lastUpdateSave', 'POST', {
    query: {
      userId,
      ymdStr: ymdStr.value
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: jwt
    }
  })
  interface LastUpdateSaveRes {
    result: string,
    format: string
  }
  const resData: LastUpdateSaveRes = res.data as LastUpdateSaveRes
  alert(`実行結果：${resData.result}`)
  ymdStr.value = resData.format

  isBtnClick.value = false
}

const screenControlMethods = () => {
  const init = async () => {
    const userId: string = manageStore().getUserId()
    const jwt: string = manageStore().getJwt()
    if (!userId || !jwt) {
      alert('不正なアクセスです。')
      useRouter().push({ name: 'manage-login' })
      return
    }

    const res = await fetchCommon('/api/secure/manage/lastUpdateGetFormat', 'POST', {
      query: { userId },
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    })
    ymdStr.value = res.data?.format as string
    console.log(res.data)

    isLoading.value = false
  }
  return {
    init
  }
}

</script>
