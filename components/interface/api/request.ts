export class ResearchRequest {
  pid: string | null | undefined
  name: string | null | undefined
  type1: string
  type2: string
  finEvo: boolean
  negaFinEvo: boolean
  mega: boolean
  negaMega: boolean
  impled: boolean
  negaImpled: boolean
  tooStrong: boolean
  negaTooStrong: boolean
  region: Array<string>
  negaRegion: boolean
  gen: Array<string>
  negaGen: boolean
  enableCount: boolean

  constructor () {
    this.type1 = ''
    this.type2 = ''
    this.finEvo = false
    this.negaFinEvo = false
    this.mega = false
    this.negaMega = false
    this.impled = false
    this.negaImpled = false
    this.tooStrong = false
    this.negaTooStrong = false
    this.region = []
    this.negaRegion = false
    this.gen = []
    this.negaGen = false
    this.enableCount = false
  }

  clear () {
    this.type1 = ''
    this.type2 = ''
    this.finEvo = false
    this.negaFinEvo = false
    this.mega = false
    this.negaMega = false
    this.impled = false
    this.negaImpled = false
    this.tooStrong = false
    this.negaTooStrong = false
    this.region = []
    this.negaRegion = false
    this.gen = []
    this.negaGen = false
    this.enableCount = false
  }
}
