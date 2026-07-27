<template>
  <v-app>
    <div dark style="min-height: 90vh">
      <Navbar />
      <Toast />
      <!-- v-navigation-drawerと重ねて表示させるためにpadding-left:0pxを適用させている。 -->
      <v-main class="pl-0">
        <NuxtPage :dto="dto" />
      </v-main>
    </div>
    <v-footer padless>
      <v-container class="pa-0">
        <v-row class="pa-0">
          <v-col
            class="text-right pb-0"
            cols="12"
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
    <div v-show="isLoading || isLoadingTransition">
      <div
        :class="[
          $style.center_0,
          isLoading ? $style.initialize : null,
          isLoadingTransition ? $style.transition : null]"
      >
        <div v-if="isLoading" :class="['pulse-loader', $style.center_2]">
          Loading...
        </div>
        <img
          :src="editUtils().getUrl('pokego/peripper-flapping.gif')"
          :class="$style.center_1"
        >
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
// import { useTheme } from 'vuetify'
import '@/assets/styles/spinners.css'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { dtoStore, type ScreenInfo } from '~/stores/dtoStore'
import { commonStore } from '~/stores/commonStore'
// const theme = useTheme()
const isLoading = ref(true)
const isLoadingTransition = ref(false)
onMounted(() => {
  // theme.global.name.value = 'dark'
  // display.theme.dark = this.$store.getters.darkTheme
  isLoading.value = false
})
useRouter().afterEach(() => {
  isLoadingTransition.value = false
})

useRouter().beforeEach((_1, _2, next: NavigationGuardNext) => {
  isLoadingTransition.value = true
  next()
})
// commonStoreの初期化
commonStore().setStaticUrl(useRuntimeConfig().public.staticUrl as string)
// constantStoreの初期化
constantStore().init(await constantUtils().getConstants())

/**
 * DTO機能
 */
const dto = ref<PageDto>({
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

useRouter().beforeEach((_1: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const si: ScreenInfo = dtoUtils().createScreenInfoForBeforeEach(from, dto)
  dtoStore().beforeEachAction(si)
  next()
})
</script>

<style lang="scss" module>
.center_2 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 102;
}
.center_1 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  z-index: 101;
}
.center_0 {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;

  &.initialize {
    background-color: rgba(220, 220, 220, 1);
  }

  &.transition {
    background-color: rgba(220, 220, 220, 0.4);
  }
}
</style>
