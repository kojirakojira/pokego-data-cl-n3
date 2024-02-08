<!-- こうげき倍率（こうげきを与える際の倍率ごとのタイプ）の表 -->
<template>
  <v-container class="basic-info-table atk-dmg-mult-table">
    <v-row v-for="(adm, admIdx) in atkDmgMultArr" :key="`atk-dmg-mult-${adm.name}`">
      <v-col cols="4" :style="`background: ${editUtils().getRGB(atkType)};`">
        <span>{{ adm.dmgMult }}</span>
      </v-col>
      <v-col cols="8" :style="admIdx % 2 === 0 ? `background: ${editUtils().getRGBA(0.1, atkType, null)}` : ''">
        <span
          v-for="(type, idx) in defTypeDic[adm.name]"
          :key="`atk-dmg-mult-${type}`"
          :style="`background-color: ${editUtils().getRGB(type)}; ${idx === 0 ? '': 'margin-left:5px;'}`"
          class="type"
        >
          {{ constantUtils().getValue(type, constantUtils().value.TYPE) }}
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
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
</script>

<style scoped lang="scss">
.atk-dmg-mult-table {
  max-width: 500px;
  margin: auto;

  // v-rowへの適用
  > * {
    margin: 0px;

    // v-colへの適用
    > * {
      padding: 4px;
    }

    > *:first-child {
      color: white;
      overflow-wrap: anywhere;
      display: grid;
      align-items: center;
    }
  }
}
</style>
