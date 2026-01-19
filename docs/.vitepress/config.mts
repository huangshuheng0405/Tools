import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        defaultLabels: ['npm', 'yarn', 'pnpm', 'bun', 'deno']
      })
    ]
  },
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
          { text: '工具', link: '/tool' },
          { text: 'Nuxt', link: '/nuxt/Structure/app/nuxt' }
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
            text: 'Nuxt',
            items: [
              {
                text: '快速开始',
                link: '/nuxt/Structure/app/nuxt-start'
              },
              {
                text: 'Routing',
                link: '/nuxt/Routing'
              },
              {
                text: 'Structure',
                collapsed: false,
                items: [
                  {
                    text: 'app',
                    collapsed: false,
                    items: [
                      { text: 'pages', link: '/nuxt/Structure/app/pages' },
                      { text: 'layouts', link: '/nuxt/Structure/app/layout' },
                      {
                        text: 'components',
                        link: '/nuxt/Structure/app/components'
                      },
                      {
                        text: 'composables',
                        link: '/nuxt/Structure/app/composables'
                      },
                      {
                        text: 'middleware',
                        link: '/nuxt/Structure/app/middleware'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            text: 'Tips',
            items: [
              {
                text: '默认导出 vs 命名导出',
                link: '/Tips/default-vs-named-export'
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
              { text: 'Nuxt Start', link: '/en/nuxt/nuxt-start' },
              {
                text: 'Routing',
                link: '/en/nuxt/Routing'
              },
              {
                text: 'Structure',
                collapsed: false,
                items: [
                  {
                    text: 'app',
                    collapsed: false,
                    items: [
                      { text: 'pages', link: '/en/nuxt/Structure/app/pages' },
                      {
                        text: 'layouts',
                        link: '/en/nuxt/Structure/app/layout'
                      },
                      {
                        text: 'components',
                        link: '/en/nuxt/Structure/app/components'
                      },
                      {
                        text: 'composables',
                        link: '/en/nuxt/Structure/app/composables'
                      },
                      {
                        text: 'middleware',
                        link: '/en/nuxt/Structure/app/middleware'
                      }
                    ]
                  }
                ]
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
