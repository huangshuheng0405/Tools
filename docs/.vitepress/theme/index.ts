// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import TiltCard from './components/TiltCard.vue'
import NotifyCard from './components/NotifyCard.vue'
import OverlayDemo from './components/OverlayDemo.vue'
import SharedElementDemo from './components/SharedElementDemo.vue'
import BackToTop from './components/BackToTop.vue'
import SpotlightCard from './components/SpotlightCard.vue'
import CountUpStat from './components/CountUpStat.vue'
import RippleButton from './components/RippleButton.vue'
// 忽略对虚拟模块的类型检查
// @ts-ignore
import 'virtual:group-icons.css'
// @ts-ignore
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 全局注册演示组件，供 markdown 里直接调用
    app.component('TiltCard', TiltCard)
    app.component('NotifyCard', NotifyCard)
    app.component('OverlayDemo', OverlayDemo)
    app.component('SharedElementDemo', SharedElementDemo)
    app.component('BackToTop', BackToTop)
    app.component('SpotlightCard', SpotlightCard)
    app.component('CountUpStat', CountUpStat)
    app.component('RippleButton', RippleButton)
    // 未配置 root locale，访问首页时重定向到默认语言 zh
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      window.location.replace('/zh/')
    }
  }
} satisfies Theme
