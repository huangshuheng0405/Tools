<script setup lang="ts">
// 共享元素转场（FLIP）：点击卡片，卡片「无缝」放大成居中详情面板，关闭时收回原处
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

interface Item {
  id: number
  title: string
  desc: string
  emoji: string
  bg: string
}

const items: Item[] = [
  {
    id: 1,
    title: '设计系统',
    desc: '颜色、间距、字体与组件的统一规范。',
    emoji: '🎨',
    bg: 'linear-gradient(135deg, #0066cc, #00a8ff)'
  },
  {
    id: 2,
    title: '交互动效',
    desc: '让界面有生命力的过渡与反馈。',
    emoji: '✨',
    bg: 'linear-gradient(135deg, #7c3aed, #c026d3)'
  },
  {
    id: 3,
    title: '组件库',
    desc: '可复用、可组合的 UI 积木。',
    emoji: '🧩',
    bg: 'linear-gradient(135deg, #059669, #34d399)'
  }
]

const active = ref<Item | null>(null)
const backdropOn = ref(false)
const panelRef = ref<HTMLElement | null>(null)
let originEl: HTMLElement | null = null
let closeTimer: ReturnType<typeof setTimeout> | undefined

async function open(item: Item, e: MouseEvent) {
  originEl = e.currentTarget as HTMLElement
  const from = originEl.getBoundingClientRect()

  active.value = item
  backdropOn.value = false
  await nextTick()

  const panel = panelRef.value
  if (!panel) return
  const to = panel.getBoundingClientRect()

  const sx = from.width / to.width
  const sy = from.height / to.height
  const dx = from.left - to.left
  const dy = from.top - to.top

  // 先「瞬移」到卡片的位置与尺寸（无过渡）
  panel.style.transition = 'none'
  panel.style.transformOrigin = 'top left'
  panel.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
  panel.style.borderRadius = '12px'
  panel.style.opacity = '0'

  // 下一帧再过渡到最终位置，形成连续平滑缩放
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.style.transition =
        'transform .42s cubic-bezier(.22,1,.36,1), border-radius .42s ease, opacity .28s ease'
      panel.style.transform = 'translate(0, 0) scale(1, 1)'
      panel.style.borderRadius = '20px'
      panel.style.opacity = '1'
      backdropOn.value = true
    })
  })
}

function close() {
  const panel = panelRef.value
  if (!panel || !originEl) {
    active.value = null
    return
  }
  const from = panel.getBoundingClientRect()
  const to = originEl.getBoundingClientRect()

  const sx = to.width / from.width
  const sy = to.height / from.height
  const dx = to.left - from.left
  const dy = to.top - from.top

  backdropOn.value = false
  panel.style.transformOrigin = 'top left'
  panel.style.transition = 'transform .36s cubic-bezier(.4,0,.2,1), border-radius .36s ease'
  panel.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
  panel.style.borderRadius = '12px'

  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    active.value = null
  }, 360)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(active, (v) => {
  if (typeof window === 'undefined') return
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  clearTimeout(closeTimer)
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="se-demo">
    <div class="se-grid">
      <button
        v-for="it in items"
        :key="it.id"
        class="se-card"
        type="button"
        :style="{ background: it.bg }"
        @click="open(it, $event)"
      >
        <span class="se-card__emoji">{{ it.emoji }}</span>
        <span class="se-card__title">{{ it.title }}</span>
      </button>
    </div>

    <div v-if="active" class="se-backdrop" :class="{ 'is-on': backdropOn }" @click="close"></div>

    <div v-if="active" ref="panelRef" class="se-panel" role="dialog" aria-modal="true">
      <button class="se-panel__close" type="button" aria-label="关闭" @click="close">×</button>
      <div class="se-panel__hero" :style="{ background: active.bg }">
        <span class="se-panel__emoji">{{ active.emoji }}</span>
      </div>
      <div class="se-panel__body">
        <h3 class="se-panel__title">{{ active.title }}</h3>
        <p class="se-panel__desc">{{ active.desc }}</p>
        <p class="se-panel__desc">
          共享元素转场：卡片的位置与尺寸被连续插值到详情面板，视觉上像是同一个元素在「长大」，
          而不是两个界面之间的硬切换。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.se-demo {
  padding: 8px 0;
}
.se-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 640px) {
  .se-grid {
    grid-template-columns: 1fr;
  }
}
.se-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 6px;
  height: 112px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  color: #fff;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.se-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
}
.se-card__emoji {
  font-size: 22px;
}
.se-card__title {
  font-size: 14px;
  font-weight: 600;
}

.se-backdrop {
  position: fixed;
  inset: 0;
  z-index: 190;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.se-backdrop.is-on {
  opacity: 1;
}

.se-panel {
  position: fixed;
  inset: 0;
  margin: auto;
  z-index: 191;
  display: flex;
  flex-direction: column;
  width: min(520px, calc(100vw - 32px));
  height: min(340px, 72vh);
  overflow: hidden;
  background: var(--vp-c-bg-elv, #fff);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  opacity: 0;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.4);
}
.se-panel__hero {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 92px;
  font-size: 38px;
}
.se-panel__body {
  flex: 1;
  padding: 18px 20px;
  overflow: auto;
}
.se-panel__title {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.se-panel__desc {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.se-panel__close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
.se-panel__close:hover {
  background: rgba(0, 0, 0, 0.45);
}
</style>
