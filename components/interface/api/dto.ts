import type { MsgLevel } from './response'

/**
 * API側で定義したDTO、Response等を表現するインターフェース
 */
export class GoPokedex {
  pokedexId: string
  name: string
  attack: number
  defense: number
  hp: number
  image: string | null | undefined
  remarks: string
  type1: string
  type2: string | null | undefined
  gen: string
  implFlg: boolean

  constructor () {
    this.pokedexId = ''
    this.name = ''
    this.attack = 0
    this.defense = 0
    this.hp = 0
    this.remarks = ''
    this.type1 = ''
    this.gen = ''
    this.implFlg = false
  }
}

export interface Pokedex {
  pokedexId: string,
  name: string,
  hp: number,
  attack: number,
  defense: number,
  specialAttack: number,
  specialDefense: number,
  speed: number,
  image: string | null | undefined,
  remarks: string,
  type1: string,
  type2: string | null | undefined,
  gen: string,
  implFlg: boolean
}

export class ScpRank {
  league: string
  rank: number
  iva: number
  ivd: number
  ivh: number
  cp: number
  sp: number
  scp: number
  pl: string
  percent: number

  constructor () {
    this.league = ''
    this.rank = 0
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.cp = 0
    this.sp = 0
    this.scp = 0
    this.pl = ''
    this.percent = 0
  }
}

export interface Hierarchy {
  x: number,
  y: number,
  dist: number,
  id: string,
  bid: string,
  costs: Array<string>,
  goEvo: boolean
}

export class Color {
  r: number
  g: number
  b: number

  constructor () {
    this.r = 0
    this.g = 0
    this.b = 0
  }
}

export interface TypeInfo {
  type: string,
  jpn: string,
  color: Color
}

export class Race {
  pokedexId: string
  name: string
  remarks: string
  pokedex: Pokedex | null | undefined
  goPokedex: GoPokedex

  constructor () {
    this.pokedexId = ''
    this.name = ''
    this.remarks = ''
    this.goPokedex = new GoPokedex()
  }
}

export class CpRank {
  rank: number
  iva: number
  ivd: number
  ivh: number
  cp: number
  percent: number

  constructor () {
    this.rank = 0
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.cp = 0
    this.percent = 0
  }
}

export class GoPokedexAndCp {
  goPokedex: GoPokedex
  cp: number

  constructor () {
    this.goPokedex = new GoPokedex()
    this.cp = 0
  }
}

export class VersatilityIv {
  no: number
  pl: string
  iva: number
  ivd: number
  ivh: number
  percent: number

  constructor () {
    this.no = 0
    this.pl = ''
    this.iva = 0
    this.ivd = 0
    this.ivh = 0
    this.percent = 0
  }
}

export interface TwoTypeKey {
  type1: string,
  type2: string | null | undefined
}

export interface DispFilterParam {
  name: string,
  filterValue: string,
  negate: string
}

export interface XTypeElement {
  twoTypeKey: TwoTypeKey,
  rank: number,
  atkMsgs: Array<string>,
  defMsgs: Array<string>
}

export class AfterEvoIv {
  goPokedex: GoPokedex
  cp: number
  slRank: number
  hlRank: number
  mlRank: number

  constructor () {
    this.goPokedex = new GoPokedex()
    this.cp = 0
    this.slRank = 0
    this.hlRank = 0
    this.mlRank = 0
  }
}

export interface PlCp {
  no: string,
  pl: string,
  cp: number
}

export interface SimpPokemon {
  pokedexId: string,
  name: string,
  image: string,
  gen: string,
  remarks: string
}

export class Statistics {
  list: Array<number>
  max: number
  min: number
  med: number

  constructor () {
    this.list = []
    this.max = 0
    this.min = 0
    this.med = 0
  }
}

export class PokedexStats {
  hpStats: Statistics
  atStats: Statistics
  dfStats: Statistics
  spAtStats: Statistics
  spDfStats: Statistics
  spStats: Statistics

  constructor () {
    this.hpStats = new Statistics()
    this.atStats = new Statistics()
    this.dfStats = new Statistics()
    this.spAtStats = new Statistics()
    this.spDfStats = new Statistics()
    this.spStats = new Statistics()
  }
}

export class GoPokedexStats {
  goAtStats: Statistics
  goDfStats: Statistics
  goHpStats: Statistics

  constructor () {
    this.goAtStats = new Statistics()
    this.goDfStats = new Statistics()
    this.goHpStats = new Statistics()
  }
}

export class PokemonStatisticsInfo {
  pokedexStats: PokedexStats
  goPokedexStats: GoPokedexStats

  constructor () {
    this.pokedexStats = new PokedexStats()
    this.goPokedexStats = new GoPokedexStats()
  }
}

export interface IroiroTypeRankElement {
  twoTypeKey: TwoTypeKey,
  rank: number,
  msgs: Array<string>
}

export class CatchCp {
  min: number
  max: number
  wbMin: number
  wbMax: number
  otherName: string
  otherMin: number
  otherMax: number

  constructor () {
    this.min = 0
    this.max = 0
    this.wbMin = 0
    this.wbMax = 0
    this.otherName = ''
    this.otherMin = 0
    this.otherMax = 0
  }
}

export class PokemonSearchResult {
  message: string
  msgLevel: MsgLevel
  unique: boolean
  goPokedexList: Array<GoPokedex>
  goPokedex: GoPokedex
  maybe: boolean
  hit: boolean
  searched: boolean

  constructor () {
    this.message = ''
    this.msgLevel = 'info'
    this.unique = false
    this.goPokedexList = []
    this.goPokedex = new GoPokedex()
    this.maybe = false
    this.hit = false
    this.searched = false
  }
}

export class MultiSearchResult {
  message: string
  msgLevel: MsgLevel
  allUnique: boolean
  psrArr: Array<PokemonSearchResult>

  constructor () {
    this.message = ''
    this.msgLevel = 'info'
    this.allUnique = false
    this.psrArr = []
  }
}

export class PokemonFilterResult {
  message: string
  msgLevel: MsgLevel
  unique: boolean
  gpAndCpList: Array<GoPokedexAndCp>
  goPokedex: GoPokedexAndCp
  hit: boolean
  filteredItems: Array<DispFilterParam>

  constructor () {
    this.message = ''
    this.msgLevel = 'info'
    this.unique = false
    this.gpAndCpList = []
    this.goPokedex = new GoPokedexAndCp()
    this.hit = false
    this.filteredItems = []
  }
}
