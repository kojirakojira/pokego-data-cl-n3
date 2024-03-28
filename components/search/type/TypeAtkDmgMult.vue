<template>
  <v-container class="pa-0">
    <v-row>
      <v-col
        cols="12"
        :md="type2 ? 6 : 12"
        :lg="type2 ? 6 : 12"
        :xl="type2 ? 6 : 12"
      >
        <div class="pa-3">
          タイプ1:
          <SearchType :type="constantAccessor.getTypeJpn(type1)" />
        </div>
        <SearchTypeAtkTable :atk-type="type1" :def-type-dic="defTypeDic1" class="" />
      </v-col>
      <v-col v-if="type2" cols="12" md="6" lg="6" xl="6">
        <div class="pa-3">
          タイプ2:
          <SearchType :type="constantAccessor.getTypeJpn(type2)" />
        </div>
        <SearchTypeAtkTable :atk-type="type2" :def-type-dic="defTypeDic2" class="" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ConstantAccessor } from '#imports'

withDefaults(
  defineProps<{
    type1: string,
    type2?: string | null,
    defTypeDic1: Record<string, Array<string>>,
    defTypeDic2?: any // Record<string, Array<string>で宣言するとなぜか怒られる…。
   }>(),
  { type2: null, defTypeDic2: {} as Record<string, Array<string>> }
)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
</script>
