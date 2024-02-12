<template>
  <div>
    <!-- ナビゲーションバー -->
    <v-app-bar app color="grey-darken-4 accent-4" height="56">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>
        <nuxt-link :to="{ name: 'search' }" class="title-line">
          <h1 class="title" style="margin-bottom:0px;">
            ペリずかん
          </h1>
        </nuxt-link>
        <div class="peripper" />
      </v-app-bar-title>
      <v-tabs right>
        <v-tab
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :to="menuItem.link"
        >
          {{ menuItem.name }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <!-- TODO: client-onlyはv-navigation-drawerでHydration style mismatchのエラーが出るため一時的に追加している。 -->
    <client-only>
      <v-navigation-drawer v-model="drawer" permanent>
        <v-list density="compact">
          <v-list-item
            v-for="(menuItem, index) in menuItems"
            :key="index"
            :to="menuItem.link"
            style="font-size: 0.875rem;"
          >
            {{ menuItem.name }}
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </client-only>
  </div>
</template>

<script setup lang="ts">

const drawer = ref<boolean>(false)
const menuItems = readonly([
  { name: '検索する', link: '/search' },
  { name: 'ヘルプ', link: '/help' }
])

</script>

<style lang="scss" scoped>
.v-toolbar-title {
  padding-left: 5px !important;
  display: contents;
  align-items: center;
  height:100%;
}
.title-line {
  display: flex;
  overflow: visible !important;
  text-decoration: none;
  color: white;
}
.peripper {
  position: relative;
  background-image: url(https://static.brainjuice.jp/pokego/peripper-eyes.png);
  height: 100%;
  background-size: contain;
  aspect-ratio: 421 / 226;
  margin-left: auto;

  @include display_pc {
    margin-left: 0px;
    margin-right: auto;
  }
}
.peripper::after {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    90deg,
  #1e1e1e 0%,
  rgba(30, 30, 30, 0.4) 30%,
  rgba(30, 30, 30, 0.3) 40%,
  rgba(30, 30, 30, 0.3) 60%,
  rgba(30, 30, 30, 0.4) 70%,
  #1e1e1e 100%);
}
.v-app-bar__nav-icon {
  @include display_pc {
    display: none !important;
  }
}
.v-tabs {
  display: none;
  @include display_pc {
    display: block !important;
  }
}
</style>

<style>
.v-toolbar-title__placeholder {
  display: contents;
}
</style>
