<template>
  <div>
    <div v-if="!isLoading" id="type-comments-base">
      <img :src="editUtils().getUrl('brainjuice/brain-juice-e.png')" class="brain-icon">
      <div :class="`triangle ' + ${theme}`" />
      <div :class="`type-comments-fukidashi ' + ${theme}`">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="mx-0 my-0">
          あ、どうも。サイトの運営者です。
        </p>
        <ul class="px-0 py-0 mx-5 my-0">
          <li
            v-for="(comment, idx) in comments"
            :key="`type-comment-${idx}`"
            class="type-comments-text"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="comment" />
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
const emit = defineEmits<{(e: 'isHit', value: boolean): void}>()
const isLoading = ref<boolean>(true)

const comments = ref<Array<string>>([])

const res: Array<string> = await $fetch(useRuntimeConfig().public.apiUrl + '/api/adminComment')
if (res) {
  comments.value = res
}

onMounted(() => {
  emit('isHit', !!comments.value.length)
  isLoading.value = false
})
// Vuetifyのテーマを取得する（light or dark）
const theme = computed((): string => {
  return useTheme().global.name.value
})

</script>

<style scoped>
#type-comments-base {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 800px;
  margin: auto;
}
.brain-icon {
  position: relative;
  width: 80px;
  height: 80px;
}
.type-comments-fukidashi {
  position: relative;
  width: 100%;
  padding: 10px;
  margin: 10px 20px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 0;
}
.type-comments-fukidashi.light {
  background-color: white;
  border: 3px solid black;
}
.type-comments-fukidashi.dark {
  background-color: black;
  border: 3px solid white;
}
.triangle {
  z-index: 1;
}
.triangle:before {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  left: 86px;
  top: 24px;
  border-right: 15px solid black;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
.triangle.dark:before {
  border-right: 15px solid white;
}
.triangle.light:before {
  border-right: 15px solid black;
}
.triangle:after {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  left: 90px;
  top: 24px;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
.triangle.dark:after {
  border-right: 15px solid black;
}
.triangle.light:after {
  border-right: 15px solid white;
}
.type-comments-text > * {
  margin: 0px;
  font-size: 12px;
}
</style>
