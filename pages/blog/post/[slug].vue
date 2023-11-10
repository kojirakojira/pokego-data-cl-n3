<template>
  <div>
    <div id="post">
      <p id="blog-name">
        ペリぶろぐ
      </p>
      <client-only>
        <v-container class="ma-auto px-2">
          <v-row>
            <v-col>
              <template v-if="!isLoading">
                <BlogPost
                  :title="postInfo.title"
                  :content="postInfo.content"
                  :media-link="postInfo.mediaLink"
                  :prev="postInfo.prev"
                  :next="postInfo.next"
                />
              <!-- <CommentForm :form="commentForm" class="my-3 py-3" @click="submitCommentForm" /> -->
              </template>
              <Loading v-else />
            </v-col>
          </v-row>
        </v-container>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">

const isLoading = ref<boolean>(true)
const postInfo: Record<string, any> = {}

// スラッグ（WordPressにおける記事を特定するためのエンドポイント的なやつ。）
const slug = useRoute().params.slug
// WordPressのURL
const url = `${useRuntimeConfig().public.blogUrl}/wp-json/wp/v2/posts?_embed&slug=${slug}`
const res: any = await fetchCommon(url, 'GET')
  .catch(() => {})

if (!res.data || !res.data[0]) {
  postInfo.content = '<p></p><span class="headline">記事の取得に失敗しました。</span><p></p>'
}

const rd = res.data[0]
postInfo.id = rd ? rd.id : 0 // 記事ID
postInfo.title = rd ? rd.title.rendered : '' // 記事タイトル
postInfo.content = rd ? rd.content.rendered : postInfo.content // 記事本文
postInfo.prev = rd ? rd.prev : null // 前の記事
postInfo.next = rd ? rd.next : null // 次の記事

// アイキャッチ画像
// res.data._embedded.wp:featuredmedia[0].linkが存在してたらアイキャッチ画像が存在する。
const wpfm = 'wp:featuredmedia'
postInfo.mediaLink = (rd && rd._embedded[wpfm] && rd._embedded[wpfm][0].link)
  ? rd._embedded[wpfm][0].link
  : ''

// OGP情報の生成
const content = postInfo.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
const ogpInfo = {
  title: postInfo.title,
  content: content.length > 100 ? content.substring(0, 200) : content,
  image: postInfo.mediaLink
}

isLoading.value = false

useHead({
  title: `${ogpInfo.title} - ペリぶろぐ`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpInfo.title} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: ogpInfo.content },
    { property: 'og:image', content: ogpInfo.image }
  ]
})
</script>

<style lang="scss" scoped>
#post {
  background-color: #f3f4f5;

  #blog-name {
    background-color: gold;
    padding: 24px;
    font-weight: bold;
    font-size: 28px;
  }
}
</style>
