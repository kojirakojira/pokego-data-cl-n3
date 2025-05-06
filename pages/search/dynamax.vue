<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col class="caption">
            ダイマックスバトル、キョダイマックスバトル後に入手できるポケモンのCPを確認できます。<br>
            確認したいポケモンを選択してください。
          </v-col>
        </v-row>
        <v-row>
          <v-col align="right">
            {{ `最終更新日：${cDtoItem.resData?.lastUpdated}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center">
            <div style="width: 600px;">
              <v-list
                v-for="(arr, key, i) in dynamaxDic"
                :key="`max-gmax-list-${i}`"
                v-model:opened="cDtoItem.openDic[`list-open-status-${i}`]"
                class="py-0"
              >
                <v-list-group
                  :value="key"
                  :class="$style.cost_type_area"
                >
                  <template #activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      :title="`${nameDic[key]}(${arr.length})`"
                    />
                  </template>
                  <v-list-item
                    v-for="(item, n) in arr"
                    :key="`dynamax-${n}`"
                    :class="[$style.detail_area, 'ml-8']"
                    :title="item.title"
                    @click="screenControlMethods().onClickRow($event, item)"
                  >
                    <template #prepend>
                      <div class="mx-4" style="width: 40px;">
                        {{ item.no }}
                      </div>
                      <v-avatar :image="item.prependAvatar" />
                    </template>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </div>
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
  get
} from '~/components/interface/dynamaxImplPokemon'
import {
  DynamaxSearchDtoItem
} from '~/components/interface/dynamax'

const searchPattern = 'dynamax'
// current dto item
const cDtoItem = ref<DynamaxSearchDtoItem>(new DynamaxSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

interface Item {
  prependAvatar: string,
  title: string,
  id: string,
  no: string
}
interface MaxGmaxDic {
  dynamax: Array<Item>,
  gigantamax: Array<Item>
}

const dynamaxDic = computed((): MaxGmaxDic => {
  if (!cDtoItem.value.resData) {
    return {
      dynamax: [],
      gigantamax: []
    }
  }
  const dynamaxArr: Array<Item> = cDtoItem.value.resData.dynamaxList
    .filter((gp: GoPokedex) => gp.dynamaxImplFlg)
    .map((gp: GoPokedex) => {
      return {
        prependAvatar: editUtils().getPokemonImageUrl(gp.image1),
        title: editUtils().appendRemarks(gp.name, gp.remarks),
        id: gp.pokedexId,
        no: editUtils().getPdxNo(gp.pokedexId)
      }
    })
  const gigantamaxArr: Array<Item> = cDtoItem.value.resData.dynamaxList
    .filter((gp: GoPokedex) => gp.gigantamaxImplFlg)
    .map((gp: GoPokedex) => {
      return {
        prependAvatar: editUtils().getPokemonImageUrl(gp.image1),
        title: editUtils().appendRemarks(gp.name, gp.remarks),
        id: gp.pokedexId,
        no: editUtils().getPdxNo(gp.pokedexId)
      }
    })
  return {
    dynamax: dynamaxArr,
    gigantamax: gigantamaxArr
  }
})

const nameDic: Record<string, string> = {
  dynamax: 'ダイマックス',
  gigantamax: 'キョダイマックス'
}

/**
 * 画面制御用機能
 */
const screenControlMethods = () => {
  /** 初期表示時の処理 */
  const init = async (): Promise<void> => {
    // 画面を復元する
    searchCommon().restoreSearchScreen(['resData', 'openDic'], cDtoItem.value)
    // dtoStoreからresDataを復元
    const rd: DynamaxImplPokemonResponse | null | undefined = cDtoItem.value.resData

    if (rd) {
      cDtoItem.value.resData = rd
    } else {
      // 存在しない場合は取得する
      const ret = await get()
      if (!ret) { return }
      cDtoItem.value.resData = ret as DynamaxImplPokemonResponse
    }
    initOpenDic()
    isLoading.value = false
  }

  const initOpenDic = () => {
    if (Object.keys(cDtoItem.value.openDic).length) {
    // 復元できている場合は何もしない
      return
    }

    // 復元できない場合は、openDicを初期化する
    const openDic = cDtoItem.value.openDic
    Object.keys(dynamaxDic.value).forEach((key, i) => {
      openDic[`list-open-status-${i}`] = [key]
    })
  }
  /**
   * v-listの行をクリックしたときの処理
   * @param _
   * @param selected
   */
  const onClickRow = (_: Event, selected: Item) => {
    useRouter().push({
      name: 'search-result-dynamaxResult',
      query: {
        pid: selected.id
      }
    })
  }
  return {
    init,
    initOpenDic,
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

<style lang="scss" module>
.cost_type_area {
  border: thin solid rgba(0, 0, 0, 0.12);

  &:not(:last-child) {
    border-bottom: none;
  }

  .detail_area {
    border-top: thin solid rgba(0, 0, 0, 0.12);
    border-left: thin solid rgba(0, 0, 0, 0.12);
  }
}
</style>
