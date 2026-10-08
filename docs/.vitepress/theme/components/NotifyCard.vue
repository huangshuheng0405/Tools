<script setup lang="ts">
// 通知卡片演示：点击按钮后，在浏览器右上角弹出一张卡片，3.5s 后自动收起，也可手动关闭
import { ref, onBeforeUnmount } from 'vue'

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

// 再次点击时先收起再弹出，保证入场动画能重新播放
function show() {
  clearTimer()
  visible.value = false
  requestAnimationFrame(() => {
    visible.value = true
    timer = setTimeout(() => {
      visible.value = false
    }, 3500)
  })
}

function close() {
  clearTimer()
  visible.value = false
}

onBeforeUnmount(clearTimer)
</script>

<template>
  <div class="nt-demo">
    <button class="nt-trigger" type="button" @click="show">弹出通知</button>

    <Transition name="nt">
      <div v-if="visible" class="nt-card" role="status" aria-live="polite">
        <div class="nt-card__icon" aria-hidden="true">✓</div>
        <div class="nt-card__body">
          <p class="nt-card__title">保存成功</p>
          <p class="nt-card__desc">你的更改已同步到云端。</p>
        </div>
        <button class="nt-card__close" type="button" aria-label="关闭" @click="close">×</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.nt-demo {
  display: flex;
  justify-content: center;
  padding: 24px 8px;
}
.nt-trigger {
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: #0066cc;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.nt-trigger:hover {
  background: #0058b0;
}

/* 固定在视口右上角的通知卡片 */
.nt-card {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 320px;
  max-width: calc(100vw - 40px);
  padding: 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-elv, #fff);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
}
.nt-card__icon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 700;
  background: color-mix(in srgb, #1a7f37 16%, transparent);
  color: #1a7f37;
}
:global(.dark) .nt-card__icon {
  background: color-mix(in srgb, #3fb950 22%, transparent);
  color: #3fb950;
}
.nt-card__body {
  flex: 1;
  min-width: 0;
}
.nt-card__title {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.nt-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.nt-card__close {
  flex: none;
  padding: 2px 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.nt-card__close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* 从右上角滑入 + 淡入 */
.nt-enter-active,
.nt-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.nt-enter-from,
.nt-leave-to {
  opacity: 0;
  transform: translate(24px, -8px);
}

@media (prefers-reduced-motion: reduce) {
  .nt-enter-active,
  .nt-leave-active {
    transition: none;
  }
}
</style>
