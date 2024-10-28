<template>
  <v-container>
    <v-row>
      <v-col
        :cols="grid[0].cols"
        :sm="grid[0].sm"
        :md="grid[0].md"
        :lg="grid[0].lg"
        :xl="grid[0].xl"
      >
        <h4 class="mt-0 col-title">
          進化ツリー
        </h4>
        <div style="justify-content: center; display: flex;">
          <div :class="$style.evo_tree" style="overflow-x: auto;">
            <div style="display: flex;">
              <div v-for="(yArr, i) in evolTreeInfo" :key="i">
                <div v-for="(xArr, yIdx) in yArr" :key="`hierarchy-${yIdx + 1}`" :class="$style.hierarchy">
                  <div
                    v-for="(h, xIdx) in xArr"
                    :key="`index${i}-${yIdx + 1}-${xIdx + 1}`"
                    :class="$style.block"
                  >
                    <template v-if="h">
                      <div v-if="0 < yIdx" :class="$style.edge1" :style="styleFactoryMethods().edge1Style(h)">
                        <div :class="$style.edge2" :style="styleFactoryMethods().edge2Style(h)" />
                      </div>
                      <ul
                        v-if="0 < yIdx"
                        :class="$style.costs"
                        @mouseenter="eventMethods().onCostsEnter($event)"
                        @mouseleave="eventMethods().onCostsLeave($event)"
                      >
                        <li v-for="(c, ci) in h.costs" :key="`costs${i}-${yIdx + 1}-${xIdx + 1}-${ci}`">
                          <!-- text-overflow:ellipsisとliの中点は共存不可 -->
                          {{ '・' + c }}
                        </li>
                      </ul>
                      <SearchEvolutionPokemon
                        :go-pokedex="raceMap[h.id].goPokedex"
                        :link="h.id === pid"
                        :click-action="() => { useRouter().push({ name: routerLink, query: { pid: h.id }})}"
                        :marker="h.id === pid"
                        :class="$style.pokemon"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <ul v-if="evolTreeAnnos.length" :class="$style.evo_tree_annos">
              <li v-for="(anno, i) in evolTreeAnnos" :key="`anno-${i}`">
                {{ anno }}
              </li>
            </ul>
          </div>
        </div>
      </v-col>
      <v-col
        :cols="grid[1].cols"
        :sm="grid[1].sm"
        :md="grid[1].md"
        :lg="grid[1].lg"
        :xl="grid[1].xl"
      >
        <h4 class="mt-0 col-title">
          別のすがた
        </h4>
        <v-container v-if="anotherForms.length" style="justify-content: center; display: grid;">
          <v-row :class="$style.another_form">
            <v-col v-for="itemPid in anotherForms" :key="`aot-form-${itemPid}`" class="pa-0">
              <div :class="$style.block">
                <SearchEvolutionPokemon
                  :go-pokedex="raceMap[itemPid].goPokedex"
                  :click-action="() => { useRouter().push({ name: routerLink, query: { pid: itemPid }})}"
                  :class="$style.pokemon"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
        <div v-else align="center">
          なし
        </div>
        <h4 class="mt-0 col-title">
          同系統のポケモン
        </h4>
        <v-container v-if="bfAfAotForms.length" style="justify-content: center; display: grid;">
          <v-row :class="$style.bfaf_another_form">
            <v-col v-for="itemPid in bfAfAotForms" :key="`aot-form-${itemPid}`" class="pa-0">
              <div :class="$style.block">
                <SearchEvolutionPokemon
                  :go-pokedex="raceMap[itemPid].goPokedex"
                  :click-action="() => { useRouter().push({ name: routerLink, query: { pid: itemPid } })}"
                  :class="$style.pokemon"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
        <div v-else align="center">
          なし
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Hierarchy, Race } from '~/components/interface/api/dto'
import type { Grid } from '~/components/interface/common/layout'

withDefaults(
  defineProps<{
    pid: string, // 図鑑ID
    evolTreeInfo: Array<Array<Array<Hierarchy | null>>>, // 進化ツリー
    anotherForms: Array<string>, // 別のすがた
    bfAfAotForms: Array<string>, // 同系統のポケモン（別のすがたの進化前、進化後）
    raceMap: Record<string, Race>, // 種族値マップ
    evolTreeAnnos?: Array<any>, // 進化ツリーの注釈
    routerLink?: string, // ポケモンクリック時の遷移先
    grid?: Array<Grid> // VuetifyのGrid。配列の要素数は固定2つ。
   }>(),
  {
    evolTreeAnnos: () => [],
    routerLink: '',
    grid: () => [{ cols: 12 }, { cols: 12 }]
  }
)

/**
 * スタイル生成ファクトリ関数
 */
const styleFactoryMethods = () => {
  const edge1Style = (h: Hierarchy) => {
    return {
      width: `${80 * h.dist + 1}px`,
      left: `${-80 * h.dist + 35}px`,
      borderColor: h.goEvo ? undefined : 'grey',
      zIndex: h.goEvo ? undefined : 49
    }
  }
  const edge2Style = (h: Hierarchy) => {
    return {
      width: `${80 * h.dist + 1}px`,
      left: `${-80 * h.dist}px`,
      borderColor: h.goEvo ? undefined : 'grey',
      zIndex: h.goEvo ? undefined : 49
    }
  }

  return {
    edge1Style,
    edge2Style
  }
}

const evoStyle = useCssModule()
const eventMethods = () => {
  /** costsにマウスカーソルを乗せた際のイベント */
  const onCostsEnter = (event: MouseEvent): void => {
    const elem: Element = event.target as Element
    elem.className += ' ' + evoStyle.costs_enter
  }
  /** costsからマウスカーソルを外した際のイベント */
  const onCostsLeave = (event: MouseEvent): void => {
    const elem: Element = event.target as Element
    elem.className = evoStyle.costs
  }

  return {
    onCostsEnter,
    onCostsLeave
  }
}
</script>

<style lang="scss" module>
.evo_tree {
  background-color: black;
  width: fit-content;

  .hierarchy {
    height: 140px;
    display: flex;
  }

  .evo_tree_annos {
    color: white;
    padding: 0px 16px 8px;
    width: max-content;
    font-size: 12px;

    li::marker {
      content: '※';
    }
  }
}
.another_form,.bfaf_another_form {
  background-color: black;
  width: fit-content;

  .block {
    height: 60px;
  }
}
.block {
  width: 160px;
  display: flex;
  position: relative;
  align-items: center;

  .edge1 {
    content: '';
    position: absolute;
    height: 90px;
    top: -20px;
    border-top: 2px solid yellow;
    border-right: 2px solid yellow;
    border-radius: 0 30px 0 0;
    z-index: 50;
  }
  .edge2 {
    content: '';
    position: absolute;
    height: 50px;
    top: -50px;
    border-bottom: 2px solid yellow;
    border-left: 2px solid yellow;
    border-radius: 0 0 0 30px;
    z-index: 50;
  }

  .pokemon {
    margin-left: 15px;
  }

  .costs {
    position: absolute;
    left: 45px;
    top: -10px;
    color: white;
    font-size: 11px;
    z-index: 52;
    width: calc(100% - 45px);
    padding-left: 0px;

    li {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &_enter {
      background-color: #F5F5F5;
      color: black;
      border-radius: 2px;
      font-weight: bold;
      height: auto;
      width: max-content;
      padding-right: 5px;
      z-index: 53;

      li {
        white-space: normal;
      }
    }
  }
}
</style>
