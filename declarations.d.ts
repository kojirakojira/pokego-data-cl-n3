// https://github.com/nuxt/nuxt/releases/tag/v3.15.0
// TODO periodically check if this file is still needed, as libraries may update their types
// see https://www.answeroverflow.com/m/1273576997146329129
import type {
    ComponentCustomOptions as _ComponentCustomOptions,
    ComponentCustomProperties as _ComponentCustomProperties,
  } from 'vue'
  
  declare module '@vue/runtime-core' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ComponentCustomProperties extends _ComponentCustomProperties {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ComponentCustomOptions extends _ComponentCustomOptions {}
  }
declare global {
  interface PageDto {
    params?: any
    searchParams?: any
    resData?: any
    [key: string]: any
  }
  
  interface DataTableHeader {
    title: string
    key: string
    align?: 'start' | 'center' | 'end'
    sortable?: boolean
    width?: string | number
    fixed?: boolean
  }
}
