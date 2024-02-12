<template>
  <div
    class="pokemon"
    :style="link || clickAction ? 'cursor: pointer;' : 'pointer-events: none;'"
    @click="clickAction()"
  >
    <div class="node" />
    <div class="pokemon-name">
      {{ name }}
      <div v-if="remarks" class="remarks">
        {{ `(${remarks})` }}
      </div>
    </div>
    <div v-if="marker" class="marker" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    pid: string,
    name: string,
    remarks: string,
    link?: boolean,
    clickAction?: Function,
    marker?: boolean
   }>(),
  { link: false, clickAction: () => {}, marker: false }
)
</script>

<style lang="scss" scoped>
.pokemon {
  display: flex;
  position: relative;
  align-items: center;

  .node {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    z-index: 51;
    position: relative;

    // nodeの球体表現(左上部のぼかし)
    &:before {
      content: '';
      position: absolute;
      top: 5px;
      left: 7px;
      width: 12px;
      height: 12px;
      background: white;
      border-radius: 50%;
      filter: blur(4px);
    }

    // nodeの球体表現(上部のぼかし)
    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      left: 0px;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 30%);
      border-radius: 50%;
    }
  }
  .pokemon-name {
    color: white;
    margin-left: 10px;
    width: 90px;
    font-size: 14px;

    .remarks {
      font-size: 10px;
    }
  }
  .marker {
    position: absolute;
    border: 1px solid red;
    width: 142px;
    height: 55px;
    left: -2px;
  }
}
</style>
