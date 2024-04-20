import { PokemonSearchResult } from './dto'

export type MsgLevel = 'info' | 'warn' | 'error'

export class Response implements ResData {
  success: boolean
  message: string
  msgLevel: MsgLevel

  constructor () {
    this.success = false
    this.message = ''
    this.msgLevel = 'info'
  }
}

export class ResearchResponse extends Response {
  pokemonSearchResult: PokemonSearchResult
  pokedexId: string
  name: string
  image1: string | null | undefined
  image2: string | null | undefined
  remarks: string

  constructor () {
    super()
    this.pokemonSearchResult = new PokemonSearchResult()
    this.pokedexId = ''
    this.name = ''
    this.remarks = ''
  }
}
