<template>
  <v-container>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('type', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-select
          v-model="searchParams.type1"
          :items="constant.TYPE"
          item-title="jpn"
          item-value="type"
          clearable
          prepend-icon="mdi-filter-multiple"
          hide-details
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-select
          v-model="searchParams.type2"
          :items="constant.TYPE"
          item-title="jpn"
          item-value="type"
          clearable
          prepend-icon="mdi-filter-multiple"
          hide-details
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('finEvo', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.finEvo"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="searchParams.finEvo ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaFinEvo"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.finEvo"
          :label="searchParams.negaFinEvo ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('mega', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.mega"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="searchParams.mega ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaMega"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.mega"
          :label="searchParams.negaMega ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('dynamax', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.dynamax"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="searchParams.dynamax ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaDynamax"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.dynamax"
          :label="searchParams.negaDynamax ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('gigantamax', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.gigantamax"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="searchParams.gigantamax ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaGigantamax"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.gigantamax"
          :label="searchParams.negaGigantamax ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('impled', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.impled"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="searchParams.impled ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaImpled"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.impled"
          :label="searchParams.negaImpled ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row ref="releaseDateRef">
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('releaseDateStart', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-container class="pa-0">
          <v-row class="align-center">
            <v-col cols="12" xl="4">
              <div class="d-flex align-center">
                <v-select
                  v-model="startYear"
                  :items="years"
                  label="年"
                  density="compact"
                  hide-details
                  class="mr-2"
                  clearable
                  style="max-width: 170px;"
                />

                <v-select
                  v-model="startMonth"
                  :items="months"
                  label="月"
                  density="compact"
                  hide-details
                  clearable
                  style="max-width: 150px;"
                />
              </div>
            </v-col>
            <v-col cols="12" xl="4">
              <div class="d-flex align-center justify-end">
                <span class="px-2">〜</span>
                <v-select
                  v-model="endYear"
                  :items="years"
                  label="年"
                  density="compact"
                  hide-details
                  class="mr-2"
                  clearable
                  style="max-width: 170px;"
                />
                <v-select
                  v-model="endMonth"
                  :items="months"
                  label="月"
                  density="compact"
                  hide-details
                  clearable
                  style="max-width: 150px;"
                />
              </div>
            </v-col>
          </v-row>
          <v-row v-if="releaseDateError" class="mt-1">
            <v-col cols="12" class="py-0">
              <div class="text-error">
                {{ releaseDateError }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('tooStrong', 'FILTER_ITEMS') }}
        <SearchInputHelpMsg>
          ポケモンGOの種族値は、原作の種族値から一定の変換式で算出されます。種族値が高すぎる一部のポケモンは算出された種族値から×0.91されます。<br>この補正には通称がないため、このサイトでは「強ポケ補正」と呼んでいます。
        </SearchInputHelpMsg>
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.tooStrong"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="searchParams.tooStrong ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaTooStrong"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.tooStrong"
          :label="searchParams.negaTooStrong ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('region', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <div v-for="r in constant.REGION" :key="r.k">
          <v-checkbox
            v-model="searchParams.region"
            :label="r.v"
            :value="r.k"
            hide-details
            multiple
            color="info"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaRegion"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.region.length"
          :label="searchParams.negaRegion ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
        {{ constantAccessor.getValue('gen', 'FILTER_ITEMS') }}
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <div v-for="r in constant.GEN" :key="r.k">
          <v-checkbox
            v-model="searchParams.gen"
            :label="r.v"
            :value="r.k"
            hide-details
            multiple
            color="info"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="searchParams.negaGen"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!searchParams.gen.length"
          :label="searchParams.negaGen ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
    <template v-if="showSearchBtn">
      <v-row>
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn
            rounded
            min-width="50%"
            color="success"
            :disabled="isSearchBtnClick"
            @click="onSearchBtnClick"
          >
            検索
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import type { ResearchRequest } from '~/components/interface/api/request'
import { ConstantAccessor } from '~/utils/constantUtils'

// --- Props, Emits, Models ---
const searchParams = defineModel<ResearchRequest>({ required: true })
withDefaults(
  defineProps<{
    isSearchBtnClick?: boolean,
    showSearchBtn?: boolean
   }>(),
  { isSearchBtnClick: false, showSearchBtn: true }
)
const emit = defineEmits<{(e: 'click'): void}>()

// --- Constants ---
const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)

// --- Composable: リリース年月制御 ---
const useReleaseDateControl = () => {
  const releaseDateError = ref<string>('')
  const releaseDateRef = ref<any>(null) // refと自動的に同期

  const startYear = ref<string>('')
  const startMonth = ref<string>('')
  const endYear = ref<string>('')
  const endMonth = ref<string>('')

  // リリース年月の選択範囲の生成
  const pokeGoReleaseYear = 2016
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - pokeGoReleaseYear + 1 },
    (_, i) => pokeGoReleaseYear + i
  ).map(v => v.toString())
  const months = Array.from(
    { length: 12 },
    (_, i) => i + 1
  ).map(v => v.toString())

  // APIリクエスト用のリリース年月の設定
  watch([startYear, startMonth], () => {
    releaseDateError.value = ''
    if (!startYear.value || !startMonth.value) {
      searchParams.value.releaseDateStart = 0
      return
    }
    searchParams.value.releaseDateStart = Number(startYear.value + startMonth.value.padStart(2, '0'))
  })
  watch([endYear, endMonth], () => {
    releaseDateError.value = ''
    if (!endYear.value || !endMonth.value) {
      searchParams.value.releaseDateEnd = 0
      return
    }
    searchParams.value.releaseDateEnd = Number(endYear.value + endMonth.value.padStart(2, '0'))
  })

  // 初期化処理
  const initReleaseDate = () => {
    const initStartYear = Math.floor(searchParams.value.releaseDateStart / 100)
    if (pokeGoReleaseYear <= initStartYear && initStartYear <= currentYear) {
      startYear.value = String(initStartYear)
      startMonth.value = String(searchParams.value.releaseDateStart % 100)
    }
    const initEndYear = Math.floor(searchParams.value.releaseDateEnd / 100)
    if (pokeGoReleaseYear <= initEndYear && initEndYear <= currentYear) {
      endYear.value = String(initEndYear)
      endMonth.value = String(searchParams.value.releaseDateEnd % 100)
    }
  }

  // バリデーション処理
  const validateReleaseDate = (): boolean => {
    releaseDateError.value = ''
    const isStartPartial = !!startYear.value !== !!startMonth.value // XOR
    const isEndPartial = !!endYear.value !== !!endMonth.value // XOR

    if (isStartPartial || isEndPartial) {
      releaseDateError.value = 'リリース年月を指定する場合は、年と月を両方とも設定してください。'
      return false
    }
    if (searchParams.value.releaseDateStart && searchParams.value.releaseDateEnd && searchParams.value.releaseDateStart > searchParams.value.releaseDateEnd) {
      releaseDateError.value = 'リリース年月（開始）は、リリース年月（終了）と同じか、それよりも小さい値を設定してください。'
      return false
    }
    return true
  }

  // 入力チェックエラー時の画面スクロール
  const scrollToError = async () => {
    await nextTick()
    if (releaseDateRef.value) {
      const el = releaseDateRef.value.$el || releaseDateRef.value
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return {
    releaseDateError,
    releaseDateRef,
    startYear,
    startMonth,
    endYear,
    endMonth,
    years,
    months,
    initReleaseDate,
    validateReleaseDate,
    scrollToError
  }
}

const {
  releaseDateError,
  releaseDateRef,
  startYear,
  startMonth,
  endYear,
  endMonth,
  years,
  months,
  initReleaseDate,
  validateReleaseDate,
  scrollToError
} = useReleaseDateControl()

// 初期化実行
initReleaseDate()

// 検索ボタン押下時の処理
const onSearchBtnClick = async () => {
  if (!validateReleaseDate()) {
    await scrollToError()
    return
  }
  emit('click')
}
</script>
