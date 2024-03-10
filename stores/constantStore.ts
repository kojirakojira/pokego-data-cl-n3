import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TypeInfo } from '~/components/interface/api/dto'
import type { ConstantItem, ConstantValue, SimpEntry } from '~/utils/constantUtils'

export const constantStore = defineStore(
  'constantStore',
  () => {
    const constantValue = ref<ConstantValue>({
      TYPE: [] as Array<TypeInfo>, // タイプ
      REGION: [] as Array<SimpEntry>, // 地域
      GEN: [] as Array<SimpEntry>, // 世代
      FILTER_ITEMS: [] as Array<SimpEntry>, // 絞り込み検索項目
      PL: [] as Array<string>, // PL
      SITUATION: [] as Array<SimpEntry> // ポケモンを捕まえるときのシチュエーション
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

    const clear = () => {
      Object.entries(constantValue.value).forEach(([k]) => {
        constantValue.value[k as ConstantItem] = []
      })
    }

    return {
      get,
      setType,
      setRegion,
      setGen,
      setFilterItems,
      setPl,
      setSituation,
      clear
    }
  })
