<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  labels: string[]
  datasets: {
    label?: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
  type: 'donut' | 'bar' | 'line'
  class?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '240px',
})

// SVG donut chart rendered inline (no Chart.js dependency)
const donutData = computed(() => {
  if (props.type !== 'donut' || !props.datasets[0]) return null
  const data = props.datasets[0].data
  const colors = props.datasets[0].backgroundColor || ['#017C3D', '#FF6916', '#6B7280', '#EF4444', '#3B82F6']
  const total = data.reduce((a: number, b: number) => a + b, 0)
  if (total === 0) return null
  let cumulative = 0
  const segments = data.map((value: number, i: number) => {
    const startAngle = (cumulative / total) * 360
    cumulative += value
    const endAngle = (cumulative / total) * 360
    return { value, startAngle, endAngle, color: colors[i % colors.length], label: props.labels[i] || `Item ${i + 1}` }
  })
  return { segments, total }
})

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 360) {
    const p1 = polarToCartesian(cx, cy, r, 0)
    const p2 = polarToCartesian(cx, cy, r, 180)
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`
  }
  const s = polarToCartesian(cx, cy, r, endAngle)
  const e = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y} L ${cx} ${cy} Z`
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <!-- Donut Chart -->
    <template v-if="type === 'donut' && donutData">
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <svg :width="height" :height="height" viewBox="0 0 200 200" class="shrink-0">
          <template v-for="(seg, i) in donutData.segments" :key="i">
            <path
              :d="describeArc(100, 100, 80, seg.startAngle, seg.endAngle)"
              :fill="seg.color"
              stroke="white"
              stroke-width="2"
              class="transition-all duration-500 hover:opacity-90 cursor-pointer"
            />
          </template>
          <circle cx="100" cy="100" r="50" fill="white" />
          <text x="100" y="95" text-anchor="middle" class="text-[24px] font-bold" fill="#111827">{{ donutData.total }}</text>
          <text x="100" y="115" text-anchor="middle" class="text-[11px]" fill="#6B7280">Total Suara</text>
        </svg>
        <!-- Legend -->
        <div class="flex-1 space-y-2 min-w-0">
          <div v-for="(seg, i) in donutData.segments" :key="i" class="flex items-center gap-2 text-sm">
            <span class="size-3 shrink-0 rounded-full" :style="{ background: seg.color }" />
            <span class="truncate text-gray-700">{{ seg.label }}</span>
            <span class="ml-auto font-semibold text-gray-900">{{ seg.value }}</span>
            <span class="text-xs text-gray-500">
              ({{ donutData.total > 0 ? Math.round((seg.value / donutData.total) * 100) : 0 }}%)
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Bar Chart (simple) -->
    <template v-if="type === 'bar'">
      <div :style="{ minHeight: height }" class="flex items-end gap-2 px-2">
        <div
          v-for="(val, i) in datasets[0]?.data || []"
          :key="i"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <span class="text-xs font-semibold text-gray-900">{{ val }}</span>
          <div
            class="w-full rounded-t-md bg-primary-500 transition-all duration-500 min-h-[4px]"
            :style="{ height: Math.max((val / Math.max(...(datasets[0]?.data || [1]))) * 100, 2) + '%' }"
          />
          <span class="text-[10px] text-gray-500 truncate w-full text-center">{{ labels[i] }}</span>
        </div>
      </div>
    </template>

    <!-- Line / fallback -->
    <template v-if="type === 'line'">
      <div :style="{ minHeight: height }" class="flex items-center justify-center text-sm text-gray-400">
        Grafik garis — silakan integrasikan library chart pilihan (Chart.js/ApexCharts)
      </div>
    </template>
  </div>
</template>
