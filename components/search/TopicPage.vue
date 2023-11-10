<template>
  <v-container class="widget-item">
    <v-row>
      <v-col class="subtitle-1 py-0 h2-title">
        人気の検索
      </v-col>
    </v-row>
    <v-row v-show="!isLoading">
      <v-col>
        <div v-if="isHit">
          <v-list-item
            v-for="(p, index) in topicPages.arr"
            :key="index"
            class="px-0"
            :to="{name: `search-${p.page}`}"
          >
            <v-list-item-title class="subtitle-2" :title="p.name">
              <v-icon v-if="index < 3" :color="getTrophyColor(index)">
                mdi-trophy
              </v-icon>
              {{ p.name }}
            </v-list-item-title>
          </v-list-item>
        </div>
        <div v-else class="subtitle-2">
          最近のアクセスはありません。
        </div>
      </v-col>
    </v-row>
    <v-row v-show="isLoading">
      <v-col>
        <Loading />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface TopicPageIF {
  page: string,
  name: string,
  count: number
}
const topicPages = ref<Record<string, Array<TopicPageIF>>>({
  arr: []
})
const isHit = ref<boolean>(true)
const isLoading = ref<boolean>(true)

onMounted(async () => {
  const res: Array<TopicPageIF> = await $fetch(useRuntimeConfig().public.apiUrl + '/api/topicPage')
  if (res) {
    topicPages.value.arr = res
  }
  isHit.value = !!topicPages.value.arr.length

  isLoading.value = false
})

const getTrophyColor = (index: number) => {
  let color = ''
  switch (index + 1) {
    case 1:
      color = 'yellow'
      break
    case 2:
      color = '#F0EFE8'
      break
    case 3:
      color = '#CD7427'
      break
  }
  return color
}
</script>
