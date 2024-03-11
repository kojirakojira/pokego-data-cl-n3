<template>
  <Radar :data="data" :options="options" />
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
import { Radar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, RadialLinearScale, LineElement, Filler, Title, Tooltip, Legend)

const props = withDefaults(
  defineProps<{
    title: string,
    labels: Array<string>,
    dataset: Array<number>,
    min: number,
    max: number,
    color: {
      r: number,
      g: number,
      b: number
    }
  }>(),
  {})

const rgb = computed(() => {
  return `${props.color.r}, ${props.color.g}, ${props.color.b}`
})

const data = ref<ChartData<'radar'>>({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: `rgba(${rgb.value}, 0.5)`,
      borderColor: `rgb(${rgb.value})`,
      pointBackgroundColor: `rgb(${rgb.value})`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `rgb(${rgb.value})`,
      data: props.dataset
    }
  ]
})
const options = ref<ChartOptions<'radar'>>({
  plugins: {
    title: {
      display: true,
      text: props.title,
      font: { size: 18 }
    },
    legend: {
      display: false
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
