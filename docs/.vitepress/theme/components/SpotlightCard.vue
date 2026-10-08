<script setup lang="ts">
// 光标光斑演示：鼠标在卡片上移动时，把光标位置写成 --mx/--my，光斑和描边用径向渐变跟着走。
// 纯指针驱动，没有逐帧动画，所以不需要 requestAnimationFrame。
import { ref } from 'vue'

const card = ref<HTMLElement | null>(null)

function setFromPoint(clientX: number, clientY: number) {
  const el = card.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', ((clientX - rect.left) / rect.width) * 100 + '%')
  el.style.setProperty('--my', ((clientY - rect.top) / rect.height) * 100 + '%')
}

function onMove(e: MouseEvent) {
  setFromPoint(e.clientX, e.clientY)
}

function onTouch(e: TouchEvent) {
  if (e.touches.length) setFromPoint(e.touches[0].clientX, e.touches[0].clientY)
}
</script>

<template>
  <div class="spot-demo">
    <div ref="card" class="spot-card" @mousemove="onMove" @touchmove="onTouch">
      <div class="spot-card__glow"></div>
      <div class="spot-card__content">
        <span class="spot-card__tag">SPOTLIGHT</span>
        <h3 class="spot-card__title">光标光斑</h3>
        <p class="spot-card__desc">移动光标，一束柔光跟着走，边缘也会在近处被点亮；离开后淡出。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spot-demo {
  display: flex;
  justify-content: center;
  padding: 40px 8px;
}
.spot-card {
  position: relative;
  width: 320px;
  height: 190px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: #14151a;
  color: #fff;
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.35);
}
.spot-card__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
  background: radial-gradient(
    220px circle at var(--mx, 50%) var(--my, 50%),
    rgba(0, 168, 255, 0.3),
    transparent 62%
  );
}
.spot-card::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
  background: radial-gradient(
    170px circle at var(--mx, 50%) var(--my, 50%),
    rgba(0, 168, 255, 0.9),
    transparent 60%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
}
.spot-card:hover .spot-card__glow,
.spot-card:focus-within .spot-card__glow,
.spot-card:hover::after,
.spot-card:focus-within::after {
  opacity: 1;
}
.spot-card__content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.spot-card__tag {
  font-size: 12px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.5);
}
.spot-card__title {
  margin: 8px 0 6px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.spot-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}
</style>
