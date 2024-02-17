import { PokemonSearchResult } from './dto'

export interface Response extends ResData {
    success: boolean,
    message: string,
    msgLevel: string
}

export class ResearchResponse implements Response {
  success = false
  message = ''
  msgLevel = ''

  pokemonSearchResult: PokemonSearchResult
  pokedexId: string
  name: string
  image: string | null | undefined
  remarks: string

  constructor () {
    this.pokemonSearchResult = new PokemonSearchResult()
    this.pokedexId = ''
    this.name = ''
    this.remarks = ''
  }
}
