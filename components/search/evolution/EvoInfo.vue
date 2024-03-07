<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="col-title">
        <h4 style="margin: 0px;">
          進化ツリー
        </h4>
      </v-col>
      <v-col cols="12" style="justify-content: center; display: flex;">
        <div class="evo-tree" style="overflow-x: auto;">
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
                      @mouseenter="onCostsEnter(`index${i}-${yIdx + 1}-${xIdx + 1}`)"
                      @mouseleave="onCostsLeave(`index${i}-${yIdx + 1}-${xIdx + 1}`)"
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
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="col-title">
          <h4 style="margin: 0px;">
            別のすがた
          </h4>
        </div>
      </v-col>
      <v-col>
        <v-container v-if="anotherForms.length" style="justify-content: center; display: grid;">
          <v-row class="another-form">
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
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="col-title">
        <h4 style="margin: 0px;">
          同系統のポケモン
        </h4>
      </v-col>
      <v-col>
        <v-container v-if="bfAfAotForms.length" style="justify-content: center; display: grid;">
          <v-row class="bfaf-another-form">
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
import { type Hierarchy, type Race } from '~/components/interface/api/dto'

const props = withDefaults(
  defineProps<{
    pid: string, // 図鑑ID
    evoTreeInfo: Array<Array<Array<Hierarchy | null>>>, // 進化ツリー
    anotherForms: Array<string>, // 別のすがた
    bfAfAotForms: Array<string>, // 同系統のポケモン（別のすがたの進化前、進化後）
    raceMap: Record<string, Race>, // 種族値マップ
    evoTreeAnnos?: Array<any>, // 進化ツリーの注釈
    routerLink?: string // ポケモンクリック時の遷移先
   }>(),
  { evoTreeAnnos: () => [], routerLink: '' }
)
const styleIdArr = ref<Array<string>>([]) // 追加したstyleのclass名の配列

/**
 * 進化ツリーのノードを描画する。
 */
const drawNode = (yArr: Array<Array<Hierarchy | null>>, raceMap: Record<string, Race>, i: number) => {
  yArr.forEach((xArr: Array<Hierarchy | null>) => {
    xArr.forEach((v) => {
      if (v) {
        const idName = `evotree-index${i}-${v.y}-${v.x}-node`
        const color = raceMap[v.id].color
        const style = `.block.index${i}-${v.y}-${v.x} .pokemon .node {\
            background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
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

  const idName = `evotree-index${i}-${y}-${x}-edge`
  const style =
      `.block.index${i}-${y}-${x} .edge {\
        width: ${80 * dist + 1}px;\
        left: ${-80 * dist + 35}px;\
        ${addStyle}}\
       .block.index${i}-${y}-${x} .edge:before {\
        width: ${80 * dist + 1}px;\
        left: ${-80 * dist}px;\
        ${addStyle}}`

  editUtils().createStyleElem(idName, style, styleIdArr.value)
}

// evoTreeInfoが更新されたらstyleを再生成する
watch(
  props.evoTreeInfo,
  (newValue: Array<Array<Array<Hierarchy | null>>>): void => {
    styleIdArr.value = editUtils().deleteStyleElem(styleIdArr.value, 'evotree-index')

    newValue.forEach((arr, i) => {
    // エッジを描画する。
      drawEdge(arr, i)
      // ノードを描画する。（色を設定するだけ。）
      drawNode(arr, props.raceMap, i)
    })
  },
  { immediate: true })

/**
 * 別のすがた
 */
watch(
  props.anotherForms,
  (newValue: Array<string>): void => {
    // style追加前に、不要なスタイルが残っている場合は削除する。
    styleIdArr.value = editUtils().deleteStyleElem(styleIdArr.value, 'aot-form-')
    // 描画(styleの追加)
    newValue.forEach((pid) => {
      const idName = `aot-form-${pid}`
      const color = props.raceMap[pid].color
      const style = `.block.aot-form-${pid} .node {\
            background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
      editUtils().createStyleElem(idName, style, styleIdArr.value)
    })
  },
  { immediate: true })

/**
 * 同系統のポケモン
 */
watch(
  props.bfAfAotForms,
  (newValue: Array<string>): void => {
  // style追加前に、不要なスタイルが残っている場合は削除する。
    styleIdArr.value = editUtils().deleteStyleElem(styleIdArr.value, 'bfaf-aot-form-')
    // 描画(styleの追加)
    newValue.forEach((pid) => {
      const idName = `bfaf-aot-form-${pid}`
      const color = props.raceMap[pid].color
      const style = `.block.bfaf-aot-form-${pid} .node {\
          background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
      editUtils().createStyleElem(idName, style, styleIdArr.value)
    })
  },
  { immediate: true })

/**
 * onDestroy
 */
onBeforeUnmount(() => {
  // 作成したstyleをすべて削除する
  editUtils().deleteStyleElem(styleIdArr.value)
})

/**
 * costsにマウスカーソルを乗せた際のイベント
 */
const onCostsEnter = (index: string): void => {
  const costs = document.getElementsByClassName(index)[0].getElementsByClassName('costs')[0]
  costs.className += ' costs-enter'
}
/**
 * costsからマウスカーソルを外した際のイベント
 */
const onCostsLeave = (index: string): void => {
  const costs = document.getElementsByClassName(index)[0].getElementsByClassName('costs')[0]
  costs.className = 'costs'
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
    padding-bottom: 5px;
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
