<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col class="caption">
            ポケモンGOにおいて、ダイマックス、キョダイマックスが実装されているポケモンのリストです。
          </v-col>
        </v-row>
        <v-row>
          <v-col align="right">
            {{ `最終更新日：${cDtoItem.resData?.lastUpdated}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" lg="6" xl="6">
            <h3>ダイマックス</h3>
            <v-container>
              <v-row>
                <v-col align="right">
                  {{ `ダイマックス実装済みポケモン数：${dynamaxList.length}` }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-list item-props variant="elevated">
                    <v-list-item
                      v-for="(item, i) in dynamaxList"
                      :key="`dynamax-${i}`"
                      :title="item.title"
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
                <v-col align="right">
                  <p class="link" @click="transitionUtils().filterAll({ dynamax: true })">
                    ダイマックスを詳細に絞り込む >>
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" md="12" lg="6" xl="6">
            <h3>キョダイマックス</h3>
            <v-container>
              <v-row>
                <v-col align="right">
                  {{ `キョダイマックス実装済みポケモン数：${gigantamaxList.length}` }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-list item-props variant="elevated">
                    <v-list-item
                      v-for="(item, i) in gigantamaxList"
                      :key="`dynamax-${i}`"
                      :title="item.title"
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
                <v-col align="right">
                  <p class="link" @click="transitionUtils().filterAll({ gigantamax: true })">
                    キョダイマックスを詳細に絞り込む >>
                  </p>
                </v-col>
              </v-row>
            </v-container>
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
import { GoPokedex } from '~/components/interface/api/dto'
import {
  type DynamaxImplPokemonResponse,
  DynamaxImplPokemonResultDtoItem,
  get
} from '~/components/interface/dynamaxImplPokemon'

const searchPattern = 'dynamaxImplPokemon'
// current dto item
const cDtoItem = ref<DynamaxImplPokemonResultDtoItem>(new DynamaxImplPokemonResultDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

interface Item {
  prependAvatar: string,
  title: string,
  id: string
}
const dynamaxList = computed(() => {
  const arr: Array<Item> = cDtoItem.value.resData.dynamaxList
    .filter((gp: GoPokedex) => gp.dynamaxImplFlg)
    .map((gp: GoPokedex) => {
      return {
        prependAvatar: editUtils().getPokemonImageUrl(gp.image1),
        title: editUtils().appendRemarks(gp.name, gp.remarks),
        id: gp.pokedexId
      }
    })
  return arr
})

const gigantamaxList = computed(() => {
  const arr: Array<Item> = cDtoItem.value.resData.dynamaxList
    .filter((gp: GoPokedex) => gp.gigantamaxImplFlg)
    .map((gp: GoPokedex) => {
      return {
        prependAvatar: editUtils().getPokemonImageUrl(gp.image1),
        title: editUtils().appendRemarks(gp.name, gp.remarks),
        id: gp.pokedexId
      }
    })
  return arr
})

/**
 * 画面制御用機能
 */
const screenControlMethods = () => {
  const init = async (): Promise<void> => {
    // dtoStoreからresDataを復元
    const restoredParams: Record<string, any> | null = searchCommon().restoreCurrentScreen(['resData'])
    const rd: DynamaxImplPokemonResponse | null = restoredParams?.resData

    if (rd) {
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      const ret = await get()
      if (!ret) { return }
      cDtoItem.value.resData = ret as DynamaxImplPokemonResponse
    }
    isLoading.value = false
  }
  /**
   * v-listの行をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: PointerEvent, selected: Item) => {
    useRouter().push({
      name: 'search-result-abundance',
      query: {
        pid: selected.id
      }
    })
  }
  return {
    init,
    onClickRow
  }
}

await screenControlMethods().init()

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: 'ポケモンGOにおけるダイマックス、キョダイマックス実装済みポケモンの一覧を閲覧することができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
