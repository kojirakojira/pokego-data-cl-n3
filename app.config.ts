/**
 * 検索系画面の検索パターン
 */
export interface SearchPattern {
  name: string
  isTool?: boolean // tool配下か否か
}
export interface SearchCategory {
  name: string
  patternNames: Record<string, SearchPattern>
}
// searchPatternNames全体の型
export type SearchPatternNames = Record<string, SearchCategory>

export default defineAppConfig({
  searchPatternNames: {
    main: {
      name: '一般',
      patternNames: {
        searchAll: { name: 'ポケモン検索' },
        filterAll: { name: 'ポケモン一覧' }
      }
    },
    pinnacle: {
      name: '最強ポケモンランキング',
      patternNames: {
        gymRaidPinnacleRank: { name: 'ジム・レイド対策ポケモンランキング' }
      }
    },
    captureCp: {
      name: '捕獲時CP',
      patternNames: {
        wild: { name: '野生CP', isTool: true },
        raid: { name: 'レイドボス勝利ボーナスCP', isTool: true },
        frTask: { name: 'フィールドリサーチCP', isTool: true },
        eggs: { name: 'タマゴCP', isTool: true },
        rocket: { name: 'ロケット団勝利ボーナスCP', isTool: true },
        dynamax: { name: 'MAX,G-MAX勝利ボーナスCP', isTool: true }
      }
    },
    race: {
      name: '種族値',
      patternNames: {
        race: { name: '種族値検索', isTool: true },
        raceDiff: { name: '種族値比較' }
      }
    },
    iv: {
      name: '個体値',
      patternNames: {
        scpRank: { name: 'PvP順位', isTool: true },
        scpRankList: { name: 'PvP順位ランキング', isTool: true },
        scpRankMaxMin: { name: 'PvP最高(最低)順位', isTool: true },
        afterEvoScpRank: { name: '進化後PvP順位', isTool: true },
        afterEvoCp: { name: '進化後CP', isTool: true },
        threeGalarBirds: { name: 'ガラル三鳥の野生個体値', isTool: true },
        cpIv: { name: 'CP→個体値検索', isTool: true },
        cp: { name: '個体値→CP算出', isTool: true },
        plList: { name: 'PLごとのCPリスト', isTool: true },
        cpRank: { name: 'CP順位', isTool: true },
        cpRankList: { name: 'CPランキング', isTool: true }
      }
    },
    moves: {
      name: '技',
      patternNames: {
        moveLookup: { name: '技検索', isTool: true },
        filterAllMove: { name: '技一覧', isTool: true },
        pokemonAttack: { name: 'ポケモンが覚える技', isTool: true },
        gymRaidPokeMoveCombi: { name: '技の組み合わせランキング(ジム・レイド)', isTool: true }
      }
    },
    type: {
      name: 'タイプ',
      patternNames: {
        typeScore: { name: 'タイプ評価', isTool: true },
        xType: { name: 'Xタイプ検索', isTool: true },
        iroiroTypeRank: { name: '色々タイプランキング', isTool: true }
      }
    },
    others: {
      name: 'その他',
      patternNames: {
        unimplPokemon: { name: '未実装ポケモンリスト' },
        dynamaxImplPokemon: { name: 'MAX,G-MAX実装済みリスト' },
        evoCost: { name: '進化コスト', isTool: true },
        evolution: { name: '進化ツリーと別のすがた', isTool: true }
      }
    }
  }
})
