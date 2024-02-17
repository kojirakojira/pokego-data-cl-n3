/**
 * API側で定義したDTO、Response等を表現するインターフェース
 */
export declare interface GoPokedex {
  pokedexId: string,
  name: string,
  attacke: number,
  defense: number,
  hp: number,
  image: string | null | undefined,
  remarks: string,
  type1: string,
  type2: string | null | undefined,
  gen: string,
  implFlg: boolean
}

export declare interface Pokedex {
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

export declare interface Hierarchy {
  x: number,
  y: number,
  dist: number,
  id: string,
  bid: string,
  costs: Array<string>,
  goEvo: boolean
}

export declare interface Color {
  r: number,
  g: number,
  b: number
}

export declare interface Race {
  pokedexId: string,
  name: string,
  remarks: string,
  pokedex: Pokedex | null | undefined,
  goPokedex: GoPokedex,
  color: Color,
  type1Color: Color,
  type2Color: Color | null | undefined
}

export declare interface GoPokedexAndCp {
  goPokedex: GoPokedex,
  cp: number
}

export declare interface PokemonSearchResult {
  message: string,
  msgLevel: string,
  unique: boolean,
  goPokedexList: Array<GoPokedex>,
  goPokedex: GoPokedex,
  maybe: boolean,
  hit: boolean,
  searched: boolean
}

export declare interface ResearchResponse {
  pokemonSearchResult: PokemonSearchResult,
  pokedexId: string,
  name: string,
  image: string | null | undefined,
  remarks: string
}

export declare interface TwoTypeKey {
  type1: string,
  type2: string | null | undefined
}

export declare interface XTypeElement {
  twoTypeKey: TwoTypeKey,
  rank: number,
  atkMsgs: Array<string>,
  defMsgs: Array<string>
}
