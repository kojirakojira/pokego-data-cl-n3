import { defineStore } from 'pinia'
import type { TypeInfo } from '~/components/interface/api/dto'
import type { ConstantItem, ConstantValue, SimpEntry, Constants } from '~/utils/constantUtils'

export const constantStore = defineStore(
  'constantStore',
  () => {
    const constantValue = ref<ConstantValue>({
      TYPE: [] as Array<TypeInfo>, // タイプ
      REGION: [] as Array<SimpEntry>, // 地域
      GEN: [] as Array<SimpEntry>, // 世代
      FILTER_ITEMS: [] as Array<SimpEntry>, // 絞り込み検索項目
      PL: [] as Array<string>, // PL
      SITUATION: [] as Array<SimpEntry>, // ポケモンを捕まえるときのシチュエーション
      WEATHER: [] as Array<SimpEntry> // 天気
    })

    const get = () => {
      return constantValue.value
    }

    const setType = (typeArr: Array<TypeInfo>) => {
      constantValue.value.TYPE = typeArr
    }

    const setRegion = (regionArr: Array<SimpEntry>) => {
      constantValue.value.REGION = regionArr
    }

    const setGen = (genArr: Array<SimpEntry>) => {
      constantValue.value.GEN = genArr
    }

    const setFilterItems = (filterItemArr: Array<SimpEntry>) => {
      constantValue.value.FILTER_ITEMS = filterItemArr
    }

    const setPl = (plArr: Array<string>) => {
      constantValue.value.PL = plArr
    }

    const setSituation = (situationArr: Array<SimpEntry>) => {
      constantValue.value.SITUATION = situationArr
    }

    const setWeather = (weatherArr: Array<SimpEntry>) => {
      constantValue.value.WEATHER = weatherArr
    }

    const clear = () => {
      Object.entries(constantValue.value).forEach(([k]) => {
        constantValue.value[k as ConstantItem] = []
      })
    }

    const init = (constants: Constants) => {
      // 念のためクリア
      clear()

      // それぞれセットしていく
      setType(Object.entries(constants.typeList).map((arr: [string, any]) => arr[1] as TypeInfo))
      setRegion(Object.entries(constants.regionMap).map(([k, v]: [string, string]) => { return { k, v } }))
      setGen(Object.entries(constants.genMap).map(([k, v]: [string, string]) => { return { k, v } }))
      setFilterItems(Object.entries(constants.filterItemMap).map(([k, v]: [string, string]) => { return { k, v } }))
      setPl(Object.entries(constants.plList).map((arr: [string, any]) => String(arr[1])))
      setSituation(Object.entries(constants.situationMap).map(([k, v]: [string, string]) => { return { k, v } }))
      setWeather(Object.entries(constants.weatherMap).map(([k, v]: [string, string]) => { return { k, v } }))
    }

    return {
      get,
      setType,
      setRegion,
      setGen,
      setFilterItems,
      setPl,
      setSituation,
      setWeather,
      clear,
      init
    }
  })
