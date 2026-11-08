<script setup lang="ts">
// 编辑部摘引风格卡片：衬线引号 + 左侧细色条，进入视口时轻量浮现
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

withDefaults(
  defineProps<{
    title?: string
    color?: string
  }>(),
  {
    title: '',
    color: '',
  }
)

const root = ref<HTMLDivElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  ctx = gsap.context((self) => {
    const bar = self.selector?.('.cbc__bar')[0]
    const quote = self.selector?.('.cbc__quote')[0]

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.value,
        start: 'top 85%',
        once: true,
      },
      defaults: { ease: 'power2.out' },
    })

    tl.fromTo(
      root.value,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.5 }
    )
      .fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: 0.35 }, 0.1)
      .fromTo(
        quote,
        { autoAlpha: 0, scale: 1.6 },
        { autoAlpha: 1, scale: 1, duration: 0.3 },
        0.25
      )
      // 清掉入场动画的 inline transform，否则会压住 CSS 的 hover 上浮
      .eventCallback('onComplete', () => {
        gsap.set(root.value, { clearProps: 'transform,opacity,visibility' })
      })
  }, root.value)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="cbc" :style="color ? { '--cbc-accent': color } : null">
    <span class="cbc__bar" aria-hidden="true"></span>
    <p v-if="title" class="cbc__title">
      <span class="cbc__quote" aria-hidden="true">&ldquo;</span>{{ title }}
    </p>
    <div class="cbc__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cbc {
  --cbc-accent: var(--vp-c-brand-1);
  position: relative;
  margin: 16px 0;
  padding: 14px 18px;
  border: 1px solid color-mix(in srgb, var(--cbc-accent) 18%, var(--vp-c-divider));
  border-radius: 8px;
  background: color-mix(in srgb, var(--cbc-accent) 5%, var(--vp-c-bg-soft));
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

/* hover 上浮：轻微抬升 + 品牌色柔光投影 */
.cbc:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--cbc-accent) 32%, var(--vp-c-divider));
  box-shadow: 0 6px 16px color-mix(in srgb, var(--cbc-accent) 14%, rgba(0, 0, 0, 0.05));
}

@media (prefers-reduced-motion: reduce) {
  .cbc {
    transition: none;
  }
}

.cbc__bar {
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 2px;
  border-radius: 0 2px 2px 0;
  background: var(--cbc-accent);
  transform-origin: top center;
}

.cbc__title {
  display: flex;
  align-items: baseline;
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-1);
}

/* 大号衬线引号：杂志摘引的视觉标记 */
.cbc__quote {
  margin-right: 6px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 0.6;
  color: color-mix(in srgb, var(--cbc-accent) 60%, transparent);
}

.cbc__content :deep(p) {
  margin: 4px 0;
  line-height: 1.7;
}
</style>
