<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            相手のポケモン
          </v-col>
          <v-col cols="12" md="4" lg="4" xl="4">
            <v-select
              v-model="cDtoItem.searchParams.oppType1"
              :items="constant.TYPE"
              item-value="type"
              item-title="jpn"
              label="タイプ1を入力"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4" lg="4" xl="4">
            <v-select
              v-model="cDtoItem.searchParams.oppType2"
              :items="constant.TYPE"
              item-value="type"
              item-title="jpn"
              label="タイプ2を入力(任意)"
              clearable
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            自分のポケモン
            <v-checkbox
              v-model="allCheck"
              label="すべて選択"
              hide-details
              color="success"
            />
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <div class="d-flex flex-wrap">
              <v-checkbox
                v-for="t in constant.TYPE"
                :key="`TYPE-${t}`"
                v-model="cDtoItem.searchParams.ownTypes"
                :label="t.jpn"
                :value="t.type"
                hide-details
                multiple
                color="info"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            天候
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-select
              v-model="cDtoItem.searchParams.weather"
              :items="constant.WEATHER"
              item-value="k"
              item-title="v"
              label="天気を入力(任意)"
              clearable
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            メガシンカ
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-radio-group
              v-model="cDtoItem.searchParams.megaSelected"
              :disabled="isShadowOnly"
              color="info"
              inline
              row
            >
              <v-radio label="含める" value="include" />
              <v-radio label="除く" value="except" />
              <v-radio label="だけにする" value="only" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            シャドウ
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-radio-group
              v-model="cDtoItem.searchParams.shadowSelected"
              :disabled="isMegaOnly"
              color="info"
              inline
              row
            >
              <v-radio label="含める" value="include" />
              <v-radio label="除く" value="except" />
              <v-radio label="だけにする" value="only" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            最強 or 最弱
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-radio-group
              v-model="cDtoItem.searchParams.order"
              color="info"
              inline
              row
            >
              <v-radio label="最強" value="desc" />
              <v-radio label="最弱" value="asc" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
            <v-icon>
              mdi-pen
            </v-icon>
            ポケモンの重複を除去する
            <SearchInputHelpMsg>
              「する」にした場合、最も上位の技構成のみを表示します。（シャドウ、メガシンカ、通常状態はそれぞれ独立したポケモンとして扱います。）
            </SearchInputHelpMsg>
          </v-col>
          <v-col cols="12" md="8" lg="8" xl="8">
            <v-switch
              v-model="cDtoItem.searchParams.unique"
              inset
              color="info"
              hide-details
              :label="cDtoItem.searchParams.unique ? 'する' : 'しない'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isSearchBtnClick"
              @click="screenControlMethods().clickSearchBtn"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- <template v-if="cDtoItem.pokemonSearchResult && cDtoItem.pokemonSearchResult?.goPokedexList.length > 1">
        <SearchResultList
          :psr="cDtoItem.pokemonSearchResult"
          @click-row="searchCommon().clickRowResultList($event, searchPattern, cDtoItem.searchParams)"
        />
      </template> -->
    </div>
    <div v-show="isLoading">
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GymRaidPinnacleRankSearchDtoItem,
  type GymRaidPinnacleRankResponse,
  get,
  check,
  GymRaidPinnacleRankSearchParams
} from '~/components/interface/gymRaidPinnacleRank'

const searchPattern = 'gymRaidPinnacleRank'
// current dto item
const cDtoItem = ref<GymRaidPinnacleRankSearchDtoItem>(new GymRaidPinnacleRankSearchDtoItem())
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(false)
const isSearchBtnClick = ref<boolean>(false)

const constant: ConstantValue = constantUtils().get()

const typeLength: number = constant.TYPE.length
const allCheck = computed({
  get () {
    return typeLength === cDtoItem.value.searchParams.ownTypes.length
  },
  set (newVal) {
    cDtoItem.value.searchParams.ownTypes.splice(0)
    if (newVal) {
      cDtoItem.value.searchParams.ownTypes.push(...constant.TYPE.map(type => type.type))
    }
  }
})

// メガとシャドウはいずれかしかonlyにできない
const isMegaOnly = computed(() => cDtoItem.value.searchParams.megaSelected === 'only')
const isShadowOnly = computed(() => cDtoItem.value.searchParams.shadowSelected === 'only')

const screenControlMethods = () => {
  /** 初期表示時の処理 */
  const init = () => {
    // created: 画面を復元する
    searchCommon().restoreSearchScreen(['searchParams', 'pokemonSearchResult'], cDtoItem.value)
  }

  const clickSearchBtn = async () => {
    isSearchBtnClick.value = true
    const msg = check(cDtoItem.value.searchParams)
    if (msg) {
      alert(msg)
      isSearchBtnClick.value = false
      return
    }
    // if (cDtoItem.value.searchParams.pid) {
    // // pidが存在する場合
    //   transitionResultPage(cDtoItem.value.searchParams.pid, cDtoItem.value.searchParams)
    //   return
    // }
    isLoading.value = true
    const res = await get(cDtoItem.value.searchParams)
    if (!res || !res.success) {
      isSearchBtnClick.value = false
      isLoading.value = false
      return
    }
    handleApiResult(res)
  }

  /**
   * APIのレスポンスを処理する。
   *
   * @param rd
   */
  const handleApiResult = (rd: GymRaidPinnacleRankResponse) => {
    if (rd.success) {
      transitionResultPage(rd.pokedexId, cDtoItem.value.searchParams, rd)
      // cDtoItem.value.pokemonSearchResult = rd.pokemonSearchResult
      // if (rd.pokemonSearchResult.unique) {
      //   // 1件のみヒットした場合
      //   transitionResultPage(rd.pokedexId, cDtoItem.value.searchParams, rd)
      // } else {
      //   // 複数件 or 0件ヒットした場合
      //   useRouter().replace({
      //     name: searchCommon().getRouteName('gymRaidPinnacleRank')
      //   })
      //   isSearchBtnClick.value = false
      //   isLoading.value = false
      // }
    }
  }

  /**
   * result画面に遷移する
   * ここで遷移する場合は、ポケモンが一意に特定できている
   *
   * @param pid
   * @param searchParams
   * @param resData
   */
  const transitionResultPage = (pid: string, searchParams: GymRaidPinnacleRankSearchParams, resData?: GymRaidPinnacleRankResponse): void => {
    // result画面にresDataをセット
    const pathName: string = searchCommon().getRouteName('gymRaidPinnacleRank', true)
    const params: Record<string, any> = {}
    if (resData) { params.resData = resData }
    dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
      pathName,
      {},
      params,
      true
    ))
    // 遷移
    useRouter().push({
      name: pathName,
      query: searchCommon().makeQuery(pid, searchParams)
    })
  }
  return {
    init,
    clickSearchBtn
  }
}

screenControlMethods().init()

useHead({
  title: searchCommon().getSearchPatternName(searchPattern),
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${searchCommon().getSearchPatternName(searchPattern)} - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: '個体値、PLを入力することにより、CPを求めることができます。' },
    { property: 'og:image', content: editUtils().getUrl('pokego/peripper-eyes.png') }
  ]
})
</script>
