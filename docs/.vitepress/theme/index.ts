// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// 忽略对虚拟模块的类型检查
// @ts-ignore
import 'virtual:group-icons.css'
// @ts-ignore
import './style.css'
import HomeLanding from './components/HomeLanding.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 自定义中文首页（接管 hero 之下的整块区域）
      'home-hero-after': () => h(HomeLanding),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 未配置 root locale，访问首页时重定向到默认语言 zh
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      window.location.replace('/zh/')
    }
  }
} satisfies Theme
