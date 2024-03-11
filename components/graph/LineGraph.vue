<template>
  <Line :data="data" :options="options" />
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Filler,
  LineElement
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { reverseRank } from './graphCommon'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, RadialLinearScale, LineElement, Filler, Title, Tooltip, Legend)

const props = withDefaults(
  defineProps<{
    title: string,
    dataset: Array<number>,
    point: number,
    color: {
      r: number,
      g: number,
      b: number
    }
  }>(),
  {})

const forPointArr = computed((): Array<number | null> => {
  // 点を打ちたい要素に値を設定する。
  let flg = false
  const arr = props.dataset.map((num) => {
    let ret = null // chart.jsでは、nullを設定すると点が打たれない。
    if (!flg && num === props.point) {
      ret = num
      flg = true
    }
    return ret
  })
  return arr
})

const rgb = computed(() => {
  return `${props.color.r}, ${props.color.g}, ${props.color.b}`
})

const rankStr = computed((): string => {
  const totalCount = props.dataset.length
  return `${totalCount - reverseRank(props.point, props.dataset)}/${totalCount}位`
})

const data = ref<ChartData<'line'>>({
  labels: props.dataset,
  datasets: [
    // 対象のポケモンのステータス(点)
    {
      data: forPointArr.value,
      pointStyle: 'rectRot',
      pointBorderColor: 'black',
      pointBackgroundColor: 'yellow',
      pointRadius: 8,
      pointHoverRadius: 12,
      showLine: false
    },
    // 全ポケモンのステータス
    {
      data: props.dataset,
      backgroundColor: `rgba(${rgb.value}, 0.2)`,
      borderColor: `rgba(${rgb.value}, 0.1)`,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 0, // マウスカーソルを当てても何もしない
      pointHitRadius: 0 // マウスカーソルを当てても何もしない
    }
  ]
})
const options = ref<ChartOptions<'line'>>({
  plugins: {
    title: {
      display: true,
      text: `${props.title}(${rankStr.value})`,
      font: { size: 14 }
    },
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: () => rankStr.value
      }
    }
  },
  scales: {
    y: {
      ticks: {
        stepSize: 150
      }
    },
    x: {
      grid: {
        display: false // 目盛り
      },
      display: false // ラベル
    }
  },
  responsive: true,
  maintainAspectRatio: false
})
</script>
