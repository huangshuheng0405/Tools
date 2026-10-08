<script setup lang="ts">
// 3D 倾斜光影面板演示组件：跟随光标做 3D 透视倾斜 + 径向高光，松手带 Spring 阻尼回正
import { ref, onMounted, onBeforeUnmount } from 'vue'

const card = ref<HTMLElement | null>(null)
const glare = ref<HTMLElement | null>(null)

// 弹簧物理参数
const stiffness = 0.12 // 刚度，越大回弹越快
const damping = 0.82 // 阻尼，越大越快停
const maxTilt = 14 // 最大倾斜角度（度）

let rx = 0,
  ry = 0 // 当前倾斜
let trx = 0,
  try_ = 0 // 目标倾斜
let velocityX = 0,
  velocityY = 0 // 弹簧速度
let hovering = false
let rafId = 0

function reset() {
  hovering = false
  trx = 0
  try_ = 0
  if (glare.value) glare.value.style.opacity = '0'
}

function setTarget(clientX: number, clientY: number) {
  const el = card.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = (clientX - rect.left) / rect.width - 0.5
  const py = (clientY - rect.top) / rect.height - 0.5

  try_ = -py * maxTilt
  trx = px * maxTilt

  if (glare.value) {
    glare.value.style.setProperty('--mx', (px + 0.5) * 100 + '%')
    glare.value.style.setProperty('--my', (py + 0.5) * 100 + '%')
    glare.value.style.opacity = '1'
  }
  hovering = true
}

function animate() {
  const ax = (trx - rx) * stiffness
  const ay = (try_ - ry) * stiffness
  velocityX = (velocityX + ax) * damping
  velocityY = (velocityY + ay) * damping
  rx += velocityX
  ry += velocityY

  if (card.value) {
    card.value.style.transform =
      'perspective(800px) rotateX(' + ry.toFixed(3) + 'deg) rotateY(' + rx.toFixed(3) + 'deg)'
  }

  if (
    !hovering &&
    Math.abs(rx) < 0.01 &&
    Math.abs(ry) < 0.01 &&
    Math.abs(velocityX) < 0.01 &&
    Math.abs(velocityY) < 0.01
  ) {
    rx = ry = 0
    velocityX = velocityY = 0
    if (card.value) card.value.style.transform = 'none'
  }

  rafId = requestAnimationFrame(animate)
}

function onMove(e: MouseEvent) {
  setTarget(e.clientX, e.clientY)
}
function onTouch(e: TouchEvent) {
  if (e.touches.length) setTarget(e.touches[0].clientX, e.touches[0].clientY)
}

onMounted(() => {
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return // 尊重「减少动态效果」偏好，直接不启用
  rafId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="tilt-demo">
    <div
      ref="card"
      class="tilt-card"
      @mousemove="onMove"
      @mouseenter="onMove"
      @mouseleave="reset"
      @touchmove="onTouch"
      @touchend="reset"
    >
      <div ref="glare" class="tilt-card__glare"></div>
      <div class="tilt-card__content">
        <span class="tilt-card__tag">3D TILT</span>
        <h3 class="tilt-card__title">Spring 阻尼光影面板</h3>
        <p class="tilt-card__desc">移动光标，卡片随位置倾斜；松开后带阻尼回正。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tilt-demo {
  display: flex;
  justify-content: center;
  padding: 40px 8px;
}
.tilt-card {
  position: relative;
  width: 320px;
  height: 200px;
  border-radius: 20px;
  cursor: pointer;
  will-change: transform;
  transform-style: preserve-3d;
  background: linear-gradient(135deg, #1d1d1f 0%, #2a2a2e 100%);
  color: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}
.tilt-card__glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.08) 40%,
    transparent 70%
  );
  transition: opacity 0.25s ease;
}
.tilt-card__content {
  position: relative;
  z-index: 1;
  padding: 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tilt-card__tag {
  font-size: 12px;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.5);
}
.tilt-card__title {
  margin: 8px 0 6px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.tilt-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}
</style>
