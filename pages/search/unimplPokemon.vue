<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container v-if="cDtoItem.resData">
        <v-row>
          <v-col class="text-right">
            {{ `最終更新日：${cDtoItem.resData.lastUpdated}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-right">
            {{ `未実装ポケモン数：${unimplList.length}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list item-props lines="three" variant="elevated">
              <v-list-item
                v-for="(item, i) in unimplList"
                :key="`dynamax-${i}`"
                :title="item.title"
                :subtitle="item.subtitle"
                @click="screenControlMethods().onClickRow($event, item)"
              >
                <template #prepend>
                  <v-avatar :image="item.prependAvatar" />
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <v-row class="my-0">
          <v-col class="text-right">
            <p class="link" @click="transitionUtils().filterAll({ impled: true, negaImpled: true })">
              未実装ポケモンを詳細に絞り込む >>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SimpPokemon } from '~/components/interface/api/dto'
import {
  type UnimplPokemonResponse,
  UnimplPokemonResultDtoItem,
  get
} from '~/components/interface/unimplPokemon'

const searchPattern = 'unimplPokemon'
// current dto item
const cDtoItem = ref<UnimplPokemonResultDtoItem>(new UnimplPokemonResultDtoItem())
const dto = useAttrs().dto as PageDto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)

// created: 画面を復元する
const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
const rd: UnimplPokemonResponse | null = restoredParams?.resData

if (rd) {
  // resDataが復元できた場合
  cDtoItem.value.resData = rd
} else {
  // 存在しない場合は取得する
  // 入力チェック不要
  const ret = cDtoItem.value.resData = await get()
  cDtoItem.value.resData = ret
}

interface Item {
  prependAvatar: string,
  title: string,
  subtitle: string,
  id: string
}
const unimplList = computed(() => {
  const arr: Array<Item> = cDtoItem.value.resData.unimplList.map((sp: SimpPokemon) => {
    return {
      prependAvatar: editUtils().getPokemonImageUrl(sp.image1),
      title: editUtils().appendRemarks(sp.name, sp.remarks),
      subtitle: sp.gen,
      id: sp.pokedexId
    }
  })
  return arr
})

/**
 * 画面制御用機能
 */
const screenControlMethods = () => {
  /**
   * v-listの行をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: Event, selected: Item) => {
    useRouter().push({
      name: searchCommon().getRouteName('abundance', true),
      query: {
        pid: selected.id
      }
    })
  }
  return {
    onClickRow
  }
}

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'ポケモンGO未実装ポケモンの一覧を閲覧することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
