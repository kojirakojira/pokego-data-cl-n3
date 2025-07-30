<template>
  <div>
    <MajorPartsH2Common>
      マスタファイル解析
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col>
            <v-file-upload v-model="masterFile" clearable density="compact">
              <template #item="{ props: itemProps }">
                <v-file-upload-item v-bind="itemProps" lines="one" nav>
                  <template #prepend>
                    <v-avatar size="32" rounded />
                  </template>

                  <template #clear="{ props: clearProps }">
                    <v-btn color="primary" v-bind="clearProps" />
                  </template>
                </v-file-upload-item>
              </template>
            </v-file-upload>
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="6" class="col-title">
            Print to log Quick moves?
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="isPrintRequestedQuickMoves"
              inset
              color="info"
              hide-details
              :label="isPrintRequestedQuickMoves ? 'Yes, I do.' : 'No, I dont.'"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="6" class="col-title">
            Print to log Cinematic moves?
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="isPrintRequestedCinematicMoves"
              inset
              color="info"
              hide-details
              :label="isPrintRequestedCinematicMoves ? 'Yes, I do.' : 'No, I dont.'"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="6" class="col-title">
            Print to log Moves for each Pokemon?
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="isPrintRequestedMoveEachPokemon"
              inset
              color="info"
              hide-details
              :label="isPrintRequestedMoveEachPokemon ? 'Yes, I do.' : 'No, I dont.'"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="6" class="col-title">
            Save FastAttack?
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="shouldSaveFastAttack"
              inset
              color="info"
              hide-details
              :label="shouldSaveFastAttack ? 'Yes, I do.' : 'No, I dont.'"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="6" class="col-title">
            Save ChargedAttack?
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="shouldSaveChargedAttack"
              inset
              color="info"
              hide-details
              :label="shouldSaveChargedAttack ? 'Yes, I do.' : 'No, I dont.'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isBtnClick || !masterFile"
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

const masterFile = shallowRef(undefined)
const isPrintRequestedQuickMoves = ref<boolean>(false)
const isPrintRequestedCinematicMoves = ref<boolean>(false)
const isPrintRequestedMoveEachPokemon = ref<boolean>(false)
const shouldSaveFastAttack = ref<boolean>(false)
const shouldSaveChargedAttack = ref<boolean>(false)

onMounted(async () => {
  await screenControlMethods().init()
})

const onClickBtn = async () => {
  isBtnClick.value = true
  const userId: string = manageStore().getUserId()
  const jwt: string = manageStore().getJwt()
  console.log(masterFile.value)
  if (!masterFile.value) {
    alert('ファイルが選択されていません。')
    isBtnClick.value = false
    return
  }
  const formData = new FormData()
  formData.append('userId', userId)
  formData.append('masterFile', masterFile.value)
  formData.append('isPrintRequestedQuickMoves', String(isPrintRequestedQuickMoves.value))
  formData.append('isPrintRequestedCinematicMoves', String(isPrintRequestedCinematicMoves.value))
  formData.append('isPrintRequestedMoveEachPokemon', String(isPrintRequestedMoveEachPokemon.value))
  formData.append('shouldSaveFastAttack', String(shouldSaveFastAttack.value))
  formData.append('shouldSaveChargedAttack', String(shouldSaveChargedAttack.value))

  const res = await fetchCommon('/api/secure/masterFileAnalyze', 'POST', {
    body: formData,
    headers: {
      // bodyを指定してるから勝手にContent-Typeが指定される。むしろ明示的に指定するとダメ
      //   'Content-Type': 'multipart/form-data',
      Authorization: jwt
    }
  })
  alert(`実行結果：${res.data}`)
  isBtnClick.value = false
}

const screenControlMethods = () => {
  const init = () => {
    const userId: string = manageStore().getUserId()
    const jwt: string = manageStore().getJwt()
    if (!userId || !jwt) {
      alert('不正なアクセスです。')
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
