<template>
  <v-container class="widget-item">
    <v-row>
      <v-col class="subtitle-1 py-0 h2-title">
        最新記事一覧
      </v-col>
    </v-row>
    <v-row v-if="!isErr" v-show="!isLoading">
      <v-col
        v-for="art in articles.arr"
        :key="art.id"
        class="py-1"
      >
        <v-card
          class="mx-auto"
          max-width="400"
          :to="{ name: 'blog-post-slug', params: { slug: art.slug }}"
        >
          <v-img
            :src="art._embedded['wp:featuredmedia']
              ? art._embedded['wp:featuredmedia'][0].source_url
              : editUtils().getUrl('/img/no-image.png')"
            cover
            height="100"
          >
            <div class="publ-date">
              {{ dateFormat(art.date) }}
            </div>
          </v-img>
          <v-card-title class="py-2">
            <span class="subtitle-2 text-truncate-row2">{{ art.title.rendered }}</span>
          </v-card-title>
          <v-card-text>
            <span class="text-truncate-row3 caption">{{ removeTag(art.content.rendered) }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="subtitle-2">
        取得に失敗しました。
      </v-col>
    </v-row>
    <v-row v-show="isLoading">
      <v-col>
        <Loading split-scr />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import moment from 'moment'

const articles = ref<Record<string, Array<any>>>({
  arr: []
})
const isLoading = ref<boolean>(true)
const isErr = ref<boolean>(false)

const dateFormat = (arg: string): string => {
  return moment(arg).format('YYYY/MM/DD')
}
const removeTag = (arg: string): string => {
  // HTMLタグを除去する。
  return arg.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
}

onMounted(async () => {
  // _embedでサムネイル情報も取得している。公開日順、5件まで
  await $fetch(useRuntimeConfig().public.blogUrl + '/wp-json/wp/v2/posts?_embed&orderby=date&per_page=5')
    .then((res) => {
      articles.value.arr = (res as Array<any>)
    })
    .catch(() => {
      isErr.value = true
    })
  isLoading.value = false
  // await axios.get(process.env.VUE_APP_BLOG_URL + '/wp-json/wp/v2/posts?_embed&orderby=date&per_page=5')
  //   .then((res) => {
  //     this.articles = res.data
  //   })
  //   .catch(() => {
  //     this.isErr = true
  //   })
})
</script>

<style lang="scss">
.publ-date {
    position: absolute;
    bottom: 0px;
    right: 0px;
    white-space: nowrap;
    overflow: hidden;
    background-color: black;
    color: white;
    text-align: center;
    font-weight:bold !important;
    font-size: 10px;
    padding: 0px 5px;
    border-radius: 2px;
}
/** text-truncate-row${i}を生成。複数行でtext-overflow: ellipsisをやる。 */
.text-truncate {
  $i: 2;
  @while $i <= 4 {
    &-row#{$i} {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: $i;
    }
    $i: $i + 1;
  }

}
</style>
