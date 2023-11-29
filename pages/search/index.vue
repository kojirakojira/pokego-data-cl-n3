<template>
  <div>
    <div v-if="!isLoading">
      <v-container>
        <p />
        <h2 class="display-1">
          <v-row>
            <v-col>
              <div class="home">
                <div class="peripper2" />
                <span class="home-text">ホーム</span>
                <div class="peripper" />
              </div>
            </v-col>
          </v-row>
        </h2>
      </v-container>
      <v-container>
        <v-row>
          <v-col class="subtitle-2">
            ペリずかんは、ポケモンGOの個体値を検索したり、種族値を比較したりするためのサイトです。研究目的の使用、豆知識の蓄積に便利です。（多分）
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="7" lg="8" xl="8">
            <v-row>
              <v-col>
                <div v-for="(largeScale, index) in searchCommon().searchPatternNames" :key="index">
                  <h3 style="background: #1E1E1E; color: white;">
                    {{ largeScale.name }}
                  </h3>
                  <v-list>
                    <v-list-item
                      v-for="(value, key) in largeScale.patternNames"
                      :key="key"
                      class="px-0"
                      :to="toSelector(key)"
                    >
                      <v-list-item-title>
                        <v-icon large>
                          mdi-pokemon-go
                        </v-icon>
                        {{ value }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6" md="5" lg="4" xl="4">
            <SearchTopicPage class="my-2" />
            <SearchTopicPokemon class="my-2" />
            <BlogArchive class="my-2 pb-6" />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
const cDtoItem = ref<Record<string, any>>({})
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)
onMounted(() => {
  isLoading.value = false
})

const toSelector = (key: string) => {
  if (key === 'searchAll' ||
    key === 'filterAll' ||
    key === 'race' ||
    key === 'raceDiff' ||
    key === 'scpRankList' ||
    key === 'scpRankMaxMin' ||
    key === 'afterEvoScpRank' ||
    key === 'afterEvoCp' ||
    key === 'threeGalarBirds' ||
    key === 'cpIv' ||
    key === 'cp' ||
    key === 'plList' ||
    key === 'cpRank' ||
    key === 'cpRankList' ||
    key === 'typeScore' ||
    key === 'xType' ||
    key === 'iroiroTypeRank' ||
    key === 'unimplPokemon' ||
    key === 'evoCost' ||
    key === 'evolution') {
    return undefined
  }
  return { name: `search-${key}` }
}
useHead({
  title: 'ホーム',
  meta: [
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'ホーム - ペリずかん' },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'ペリずかんは、ポケモンGOの個体値を検索したり、種族値を比較したりするためのサイトです。研究目的の使用、豆知識の蓄積に便利です。（多分）' },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>

<style scoped>
.home {
  height: 60px;
  display: flex;
  position: relative;
  align-items: center;
  overflow: hidden;
  background-color: #1E1E1E;
  border-bottom: 3px ridge skyblue;
  border-radius: 20px;
}
.home-text {
  font-weight: bold;
  color: white;
  margin: auto;
}
.peripper {
  position: absolute;
  background-image: url(https://static.brainjuice.jp/pokego/peripper-eyes.png);
  width: 111.7px;
  height: 60px;
  background-size: contain;
  right: 0;
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
    rgba(30,30,30,1) 0%,
    rgba(30,30,30,0.5) 40%,
    rgba(30,30,30,0) 100%);
}
.peripper2 {
  position: absolute;
  background-image: url(https://static.brainjuice.jp/pokego/peripper-eyes.png);
  width: 111.7px;
  height: 60px;
  background-size: contain;
  left: 0;
}
.peripper2::after {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    270deg,
    rgba(30,30,30,1) 0%,
    rgba(30,30,30,0.5) 40%,
    rgba(30,30,30,0) 100%);
}
</style>
~/stores/historyState
