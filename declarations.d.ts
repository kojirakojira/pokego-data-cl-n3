// https://github.com/nuxt/nuxt/releases/tag/v3.15.0
// TODO periodically check if this file is still needed, as libraries may update their types
// see https://www.answeroverflow.com/m/1273576997146329129
import type {
    ComponentCustomOptions as _ComponentCustomOptions,
    ComponentCustomProperties as _ComponentCustomProperties,
  } from 'vue'
  
  declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends _ComponentCustomProperties {}
    interface ComponentCustomOptions extends _ComponentCustomOptions {}
  }