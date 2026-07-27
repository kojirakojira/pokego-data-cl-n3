<template>
  <v-container
    :class="
      [useTheme().global.name.value === 'dark' ? 'bg-grey-darken-3' : 'bg-grey-lighten-5',
       'filter-area',
       'pa-4',
       'my-4'
      ]"
  >
    <v-row>
      <v-col cols="8">
        <v-btn
          rounded
          class="px-4"
          color="success"
          density="comfortable"
          @click="emit('showArea')"
        >
          <v-icon size="x-small">
            mdi-filter-menu
          </v-icon>
          <span class="caption">{{ filteringBtnLabel }}</span>
        </v-btn>
        <SearchInputHelpMsg v-if="helpMessage">
          {{ helpMessage }}
        </SearchInputHelpMsg>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn
          rounded
          variant="outlined"
          class="px-4"
          color="error"
          density="comfortable"
          title="絞り込み条件をクリア"
          @click="clear()"
        >
          <span class="caption">クリア</span>
        </v-btn>
      </v-col>
    </v-row>
    <transition name="fade">
      <div v-show="showArea">
        <SearchInputFilterInput
          v-model="searchParams"
          :is-search-btn-click="isSearchBtnClick"
          :show-search-btn="false"
          @click="emit('click')"
        />
      </div>
    </transition>
    <v-row v-show="showArea">
      <v-col cols="12">
        <v-btn
          rounded
          class="px-4"
          color="success"
          density="comfortable"
          @click="emit('showArea')"
        >
          <v-icon size="x-small">
            mdi-filter-menu
          </v-icon>
          <span class="caption">折りたたむ</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { ResearchRequest } from '~/components/interface/api/request'

const searchParams = defineModel<ResearchRequest>({ required: true })
withDefaults(
  defineProps<{
    showArea: boolean,
    isSearchBtnClick?: boolean,
    helpMessage?: string,
    filteringBtnLabel?: string
   }>(),
  { isSearchBtnClick: false, helpMessage: '', filteringBtnLabel: '絞り込む' })

const clear = () => {
  searchParams.value = new ResearchRequest()
}

const emit = defineEmits<{(e: 'showArea' | 'click'): void}>()
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.filter-area {
  max-width: 700px;
  border-radius: 20px;
}
</style>
