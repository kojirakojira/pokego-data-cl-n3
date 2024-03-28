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
          <div :class="`evo-tree ${id || ''}`.trim()" style="overflow-x: auto;">
            <div style="display: flex;">
              <div v-for="(yArr, i) in evoTreeInfo" :key="i">
                <div v-for="(xArr, yIdx) in yArr" :key="`hierarchy-${yIdx + 1}`" class="hierarchy">
                  <div
                    v-for="(h, xIdx) in xArr"
                    :key="`index${i}-${yIdx + 1}-${xIdx + 1}`"
                    :class="`block index${i}-${yIdx + 1}-${xIdx + 1}`"
                  >
                    <template v-if="h">
                      <div v-if="0 < yIdx" class="edge" />
                      <ul
                        v-if="0 < yIdx"
                        class="costs"
                        @mouseenter="eventMethods().onCostsEnter(`index${i}-${yIdx + 1}-${xIdx + 1}`)"
                        @mouseleave="eventMethods().onCostsLeave(`index${i}-${yIdx + 1}-${xIdx + 1}`)"
                      >
                        <li v-for="(c, ci) in h.costs" :key="`costs${i}-${yIdx + 1}-${xIdx + 1}-${ci}`">
                          <!-- text-overflow:ellipsisとliの中点は共存不可 -->
                          {{ '・' + c }}
                        </li>
                      </ul>
                      <SearchEvolutionPokemon
                        :pid="h.id"
                        :name="raceMap[h.id].goPokedex.name"
                        :remarks="raceMap[h.id].goPokedex.remarks"
                        :link="h.id === pid"
                        :click-action="() => { useRouter().push({ name: routerLink, query: { pid: h.id }})}"
                        :marker="h.id === pid"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <ul v-if="evoTreeAnnos.length" class="evo-tree-annos">
              <li v-for="(anno, i) in evoTreeAnnos" :key="`anno-${i}`">
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
          <v-row :class="`another-form ${id || ''}`.trim()">
            <v-col v-for="itemPid in anotherForms" :key="`aot-form-${itemPid}`" class="pa-0">
              <div :class="`block aot-form-${itemPid}`">
                <SearchEvolutionPokemon
                  :pid="itemPid"
                  :name="raceMap[itemPid].goPokedex.name"
                  :remarks="raceMap[itemPid].goPokedex.remarks"
                  :click-action="() => { useRouter().push({ name: routerLink, query: { pid: itemPid }})}"
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
          <v-row :class="`bfaf-another-form ${id || ''}`.trim()">
            <v-col v-for="itemPid in bfAfAotForms" :key="`aot-form-${itemPid}`" class="pa-0">
              <div :class="`block bfaf-aot-form-${itemPid}`">
                <SearchEvolutionPokemon
                  :pid="itemPid"
                  :name="raceMap[itemPid].goPokedex.name"
                  :remarks="raceMap[itemPid].goPokedex.remarks"
                  :click-action="() => { useRouter().push({ name: routerLink, query: { pid: itemPid } })}"
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
import { TypeColorUtils } from '~/utils/editUtils'
import type { Hierarchy, Race, GoPokedex } from '~/components/interface/api/dto'
import type { Grid } from '~/components/interface/common/layout'

const props = withDefaults(
  defineProps<{
    id?: string | null, // このコンポーネントの一意になるID
    pid: string, // 図鑑ID
    evoTreeInfo: Array<Array<Array<Hierarchy | null>>>, // 進化ツリー
    anotherForms: Array<string>, // 別のすがた
    bfAfAotForms: Array<string>, // 同系統のポケモン（別のすがたの進化前、進化後）
    raceMap: Record<string, Race>, // 種族値マップ
    evoTreeAnnos?: Array<any>, // 進化ツリーの注釈
    routerLink?: string, // ポケモンクリック時の遷移先
    grid?: Array<Grid> // VuetifyのGrid。配列の要素数は固定3つ。
   }>(),
  {
    id: null,
    evoTreeAnnos: () => [],
    routerLink: '',
    grid: () => [{ cols: 12 }, { cols: 12 }, { cols: 12 }]
  }
)
const styleIdArr = ref<Array<string>>([]) // 追加したstyleのclass名の配列

const constant: ConstantValue = constantUtils().get()
const typeColorUtils: TypeColorUtils = new TypeColorUtils(constant.TYPE)

/**
 * スタイル生成ファクトリ関数
 */
const styleFuctoryMethods = () => {
  const makePrefix = (id: string | null): string => {
    return id ? id + '-' : ''
  }
  /** 進化ツリーのノードを描画する。 */
  const drawNode = (yArr: Array<Array<Hierarchy | null>>, raceMap: Record<string, Race>, i: number) => {
    yArr.forEach((xArr: Array<Hierarchy | null>) => {
      xArr.forEach((v) => {
        if (v) {
          const gp: GoPokedex = raceMap[v.id].goPokedex
          const idName = `${makePrefix(props.id)}evotree-index${i}-${v.y}-${v.x}-node`
          let style = `.evo-tree${props.id ? '.' + props.id : ''}`
          style += ` .block.index${i}-${v.y}-${v.x} .pokemon .node {`
          style += `background-color: ${typeColorUtils.getRGB(gp.type1, gp.type2)}; },`
          editUtils().createStyleElem(idName, style, styleIdArr.value)
        }
      })
    })
  }
  /**
   * 進化ツリーのエッジを描画する。
   */
  const drawEdge = (yArr: Array<Array<Hierarchy | null>>, i: number) => {
    yArr.forEach((xArr: Array<Hierarchy | null>) => {
      xArr.forEach((h: Hierarchy | null) => {
        if (h) {
          createEdge(
            i,
            h.x,
            h.y,
            h.dist,
            h.goEvo ? '' : 'border-color: grey; z-index: 49;')
        }
      })
    })
  }
  /**
   * 進化ツリーのノードを結ぶ線（エッジ）のスタイルを作成します。
   *
   * @param i番目のツリー
   * @param x軸
   * @param y軸(上から数える)
   * @param 上位階層からのx軸の距離
   * @param 追加のstyle
   */
  const createEdge = (i: number, x: number, y: number, dist: number, addStyle: string) => {
    // y=1の場合はedgeは生成しない。
    if (y <= 1) { return }

    const idName = `${makePrefix(props.id)}evotree-index${i}-${y}-${x}-edge`
    let style = `.evo-tree${props.id ? '.' + props.id : ''}`
    style += ` .block.index${i}-${y}-${x} .edge {`
    style += `width: ${80 * dist + 1}px;`
    style += `left: ${-80 * dist + 35}px;`
    style += `${addStyle}}`
    style += `.evo-tree${props.id ? '.' + props.id : ''}`
    style += ` .block.index${i}-${y}-${x} .edge:before {`
    style += `width: ${80 * dist + 1}px;`
    style += `left: ${-80 * dist}px;`
    style += `${addStyle}}`

    editUtils().createStyleElem(idName, style, styleIdArr.value)
  }

  /**
   * スタイルを生成・再生成する。
   */
  const refresh = () => {
    // style追加前に、不要なスタイルが残っている場合は削除する。
    styleIdArr.value = editUtils().deleteStyleElem(styleIdArr.value, 'evotree-index')
    styleIdArr.value = editUtils().deleteStyleElem(styleIdArr.value, 'aot-form-')
    styleIdArr.value = editUtils().deleteStyleElem(styleIdArr.value, 'bfaf-aot-form-')

    // 進化ツリー
    props.evoTreeInfo.forEach((arr, i) => {
    // エッジを描画する。
      drawEdge(arr, i)
      // ノードを描画する。（色を設定するだけ。）
      drawNode(arr, props.raceMap, i)
    })

    // 別のすがた
    props.anotherForms.forEach((pid) => {
      const gp: GoPokedex = props.raceMap[pid].goPokedex
      const idName = `${makePrefix(props.id)}aot-form-${pid}`
      let style = `.another-form${props.id ? '.' + props.id : ''}`
      style += ` .block.aot-form-${pid} .node {`
      style += `background-color: ${typeColorUtils.getRGB(gp.type1, gp.type2)}; },`
      editUtils().createStyleElem(idName, style, styleIdArr.value)
    })

    // 同系統のポケモン
    props.bfAfAotForms.forEach((pid) => {
      const gp: GoPokedex = props.raceMap[pid].goPokedex
      const idName = `${makePrefix(props.id)}bfaf-aot-form-${pid}`
      let style = `.bfaf-another-form${props.id ? '.' + props.id : ''}`
      style += ` .block.bfaf-aot-form-${pid} .node {`
      style += `background-color: ${typeColorUtils.getRGB(gp.type1, gp.type2)}; },`
      editUtils().createStyleElem(idName, style, styleIdArr.value)
    })
  }

  return {
    refresh
  }
}
defineExpose({
  refresh: styleFuctoryMethods().refresh
})
// created
styleFuctoryMethods().refresh()

/**
 * onDestroy
 */
onBeforeUnmount(() => {
  // 作成したstyleをすべて削除する
  editUtils().deleteStyleElem(styleIdArr.value)
})
const eventMethods = () => {
  /** costsにマウスカーソルを乗せた際のイベント */
  const onCostsEnter = (className: string): void => {
    const costs = document.getElementsByClassName(className)[0].getElementsByClassName('costs')[0]
    costs.className += ' costs-enter'
  }
  /** costsからマウスカーソルを外した際のイベント */
  const onCostsLeave = (className: string): void => {
    const costs = document.getElementsByClassName(className)[0].getElementsByClassName('costs')[0]
    costs.className = 'costs'
  }

  return {
    onCostsEnter,
    onCostsLeave
  }
}
</script>

<style lang="scss">
.evo-tree {
  background-color: black;
  width: fit-content;

  .hierarchy {
    height: 140px;
    display: flex;
  }

  .evo-tree-annos {
    color: white;
    padding: 0px 16px 8px;
    width: max-content;
    font-size: 12px;

    li::marker {
      content: '※';
    }
  }
}
.another-form,.bfaf-another-form {
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

  .edge {
    content: '';
    position: absolute;
    height: 90px;
    top: -20px;
    border-top: 2px solid yellow;
    border-right: 2px solid yellow;
    border-radius: 0 30px 0 0;
    z-index: 50;
  }
  .edge:before {
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

    &-enter {
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
