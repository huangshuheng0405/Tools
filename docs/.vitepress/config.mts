import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import mathjax from 'markdown-it-mathjax3'
import zhSidebar from './config/sidebar.zh'
import enSidebar from './config/sidebar.en'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    math: true,
    // config(md) {
    //   md.use(groupIconMdPlugin)
    // },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        defaultLabels: ['npm', 'yarn', 'pnpm', 'bun', 'deno'],
      }) as any,
    ],
  },
  themeConfig: {
    // logo: '/frontend-icon.svg',
    outline: {
      level: [2, 3],
    },
  },
  title: 'front-end',
  description: 'A VitePress Site',
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', href: '/frontend-icon.svg', sizes: 'any' }]],

  // 多语言配置
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/zh/' },
          { text: 'JavaScript', link: '/zh/JavaScript/' },
          {
            text: 'Vue',
            items: [
              { text: 'Vue', link: '/zh/vue/lifecycle' },
              { text: 'Nuxt', link: '/zh/vue/nuxt/Structure/app/nuxt' },
            ],
          },
          { text: 'React', link: '/zh/react/index' },
          { text: 'Engineering', link: '/zh/Engineering/' },
          {
            text: 'Backend',
            items: [
              { text: 'Java', link: '/zh/backend/java/' },
              { text: 'NodeJS', link: '/zh/backend/nodejs/index.md' },
            ],
          },
          { text: 'Misc', link: '/zh/Misc/' },
        ],
        // 侧边栏配置
        sidebar: zhSidebar,
        socialLinks: [
          { icon: 'github', link: 'https://github.com/huangshuheng0405/Tools' },
        ],
        // 中文界面文本配置
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'JavaScript', link: '/en/JavaScript/' },
          {
            text: 'Vue',
            items: [
              { text: 'Vue', link: '/en/vue/lifecycle' },
              { text: 'Nuxt', link: '/en/vue/nuxt/Structure/app/nuxt' },
            ],
          },
          { text: 'React', link: '/en/react/index' },
          { text: 'Engineering', link: '/en/Engineering/' },
          { text: 'Misc', link: '/en/Misc/' },
          {
            text: 'Backend',
            items: [
              { text: 'Java', link: '/en/backend/java/' },
              { text: 'NodeJS', link: '/en/backend/nodejs/index.md' },
            ],
          },
        ],
        sidebar: enSidebar,
        socialLinks: [
          { icon: 'github', link: 'https://github.com/huangshuheng0405/Tools' },
        ],
        // 中文界面文本配置
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
  },
})
