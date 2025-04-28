<template>
  <v-app>
    <div dark style="min-height: 90vh">
      <Navbar />
      <Toast />
      <v-main>
        <NuxtPage :dto="dto" />
      </v-main>
    </div>
    <v-footer padless>
      <v-container style="padding: 0px;">
        <v-row style="padding: 0px;">
          <v-col
            class="text-right"
            cols="12"
            style="padding-bottom:0px;"
          >
            <router-link to="/help/inquiry">
              お問い合わせ
            </router-link> | <router-link to="/help/privacyPolicy">
              プライバシーポリシー
            </router-link>
          </v-col>
          <v-col
            class="text-right"
            cols="12"
          >
            <a style="display:none;">©</a> 2021 — <strong>BrainJuice</strong>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
    <div v-show="isLoading">
      <div class="center-0">
        <div class="pulse-loader center-2">
          Loading...
        </div>
        <img
          :src="editUtils().getUrl('brainjuice/brain-juice.png')"
          class="center-1"
        >
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
// import { useTheme } from 'vuetify'
import '@/assets/styles/spinners.css'
import { type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { dtoStore, type ScreenInfo } from '~/stores/dtoStore'
import { commonStore } from '~/stores/commonStore'
// const theme = useTheme()
const isLoading = ref(true)
onMounted(() => {
  // theme.global.name.value = 'dark'
  // display.theme.dark = this.$store.getters.darkTheme
  isLoading.value = false
})
// commonStoreの初期化
commonStore().setStaticUrl(useRuntimeConfig().public.staticUrl)
// constantUtilsの初期化
await constantUtils().init()

/**
 * DTO機能
 */
const dto = ref<Record<string, any>>({
  params: {}
})

onMounted(() => {
  // 最初にリロードされたときはafterEachは呼ばれない。手動で呼ぶ。
  const route = useRoute()
  const si: ScreenInfo = dtoUtils().createScreenInfoFromRoute(route, window.history)
  dtoStore().afterEachAction(si)
})

useRouter().afterEach((to: RouteLocationNormalized) => {
  const si: ScreenInfo = dtoUtils().createScreenInfoFromRoute(to, window.history)
  dtoStore().afterEachAction(si)
})

useRouter().beforeEach((
  _: RouteLocationNormalized, // to
  from: RouteLocationNormalized,
  next: NavigationGuardNext) => {
  const si: ScreenInfo = dtoUtils().createScreenInfoForBeforeEach(from, dto)
  dtoStore().beforeEachAction(si)

  next()
})
</script>

<style>

.center-2 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 102;
}
.center-1 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  z-index: 101;
}
.center-0 {
  background-color: #dcdcdc;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
