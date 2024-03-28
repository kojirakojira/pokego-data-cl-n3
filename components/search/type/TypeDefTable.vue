<!-- ぼうぎょ倍率（こうげきを与える際の倍率ごとのタイプ）の表 -->
<template>
  <v-container class="basic-info-table def-dmg-mult-table">
    <v-row v-for="(ddm, ddmIdx) in defDmgMultArr" :key="`def-dmg-mult-${ddm.name}`">
      <v-col cols="4" :style="`background: ${typeColorUtils.getRGB(defType1, defType2)}`">
        <span>{{ ddm.dmgMult }}</span>
      </v-col>
      <v-col
        cols="8"
        :style="ddmIdx % 2 === 0 ? `background: ${typeColorUtils.getRGBA(0.1, defType1, defType2)}` : ''"
      >
        <template
          v-for="(type, idx) in atkTypeDic[ddm.name]"
          :key="`def-dmg-mult-${type}`"
        >
          <SearchType
            :type="constantAccessor.getTypeJpn(type)"
            :style="idx === 0 ? '': 'margin-left:5px;'"
          />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { TypeColorUtils } from '~/utils/editUtils'
import { ConstantAccessor } from '~/utils/constantUtils'

const defDmgMultArr: Array<Record<string, string>> = [
  { name: 'MAX', dmgMult: '×2.56' },
  { name: 'HIGH', dmgMult: '×1.6' },
  { name: 'LOW', dmgMult: '×0.625' },
  { name: 'VERY_LOW', dmgMult: '×0.390625' },
  { name: 'MIN', dmgMult: '×0.244140625' }]

withDefaults(
  defineProps<{
    defType1: string,
    defType2?: string,
    atkTypeDic: Record<string, Array<string>>
   }>(),
  { defType2: '' }
)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)
</script>

<style lang="scss">
.def-dmg-mult-table {
  max-width: 500px;
  margin: auto;
  padding: 12px;

  .v-row {
    .v-col:first-child {
      color: white;
      overflow-wrap: anywhere;
      display: grid;
      align-items: center;
    }
  }
}
</style>
