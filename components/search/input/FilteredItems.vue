<template>
  <v-container v-if="items.length">
    <v-row>
      <v-col align="center">
        <v-card max-width="500px" class="searched-items">
          <v-card-title class="d-block body-2 pa-2 searched-params-title">
            絞り込み条件
          </v-card-title>
          <v-card-text class="caption text-left py-1">
            <v-container>
              <template v-for="(item, i) in items" :key="`filter-${item.name}`">
                <v-row :class="i === 0 ? null : 'searched-param'">
                  <v-col cols="5" md="4" lg="4" xl="4" class="pa-1">
                    {{ item.name }}
                  </v-col>
                  <v-col cols="7" md="8" lg="8" xl="8" class="pa-1">
                    {{ item.filterValue }}
                  </v-col>
                </v-row>
              </template>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { type DispFilterParam } from '~/components/interface/api/dto'

withDefaults(
  defineProps<{
    items: Array<DispFilterParam>
  }>(),
  {})
</script>
