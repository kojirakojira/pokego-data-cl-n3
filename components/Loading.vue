<template>
  <ClientOnly>
    <VueLoadingOverlay
      :active="true"
      :is-full-page="fullPage"
      class="text-center my-8"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import VueLoadingOverlay from 'vue-loading-overlay'

withDefaults(
  defineProps<{ fullPage?: boolean }>(),
  { fullPage: false }
)
</script>
