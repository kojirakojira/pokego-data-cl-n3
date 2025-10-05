import { AfterEvoScpRankSearchParams } from '~/components/interface/afterEvoScpRank'
import { FilterAllSearchParams } from '~/components/interface/filterAll'
import { RaceDiffSearchParams } from '~/components/interface/raceDiff'
import { ScpRankSearchParams } from '~/components/interface/scpRank'
import { ScpRankListSearchParams } from '~/components/interface/scpRankList'

export interface TransitionParamForGeneral {
  pokedexId: string, // resDataをそのまま設定できるようにpidではなくpokedexId
  name: string,
  remarks: string
}
export interface TransitionParamForFilterAll {
  dynamax?: boolean,
  gigantamax?: boolean,
  impled?: boolean,
  negaImpled?: boolean
}
export default () => {
  const abundance = (pid: string) => {
    useRouter().push({
      name: 'search-result-abundance',
      query: { pid }
    })
  }

  const filterAll = (params: TransitionParamForFilterAll) => {
    const searchParams: FilterAllSearchParams = new FilterAllSearchParams()
    for (const [k, v] of Object.entries(params)) {
      (searchParams as any)[k] = v
    }
    const pathName = 'search-filterAll'
    dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
      pathName,
      {},
      { searchParams },
      true
    ))
    useRouter().push({
      name: pathName
    })
  }

  const raceResult = (pid: string) => {
    useRouter().push({
      name: 'search-result-raceResult',
      query: { pid }
    })
  }

  const raceDiff = (params: Array<TransitionParamForGeneral>) => {
    const searchParams: RaceDiffSearchParams = new RaceDiffSearchParams()
    for (const p of params) {
      searchParams.textFieldValues.push({
        pid: p.pokedexId,
        name: editUtils().appendRemarks(p.name, p.remarks),
        errMsg: ''
      })
    }
    const pathName = 'search-raceDiff'
    dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
      pathName,
      {},
      { searchParams },
      true
    ))
    useRouter().push({
      name: pathName
    })
  }

  const afterEvoScpRank = (params: TransitionParamForGeneral, iv?: string, cp?: string) => {
    const searchParams: AfterEvoScpRankSearchParams = new AfterEvoScpRankSearchParams()
    searchParams.pid = params.pokedexId
    searchParams.name = editUtils().appendRemarks(params.name, params.remarks)
    if (iv) { searchParams.iv = iv }
    if (cp) { searchParams.cp = cp }
    const pathName = 'search-afterEvoScpRank'
    dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
      pathName,
      {},
      { searchParams },
      true
    ))
    useRouter().push({
      name: pathName
    })
  }

  const scpRank = (params: TransitionParamForGeneral, iv?: string) => {
    const searchParams: ScpRankSearchParams = new ScpRankSearchParams()
    searchParams.pid = params.pokedexId
    searchParams.name = editUtils().appendRemarks(params.name, params.remarks)
    if (iv) { searchParams.iv = iv }
    const pathName = 'search-scpRank'
    dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
      pathName,
      {},
      { searchParams },
      true
    ))
    useRouter().push({
      name: pathName
    })
  }

  const scpRankList = (params: TransitionParamForGeneral) => {
    const searchParams: ScpRankListSearchParams = new ScpRankListSearchParams()
    searchParams.pid = params.pokedexId
    searchParams.name = editUtils().appendRemarks(params.name, params.remarks)
    const pathName = 'search-scpRankList'
    dtoUtils().prePushScreenInfo(dtoUtils().createScreenInfo(
      pathName,
      {},
      { searchParams },
      true
    ))
    useRouter().push({
      name: pathName
    })
  }

  const scpRankMaxMinResult = (pid: string) => {
    useRouter().push({
      name: 'search-result-scpRankMaxMinResult',
      query: { pid }
    })
  }

  const moveLookupResult = (mid: string) => {
    useRouter().push({
      name: 'search-result-moveLookupResult',
      query: { mid }
    })
  }

  return {
    abundance,
    filterAll,
    raceResult,
    raceDiff,
    afterEvoScpRank,
    scpRank,
    scpRankList,
    scpRankMaxMinResult,
    moveLookupResult
  }
}
