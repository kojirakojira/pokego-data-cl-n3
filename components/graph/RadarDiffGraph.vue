<template>
  <Radar :data="data" :options="options" />
</template>

<script setup lang="ts">
import type { ChartData, ChartDataset, ChartOptions } from 'chart.js'
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
import { Radar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, RadialLinearScale, LineElement, Filler, Title, Tooltip, Legend)

export interface RadarDataset {
  elems: Array<number>,
  label: string,
  color: { r: number, g: number, b: number }
}
const props = withDefaults(
  defineProps<{
    title: string,
    labels: Array<string>,
    datasets: Array<RadarDataset>,
    min: number,
    max: number
  }>(),
  {})

const datasets = computed(() => {
  return props.datasets.map((ds: RadarDataset): ChartDataset<'radar'> => {
    const rgb = `${ds.color.r}, ${ds.color.g}, ${ds.color.b}`
    return {
      label: ds.label,
      backgroundColor: `rgba(${rgb}, 0.2)`,
      borderColor: `rgb(${rgb})`,
      borderWidth: 2,
      pointBackgroundColor: `rgb(${rgb})`,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `rgb(${rgb})`,
      pointRadius: 2,
      data: ds.elems
    }
  })
})

const data = ref<ChartData<'radar'>>({
  labels: props.labels,
  datasets: datasets.value
})
const options = ref<ChartOptions<'radar'>>({
  plugins: {
    title: {
      display: true,
      text: props.title,
      font: { size: 18 }
    },
    tooltip: {
      callbacks: {
        label: (arg) => {
          const raw = arg.raw as number
          return `${props.max - raw + 1}/${props.max}位`
        }
      }
    }
  },
  scales: {
    r: {
      angleLines: {
        display: true
      },
      min: props.min,
      max: props.max,
      ticks: {
        stepSize: (props.max - props.min) / 4,
        display: false
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
})
</script>
