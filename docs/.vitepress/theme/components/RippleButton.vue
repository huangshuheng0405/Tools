<script setup lang="ts">
// 点击涟漪按钮：在 pointerdown 的落点生成一圈水波，向外扩散后移除。
// 水波尺寸按「落点到最远的那个角」算，保证任意位置点下去都能铺满整个按钮。
import { ref } from 'vue'

withDefaults(defineProps<{ variant?: 'primary' | 'violet' }>(), {
  variant: 'primary',
})

type Wave = { id: number; x: number; y: number; size: number }

const root = ref<HTMLButtonElement | null>(null)
const waves = ref<Wave[]>([])
let seq = 0

function onDown(e: PointerEvent) {
  const el = root.value
  if (!el) return
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return // 尊重「减少动态效果」偏好，不扩散

  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const size =
    2 *
    Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y),
    )
  waves.value = [...waves.value, { id: ++seq, x, y, size }]
}

function onWaveEnd(id: number) {
  waves.value = waves.value.filter((w) => w.id !== id)
}
</script>

<template>
  <button
    ref="root"
    class="ripple-btn"
    :class="`ripple-btn--${variant}`"
    type="button"
    @pointerdown="onDown"
  >
    <span
      v-for="wave in waves"
      :key="wave.id"
      class="ripple-btn__wave"
      :style="{
        left: wave.x + 'px',
        top: wave.y + 'px',
        width: wave.size + 'px',
        height: wave.size + 'px',
      }"
      @animationend="onWaveEnd(wave.id)"
    ></span>
    <span class="ripple-btn__label"><slot /></span>
  </button>
</template>

<style scoped>
.ripple-btn {
  position: relative;
  overflow: hidden;
  padding: 11px 26px;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  isolation: isolate;
}
.ripple-btn--primary {
  background: #0066cc;
}
.ripple-btn--violet {
  background: #7c3aed;
}
.ripple-btn__wave {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  transform: translate(-50%, -50%) scale(0);
  animation: ripple-grow 0.55s ease-out forwards;
}
.ripple-btn__label {
  position: relative;
}
@keyframes ripple-grow {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.55;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
</style>
