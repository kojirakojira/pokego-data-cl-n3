<template>
  <v-container>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
    <v-row align="center">
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
        <v-col cols="12" align="center">
          <v-btn
            rounded
            min-width="50%"
            color="success"
            :disabled="isSearchBtnClick"
            @click="emit('click')"
          >
            検索
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ResearchRequest } from '~/components/interface/api/request'
import { ConstantAccessor } from '~/utils/constantUtils'

const searchParams = defineModel<ResearchRequest>({ required: true })
withDefaults(
  defineProps<{
    isSearchBtnClick?: boolean,
    showSearchBtn?: boolean
   }>(),
  { isSearchBtnClick: false, showSearchBtn: true })

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)

const emit = defineEmits<{(e: 'click'): void}>()
</script>
