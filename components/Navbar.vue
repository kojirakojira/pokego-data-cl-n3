<template>
  <div>
    <v-app-bar app color="grey-darken-4 accent-4" height="56">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="ml-0">
        <nuxt-link :to="{ name: 'search' }" class="text-decoration-none d-block" style="width: fit-content;">
          <h1 class="title text-white" style="width: fit-content;">
            ペリずかん
          </h1>
        </nuxt-link>
      </v-app-bar-title>
      <v-tabs v-if="!isSmAndDown" right>
        <v-tab
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :to="menuItem.link"
        >
          {{ menuItem.name }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list density="compact">
        <v-list-item
          v-for="(menuItem, index) in menuItems"
          :key="index"
          class="subtitle-2"
          :to="menuItem.link"
        >
          {{ menuItem.name }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">

const drawer = ref<boolean>(false)
const menuItems = readonly([
  { name: '検索する', link: '/search' },
  { name: 'ヘルプ', link: '/help' }
])

const isSmAndDown = useDisplay().smAndDown
</script>
