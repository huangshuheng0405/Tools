<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useData } from 'vitepress'
import { data as pageUrls } from '../notes.data'

const { page } = useData()

// 只接管中文首页，英文首页保持默认 layout
const show = computed(() => (page.value.relativePath || '').startsWith('zh/'))

interface NoteLink {
  text: string
  link: string
}

interface Category {
  title: string
  desc: string
  // 用于统计篇数的 URL 前缀，同时也是这张卡片的归类范围
  prefix: string
  notes: NoteLink[]
}

// 六张主卡片。链接都指向真实存在的笔记页，
// 而不是分类的 index.md —— 那些页面目前只有一张 logo，点进去是空的。
const CATEGORIES: Category[] = [
  {
    title: 'JavaScript',
    desc: '语言核心、异步与手写题',
    prefix: '/zh/JavaScript/',
    notes: [
      { text: '闭包', link: '/zh/JavaScript/Closure' },
      { text: '原型链', link: '/zh/JavaScript/Prototype_Chain' },
      { text: '事件循环', link: '/zh/JavaScript/EventLoop' },
      { text: 'Promise', link: '/zh/JavaScript/Promise' },
    ],
  },
  {
    title: 'Vue',
    desc: '响应式、组件与生态',
    prefix: '/zh/vue/',
    notes: [
      { text: '生命周期', link: '/zh/vue/lifecycle' },
      { text: '响应式原理', link: '/zh/vue/reponsive' },
      { text: 'Pinia', link: '/zh/vue/pinia' },
      { text: 'Vue Router', link: '/zh/vue/vueRouter' },
    ],
  },
  {
    title: 'React',
    desc: 'Hooks、状态管理与路由',
    prefix: '/zh/react/',
    notes: [
      { text: 'Hooks', link: '/zh/react/hooks/index' },
      { text: 'Zustand', link: '/zh/react/zustand/installation' },
      { text: 'React Router', link: '/zh/react/router/index' },
      { text: 'CSS Modules', link: '/zh/react/css/cssModule' },
    ],
  },
  {
    title: 'Java & Spring',
    desc: 'IoC、AOP 与 Spring Boot',
    prefix: '/zh/backend/java/',
    notes: [
      { text: 'IoC / DI', link: '/zh/backend/java/spring/IoC_DI' },
      { text: 'AOP', link: '/zh/backend/java/spring/aop' },
      { text: 'Spring Boot', link: '/zh/backend/java/springboot/' },
      { text: 'MyBatis-Plus', link: '/zh/backend/java/springboot/mybatisPlus' },
    ],
  },
  {
    title: '工程化',
    desc: '构建、规范与 CI',
    prefix: '/zh/Engineering/',
    notes: [
      { text: 'Webpack', link: '/zh/Engineering/webpack' },
      { text: 'Vite', link: '/zh/Engineering/vite' },
      { text: 'ESLint', link: '/zh/Engineering/ESlint' },
      { text: 'Husky', link: '/zh/Engineering/Husky' },
    ],
  },
  {
    title: '数据库与运维',
    desc: 'MySQL、Redis 与部署',
    prefix: '/zh/Misc/',
    notes: [
      { text: 'MySQL', link: '/zh/Misc/database/mysql' },
      { text: 'Redis', link: '/zh/Misc/database/redis' },
      { text: 'Docker', link: '/zh/Misc/docker' },
      { text: 'Nginx', link: '/zh/Misc/nginx' },
    ],
  },
]

// 卡片装不下的零散主题，收成一行小链接，避免它们从首页消失
const MORE: NoteLink[] = [
  { text: 'Node.js 服务端', link: '/zh/backend/' },
  { text: 'MongoDB', link: '/zh/backend/MongoDB' },
  { text: 'Sequelize', link: '/zh/backend/sequelize' },
  { text: '设计模式', link: '/zh/DesignPatterns/' },
  { text: '小程序', link: '/zh/Misc/wxapp' },
  { text: '网络', link: '/zh/network/SSE' },
  { text: '安全', link: '/zh/Security/xss' },
  { text: '面试', link: '/zh/Interview/Session_Cookie' },
]

// 分类 index 页的 url 带尾斜杠，普通页面不带，两种形态都兜住
function countOf(prefix: string) {
  const bare = prefix.replace(/\/$/, '')
  return pageUrls.filter((u) => u.startsWith(prefix) || u === bare).length
}

// 首页自己不算“笔记”
const total = pageUrls.filter((u) => u !== '/zh/').length

let ctx: any = null

onMounted(async () => {
  if (!show.value) return

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  const mod = await import('gsap')
  const gsap = mod.gsap ?? (mod as any).default

  // 只给卡片做入场：Hero 含 h1（LCP 元素），从透明淡入会推迟首屏渲染，
  // 「每屏最多动画 1-2 个关键元素」也要求收敛动效范围
  ctx = gsap.context(() => {
    gsap.from('.hl-cat', {
      opacity: 0,
      y: 16,
      duration: 0.4,
      ease: 'power2.out',
      stagger: { each: 0.04 },
      delay: 0.1,
    })
  })
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div v-if="show" class="home-landing">
    <div class="hl-inner">
      <header class="hl-hero">
        <p class="hl-eyebrow">ESTHER YUSHUXING</p>
        <h1 class="hl-title">全栈学习笔记</h1>
        <p class="hl-tagline">
          从 JavaScript、Vue / React，到 Node.js、Java 与数据库，把学过的、踩过的坑，沉淀成能反复查阅的笔记。
        </p>
        <p class="hl-meta">
          <span>{{ total }} 篇</span>
          <span class="hl-dot" aria-hidden="true"></span>
          <span>{{ CATEGORIES.length }} 个分类</span>
          <span class="hl-dot" aria-hidden="true"></span>
          <span>持续更新</span>
        </p>
        <div class="hl-actions">
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

      <section class="hl-cats" aria-label="分类导航">
        <article v-for="(c, i) in CATEGORIES" :key="c.title" class="hl-cat">
          <header class="hl-cat-meta">
            <span class="hl-cat-idx">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="hl-cat-rule" aria-hidden="true"></span>
            <span class="hl-cat-count">{{ countOf(c.prefix) }} 篇</span>
          </header>
          <h2 class="hl-cat-title">{{ c.title }}</h2>
          <p class="hl-cat-desc">{{ c.desc }}</p>
          <ul class="hl-cat-links">
            <li v-for="n in c.notes" :key="n.link">
              <a :href="n.link">{{ n.text }}</a>
            </li>
          </ul>
        </article>
      </section>

      <nav class="hl-more" aria-label="其他主题">
        <span class="hl-more-label">更多</span>
        <a v-for="m in MORE" :key="m.link" :href="m.link">{{ m.text }}</a>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/*
 * 视觉方向：Swiss Modernism 2.0（documentation 场景）
 * 三条硬约束：单一强调色（--vp-c-brand-1，只用在可交互处）、不用渐变/阴影、
 * 间距与字号走固定刻度。颜色全部取自站点 token，浅色/深色自动一致。
 *
 * 刻度：间距 8 的倍数 · 字号 12/14/16/18 · 圆角 6（小）/ 10（中）
 */
.home-landing {
  width: 100%;
  padding: 96px 24px;
}

.hl-inner {
  max-width: 1152px;
  margin: 0 auto;
}

.hl-hero {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.hl-eyebrow {
  margin: 0 0 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.18em;
  color: var(--vp-c-text-3);
}

.hl-title {
  margin: 0;
  /* 中文不加负字距：CJK 字形本身已经紧凑，再压会挤在一起 */
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0;
  color: var(--vp-c-text-1);
}

.hl-tagline {
  margin: 24px auto 0;
  max-width: 560px;
  font-size: 16px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.hl-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 24px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1;
  color: var(--vp-c-text-3);
  /* 数字等宽，避免篇数变化时整行宽度跳动 */
  font-variant-numeric: tabular-nums;
}

.hl-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

.hl-actions {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.hl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.hl-btn.primary {
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
}

.hl-btn.primary:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
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

.hl-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* ---------------- 分类卡片 ---------------- */

.hl-cats {
  margin-top: 64px;
  display: grid;
  /* 固定列数而不是 auto-fill：列宽与断点都可预期，符合栅格化排版 */
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.hl-cat {
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

/* 悬停只改描边与底色，不做位移和投影 —— 避免布局抖动 */
.hl-cat:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.hl-cat-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.hl-cat-idx {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* 拉一条细线撑满剩余空间，把编号和篇数分列两端 */
.hl-cat-rule {
  flex: 1;
  height: 1px;
  background: var(--vp-c-border);
}

.hl-cat-count {
  color: var(--vp-c-text-3);
}

.hl-cat-title {
  margin: 20px 0 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--vp-c-text-1);
}

.hl-cat-desc {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.hl-cat-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0 0;
  padding: 20px 0 0;
  border-top: 1px solid var(--vp-c-border);
  list-style: none;
}

.hl-cat-links a {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  text-decoration: none;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.hl-cat-links a:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* 键盘焦点环：卡片里的链接默认没有任何焦点样式 */
.hl-cat-links a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* 触摸设备上把窄链接撑到 44px，鼠标端保持紧凑 */
@media (pointer: coarse) {
  .hl-cat-links a {
    min-height: 44px;
  }
}

/* ---------------- “更多”小链接 ---------------- */

.hl-more {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 20px;
  font-size: 14px;
}

.hl-more-label {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--vp-c-text-3);
}

.hl-more a {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.hl-more a:hover {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.hl-more a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (pointer: coarse) {
  .hl-more a {
    min-height: 44px;
  }
}

/* ---------------- 断点：768 / 1024 ---------------- */

@media (max-width: 1023px) {
  .hl-cats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .home-landing {
    padding: 64px 20px;
  }

  .hl-cats {
    grid-template-columns: 1fr;
    margin-top: 48px;
  }

  .hl-cat {
    padding: 20px;
  }
}
</style>
