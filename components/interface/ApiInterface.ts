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
