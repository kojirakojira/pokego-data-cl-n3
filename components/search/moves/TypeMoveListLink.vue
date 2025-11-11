<template>
  <div class="d-flex flex-wrap justify-center">
    <div
      v-for="t in constant.TYPE"
      :key="`list-link-${t.type}`"
      :class="['d-flex', 'justify-center', 'align-center', 'px-10', $style.type_move_list]"
      @click="transitionUtils().moveList([t.type])"
    >
      <SearchType :type="t.jpn" />
    </div>
  </div>
</template>

<script setup lang="ts">
const constant: ConstantValue = constantUtils().get()
</script>

<style lang="scss" module>
.type_move_list {
  border: 1px solid black;
  width: 100px;
  height: 50px;
  margin-left: -1px;
  margin-top: -1px;
  cursor: pointer;
}
.type_move_list:hover {
  background-color: #f0f8ff;
}
</style>
