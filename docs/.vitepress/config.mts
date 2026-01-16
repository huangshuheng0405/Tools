import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Tutorial',
  description: 'A VitePress Site',
  head: [
    // 使用你指定的图标（把 vitepress.ico 放到 docs/public/vitepress.ico）
    ['link', { rel: 'icon', href: '/vitepress.ico', sizes: 'any' }]
  ],

  // 多语言配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '示例', link: '/markdown-examples' },
          { text: '工具', link: '/tool' }
        ],
        sidebar: [
          {
            text: '示例',
            items: [
              { text: 'Markdown 示例', link: '/markdown-examples' },
              { text: 'API 示例', link: '/api-examples' }
            ]
          },
          {
            text: '前端',
            items: [{ text: '工具', link: '/tool' }]
          },
          {
            text: '算法',
            items: [{ text: '教程', link: '/Tutorial' }]
          },
          {
            text: 'Nuxt',
            items: [
              { text: 'Nuxt 起步', link: '/nuxt-start' },
              {
                text: '路由',
                link: '/Routing'
              }
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/huangshuheng0405' }
        ],
        // 中文界面文本配置
        outline: {
          label: '页面导航'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Examples', link: '/en/markdown-examples' },
          { text: 'Tools', link: '/en/tool' }
        ],
        sidebar: [
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/en/markdown-examples' },
              { text: 'Runtime API Examples', link: '/en/api-examples' }
            ]
          },
          {
            text: 'Front-end',
            items: [{ text: 'Tools', link: '/en/tool' }]
          },
          {
            text: 'Algorithm',
            items: [{ text: 'Tutorial', link: '/en/Tutorial' }]
          },
          {
            text: 'Nuxt',
            items: [
              { text: 'Nuxt Start', link: '/en/nuxt-start' },
              {
                text: 'Routing',
                link: '/en/Routing'
              }
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/huangshuheng0405' }
        ]
      }
    }
  }
})
