<template>
  <div>
    <MajorPartsH2Common>
      {{ searchCommon().getSearchPatternName(searchPattern) }}
    </MajorPartsH2Common>
    <div v-if="!isLoading">
      <v-container v-if="cDtoItem.resData.typeComments">
        <v-row>
          <v-col>
            <SearchTypeComments
              :comments="cDtoItem.resData.typeComments"
              :type1="cDtoItem.resData.type1"
              :type2="cDtoItem.resData.type2"
              :name="cDtoItem.resData.name"
              :remarks="cDtoItem.resData.remarks"
            />
          </v-col>
        </v-row>
      </v-container>
      <h3>
        評価
        <v-tooltip bottom>
          <template #activator="{ props }">
            <v-icon
              small
              v-bind="props"
            >
              mdi-help-circle
            </v-icon>
          </template>
          <span>有利・不利タイプの数から加点・減点し、タイプごとの評価を算出しています。</span>
        </v-tooltip>
      </h3>
      <v-container>
        <v-row>
          <v-col class="col-title">
            こうげき時のタイプ評価
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pa-3">
            タイプ1:
            <span
              :style="`background-color: ${typeDic.attacker1.color};'}`"
              class="type"
            >
              {{ constantUtils().getValue(cDtoItem.searchParams.type1, constantUtils().value.TYPE) }}
            </span>
          </v-col>
          <v-col>
            <div class="rating">
              <v-rating
                v-model="typeDic.attacker1.vRatingScore"
                half-increments
                readonly
                density="comfortable"
                :active-color="typeDic.attacker1.color"
              />
              <span class="pl-2">{{ cDtoItem.resData.attacker1Score + '点' }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="typeDic.attacker2">
          <v-col class="pa-3">
            タイプ2:
            <span
              :style="`background-color: ${typeDic.attacker2.color};'}`"
              class="type"
            >
              {{ constantUtils().getValue(cDtoItem.searchParams.type2, constantUtils().value.TYPE) }}
            </span>
          </v-col>
          <v-col>
            <div class="rating">
              <v-rating
                v-model="typeDic.attacker2.vRatingScore"
                half-increments
                readonly
                density="comfortable"
                :active-color="typeDic.attacker2.color"
              />
              <span class="pl-2">{{ cDtoItem.resData.attacker2Score + '点' }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-title">
            ぼうぎょ時のタイプ評価
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pa-3">
            タイプ:
            <span
              :style="`background-color: ${typeDic.attacker1.color};'}`"
              class="type"
            >
              {{ constantUtils().getValue(cDtoItem.searchParams.type1, constantUtils().value.TYPE) }}
            </span>
            <span
              v-if="cDtoItem.searchParams.type2"
              :style="typeDic.attacker2 && `background-color: ${typeDic.attacker2.color}; margin-left: 3px;'}`"
              class="type"
            >
              {{ constantUtils().getValue(cDtoItem.searchParams.type2, constantUtils().value.TYPE) }}
            </span>
          </v-col>
          <v-col>
            <div class="rating">
              <v-rating
                v-model="typeDic.defender.vRatingScore"
                half-increments
                readonly
                density="comfortable"
                :active-color="typeDic.defender.color"
              />
              <span class="pl-2">{{ cDtoItem.resData.defenderScore + '点' }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <!-- こうげき倍率 -->
      <v-tooltip bottom>
        <template #activator="{ props }">
          <h3 v-bind="props">
            こうげき倍率
            <v-icon small>
              mdi-help-circle
            </v-icon>
          </h3>
        </template>
        <span>ポケモンGOにおけるダメージ倍率は、ポケモンの原作のシリーズとは少し違った考え方です。
          しかし、こうげき時のダメージ倍率の考え方はほぼ同じであり、×1.6は抜群、×0.625は軽減、×0.390625は無効に対応します。また、タイプ一致のダメージ倍率は×1.2です。</span>
      </v-tooltip>
      <SearchTypeAtkDmgMult
        :type1="cDtoItem.searchParams.type1"
        :type2="cDtoItem.searchParams.type2"
        :def-type-dic1="cDtoItem.resData.attackerType1Map"
        :def-type-dic2="cDtoItem.resData.attackerType2Map"
      />
      <!-- ぼうぎょ倍率 -->
      <h3>ぼうぎょ倍率</h3>
      <SearchTypeDefDmgMult
        :type1="cDtoItem.searchParams.type1"
        :type2="cDtoItem.searchParams.type2"
        :atk-type-dic="cDtoItem.resData.defenderTypeMap"
      />
    </div>
    <div v-else>
      <Loading full-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type RouteLocationNormalizedLoaded } from 'vue-router'
const searchPattern = 'typeScore'
interface TypeInfo {
  jpn: string,
  color: string,
  vRatingScore: number
}
interface TypeDic {
  attacker1: TypeInfo,
  attacker2: TypeInfo | null | undefined,
  defender: TypeInfo
}
const typeDic = ref<TypeDic>({
  attacker1: { jpn: '', color: '', vRatingScore: 0 },
  attacker2: { jpn: '', color: '', vRatingScore: 0 },
  defender: { jpn: '', color: '', vRatingScore: 0 }
})
// current dto item
const cDtoItem = ref<ResultDtoItem>({
  searchParams: {
    pid: '',
    type1: null,
    type2: null
  },
  resData: {}
})
const dto: any = useAttrs().dto
dto.params = cDtoItem

const isLoading = ref<boolean>(true)

// APIアクセス用get関数
const get = async (): Promise<Record<string, any>> => {
  const res = await fetchCommon('/api/typeScore', 'GET', {
    query: cDtoItem.value.searchParams
  })
  const rd: Record<string, any> = res.data || {}
  if (!searchCommon().pushToast(rd?.message, rd?.msgLevel)) {
    return {}
  }
  return rd
}

/**
 * タイプを表す構造体を生成する。
 */
const createTypeDic = (type1: string, type2: string | null, resData: Record<string, any>): TypeDic => {
  // 2捨3入の関数
  const round2to3 = (score: number) => { return Math.round(score * 2) / 2 }
  const type1Jpn: string = constantUtils().getValue(type1, constantUtils().value.TYPE) as string
  const type2Jpn: string | null | undefined = type2 && constantUtils().getValue(type2, constantUtils().value.TYPE)
  const attacker1: TypeInfo = {
    jpn: type1Jpn,
    color: editUtils().getRGB(type1),
    vRatingScore: round2to3(resData.attacker1Score)
  }
  let attacker2: TypeInfo | undefined
  if (type2) {
    attacker2 = {
      jpn: type2Jpn as string,
      color: editUtils().getRGB(type2),
      vRatingScore: round2to3(resData.attacker2Score)
    }
  }
  const defender: TypeInfo = {
    jpn: type1Jpn + (type2Jpn ? ',' + type2Jpn : ''),
    color: editUtils().getRGB(type1, type2),
    vRatingScore: round2to3(resData.defenderScore)
  }
  return { attacker1, attacker2, defender }
}

/**
  * searchParams, resDataのセット
  */
const route: RouteLocationNormalizedLoaded = useRoute()
cDtoItem.value.searchParams = {
  pid: route.query.pid,
  type1: route.query.type1,
  type2: route.query.type2
}
// dtoStoreからresDataを復元
const rd: Record<string, any> | null = searchCommon().restoreResData()

if (rd) {
  cDtoItem.value.resData = rd
} else {
  // 存在しない場合は取得する
  cDtoItem.value.resData = await get()
}
// API側の仕様として、タイプ1に値がなく、タイプ2に値がある場合は、タイプ2にタイプ1の値が設定される。
// そのため、再セットする。
cDtoItem.value.searchParams.type1 = cDtoItem.value.resData?.type1
cDtoItem.value.searchParams.type2 = cDtoItem.value.resData?.type2

typeDic.value = createTypeDic(
  cDtoItem.value.searchParams.type1,
  cDtoItem.value.searchParams.type2,
  cDtoItem.value.resData)

isLoading.value = !cDtoItem.value.resData

// Head情報
const ogpType = typeDic.value.defender.jpn
useHead({
  title: `${ogpType}の評価`,
  meta: [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: `${ogpType}の評価 - ペリずかん` },
    { property: 'og:url', content: useRuntimeConfig().public.url + useRoute().path },
    { property: 'og:site_name', content: 'ペリずかん' },
    { property: 'og:description', content: `${ogpType}のこうげき時、ぼうぎょ時のそれぞれの評価を知ることができます。` },
    { property: 'og:image', content: useRuntimeConfig().public.staticUrl + '/pokego/peripper-eyes.png' }
  ]
})
</script>

<style lang="scss">
.rating {
  display: flex;
  align-items: center;
}
</style>
