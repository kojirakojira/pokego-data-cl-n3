<template>
  <v-card>
    <v-card-title :class="`bg-${headerBackgroundColor}`">
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="emit('close')"
      />
      <slot />
    </v-card-title>
    <v-card-text>
      <v-container v-if="psr">
        <v-row>
          <v-col align="right" style="padding-bottom:0px;">
            {{ `検索結果：${psr.goPokedexList.length}件` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0 subtitle-2">
            複数件ヒットしました。比較したいポケモンを選択してください。
          </v-col>
        </v-row>
        <v-row v-if="psr.maybe">
          <v-col class="py-0 subtitle-2">
            ※あいまい検索
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list style="border: solid thin grey;">
              <!-- <v-subheader>ポケモン</v-subheader> -->
              <v-list-item
                v-for="p in psr.goPokedexList"
                :key="p.pokedexId"
                @click="emit('selected', p.pokedexId)"
              >
                <v-list-item-title>
                  <v-avatar :image="editUtils().getPokemonImageUrl(p.image)" />
                  {{ editUtils().appendRemarks(p.name, p.remarks) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PokemonSearchResult } from '../interface/api/dto'

withDefaults(
  defineProps<{
    psr: PokemonSearchResult | undefined,
    headerBackgroundColor?: string
   }>(),
  { headerBackgroundColor: 'info' }
)

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'selected', pokedexId: string): void
  (e: 'close'): void
  }>()
</script>
