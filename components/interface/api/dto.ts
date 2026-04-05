import type { MsgLevel } from './response'

/**
 * API側で定義したDTO、Response等を表現するインターフェース
 */
export class GoPokedex {
  pokedexId: string
  name: string
  nameEn: string
  attack: number
  defense: number
  hp: number
  remarks: string
  type1: string
  type2: string | null | undefined
  gen: string
  image1: string | null | undefined
  image2: string | null | undefined
  region: string
  tooStrong: boolean
  finEvo: boolean
  releaseDate: string
  implFlg: boolean
  dynamaxImplFlg: boolean
  gigantamaxImplFlg: boolean

  constructor () {
    this.pokedexId = ''
    this.name = ''
    this.nameEn = ''
    this.attack = 0
    this.defense = 0
    this.hp = 0
    this.remarks = ''
    this.type1 = ''
    this.gen = ''
    this.region = ''
    this.tooStrong = false
    this.finEvo = false
    this.releaseDate = ''
    this.implFlg = false
    this.dynamaxImplFlg = false
    this.gigantamaxImplFlg = false
  }
}

export class Pokedex {
  pokedexId: string
  name: string
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
  remarks: string
  type1: string
  type2: string | null | undefined
  gen: string
  image1: string | null | undefined
  image2: string | null | undefined
  implFlg: boolean

  constructor () {
    this.pokedexId = ''
    this.name = ''
    this.hp = 0
    this.attack = 0
    this.defense = 0
    this.specialAttack = 0
    this.specialDefense = 0
    this.speed = 0
    this.remarks = ''
    this.type1 = ''
    this.gen = ''
    this.implFlg = false
  }
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

export class ScpRankAllInOne {
  goPokedex: GoPokedex
  sl: ScpRank
  hl: ScpRank
  ml: ScpRank

  constructor () {
    this.goPokedex = new GoPokedex()
    this.sl = new ScpRank()
    this.hl = new ScpRank()
    this.ml = new ScpRank()
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

export interface EvolutionEdge {
  pokedexId: string,
  beforePokedexId: string,
  goPokedex: GoPokedex,
  beforeGoPokedex: GoPokedex,
  annos: Array<string>
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

export class RaceGoRank {
  hp: number
  attack: number
  defense: number

  constructor () {
    this.hp = 1
    this.attack = 1
    this.defense = 1
  }
}

export class RaceOriRank {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number

  constructor () {
    this.hp = 1
    this.attack = 1
    this.defense = 1
    this.specialAttack = 1
    this.specialDefense = 1
    this.speed = 1
  }
}

export class Race {
  pokedexId: string
  name: string
  remarks: string
  pokedex: Pokedex | null | undefined
  goPokedex: GoPokedex
  goRank?: RaceGoRank
  oriRank?: RaceOriRank

  constructor () {
    this.pokedexId = ''
    this.name = ''
    this.remarks = ''
    this.goPokedex = new GoPokedex()
  }
}

export class RaceDiffElem {
  race: Race
  cp: number

  constructor () {
    this.race = new Race()
    this.cp = 0
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

export class GppAndCp {
  no: number
  goPokedex: GoPokedex
  pokedex: Pokedex
  cp: number

  constructor () {
    this.no = 0
    this.goPokedex = new GoPokedex()
    this.pokedex = new Pokedex()
    this.cp = 0
  }
}

export class GoPokedexAndCpPl {
  goPokedex: GoPokedex
  cp: number
  pl: string

  constructor () {
    this.goPokedex = new GoPokedex()
    this.cp = 0
    this.pl = '0'
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

export class AfterEvolIv {
  goPokedex: GoPokedex
  cp: number
  slRank: number
  hlRank: number
  mlRank: number
  slOver: boolean
  hlOver: boolean

  constructor () {
    this.goPokedex = new GoPokedex()
    this.cp = 0
    this.slRank = 0
    this.hlRank = 0
    this.mlRank = 0
    this.slOver = false
    this.hlOver = false
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
  image1: string,
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

export class IvRangeCp {
  min: number
  max: number
  wbMin: number
  wbMax: number
  name: string

  constructor () {
    this.min = 0
    this.max = 0
    this.wbMin = 0
    this.wbMax = 0
    this.name = ''
  }
}

export class CatchCp {
  normal: IvRangeCp
  others: Array<IvRangeCp>

  constructor () {
    this.normal = new IvRangeCp()
    this.others = []
  }
}

export class FastGymParam {
  gymPower: number
  energy: number
  dps: number
  eps: number
  damageSeconds: number
  totalSeconds: number

  constructor () {
    this.gymPower = 0
    this.energy = 0
    this.dps = 0
    this.eps = 0
    this.damageSeconds = 0
    this.totalSeconds = 0
  }
}

export class FastPvpParam {
  pvpPower: number
  energy: number
  turns: number
  dpt: number
  ept: number

  constructor () {
    this.pvpPower = 0
    this.energy = 0
    this.turns = 0
    this.dpt = 0
    this.ept = 0
  }
}

export class DispFastAttack {
  no: number
  moveId: string
  name: string
  type: string
  gymRaid: FastGymParam
  pvp: FastPvpParam

  constructor () {
    this.no = 0
    this.moveId = ''
    this.name = ''
    this.type = ''
    this.gymRaid = new FastGymParam()
    this.pvp = new FastPvpParam()
  }
}

export interface DispPokemonFastAttack extends DispFastAttack {
  learningPattern: string,
  learningPatternName: string
}

export class ChargedGymParam {
  no: number
  gymPower: number
  dps: number
  damageSeconds: number
  totalSeconds: number
  energyBar: number

  constructor () {
    this.no = 0
    this.gymPower = 0
    this.dps = 0
    this.damageSeconds = 0
    this.totalSeconds = 0
    this.energyBar = 0
  }
}

export interface BuffContent {
  target1: string,
  target2: string,
  buffEffect: number
}

export class Buff {
  buffList: Array<BuffContent>
  buffMsg: string
  activationChance: number
  activationChanceStr: string

  constructor () {
    this.buffList = []
    this.buffMsg = ''
    this.activationChance = 0
    this.activationChanceStr = ''
  }
}

export class ChargedPvpParam {
  pvpPower: number
  energy: number
  dpe: number
  buff: Buff

  constructor () {
    this.pvpPower = 0
    this.energy = 0
    this.dpe = 0
    this.buff = new Buff()
  }
}

export class DispChargedAttack {
  moveId: string
  name: string
  type: string
  gymRaid: ChargedGymParam
  pvp: ChargedPvpParam

  constructor () {
    this.moveId = ''
    this.name = ''
    this.type = ''
    this.gymRaid = new ChargedGymParam()
    this.pvp = new ChargedPvpParam()
  }
}

export interface DispPokemonChargedAttack extends DispChargedAttack {
  learningPattern: string,
  learningPatternName: string,
  learningPatternAnnos?: string
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
  gpAndCpList: Array<GppAndCp>
  goPokedex: GppAndCp
  hit: boolean
  filteredItems: Array<DispFilterParam>

  constructor () {
    this.message = ''
    this.msgLevel = 'info'
    this.unique = false
    this.gpAndCpList = []
    this.goPokedex = new GppAndCp()
    this.hit = false
    this.filteredItems = []
  }
}

export interface PidAndName {
  pid?: string,
  name: string
}

export class SimpMove {
  moveId: string
  name: string

  constructor () {
    this.moveId = ''
    this.name = ''
  }
}

export class MoveSearchResult {
  message: string
  msgLevel: MsgLevel
  unique: boolean
  simpMoveList: Array<SimpMove>
  simpMove: SimpMove
  maybe: boolean
  hit: boolean
  searched: boolean

  constructor () {
    this.message = ''
    this.msgLevel = 'info'
    this.unique = false
    this.simpMoveList = []
    this.simpMove = new SimpMove()
    this.maybe = false
    this.hit = false
    this.searched = false
  }
}

export class FastAttackRank {
  gymPowerRank: number
  gymEnergyIncrAmountRank: number
  dpsRank: number
  epsRank: number
  damageSecondsRank: number
  pvpPowerRank: number
  pvpEnergyIncrAmountRank: number
  dptRank: number
  eptRank: number
  totalCount: number

  constructor () {
    this.gymPowerRank = 0
    this.gymEnergyIncrAmountRank = 0
    this.dpsRank = 0
    this.epsRank = 0
    this.damageSecondsRank = 0
    this.pvpPowerRank = 0
    this.pvpEnergyIncrAmountRank = 0
    this.dptRank = 0
    this.eptRank = 0
    this.totalCount = 0
  }
}

export class ChargedAttackRank {
  gymPowerRank: number
  gymEnergyIncrAmountRank: number
  dpsRank: number
  damageSecondsRank: number
  pvpPowerRank: number
  pvpEnergyIncrAmountRank: number
  dpeRank: number
  totalCount: number

  constructor () {
    this.gymPowerRank = 0
    this.gymEnergyIncrAmountRank = 0
    this.dpsRank = 0
    this.damageSecondsRank = 0
    this.pvpPowerRank = 0
    this.pvpEnergyIncrAmountRank = 0
    this.dpeRank = 0
    this.totalCount = 0
  }
}

export interface GoPokedexAndMoveInfo {
  no: number,
  goPokedex: GoPokedex,
  cp: number,
  learningPattern: string,
  learningPatternName: string,
  learningPatternAnnos: string
}

export class FastAttackDetails {
  generalDescription: string
  fastAttack: DispFastAttack
  fastAttackRank: FastAttackRank
  learnPokemonList: Array<GoPokedexAndMoveInfo>
  sameTypeMoveList: Array<DispFastAttack>

  constructor () {
    this.generalDescription = ''
    this.fastAttack = new DispFastAttack()
    this.fastAttackRank = new FastAttackRank()
    this.learnPokemonList = []
    this.sameTypeMoveList = []
  }
}

export class ChargedAttackDetails {
  generalDescription: string
  chargedAttack: DispChargedAttack
  chargedAttackRank: ChargedAttackRank
  learnPokemonList: Array<GoPokedexAndMoveInfo>
  sameTypeMoveList: Array<DispChargedAttack>

  constructor () {
    this.generalDescription = ''
    this.chargedAttack = new DispChargedAttack()
    this.chargedAttackRank = new ChargedAttackRank()
    this.learnPokemonList = []
    this.sameTypeMoveList = []
  }
}

export interface PokemonAttackCombination {
  goPokedex: GoPokedex,
  faMoveId: string,
  faName: string,
  faType: string,
  fastAttackLearningPattern: string,
  caMoveId: string,
  caName: string,
  caType: string,
  chargedAttackLearningPattern: string,
  faAttackScore: number,
  caAttackScore: number,
  attackScore: number,
  mega: boolean,
  shadow: boolean,
  attribute: string
}

export interface MoveCombination {
  no: number,
  faMoveId: string,
  faName: string,
  faType: string,
  caMoveId: string,
  caName: string,
  caType: string,
  faAttackScore: number,
  caAttackScore: number,
  attackScore: number,
  shadow: boolean
}
