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
          src="/img/brain-juice.png"
          class="center-1"
        >
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
// import { useTheme } from 'vuetify'
import '@/assets/styles/spinners.css'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { dtoStore, ScreenInfo } from '~/stores/dtoStore'
// const theme = useTheme()
const isLoading = ref(true)
onMounted(() => {
  // theme.global.name.value = 'dark'
  // display.theme.dark = this.$store.getters.darkTheme
  isLoading.value = false
})

const dto = ref<Record<string, any>>({
  params: {}
})

const createAfterScreenInfo = (route: RouteLocationNormalized, history: History): ScreenInfo => {
  return {
    pathName: route.name ? route.name.toString() : '',
    position: history.state.position,
    query: route.query,
    params: {}
  }
}

onMounted(() => {
  // 最初にリロードされたときはafterEachは呼ばれない。手動で呼ぶ。
  const route = useRoute()
  dtoStore().afterEachAction(createAfterScreenInfo(route, window.history))
})

useRouter().afterEach((to: RouteLocationNormalized) => {
  dtoStore().afterEachAction(createAfterScreenInfo(to, window.history))
})

useRouter().beforeEach((
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext) => {
  dtoStore().beforeEachAction({
    pathName: from.name ? from.name.toString() : '',
    position: 0, // ここの値は使用してない。
    query: from.query,
    params: JSON.parse(JSON.stringify(dto.value)).params
  })

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
