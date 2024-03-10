<template>
  <div id="type-comments-base">
    <img src="/img/brain-juice-e.png" class="brain-icon">
    <div :class="`triangle ' + ${theme}`" />
    <div :class="`type-comments-fukidashi ' + ${theme}`">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="mx-0 my-0">
        <template v-if="!type1">
          <slot />
        </template>
        <template v-else>
          あ、どうも。<!--
          -->{{ name ? editUtils().appendRemarks(name, remarks) : 'こ' }}<!--
          -->のタイプ(<!--
          --><span
                :style="`background-color: ${typeColorUtils.getRGB(type1)};'}`"
                class="type"
              >
              {{ constantAccessor.getTypeJpn(type1) }}
          </span>
          <span
            v-if="type2"
            :style="`background-color: ${typeColorUtils.getRGB(type2)}; margin-left: 3px;`"
            class="type"
          >
            {{ constantAccessor.getTypeJpn(type2) }}
          </span><!--
          -->)の特徴について簡単に説明します。
        </template>
      </p>
      <ul class="px-0 py-0 mx-5 my-0">
        <li
          v-for="(comment, idx) in comments"
          :key="`type-comment-${idx}`"
          class="type-comments-text"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="typeColorUtils.typeDecoration(comment)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { TypeColorUtils } from '~/utils/editUtils'
import { ConstantAccessor } from '~/utils/constantUtils'

withDefaults(
  defineProps<{
    type1?: string, // タイプ1(英字)
    type2?: string, // タイプ2(英字)
    name?: string,
    remarks?: string,
    comments: Array<string>
   }>(),
  {
    type1: '',
    type2: '',
    name: '',
    remarks: ''
  }
)
// Vuetifyのテーマを取得する（light or dark）
const theme = computed((): string => {
  return useTheme().global.name.value
})

const constant: ConstantValue = constantUtils().get()
const constantAccessor: ConstantAccessor = new ConstantAccessor(constant)
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)
</script>

<style scoped>
#type-comments-base {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 800px;
  margin: auto;
}
.brain-icon {
  position: relative;
  width: 80px;
  height: 80px;
}
.type-comments-fukidashi {
  position: relative;
  width: 100%;
  padding: 10px;
  margin: 10px 20px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 0;
}
.type-comments-fukidashi.light {
  background-color: white;
  border: 3px solid black;
}
.type-comments-fukidashi.dark {
  background-color: black;
  border: 3px solid white;
}
.triangle {
  z-index: 1;
}
.triangle:before {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  left: 86px;
  top: 24px;
  border-right: 15px solid black;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
.triangle.dark:before {
  border-right: 15px solid white;
}
.triangle.light:before {
  border-right: 15px solid black;
}
.triangle:after {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  left: 90px;
  top: 24px;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
.triangle.dark:after {
  border-right: 15px solid black;
}
.triangle.light:after {
  border-right: 15px solid white;
}
.type-comments-text > * {
  margin: 0px;
  font-size: 12px;
}
</style>
