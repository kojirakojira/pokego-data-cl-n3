<template>
  <div>
    <div id="content">
      <h1 class="post-title">
        {{ title }}
      </h1>
      <v-img v-if="mediaLink" :src="mediaLink" class="featured-media" />
      <div class="char-count body-2">
        {{ `文字数: ${wordCnt}` }}
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="postContent" />
      <v-container style="margin-top: 100px;">
        <v-row>
          <v-col cols="11" md="8" lg="8" xl="8">
            <v-card v-if="prev" :to="{ name: 'blog-post-slug', params: { slug: prev.slug }}">
              <div class="d-flex flex-no-wrap justify-space-between">
                <span class="prev-next-arrow">&lt;&lt;</span>
                <v-card-text class="prev-next-text">
                  {{ `前の記事「${prev.title}」` }}
                </v-card-text>
                <v-img class="prev-next-thumbnail" :src="prev.thumbnail" />
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer />
          <v-col cols="11" md="8" lg="8" xl="8">
            <v-card v-if="next" :to="{ name: 'blog-post-slug', params: { slug: next.slug }}">
              <div class="d-flex flex-no-wrap justify-space-between">
                <v-img class="prev-next-thumbnail" :src="next.thumbnail" />
                <v-card-text class="prev-next-text">
                  <span>{{ `次の記事「${next.title}」` }}</span>
                </v-card-text>
                <span class="prev-next-arrow">&gt;&gt;</span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-dialog v-model="dialogFlg" max-width="600px">
      <v-img :src="dialogSrc" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
interface PrevNextIF {
  slug: string,
  title: string,
  thumbnail: string
}
const props = withDefaults(
  defineProps<{
    title: string,
    content: string,
    mediaLink: string,
    prev?: PrevNextIF | null,
    next?: PrevNextIF | null
   }>(),
  { prev: null, next: null }
)

const internalLinkArr = ref<Record<string, Array<any>>>({
  arr: []
})
const dialogSrc = ref<string>('')
const dialogFlg = ref<boolean>(false)

/**
 * 記事本文（表示用）
 */
const postContent = computed((): string => {
  if (!props.content) {
    return ''
  }
  // 文字列をDOM(HTMLDocument)に変換する。
  let domObj: Document = (new DOMParser()).parseFromString(props.content, 'text/html')
  // ペリブログのリンクにマーカーを付ける。
  domObj = editLink(domObj)
  // DOMParserでパースしたDOMオブジェクトを文字列に変換し、返却する。
  const content = new XMLSerializer().serializeToString(domObj)
  // ペリブログの遷移をVueRouterの遷移に置き換える。
  genInternalLink()
  // 画像用のポップアップリンクの生成
  genOverlayImageLink()
  return content
})

/**
 * 文字数
 */
const wordCnt = computed((): number => {
  return removeTag(postContent.value).length
})

/**
 * リンクを編集する。ドメインが「ペリブログ」の場合、
 * internal-link-${cnt}のフォーマットでid属性を生成し、編集したタグにマーカーを付ける。
 *
 * @param domObj 記事のhtml(DOM)
 */
const editLink = (domObj: Document): Document => {
  // href属性をループさせる。
  Object.entries(domObj.links).forEach(([cnt, elem]) => {
    const url: URL = new URL(elem.href)
    if (url.hostname === process.env.VUE_APP_BLOG_DOMAIN) {
      // ブログのドメインがブログカードに指定されていた場合

      // idを生成。hrefを編集。targetを削除（hrefは飾り）
      elem.id = `internal-link-${cnt}`
      elem.href = '/blog/post' + url.pathname
      elem.removeAttribute('target')

      // 配列にidとslugを追加。
      internalLinkArr.value.arr.push({
        id: elem.id,
        slug: url.pathname.replace(/^\/|\/$/g, '') // 前後のスラッシュを除去
      })
    }
  })
  return domObj
}

/**
 * VueRouterで遷移させる。
 * ※hrefで遷移すると、サイトがリロードされてしまうため。
 */
const genInternalLink = (): void => {
  // DOMの更新を待ち、次のイベントループで実行する。
  setTimeout(() => {
    internalLinkArr.value.arr.forEach((link) => {
      // DOMからidを仕込んだタグを取得
      const elem: HTMLElement | null = document.getElementById(link.id)
      if (!elem) { return }
      elem.addEventListener('click', (event: any) => {
        event.preventDefault()
        useRouter().push({ name: 'blog-post-slug', params: { slug: link.slug } })
      })
    })
  }, 0)
}

/**
 * 画像をクリックしたときにポップアップ表示させる。
 */
const genOverlayImageLink = (): void => {
  // DOMの更新を待ち、次のイベントループで実行する。
  setTimeout(() => {
    const elem: HTMLCollectionOf<HTMLImageElement> | undefined =
          document.getElementById('content')?.getElementsByTagName('img')
    if (!elem) {
      return
    }
    Object.entries(elem).forEach(([, e]: [string, HTMLImageElement]) => {
      // ブログカードの場合はポップアップは表示しない。
      if ((e.parentNode as HTMLElement).className !== 'blogcard-figure') {
        e.style.cursor = 'pointer'
        e.addEventListener('click', () => {
          dialogSrc.value = e.src
          dialogFlg.value = true
        })
      }
    })
  }, 0)
}

const removeTag = (arg: string): string => {
  // HTMLタグを除去する。
  return arg.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
}
</script>

<style lang="scss">
#post {

  h1 {
    padding: 12px;
    font-size: 32px;
    color: #000;
    font-weight: normal;
  }

  .featured-media {
    max-width: 800px;
    margin: auto;
      @include display_sp {
        max-width: 80vw;
      }
  }

  #content {
    background-color: white;
    width: 100%;
    overflow: hidden;
    padding-bottom: 100px;

    h2 {
      position: relative;
      background: linear-gradient(
        180deg,
        rgba(255,0,0,0.2) 0%,
        rgba(255,0,0,0.5) 50%,
        white 50%,
        white 85%,
        rgba(0,0,0,0.1) 100%);
      font-size: 26px;
      border: 1px solid black;
      padding: 4px 20px 4px 55px;
      border-radius: 30px;

      &::before {
        position: absolute;
        background-image: url(https://static.brainjuice.jp/pokego/poke-ball.svg);
        background-size: 52px;
        content: "";
        padding: 27px;
        top: -5px;
        left: -5px;
      }

      &:hover::before {
        transform: rotateZ(360deg);
        transform-origin: 46% 50% 0;
        transition-duration: 1s;
      }
    }

    h3 {
      position: relative;
      background: linear-gradient(
        180deg,
        rgba(0,191,255,0.2) 0%,
        rgba(0,191,255,0.5) 50%,
        white 50%,
        white 85%,
        rgba(0,0,0,0.1) 100%);
      font-size: 24px;
      border: 1px solid black;
      padding: 0px 20px 0px 55px;
      border-radius: 30px;
      overflow: unset;

      &::before {
        position: absolute;
        background-image: url(https://static.brainjuice.jp/pokego/super-ball.svg);
        background-size: 50px;
        content: "";
        padding: 26px;
        top: -10px;
        left: -6px;
      }

      &:hover::before {
        transform: rotateZ(360deg);
        transition-duration: 1s;
      }
    }

    h4 {
      position: relative;
      border-top: 2px solid #ccc;
      border-bottom: 2px solid #ccc;

      &::after {
        position: absolute;
        background-image: url(https://static.brainjuice.jp/pokego/peri.gif);
        background-size: 36px;
        content: "";
        padding: 18px;
        top: 0px;
        right: -10%;
      }

      &:hover::after {
        transform: translateX(-100%);
        transition-duration: 5s;
        right: 100%
      }
    }

    h5 {
      position: relative;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      font-weight: normal;
      text-align: left;

      &::before {
        position: absolute;
        background-image: url(https://static.brainjuice.jp/pokego/peri.gif);
        background-size: 36px;
        transform: scaleX(-1);
        content: "";
        padding: 18px;
        top: 0px;
        right: 100%;
      }

      &:hover::before {
        transform: translateX(-100%) scaleX(-1);
        transition-duration: 5s;
        right: -10%
      }
    }

    h6 {
      border-bottom: 1px solid #ccc;
    }
    h2, h3 {
      margin: 2.4em 0em 1em 5px;
      text-align: left;
    }
    h4, h5, h6 {
      margin: 2.4em 0 1em;
      text-align: left;
      font-size: 20px;
      padding: 2px 24px;
    }
    p, ul, ol, figure {
      margin: 24px 12px 0px 12px;
    }
    li {
      margin-left: 20px;
    }
    table {
      padding: 6px;
      border-collapse: collapse;
      overflow-x: auto;
      display: flex;
      white-space: nowrap;
    }
    tr {
      border: solid 1px #dcdcdc;
    }
    tr:nth-child(even) {
      background: #f7f7f7;
    }
    th {
      padding: 4px;
      background: linear-gradient(
        180deg,
        rgba(255,215,0,0.1) 25%,
        rgba(255,215,0,0.7) 100%
      );
      border-bottom: solid 1px black;
    }
    td {
      padding: 4px;
      font-size: 0.875em;
    }

    .char-count {
      text-align: right;
      margin-right: 12px;
    }
    .wp-block-image {
      text-align: center;
      background-color: rgba(0,0,0,0.05);

      figcaption {
        background-color: black;
        font-weight: bold;
        color: white;
      }
    }

    img {
      max-width: 100%;
    }

    .prev-next-thumbnail {
      width: 120px;
      height: 78px;
    }
    .prev-next-text {
      margin: auto 6px;
      padding: 2px;
    }
    .prev-next-arrow {
      margin: auto 6px;
      padding: 6px;
      width: auto;
    }
  }
}

.blogcard {
  padding: 1.4% 2% 1.8%;
  margin: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  line-height: 1.3;
  position: relative;
  overflow: auto;

  .blogcard-figure {
    float: left;
    img {
      width: 160px;
      height: 90px;
      @include display_sp {
        width: 128px;
        height: 72px;
      }
    }
  }

  .blogcard-content {
    margin-left: 170px;
    min-height: 100px;
    overflow: hidden;

    @include display_sp {
      margin-left: 138px;
      min-height: 72px;
    }

    .blogcard-title {
      font-size: 16px;
      font-weight: bold;
      // 折り返し
      overflow: hidden;
      overflow-wrap: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .blogcard-snipet {
      font-size: 14px;
      // 折り返し
      overflow: hidden;
      overflow-wrap: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;

      @include display_sp {
        font-size: 12px;
      }
    }
  }

  .blogcard-sitename {
    font-size: 14px;
    text-align: end;
  }

  a {
    position: absolute;
    top: 0;
    left: 0;
    height:100%;
    width: 100%;
  }
}
</style>
