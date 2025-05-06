<template>
  <div>
    <form>
      <v-container>
        <v-row>
          <v-col>
            ユーザ
          </v-col>
          <v-col>
            <v-text-field
              v-model="params.userId"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            パスワード
          </v-col>
          <v-col>
            <v-text-field
              v-model="params.password"
              type="password"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            MFAコード
          </v-col>
          <v-col>
            <v-text-field
              v-model="params.mfaCode"
              type="number"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isSearchBtnClick"
              @click="clickLoginBtn"
            >
              ログイン
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </form>
    <v-container>
      <v-row v-if="resData.qrCodeUrl">
        <v-col class="d-flex text-center">
          <v-img
            :src="resData.qrCodeUrl"
            width="200"
            height="200"
          />
        </v-col>
        <v-col>
          <p>Google AuthenticationでQRコードを読み取って登録してください。</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { manageStore } from '~/stores/manageStore'

type LoginPhase = 'NO_AUTHORITY' | 'NO_PASSWORD_NO_MFA' | 'NO_MFA' | 'SUCCESS'
class LoginParams {
  userId: string
  password: string
  mfaCode: string

  constructor () {
    this.userId = ''
    this.password = ''
    this.mfaCode = ''
  }
}
interface LoginResponse {
  phase: LoginPhase,
  qrCodeUrl: string | null,
  jwt: string | null
}

const params = ref<LoginParams>(new LoginParams())
const resData = ref<LoginResponse>({
  phase: 'NO_AUTHORITY',
  qrCodeUrl: null,
  jwt: null
})

const isSearchBtnClick = ref<boolean>(false)

const clickLoginBtn = async () => {
  isSearchBtnClick.value = true

  const res = await fetchCommon('/api/manage/login', 'POST', {
    query: {
      userId: params.value.userId,
      password: params.value.password,
      mfaCode: params.value.mfaCode
    },
    headers: { 'Content-Type': 'application/json' }
  })
  params.value.mfaCode = ''
  resData.value = res.data as LoginResponse

  if (resData.value.phase === 'SUCCESS') {
    // ローカルストレージにセット
    manageStore().setUserId(params.value.userId)
    if (resData.value.jwt) { manageStore().setJwt(resData.value.jwt) }
    // 成功なら遷移
    useRouter().push({ name: 'manage' })
  }

  isSearchBtnClick.value = false
}
</script>

<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance:textfield;
}
</style>
