<!-- こうげき倍率（こうげきを与える際の倍率ごとのタイプ）の表 -->
<template>
  <v-container class="basic-info-table atk-dmg-mult-table">
    <v-row v-for="(adm, admIdx) in atkDmgMultArr" :key="`atk-dmg-mult-${adm.name}`">
      <v-col cols="4" :style="`background: ${typeColorUtils.getRGB(atkType)};`">
        <span>{{ adm.dmgMult }}</span>
      </v-col>
      <v-col cols="8" :style="admIdx % 2 === 0 ? `background: ${typeColorUtils.getRGBA(0.1, atkType, null)}` : ''">
        <template
          v-for="(type, idx) in defTypeDic[adm.name]"
          :key="`atk-dmg-mult-${type}`"
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
import { TypeColorUtils, ConstantAccessor } from '#imports'

const atkDmgMultArr: Array<Record<string, string>> = [
  { name: 'HIGH', dmgMult: '×1.6' },
  { name: 'LOW', dmgMult: '×0.625' },
  { name: 'VERY_LOW', dmgMult: '×0.390625' }]

withDefaults(
  defineProps<{
    atkType: string,
    defTypeDic: Record<string, Array<string>>
   }>(),
  {}
)

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)
</script>

<style lang="scss">
.atk-dmg-mult-table {
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
