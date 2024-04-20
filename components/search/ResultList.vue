<template>
  <div>
    <v-container>
      <v-row>
        <v-col style="padding-bottom:0px;">
          {{ `検索結果：${psr.goPokedexList.length}件` }}
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 subtitle-2">
          複数件ヒットしました。ポケモンを選択してください。
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
              @click="emit('clickRow', p.pokedexId)"
            >
              <v-list-item-title>
                <v-avatar :image="editUtils().getPokemonImageUrl(p.image1)" />
                {{ editUtils().appendRemarks(p.name, p.remarks) }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  psr: {
    goPokedexList: Array<Record<string, any>>,
    maybe: boolean
  }
}>()

const emit = defineEmits<{(e: 'clickRow', value?: string): void}>()

</script>
