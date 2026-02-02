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
  title: 'Vue',
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
          { text: 'JavaScript', link: '/JavaScript/' },
          { text: 'Vue', link: '/vue/lifecycle' },
          { text: 'Nuxt', link: '/nuxt/Structure/app/nuxt' },
          { text: 'Tips', link: '/Tips/' },
          { text: 'Git', link: '/Git/reset_revert' }
        ],
        sidebar: {
          '/Git/': [
            {
              text: 'Git',
              items: [
                { text: 'Reset vs Revert', link: '/Git/reset_revert' },
                { text: 'Merge vs Rebase', link: '/Git/rebase-merge' }
              ]
            }
          ],
          '/Tips/': [
            {
              text: 'Tips',
              items: [
                {
                  text: '默认导出 vs 命名导出',
                  link: '/Tips/default-vs-named-export'
                },
                {
                  text: 'Axios 请求中断与重试',
                  link: '/Tips/axios-cancel-retry'
                },
                {
                  text: '虚拟列表 (Virtual List)',
                  link: '/Tips/virtual-list'
                },
                {
                  text: '事件委托 (Event Delegation)',
                  link: '/Tips/event-delegation'
                }
              ]
            }
          ],
          '/nuxt/': [
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
                        },
                        {
                          text: 'plugins',
                          link: '/nuxt/Structure/app/plugins'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          '/vue/': [
            {
              text: 'Vue',
              items: [
                { text: '生命周期', link: '/vue/lifecycle' },
                { text: 'Props (属性)', link: '/vue/Props' },
                { text: '组件通信方式', link: '/vue/Components-connect' },
                { text: 'Key 的作用', link: '/vue/Key' },
                { text: 'Reflect 与响应式', link: '/vue/Reflect' },
                { text: 'Query 与 Params', link: '/vue/query_params' },
                { text: '动态组件', link: '/vue/dynamic-components' }
              ]
            }
          ],
          '/JavaScript/': [
            {
              text: 'JavaScript',
              items: [
                { text: '隐藏类 (Hidden Classes)', link: '/JavaScript/' },
                {
                  text: '数组快速模式与字典模式',
                  link: '/JavaScript/array-fast-dict-mode'
                },
                {
                  text: '如何判断object为空',
                  link: '/JavaScript/judge-object'
                },
                {
                  text: '类型转换',
                  link: '/JavaScript/TypeConversion'
                },
                {
                  text: '== 和 === 的区别',
                  link: '/JavaScript/==&==='
                },
                {
                  text: '数据类型',
                  link: '/JavaScript/DataTypes'
                },
                {
                  text: '变量在内存中的堆栈存储',
                  link: '/JavaScript/stack-heap'
                },
                {
                  text: '如何判断JavaScript的数据类型',
                  link: '/JavaScript/JudgeType'
                },
                {
                  text: 'ES 版本特性 (ES6+)',
                  link: '/JavaScript/ESVersion'
                },
                {
                  text: 'let 声明变量的特性',
                  link: '/JavaScript/let'
                },
                {
                  text: '变量提升 & 函数提升（优先级）',
                  link: '/JavaScript/FunctionPromoting'
                },
                {
                  text: '判断两个对象是否相等',
                  link: '/JavaScript/JudgeObjectEqual'
                },
                {
                  text: 'null和undefined的区别',
                  link: '/JavaScript/nullUndefined'
                },
                {
                  text: 'Repaint & Reflow',
                  link: '/JavaScript/Repaint_Reflow'
                },
                {
                  text: '模块系统',
                  link: '/JavaScript/module_commonJS'
                }
              ]
            }
          ],
          '/': [
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
            }
          ]
        },
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
