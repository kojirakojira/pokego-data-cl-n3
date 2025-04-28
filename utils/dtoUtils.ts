import { type RouteLocationNormalized } from 'vue-router'
import { type ScreenInfo } from '~/stores/dtoStore'
import { dtoStore } from '~/stores/dtoStore'

export default () => {
  const createScreenInfoFromRoute = (
    route: RouteLocationNormalized,
    history: History): ScreenInfo => {
    if (!route.name) {
      throw createError({ statusCode: 500, message: 'ページの指定に誤りがあります。', fatal: true })
    }

    return {
      pathName: route.name.toString(),
      position: history.state.position,
      query: route.query,
      params: {},
      prePush: false
    }
  }

  const createScreenInfoForBeforeEach = (
    from: RouteLocationNormalized,
    dto: Ref<Record<string, any>>): ScreenInfo => {
    if (!from.name) {
      throw createError({ statusCode: 500, message: 'ページの指定に誤りがあります。', fatal: true })
    }
    return {
      pathName: from.name.toString(),
      position: 0, // ここの値は使用してない。
      query: from.query,
      params: JSON.parse(JSON.stringify(dto.value)).params,
      prePush: false
    }
  }

  const createScreenInfo = (
    pathName: string,
    query: Record<string, any>,
    argParams: Record<string, any> | null | undefined,
    prePush: boolean): ScreenInfo => {
    let params = argParams
    if (!params) {
      params = {}
    }
    return {
      pathName,
      position: window.history.state.position + 1, // 現在のpositionの+1（バグにはならない…よな…？）
      query,
      params,
      prePush
    }
  }

  const prePushScreenInfo = (si: ScreenInfo) => {
    dtoStore().prePushScreenInfo(si)
  }

  return {
    createScreenInfoFromRoute,
    createScreenInfoForBeforeEach,
    createScreenInfo,
    prePushScreenInfo
  }
}
