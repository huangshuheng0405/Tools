<script setup lang="ts">
// 覆盖层演示：一套逻辑，三种形态（modal 居中 / drawer 侧边 / sheet 底部）
import { ref, watch, onBeforeUnmount } from 'vue'

type Variant = 'modal' | 'drawer' | 'sheet'

const props = withDefaults(defineProps<{ variant?: Variant }>(), { variant: 'modal' })

const open = ref(false)

const triggerText: Record<Variant, string> = {
  modal: '打开模态框',
  drawer: '打开抽屉',
  sheet: '打开底部操作层'
}
const titleText: Record<Variant, string> = {
  modal: '模态框 Modal',
  drawer: '抽屉 Drawer',
  sheet: '底部操作层 Bottom Sheet'
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, (v) => {
  if (typeof document === 'undefined') return
  // 打开时锁住页面滚动
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="ov-demo">
    <button class="ov-trigger" type="button" @click="open = true">
      {{ triggerText[props.variant] }}
    </button>

    <Transition name="ov-fade">
      <div v-if="open" class="ov-mask" @click.self="open = false">
        <Transition :name="`ov-${props.variant}`" appear>
          <div
            v-if="open"
            class="ov-panel"
            :class="`ov-panel--${props.variant}`"
            role="dialog"
            aria-modal="true"
          >
            <header class="ov-panel__head">
              <h3 class="ov-panel__title">{{ titleText[props.variant] }}</h3>
              <button class="ov-panel__close" type="button" aria-label="关闭" @click="open = false">
                ×
              </button>
            </header>
            <div class="ov-panel__body">
              <p>这是一个「{{ titleText[props.variant] }}」示例。点击遮罩、按 Esc，或右上角的 × 都可以关闭。</p>
              <p>三种形态共用同一套逻辑，只是进场方向不同：模态框居中缩放、抽屉从右侧滑入、底部操作层从下方升起。</p>
            </div>
            <footer class="ov-panel__foot">
              <button class="ov-btn ov-btn--ghost" type="button" @click="open = false">取消</button>
              <button class="ov-btn ov-btn--primary" type="button" @click="open = false">确定</button>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ov-demo {
  display: flex;
  justify-content: center;
  padding: 20px 8px;
}
.ov-trigger {
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
.ov-trigger:hover {
  background: #0058b0;
}

/* 遮罩 */
.ov-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.45);
}

/* 面板通用 */
.ov-panel {
  position: fixed;
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--vp-c-bg-elv, #fff);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
}

/* 形态：模态框（居中） */
.ov-panel--modal {
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  scale: 1;
  width: min(440px, calc(100vw - 32px));
  border-radius: 16px;
}
.ov-modal-enter-active,
.ov-modal-leave-active {
  transition:
    opacity 0.24s ease,
    scale 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.ov-modal-enter-from,
.ov-modal-leave-to {
  opacity: 0;
  scale: 0.94;
}

/* 形态：抽屉（右侧） */
.ov-panel--drawer {
  top: 0;
  right: 0;
  height: 100%;
  width: min(340px, 86vw);
  border-radius: 16px 0 0 16px;
}
.ov-drawer-enter-active,
.ov-drawer-leave-active {
  transition: translate 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.ov-drawer-enter-from,
.ov-drawer-leave-to {
  translate: 100% 0;
}

/* 形态：底部操作层 */
.ov-panel--sheet {
  left: 50%;
  bottom: 0;
  translate: -50% 0;
  width: min(520px, 100vw);
  border-radius: 16px 16px 0 0;
}
.ov-sheet-enter-active,
.ov-sheet-leave-active {
  transition: translate 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.ov-sheet-enter-from,
.ov-sheet-leave-to {
  translate: -50% 100%;
}

/* 遮罩淡入淡出 */
.ov-fade-enter-active,
.ov-fade-leave-active {
  transition: opacity 0.25s ease;
}
.ov-fade-enter-from,
.ov-fade-leave-to {
  opacity: 0;
}

/* 面板内部结构 */
.ov-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.ov-panel__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.ov-panel__close {
  flex: none;
  padding: 2px 7px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 19px;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.ov-panel__close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.ov-panel__body {
  flex: 1;
  padding: 18px;
  overflow: auto;
}
.ov-panel__body p {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.ov-panel__foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid var(--vp-c-divider);
}
.ov-btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.ov-btn--ghost {
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}
.ov-btn--ghost:hover {
  background: var(--vp-c-bg-soft);
}
.ov-btn--primary {
  background: #0066cc;
  border: 1px solid #0066cc;
  color: #fff;
}
.ov-btn--primary:hover {
  background: #0058b0;
}

@media (prefers-reduced-motion: reduce) {
  .ov-modal-enter-active,
  .ov-modal-leave-active,
  .ov-drawer-enter-active,
  .ov-drawer-leave-active,
  .ov-sheet-enter-active,
  .ov-sheet-leave-active,
  .ov-fade-enter-active,
  .ov-fade-leave-active {
    transition: none;
  }
}
</style>
