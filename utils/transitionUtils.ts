import { AfterEvoScpRankSearchParams } from '~/components/interface/afterEvoScpRank'
import { FilterAllSearchParams } from '~/components/interface/filterAll'
import type { MoveDispType } from '~/components/interface/filterAllMove'
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
      name: searchCommon().getRouteName('abundance', true),
      query: { pid }
    })
  }
  const searchAll = () => {
    useRouter().push({
      name: searchCommon().getRouteName('searchAll')
    })
  }
  const filterAll = (params: TransitionParamForFilterAll) => {
    const searchParams: FilterAllSearchParams = new FilterAllSearchParams()
    for (const [k, v] of Object.entries(params)) {
      (searchParams as any)[k] = v
    }
    const pathName = searchCommon().getRouteName('filterAll')
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
      name: searchCommon().getRouteName('race', true),
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
    const pathName = searchCommon().getRouteName('raceDiff')
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

  const raceDiffResult = (pids: Array<string>) => {
    const query: Record<string, string> = {}
    pids.forEach((pid, i) => {
      if (i < 6) {
        query[`pid${i + 1}`] = pid
      }
    })
    useRouter().push({
      name: searchCommon().getRouteName('raceDiff', true),
      query
    })
  }

  const afterEvoScpRank = (params: TransitionParamForGeneral, iv?: string, cp?: string) => {
    const searchParams: AfterEvoScpRankSearchParams = new AfterEvoScpRankSearchParams()
    searchParams.pid = params.pokedexId
    searchParams.name = editUtils().appendRemarks(params.name, params.remarks)
    if (iv) { searchParams.iv = iv }
    if (cp) { searchParams.cp = cp }
    const pathName = searchCommon().getRouteName('afterEvoScpRank')
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
    const pathName = searchCommon().getRouteName('scpRank')
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
    const pathName = searchCommon().getRouteName('scpRankList')
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
      name: searchCommon().getRouteName('scpRankMaxMin', true),
      query: { pid }
    })
  }
  const moveLookup = () => {
    useRouter().push({
      name: searchCommon().getRouteName('moveLookup')
    })
  }
  const moveLookupResult = (mid: string) => {
    useRouter().push({
      name: searchCommon().getRouteName('moveLookup', true),
      query: { mid }
    })
  }

  const moveList = (types: Array<string>, moveDispType?: MoveDispType) => {
    useRouter().push({
      name: 'search-list-moveList',
      query: { types, ...(moveDispType && { moveDispType }) }
    })
  }

  const pokemonList = (searchParams: FilterAllSearchParams) => {
    useRouter().push({
      name: 'search-list-pokemonList',
      query: searchCommon().makeQuery(searchParams)
    })
  }

  const gymRaidPokeMoveCombiResult = (pid: string) => {
    useRouter().push({
      name: searchCommon().getRouteName('gymRaidPokeMoveCombi', true),
      query: { pid }
    })
  }

  return {
    abundance,
    searchAll,
    filterAll,
    raceResult,
    raceDiff,
    raceDiffResult,
    afterEvoScpRank,
    scpRank,
    scpRankList,
    scpRankMaxMinResult,
    moveLookup,
    moveLookupResult,
    moveList,
    pokemonList,
    gymRaidPokeMoveCombiResult
  }
}
