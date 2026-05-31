<template>
  <v-container :class="$style.citation_container">
    <div :class="$style.title_area" role="button" tabindex="0" @click="toggleExpand" @keypress.enter="toggleExpand">
      <div :class="$style.title_left">
        <v-icon icon="mdi-book-open-variant" class="mr-2" color="black" />
        <span :class="$style.title_text">{{ title }}</span>
      </div>
      <v-icon :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" color="black" />
    </div>

    <v-expand-transition>
      <div v-show="isExpanded" class="mt-4">
        <v-list bg-color="transparent" class="pa-0">
          <v-list-item
            v-for="(item, index) in citations"
            :key="index"
            :href="item.url"
            :target="target"
            rel="noopener noreferrer"
            :class="$style.list_item"
          >
            <template v-if="item.favicon" #prepend>
              <v-avatar size="24" class="mr-3">
                <v-img :src="item.favicon" alt="favicon" />
              </v-avatar>
            </template>
            <template v-else #prepend>
              <v-icon icon="mdi-link-variant" size="small" class="mr-3" color="grey-darken-1" />
            </template>

            <v-list-item-title :class="$style.item_title">
              {{ item.title }}
              <v-icon
                v-if="showExternalIcon"
                icon="mdi-open-in-new"
                size="x-small"
                class="ml-1 pb-1"
                color="grey-darken-1"
              />
            </v-list-item-title>

            <v-list-item-subtitle v-if="item.author || item.publishedAt" :class="$style.item_subtitle">
              <span v-if="item.author" :class="$style.author">{{ item.author }}</span>
              <span v-if="item.publishedAt" class="ml-2">{{ item.publishedAt }}</span>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 参考文献リストを表示するコンポーネント
 */

export interface CitationItem {
  title: string; // 記事のタイトル
  url: string; // リンク先URL
  author?: string; // サイト名（例: "公式ブログ", "Qiita" など）
  publishedAt?: string; // 公開日（任意）
  favicon?: string; // サイトのアイコンURL（任意）
}

interface Props {
  citations: CitationItem[];
  title?: string;
  showExternalIcon?: boolean;
  target?: '_blank' | '_self';
}

withDefaults(defineProps<Props>(), {
  title: '参考',
  showExternalIcon: true,
  target: '_blank'
})

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style lang="css" module>
.citation_container {
  margin-top: 24px;
  padding: 16px;
  border: 2px solid #ccc;
  border-radius: 12px;
  background-color: white;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);
  max-width: 100% !important;
}

.title_area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 4px solid #69dce0;
  cursor: pointer;
  transition: opacity 0.2s ease-out;
}

.title_area:hover {
  opacity: 0.7;
}

.title_left {
  display: flex;
  align-items: center;
}

.title_text {
  font-weight: bold;
  font-size: 1.2rem;
  color: black;
  letter-spacing: 0.05em;
}

.list_item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease-out;
  background-color: #fafafa;
}

.list_item:hover {
  transform: translateY(-2px);
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
}

.item_title {
  white-space: normal !important;
  font-size: 1rem;
  font-weight: 700;
  color: #222;
  line-height: 1.4;
}

.item_subtitle {
  margin-top: 6px;
  font-size: 0.8rem;
  opacity: 1 !important;
}

.source_tag {
  background-color: #e0e0e0;
  padding: 2px 8px;
  border-radius: 4px;
  color: #444;
  font-weight: bold;
  font-size: 0.75rem;
}
</style>
