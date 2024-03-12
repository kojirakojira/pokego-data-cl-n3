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
          v-model="(searchParams as ResearchRequest).type1"
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
          v-model="(searchParams as ResearchRequest).type2"
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
          v-model="(searchParams as ResearchRequest).finEvo"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="(searchParams as ResearchRequest).finEvo ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="(searchParams as ResearchRequest).negaFinEvo"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!(searchParams as ResearchRequest).finEvo"
          :label="(searchParams as ResearchRequest).negaFinEvo ? 'not equal' : 'equals'"
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
          v-model="(searchParams as ResearchRequest).mega"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="(searchParams as ResearchRequest).mega ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="(searchParams as ResearchRequest).negaMega"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!(searchParams as ResearchRequest).mega"
          :label="(searchParams as ResearchRequest).negaMega ? 'not equal' : 'equals'"
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
          v-model="(searchParams as ResearchRequest).impled"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="(searchParams as ResearchRequest).impled ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="(searchParams as ResearchRequest).negaImpled"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!(searchParams as ResearchRequest).impled"
          :label="(searchParams as ResearchRequest).negaImpled ? 'not equal' : 'equals'"
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
      </v-col>
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="(searchParams as ResearchRequest).tooStrong"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-filter-multiple"
          :label="(searchParams as ResearchRequest).tooStrong ? 'filter' : 'not filter'"
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="(searchParams as ResearchRequest).negaTooStrong"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!(searchParams as ResearchRequest).tooStrong"
          :label="(searchParams as ResearchRequest).negaTooStrong ? 'not equal' : 'equals'"
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
            v-model="(searchParams as ResearchRequest).region"
            :label="r.v"
            :value="r.k"
            hide-details
            multiple
          />
        </div>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="(searchParams as ResearchRequest).negaRegion"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!(searchParams as ResearchRequest).region.length"
          :label="(searchParams as ResearchRequest).negaRegion ? 'not equal' : 'equals'"
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
            v-model="(searchParams as ResearchRequest).gen"
            :label="r.v"
            :value="r.k"
            hide-details
            multiple
          />
        </div>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-spacer />
      <v-col cols="12" md="7" lg="8" xl="8">
        <v-switch
          v-model="(searchParams as ResearchRequest).negaGen"
          inset
          color="info"
          hide-details
          prepend-icon="mdi-not-equal"
          :disabled="!(searchParams as ResearchRequest).gen.length"
          :label="(searchParams as ResearchRequest).negaGen ? 'not equal' : 'equals'"
        />
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script setup lang="ts">
import { ResearchRequest } from '~/components/interface/api/request'
import { ConstantAccessor } from '~/utils/constantUtils'

const searchParams = defineModel<ResearchRequest>()
withDefaults(
  defineProps<{
    isSearchBtnClick?: boolean
   }>(),
  { isSearchBtnClick: false })

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)

const emit = defineEmits<{(e: 'click'): void}>()
</script>
