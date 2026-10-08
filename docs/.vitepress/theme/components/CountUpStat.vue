<script setup lang="ts">
// 数字滚动演示：进入视口后，数值从 0 缓动到目标值（easeOutCubic），带千分位与小数。
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Stat = {
  label: string
  to: number
  decimals?: number
  suffix?: string
}

const stats: Stat[] = [
  { label: '本月访问', to: 12840 },
  { label: '转化率', to: 3.8, decimals: 1, suffix: '%' },
  { label: '订单数', to: 1296 },
]

const DURATION = 1600

const root = ref<HTMLElement | null>(null)
const shown = ref<number[]>(stats.map(() => 0))

let rafId = 0
let started = false
let io: IntersectionObserver | undefined

function format(value: number, stat: Stat) {
  const [int, frac] = value.toFixed(stat.decimals ?? 0).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return (frac ? grouped + '.' + frac : grouped) + (stat.suffix ?? '')
}

function run() {
  if (started) return
  started = true
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    // 尊重「减少动态效果」偏好：直接落到终值，不做滚动
    shown.value = stats.map((s) => s.to)
    return
  }
  const t0 = performance.now()
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / DURATION)
    const eased = 1 - Math.pow(1 - p, 3)
    shown.value = stats.map((s) => s.to * eased)
    if (p < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !root.value) {
    run()
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        run()
        io?.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  io.observe(root.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  io?.disconnect()
})
</script>

<template>
  <div ref="root" class="count-demo">
    <div v-for="(stat, i) in stats" :key="stat.label" class="count-card">
      <span class="count-card__value">{{ format(shown[i], stat) }}</span>
      <span class="count-card__label">{{ stat.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.count-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  padding: 8px 0;
}
.count-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.count-card__value {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.count-card__label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
@media (max-width: 560px) {
  .count-demo {
    grid-template-columns: 1fr;
  }
}
</style>
