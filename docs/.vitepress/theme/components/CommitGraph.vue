<script setup lang="ts">
import { ref } from 'vue'
import contrib from '../../data/contrib.json'

const DAY = 86_400_000
const days = (contrib as { days: Record<string, number> }).days
const refDate = (contrib as { refDate: string }).refDate

// 以快照中的 refDate 为“今天”，SSR 与客户端渲染完全一致
const today0 = (() => {
  const [y, m, d] = refDate.split('-').map(Number)
  return new Date(y, m - 1, d)
})()

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const keyOf = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// 网格起点：当前周所在的那个周日起算，往左 52 周 → 共 53 列(周)，每列 Sun→Sat
const start = new Date(today0.getTime() - (52 * 7 + today0.getDay()) * DAY)

interface Cell {
  date: Date
  key: string
  count: number
  future: boolean
}

const cells: Cell[] = Array.from({ length: 53 * 7 }, (_, i) => {
  const date = new Date(start.getTime() + i * DAY)
  const future = date.getTime() > today0.getTime()
  const key = keyOf(date)
  return { date, key, count: future ? 0 : days[key] || 0, future }
})

// 顶部月份标签：取每个“某月 1 日”所在的那一列；首列若没有 1 日则标开始那月
const monthLabels: { col: number; text: string }[] = []
{
  const byCol = new Map<number, string>()
  cells.forEach((c, i) => {
    if (!c.future && c.date.getDate() === 1) {
      byCol.set(Math.floor(i / 7), `${c.date.getMonth() + 1}月`)
    }
  })
  if (!byCol.has(0)) byCol.set(0, `${start.getMonth() + 1}月`)
  for (const [col, text] of byCol) monthLabels.push({ col, text })
  monthLabels.sort((a, b) => a.col - b.col)
}

// 左侧星期标签：行序 = 周日(0)…周六(6)
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const active = cells
  .filter((c) => !c.future && c.count > 0)
  .map((c) => c.count)
  .sort((a, b) => a - b)

const commits = active.reduce((a, b) => a + b, 0)
const activeDays = active.length

// 对齐 GitHub：级别取决于提交量的相对分布而非活跃天排名，
// 多数普通天保持浅色，只把少量峰值天标深；GitHub 官方未公开精确算法，
// 这里用“活跃天提交数的第 50/80/95 分位”作为 1/2/3 级上界来逼近
const pct = (q: number) =>
  active.length
    ? active[Math.min(active.length - 1, Math.floor(q * active.length))]
    : 0
const t1 = pct(0.5)
const t2 = pct(0.8)
const t3 = pct(0.95)

function levelOf(c: Cell): number {
  if (c.future || c.count === 0) return 0
  if (c.count <= t1) return 1
  if (c.count <= t2) return 2
  if (c.count <= t3) return 3
  return 4
}

// 悬停浮层：跟随鼠标显示 日期 · 次数
const tip = ref<{ x: number; y: number; text: string } | null>(null)

function onEnter(e: MouseEvent, c: Cell) {
  if (c.future) {
    tip.value = null
    return
  }
  tip.value = {
    x: e.clientX,
    y: e.clientY,
    text: `${c.key} · ${c.count} 次提交`,
  }
}
</script>

<template>
  <section class="commitgraph" aria-label="近一年提交热力图">
    <p class="cg-cap">
      <span class="cg-prompt">$</span>
      <span>近一年 {{ commits }} 次 · {{ activeDays }} 天</span>
    </p>

    <div class="cg-panel">
      <div
        class="cg-wrap"
        role="img"
        :aria-label="`近一年提交热力图：共 ${commits} 次提交`"
        @mouseleave="tip = null"
      >
        <span
          v-for="(w, r) in WEEKDAYS"
          :key="`day-${r}`"
          class="cg-day"
          :style="{ gridRow: r + 2, gridColumn: 1 }"
          >{{ w }}</span
        >
        <span
          v-for="m in monthLabels"
          :key="`mon-${m.col}`"
          class="cg-month"
          :style="{ gridRow: 1, gridColumn: m.col + 2 }"
          >{{ m.text }}</span
        >
        <span
          v-for="(c, i) in cells"
          :key="`cell-${i}`"
          class="cg-cell"
          :class="c.future ? 'future' : `lv${levelOf(c)}`"
          :style="{ gridRow: (i % 7) + 2, gridColumn: Math.floor(i / 7) + 2 }"
          @mouseenter="(e) => onEnter(e, c)"
        ></span>
      </div>
      <div class="cg-foot">
        <span>少</span>
        <span v-for="n in 5" :key="n" class="cg-swatch" :class="`lv${n - 1}`"></span>
        <span>多</span>
      </div>
    </div>

    <!-- Teleport 到 body：避免被父容器 transform/overflow 裁掉，悬停浮层才能正常出现 -->
    <Teleport to="body">
      <transition name="cg">
        <div v-if="tip" class="cg-tip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
          {{ tip.text }}
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
.commitgraph {
  margin: clamp(48px, 7vh, 84px) auto 0;
  width: 100%;
  max-width: 860px;
  text-align: center;
}

.cg-cap {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 14px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.cg-prompt {
  color: #3fb950;
  user-select: none;
}

.cg-panel {
  display: inline-block;
  max-width: 100%;
  overflow-x: auto;
  padding: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
}

.cg-wrap {
  display: grid;
  grid-template-columns: 16px repeat(53, 13px);
  grid-template-rows: 15px repeat(7, 13px);
  column-gap: 2px;
  row-gap: 2px;
  width: max-content;
}

.cg-day,
.cg-month {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1px;
  font-size: 10px;
  line-height: 1;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  user-select: none;
}

.cg-day {
  justify-content: center;
  padding-right: 0;
}

.cg-month {
  justify-content: flex-start;
  align-items: flex-end;
  padding: 0 0 1px 2px;
}

.cg-cell {
  width: 13px;
  height: 13px;
  border-radius: 3px;
  background: transparent;
  cursor: default;
  transition: transform 0.1s ease;
}

.cg-cell:hover {
  outline: 1.5px solid var(--vp-c-brand-1);
  outline-offset: 1px;
  transform: scale(1.15);
}

/* 过去的“无提交”日 → 灰色格子 */
.cg-cell.lv0 {
  background: #ebedf0;
}

.cg-cell.lv1,
.cg-swatch.lv1 {
  background: #9be9a8;
}
.cg-cell.lv2,
.cg-swatch.lv2 {
  background: #40c463;
}
.cg-cell.lv3,
.cg-swatch.lv3 {
  background: #30a14e;
}
.cg-cell.lv4,
.cg-swatch.lv4 {
  background: #216e39;
}

/* 未来日期不画格子 */
.cg-cell.future {
  background: transparent;
}

.cg-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 10px;
  width: 100%;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.cg-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.cg-tip {
  position: fixed;
  z-index: 100;
  transform: translate(-50%, -135%);
  pointer-events: none;
  padding: 4px 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  white-space: nowrap;
}

.cg-enter-active,
.cg-leave-active {
  transition: opacity 0.15s ease;
}
.cg-enter-from,
.cg-leave-to {
  opacity: 0;
}

:global(.dark) .cg-cell.lv0 {
  background: #21262d;
}
:global(.dark) .cg-cell.lv1,
:global(.dark) .cg-swatch.lv1 {
  background: #0e4429;
}
:global(.dark) .cg-cell.lv2,
:global(.dark) .cg-swatch.lv2 {
  background: #006d32;
}
:global(.dark) .cg-cell.lv3,
:global(.dark) .cg-swatch.lv3 {
  background: #26a641;
}
:global(.dark) .cg-cell.lv4,
:global(.dark) .cg-swatch.lv4 {
  background: #39d353;
}
</style>
