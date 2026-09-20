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
      level: [1, 5],
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
          {
            text: 'front',
            items: [
              { text: 'JavaScript', link: '/zh/JavaScript/' },
              { text: 'Vue', link: '/zh/vue/lifecycle' },
              { text: 'React', link: '/zh/react/index' },
              { text: 'Engineering', link: '/zh/Engineering/' },
              { text: 'HTML/CSS', link: '/zh/frontend/h5c3' },
            ],
          },
          {
            text: 'end',
            items: [
              { text: 'Java', link: '/zh/backend/java/' },
              { text: 'NodeJS', link: '/zh/backend/nodejs/index.md' },
              { text: 'Express', link: '/zh/backend/express' },
              { text: 'Koa', link: '/zh/backend/koa' },
              { text: 'MongoDB', link: '/zh/backend/MongoDB' },
              { text: 'Mongoose', link: '/zh/backend/mongoose' },
              { text: 'Sequelize', link: '/zh/backend/sequelize' },
            ],
          },
          {
            text: 'database',
            items: [
              { text: 'SQL', link: '/zh/database/sql' },
              { text: 'MySQL', link: '/zh/database/mysql' },
              { text: 'Redis', link: '/zh/database/redis' },
            ],
          },
          {
            text: 'devops',
            items: [
              { text: 'Docker', link: '/zh/devops/docker' },
              { text: 'Nginx', link: '/zh/devops/nginx' },
              { text: 'Git', link: '/zh/devops/git' },
              { text: 'JMeter', link: '/zh/devops/jmeter' },
            ],
          },
          {
            text: 'network',
            link: '/zh/network/',
          },
          {
            text: 'misc',
            link: '/zh/misc/',
          },
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
          {
            text: 'Frontend',
            items: [
              { text: 'JavaScript', link: '/en/JavaScript/' },
              { text: 'Vue', link: '/en/vue/lifecycle' },
              { text: 'Nuxt', link: '/en/vue/nuxt/Structure/app/nuxt' },
              { text: 'React', link: '/en/react/index' },
              { text: 'Engineering', link: '/en/Engineering/' },
              { text: 'Web API', link: '/en/frontend/WebAPI' },
            ],
          },
          {
            text: 'Backend',
            items: [
              { text: 'Java', link: '/en/backend/java/' },
              { text: 'NodeJS', link: '/en/backend/nodejs/index.md' },
            ],
          },
          {
            text: 'Database',
            items: [
              { text: 'SQL', link: '/en/database/index.md' },
              { text: 'Redis', link: '/en/database/Redis.md' },
            ],
          },
          {
            text: 'DevOps',
            items: [
              { text: 'Docker', link: '/en/devops/docker' },
              { text: 'Git', link: '/en/devops/git' },
            ],
          },
          {
            text: 'Network',
            items: [{ text: 'VSCode Plugin', link: '/en/tools/vscodePlugin' }],
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
