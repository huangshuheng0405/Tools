<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useData } from 'vitepress'
import CommitGraph from './CommitGraph.vue'

const { page } = useData()

// 只接管中文首页，英文首页保持默认 layout
const show = computed(() => (page.value.relativePath || '').startsWith('zh/'))

interface Tag {
  text: string
  link: string
  size: 'xl' | 'lg' | 'md' | 'sm'
}

// 所有链接对应仓库里真实存在的笔记页（与侧边栏一致）
const TAGS: Tag[] = [
  { text: 'JavaScript', link: '/zh/JavaScript/', size: 'xl' },
  { text: 'Vue', link: '/zh/vue/lifecycle', size: 'xl' },
  { text: 'React', link: '/zh/react/index', size: 'xl' },

  { text: 'TypeScript', link: '/zh/JavaScript/ts', size: 'lg' },
  { text: 'Spring Boot', link: '/zh/backend/java/springboot/', size: 'lg' },
  { text: 'Node.js', link: '/zh/backend/nodejs/', size: 'lg' },
  { text: 'Docker', link: '/zh/Misc/docker', size: 'lg' },
  { text: 'Git', link: '/zh/Misc/git', size: 'lg' },
  { text: 'Webpack', link: '/zh/Engineering/Webpack/index', size: 'lg' },

  { text: 'Vite', link: '/zh/Engineering/vite', size: 'md' },
  { text: 'Express', link: '/zh/backend/express', size: 'md' },
  { text: 'Koa', link: '/zh/backend/koa', size: 'md' },
  { text: 'MongoDB', link: '/zh/backend/MongoDB', size: 'md' },
  { text: 'Mongoose', link: '/zh/backend/mongoose', size: 'md' },
  { text: 'MySQL', link: '/zh/Misc/database/mysql', size: 'md' },
  { text: 'Redis', link: '/zh/Misc/database/redis', size: 'md' },
  { text: 'MyBatis-Plus', link: '/zh/backend/java/springboot/mybatisPlus', size: 'md' },
  { text: 'JWT', link: '/zh/backend/java/springboot/jwt', size: 'md' },
  { text: 'Pinia', link: '/zh/vue/pinia', size: 'md' },
  { text: 'Nuxt', link: '/zh/vue/nuxt/Structure/app/pages', size: 'md' },
  { text: 'React Hooks', link: '/zh/react/hooks/index', size: 'md' },
  { text: 'XSS', link: '/zh/Security/xss', size: 'md' },
  { text: 'Event Loop', link: '/zh/JavaScript/EventLoop', size: 'md' },
  { text: 'Promise', link: '/zh/JavaScript/Promise', size: 'md' },
  { text: '闭包', link: '/zh/JavaScript/Closure', size: 'md' },
  { text: '原型链', link: '/zh/JavaScript/Prototype_Chain', size: 'md' },

  { text: 'ESLint', link: '/zh/Engineering/ESlint', size: 'sm' },
  { text: 'Prettier', link: '/zh/Engineering/Prettier', size: 'sm' },
  { text: 'Husky', link: '/zh/Engineering/Husky', size: 'sm' },
  { text: 'Rollup', link: '/zh/Engineering/rollup', size: 'sm' },
  { text: 'esbuild', link: '/zh/Engineering/esbuild', size: 'sm' },
  { text: 'Nginx', link: '/zh/Misc/nginx', size: 'sm' },
  { text: 'JMeter', link: '/zh/Misc/jmeter', size: 'sm' },
  { text: 'AOP', link: '/zh/backend/java/springboot/aop', size: 'sm' },
  { text: 'IoC / DI', link: '/zh/backend/java/spring/IoC_DI', size: 'sm' },
  { text: 'Maven', link: '/zh/backend/java/maven/', size: 'sm' },
  { text: '设计模式', link: '/zh/DesignPatterns/index', size: 'sm' },
  { text: 'SSE', link: '/zh/network/SSE', size: 'sm' },
  { text: '虚拟列表', link: '/zh/vue/virtualList', size: 'sm' },
  { text: 'CSS Modules', link: '/zh/react/css/cssModule', size: 'sm' },
  { text: '柯里化', link: '/zh/JavaScript/Curring', size: 'sm' },
]

// 字号档位（像素区间，min → max）：档与档之间留出明显级差，
// 核心知识(JS/Vue/React)超大，逐档锐减到迷你小项；档内再叠稳定哈希轻微浮动。
const SZ_RANGE: Record<Tag['size'], [number, number]> = {
  xl: [26, 30],
  lg: [18, 21],
  md: [14, 16],
  sm: [11, 12],
}

// FNV-1a 风格哈希 → [0,1)，同一标签每次渲染结果一致
function hash01(name: string) {
  let h = 2166136261
  for (const ch of name) {
    h = Math.imul(h ^ (ch.codePointAt(0) ?? 0), 16777619) >>> 0
  }
  return h / 4294967296
}

function tagFontSize(t: Tag) {
  const [lo, hi] = SZ_RANGE[t.size]
  return Math.round((lo + hash01(t.text) * (hi - lo)) * 2) / 2
}

// mulberry32 伪随机，固定种子 → 打乱结果稳定，服务端/客户端渲染一致
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 打乱展示顺序：让大小不一的标签交错出现，而不是按档位一排排排列
const shuffledTags = [...TAGS]
{
  const rnd = mulberry32(20240905)
  for (let i = shuffledTags.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[shuffledTags[i], shuffledTags[j]] = [shuffledTags[j], shuffledTags[i]]
  }
}

let ctx: any = null

onMounted(async () => {
  if (!show.value) return

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  const mod = await import('gsap')
  const gsap = mod.gsap ?? (mod as any).default

  ctx = gsap.context(() => {
    gsap.from('.hl-rv', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.05,
    })
    gsap.from('.fs-tag', {
      opacity: 0,
      y: 12,
      scale: 0.92,
      duration: 0.45,
      ease: 'back.out(1.8)',
      stagger: { each: 0.012, from: 'random' },
      delay: 0.3,
    })
    gsap.from('.commitgraph', {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      delay: 0.55,
    })
  })
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div v-if="show" class="home-landing">
    <div class="hl-inner">
      <header class="hl-hero">
        <p class="hl-eyebrow hl-rv">ESTHER YUSHUXING · 全栈笔记</p>
        <h1 class="hl-title hl-rv">全栈学习笔记</h1>
        <p class="hl-tagline hl-rv">
          从 JavaScript、Vue / React，到 Node.js、Java 与数据库，把学过的、踩过的坑，沉淀成能反复查阅的笔记。
        </p>
        <div class="hl-actions hl-rv">
          <a class="hl-btn primary" href="/zh/Start">开始学习</a>
          <a
            class="hl-btn ghost"
            href="https://github.com/huangshuheng0405/Tools"
            target="_blank"
            rel="noopener"
            >GitHub</a
          >
        </div>
      </header>

      <section class="fs" aria-label="知识点导航">
        <p class="fs-cap">
          <span class="fs-prompt">$</span> 点击标签，直达对应笔记
        </p>
        <div class="fs-cloud">
          <a
            v-for="t in shuffledTags"
            :key="t.text"
            class="fs-tag"
            :class="`sz-${t.size}`"
            :style="{ fontSize: tagFontSize(t) + 'px' }"
            :href="t.link"
            >{{ t.text }}</a
          >
        </div>
      </section>

      <CommitGraph />
    </div>
  </div>
</template>

<style scoped>
.home-landing {
  /* 首页着陆区局部品牌色覆盖为翡翠绿（不影响全站） */
  --vp-c-brand-1: #10b981;
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: clamp(64px, 12vh, 140px) 24px 72px;
}

.hl-inner {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hl-eyebrow {
  margin: 0 0 22px;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  letter-spacing: 0.2em;
  color: var(--vp-c-text-3);
}

.hl-title {
  margin: 0;
  font-size: clamp(42px, 8vw, 76px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  background: linear-gradient(
    92deg,
    var(--vp-c-brand-1),
    #2dd4bf 55%,
    #0d9488
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 180% 180%;
}

.hl-tagline {
  margin: 22px auto 0;
  max-width: 560px;
  font-size: clamp(15px, 2vw, 17px);
  line-height: 1.85;
  color: var(--vp-c-text-2);
}

.hl-actions {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

.hl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 11px 26px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.hl-btn.primary {
  color: #fff;
  background: linear-gradient(90deg, #10b981, #059669);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 22px rgba(16, 185, 129, 0.35);
}

.hl-btn.primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(90deg, #059669, #047857);
  box-shadow: 0 12px 28px rgba(16, 185, 129, 0.5);
}

.hl-btn.ghost {
  color: var(--vp-c-text-1);
  background: transparent;
  border: 1px solid var(--vp-c-border);
}

.hl-btn.ghost:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ---------------- 知识点标签云 ---------------- */

.fs {
  margin-top: clamp(48px, 7vh, 84px);
  width: 100%;
  text-align: center;
}

.fs-cap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 22px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-3);
}

.fs-prompt {
  color: #3fb950;
  user-select: none;
}

.fs-cloud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 12px;
  max-width: 780px;
  margin: 0 auto;
}

.fs-tag {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.01em;
  /* 内边距用 em：高度与宽度都随内联字号等比缩放 */
  padding: 0.5em 1em;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.fs-tag:hover {
  transform: translateY(-2px);
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  box-shadow: 0 10px 22px -14px var(--vp-c-brand-1);
}

.fs-tag:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.sz-xl {
  font-weight: 800;
}

.sz-lg {
  font-weight: 700;
}

.sz-md {
  font-weight: 600;
}

.sz-sm {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .fs-cloud {
    gap: 8px 10px;
  }
}
</style>
