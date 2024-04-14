<template>
  <v-app class="center-0">
    <v-container>
      <v-row>
        <v-spacer />
        <v-col style="text-align: -webkit-center;">
          <v-img
            :src="editUtils().getUrl('brainjuice/brain-juice-r.png')"
            width="200"
            height="200"
          />
        </v-col>
        <v-spacer />
      </v-row>
      <v-row>
        <v-col class="text-center">
          <div class="headline font-weight-bold">
            {{ dispMessage }}
          </div>
          <div v-if="error?.statusCode">
            {{ `HTTP status: ${error.statusCode}` }}
          </div>
          <NuxtLink to="/search">
            ホームへ移動する
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
const error: any = useError()
// 表示メッセージ
const dispMessage = computed(() => {
  if (error.value?.message) {
    return error.value.message
  }
  return error.value?.statusCode === 404 ? '404 Not Found' : '例外が発生しました。'
})
</script>

<style scoped>
h1 {
  font-size: 20px;
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
