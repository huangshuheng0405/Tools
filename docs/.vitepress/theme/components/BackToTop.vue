<script setup lang="ts">
// 回到顶部演示：内部滚动容器，往下滚后右下角浮出按钮，点击平滑滚回顶部
import { ref } from 'vue'

const wrap = ref<HTMLElement | null>(null)
const atTop = ref(true)

function onScroll() {
  const el = wrap.value
  if (!el) return
  atTop.value = el.scrollTop <= 80
}

function toTop() {
  wrap.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="btt-demo">
    <div ref="wrap" class="btt-scroll" @scroll="onScroll">
      <p v-for="n in 10" :key="n" class="btt-line">
        {{ n }}. 一段很长的内容，往下滚动试试 —— 右下角会浮出「回到顶部」按钮。
      </p>
    </div>

    <Transition name="btt">
      <button v-if="!atTop" class="btt-btn" type="button" aria-label="回到顶部" @click="toTop">
        ↑
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.btt-demo {
  position: relative;
}
.btt-scroll {
  height: 220px;
  padding: 14px 16px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.btt-line {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.btt-btn {
  position: absolute;
  right: 14px;
  bottom: 14px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #0066cc;
  color: #fff;
  font-size: 17px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 102, 204, 0.4);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}
.btt-btn:hover {
  background: #0058b0;
  transform: translateY(-2px);
}
.btt-enter-active,
.btt-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.9);
}
</style>
