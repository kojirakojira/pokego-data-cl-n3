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
  attacke: number,
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

export interface Hierarchy {
  x: number,
  y: number,
  dist: number,
  id: string,
  bid: string,
  costs: Array<string>,
  goEvo: boolean
}

export interface Color {
  r: number,
  g: number,
  b: number
}

export interface Race {
  pokedexId: string,
  name: string,
  remarks: string,
  pokedex: Pokedex | null | undefined,
  goPokedex: GoPokedex,
  color: Color,
  type1Color: Color,
  type2Color: Color | null | undefined
}

export interface GoPokedexAndCp {
  goPokedex: GoPokedex,
  cp: number
}

export class PokemonSearchResult {
  message: string
  msgLevel: string
  unique: boolean
  goPokedexList: Array<GoPokedex>
  goPokedex: GoPokedex
  maybe: boolean
  hit: boolean
  searched: boolean

  constructor () {
    this.message = ''
    this.msgLevel = ''
    this.unique = false
    this.goPokedexList = []
    this.goPokedex = new GoPokedex()
    this.maybe = false
    this.hit = false
    this.searched = false
  }
}

export interface TwoTypeKey {
  type1: string,
  type2: string | null | undefined
}

export interface XTypeElement {
  twoTypeKey: TwoTypeKey,
  rank: number,
  atkMsgs: Array<string>,
  defMsgs: Array<string>
}
