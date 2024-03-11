<template>
  <v-container
    :class="`${useTheme().global.name.value === 'dark' ? 'darken-3' : 'bg-grey-lighten-5'} filter-area pa-4 my-4`"
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
          <span class="caption">絞り込む</span>
        </v-btn>
        <v-tooltip v-if="helpMessage" bottom>
          <template #activator="{ props }">
            <v-icon
              small
              v-bind="props"
            >
              mdi-help-circle
            </v-icon>
          </template>
          <span>{{ helpMessage }}</span>
        </v-tooltip>
      </v-col>
      <v-col cols="4" align="right">
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
          @click="emit('click')"
        />
      </div>
    </transition>
  </v-container>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { ResearchRequest } from '~/components/interface/api/request'

const searchParams = defineModel<ResearchRequest>()
withDefaults(
  defineProps<{
    showArea: boolean,
    isSearchBtnClick?: boolean,
    helpMessage?: string
   }>(),
  { isSearchBtnClick: false, helpMessage: '' })

const clear = () => {
  (searchParams.value as ResearchRequest).clear()
}

const emit = defineEmits<{(e: 'showArea'): void, (e: 'click'): void}>()
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
