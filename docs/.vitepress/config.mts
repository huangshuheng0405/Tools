import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'
import mathjax from 'markdown-it-mathjax3'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    math: true,
    config(md) {
      md.use(groupIconMdPlugin).use(mathjax)
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        defaultLabels: ['npm', 'yarn', 'pnpm', 'bun', 'deno']
      }) as any
    ]
  },
  themeConfig: {
    outline: {
      level: [2, 6],
      label: '目录'
    }
  },
  title: 'front-end',
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
        outline: {
          level: [2, 6],
          label: '目录'
        },
        nav: [
          { text: 'Home', link: '/' },
          {
            text: 'JavaScript',
            items: [
              { text: 'JavaScript', link: '/JavaScript/' },
              { text: 'TypeScript', link: '/TypeScript/index' }
            ]
          },
          {
            text: 'Vue',
            items: [
              { text: 'Vue', link: '/vue/lifecycle' },
              { text: 'Nuxt', link: '/vue/nuxt/Structure/app/nuxt' }
            ]
          },
          { text: 'Engineering', link: '/Engineering/' },
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
          '/Engineering/': [
            {
              text: 'Engineering',
              items: [
                { text: 'Overview', link: '/Engineering/' },
                {
                  text: 'git-cz',
                  link: '/Engineering/git-cz'
                },
                {
                  text: 'Husky',
                  link: '/Engineering/Husky'
                },
                {
                  text: 'Webpack',
                  collapsed: true,
                  items: [
                    { text: 'index', link: '/Engineering/Webpack/index' },
                    { text: 'notes', link: '/Engineering/Webpack/notes' },
                    { text: 'loader', link: '/Engineering/Webpack/loader' },
                    { text: 'plugin', link: '/Engineering/Webpack/plugin' }
                  ]
                },
                {
                  text: 'Vite',
                  collapsed: true,
                  items: [
                    { text: 'index', link: '/Engineering/Vite/index' },
                    { text: 'notes', link: '/Engineering/Vite/notes' }
                  ]
                },
                {
                  text: 'CLI',
                  link: '/Engineering/scaffold'
                },
                {
                  text: 'CSpell',
                  link: '/Engineering/cspell'
                },
                {
                  text: 'tsup',
                  link: '/Engineering/tsup'
                },
                {
                  text: 'ESlint',
                  link: '/Engineering/ESlint'
                },
                {
                  text: 'Commander',
                  link: '/Engineering/Commander'
                },
                {
                  text: 'consola',
                  link: '/Engineering/consola'
                },
                {
                  text: 'prompts',
                  link: '/Engineering/prompts'
                },
                {
                  text: 'Prettier',
                  link: '/Engineering/Prettier'
                }
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
                },
                {
                  text: 'vscode 插件',
                  link: '/Tips/vscodePlugin'
                },
                {
                  text: 'CommonJS vs ESM',
                  link: '/Tips/CommonJS_ESMA'
                },
                {
                  text: 'dependencies 和 devDependencies 的区别',
                  link: '/Tips/dependencies_devDependencies'
                },
                {
                  text: 'performanceOptimization',
                  link: '/Tips/performanceOptimization'
                }
              ]
            }
          ],
          '/vue/nuxt/': [
            {
              text: 'Nuxt',
              items: [
                {
                  text: '快速开始',
                  link: '/vue/nuxt/Structure/app/nuxt-start'
                },
                {
                  text: 'Routing',
                  link: '/vue/nuxt/Routing'
                },
                {
                  text: 'Structure',
                  collapsed: false,
                  items: [
                    {
                      text: 'app',
                      collapsed: false,
                      items: [
                        {
                          text: 'pages',
                          link: '/vue/nuxt/Structure/app/pages'
                        },
                        {
                          text: 'layouts',
                          link: '/vue/nuxt/Structure/app/layout'
                        },
                        {
                          text: 'components',
                          link: '/vue/nuxt/Structure/app/components'
                        },
                        {
                          text: 'composables',
                          link: '/vue/nuxt/Structure/app/composables'
                        },
                        {
                          text: 'middleware',
                          link: '/vue/nuxt/Structure/app/middleware'
                        },
                        {
                          text: 'plugins',
                          link: '/vue/nuxt/Structure/app/plugins'
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
                { text: '动态组件', link: '/vue/dynamic-components' },
                {
                  text: '手写Vue',
                  collapsed: true,
                  items: [
                    {
                      text: 'Vue2-jindu',
                      link: '/vue/handwriting/vue2-jindu'
                    },
                    {
                      text: 'Vue3-jindu',
                      link: '/vue/handwriting/vue3-jindu'
                    },
                    {
                      text: 'Vue-Router',
                      link: '/vue/handwriting/vue-router'
                    },
                    {
                      text: 'Promise',
                      link: '/vue/handwriting/Promise'
                    }
                  ]
                },
                {
                  text: 'Vue2不监听数组下标原因',
                  link: '/vue/vue2_ArrayIndex'
                },
                {
                  text: '修饰符',
                  link: '/vue/modifier'
                },
                {
                  text: 'created 与 mounted 区别',
                  link: '/vue/created_mounted'
                },
                {
                  text: 'vue-router',
                  collapsed: true,
                  items: [
                    {
                      text: '路由模式',
                      link: '/vue/vue-router/mode'
                    },
                    {
                      text: '路由跳转',
                      link: '/vue/vue-router/routerLink'
                    }
                  ]
                },
                {
                  text: 'SSR',
                  link: '/vue/SSR'
                },
                {
                  text: 'computed',
                  link: '/vue/computed'
                },
                {
                  text: 'watch',
                  link: '/vue/watch'
                },
                {
                  text: 'effect',
                  link: '/vue/effect'
                },
                {
                  text: 'h',
                  link: '/vue/h'
                }
              ]
            }
          ],
          '/JavaScript/': [
            {
              text: 'JavaScript',
              items: [
                { text: 'index', link: '/JavaScript/index' },
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
                  text: 'let、var、const',
                  link: '/JavaScript/let_var_const'
                },
                {
                  text: '变量提升和TDZ',
                  link: '/JavaScript/Hoisting_TDZ'
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
                },
                {
                  text: '事件循环',
                  link: '/JavaScript/EventLoop'
                },
                {
                  text: '冒泡和捕获',
                  link: '/JavaScript/Bubbling_Capturing'
                },
                {
                  text: '事件委托',
                  link: '/JavaScript/EventDelegation'
                },
                {
                  text: 'ES6 类继承',
                  link: '/JavaScript/ES6Inherit'
                },
                {
                  text: '可迭代对象',
                  link: '/JavaScript/IterableObject'
                },
                {
                  text: 'Promise',
                  link: '/JavaScript/Promise'
                },
                {
                  text: '链式调用',
                  link: '/JavaScript/ChainedCall'
                },
                {
                  text: 'new 操作符',
                  link: '/JavaScript/New'
                },
                {
                  text: 'bind, apply, call的区别及实现',
                  link: '/JavaScript/bind_apply_call'
                },
                {
                  text: 'JS监听对象属性的改变',
                  link: '/JavaScript/defineProperty_Proxy'
                },
                {
                  text: 'prototype 和 __proto__',
                  link: '/JavaScript/prototype___proto__'
                },
                {
                  text: '原型链',
                  link: '/JavaScript/prototypeChain'
                },
                {
                  text: 'this指向',
                  link: '/JavaScript/this'
                },
                {
                  text: 'Function',
                  collapsed: true,
                  items: [
                    { text: 'trim()', link: '/JavaScript/trim' },
                    { text: 'parseInt()', link: '/JavaScript/parseInt' }
                  ]
                },
                { text: 'Symbol', link: '/JavaScript/Stmbol' },
                {
                  text: 'startWith和indexOf的区别',
                  link: '/JavaScript/startwith_indexof'
                },
                {
                  text: '装箱机制',
                  link: '/JavaScript/boxing'
                },
                {
                  text: '假值和真值',
                  link: '/JavaScript/falsy_truthy'
                },
                {
                  text: '命名规范',
                  link: '/JavaScript/NameConvention'
                },
                {
                  text: '隐藏类 (Hidden Classes)',
                  link: '/JavaScript/hiddenClasses'
                },
                {
                  text: 'for',
                  link: '/JavaScript/for'
                },
                {
                  text: 'Reflect',
                  link: '/JavaScript/Reflect'
                }
              ]
            }
          ],
          '/': [
            {
              text: '前端',
              items: [{ text: '工具', link: '/tool' }]
            }
          ],
          '/TypeScript/': [
            {
              text: 'TypeScript',
              items: [
                { text: 'index', link: '/TypeScript/index' },
                { text: 'Start', link: '/TypeScript/Start' },
                {
                  text: 'tsconfig.json',
                  link: '/TypeScript/tsconfig'
                }
              ]
            }
          ],
          '/DesignPatterns/': [
            {
              text: '设计模式',
              items: [
                {
                  text: 'index',
                  link: '/DesignPatterns/index'
                },
                {
                  text: 'Singleton Pattern',
                  link: '/DesignPatterns/Singleton'
                },
                { text: 'Factory Pattern', link: '/DesignPatterns/Factory' },
                { text: 'Pub-Sub Pattern', link: '/DesignPatterns/Pub-Sub' },
                { text: 'Observer Pattern', link: '/DesignPatterns/Observer' },
                { text: 'Strategy Pattern', link: '/DesignPatterns/Strategy' },
                {
                  text: 'Decorator Pattern',
                  link: '/DesignPatterns/Decorator'
                },
                { text: 'MVVM', link: '/DesignPatterns/MVVM' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/huangshuheng0405/Tools' }
        ],
        // 中文界面文本配置
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
        outline: {
          level: [2, 6],
          label: 'On this page'
        },
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'JavaScript', link: '/en/JavaScript/' },
          {
            text: 'Vue',
            items: [
              { text: 'Vue', link: '/en/vue/lifecycle' },
              { text: 'Nuxt', link: '/en/vue/nuxt/Structure/app/nuxt' }
            ]
          },
          { text: 'Engineering', link: '/en/Engineering/' },
          { text: 'Tips', link: '/en/Tips/' },
          { text: 'Git', link: '/en/Git/reset_revert' }
        ],
        sidebar: {
          '/en/Git/': [
            {
              text: 'Git',
              items: [
                { text: 'Reset vs Revert', link: '/en/Git/reset_revert' },
                { text: 'Merge vs Rebase', link: '/en/Git/rebase-merge' }
              ]
            }
          ],
          '/en/Engineering/': [
            {
              text: 'Engineering',
              items: [
                { text: 'Overview', link: '/en/Engineering/' },
                { text: 'git-cz', link: '/en/Engineering/git-cz' },
                { text: 'Husky', link: '/en/Engineering/Husky' },
                {
                  text: 'Webpack',
                  collapsed: true,
                  items: [
                    { text: 'index', link: '/en/Engineering/Webpack/index' },
                    { text: 'notes', link: '/en/Engineering/Webpack/notes' },
                    { text: 'loader', link: '/en/Engineering/Webpack/loader' },
                    { text: 'plugin', link: '/en/Engineering/Webpack/plugin' }
                  ]
                },
                {
                  text: 'Vite',
                  collapsed: true,
                  items: [
                    { text: 'index', link: '/en/Engineering/Vite/index' },
                    { text: 'notes', link: '/en/Engineering/Vite/notes' }
                  ]
                },
                { text: 'CLI', link: '/en/Engineering/scaffold' },
                { text: 'CSpell', link: '/en/Engineering/cspell' },
                { text: 'tsup', link: '/en/Engineering/tsup' },
                { text: 'ESlint', link: '/en/Engineering/ESlint' },
                { text: 'Commander', link: '/en/Engineering/Commander' },
                { text: 'consola', link: '/en/Engineering/consola' },
                { text: 'prompts', link: '/en/Engineering/prompts' },
                { text: 'Prettier', link: '/en/Engineering/Prettier' }
              ]
            }
          ],
          '/en/Tips/': [
            {
              text: 'Tips',
              items: [
                {
                  text: 'Default vs Named Export',
                  link: '/en/Tips/default-vs-named-export'
                },
                {
                  text: 'Axios Cancel & Retry',
                  link: '/en/Tips/axios-cancel-retry'
                },
                { text: 'Virtual List', link: '/en/Tips/virtual-list' },
                { text: 'Event Delegation', link: '/en/Tips/event-delegation' },
                { text: 'VSCode Plugin', link: '/en/Tips/vscodePlugin' },
                { text: 'CommonJS vs ESM', link: '/en/Tips/CommonJS_ESMA' },
                {
                  text: 'dependencies vs devDependencies',
                  link: '/en/Tips/dependencies_devDependencies'
                },
                {
                  text: 'Performance Optimization',
                  link: '/en/Tips/performanceOptimization'
                }
              ]
            }
          ],
          '/en/vue/nuxt/': [
            {
              text: 'Nuxt',
              items: [
                {
                  text: 'Quick Start',
                  link: '/en/vue/nuxt/Structure/app/nuxt-start'
                },
                { text: 'Routing', link: '/en/vue/nuxt/Routing' },
                {
                  text: 'Structure',
                  collapsed: false,
                  items: [
                    {
                      text: 'app',
                      collapsed: false,
                      items: [
                        {
                          text: 'pages',
                          link: '/en/vue/nuxt/Structure/app/pages'
                        },
                        {
                          text: 'layouts',
                          link: '/en/vue/nuxt/Structure/app/layout'
                        },
                        {
                          text: 'components',
                          link: '/en/vue/nuxt/Structure/app/components'
                        },
                        {
                          text: 'composables',
                          link: '/en/vue/nuxt/Structure/app/composables'
                        },
                        {
                          text: 'middleware',
                          link: '/en/vue/nuxt/Structure/app/middleware'
                        },
                        {
                          text: 'plugins',
                          link: '/en/vue/nuxt/Structure/app/plugins'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          '/en/vue/': [
            {
              text: 'Vue',
              items: [
                { text: 'Lifecycle', link: '/en/vue/lifecycle' },
                { text: 'Props', link: '/en/vue/Props' },
                {
                  text: 'Components Connect',
                  link: '/en/vue/Components-connect'
                },
                { text: 'Role of Key', link: '/en/vue/Key' },
                { text: 'Reflect & Reactivity', link: '/en/vue/Reflect' },
                { text: 'Query vs Params', link: '/en/vue/query_params' },
                {
                  text: 'Dynamic Components',
                  link: '/en/vue/dynamic-components'
                },
                {
                  text: 'Handwritten Vue',
                  collapsed: true,
                  items: [
                    {
                      text: 'Vue2-jindu',
                      link: '/en/vue/handwriting/vue2-jindu'
                    },
                    {
                      text: 'Vue3-jindu',
                      link: '/en/vue/handwriting/vue3-jindu'
                    },
                    {
                      text: 'Vue-Router',
                      link: '/en/vue/handwriting/vue-router'
                    },
                    { text: 'Promise', link: '/en/vue/handwriting/Promise' }
                  ]
                },
                {
                  text: 'Vue2 Array Index Reactivity',
                  link: '/en/vue/vue2_ArrayIndex'
                },
                { text: 'Modifiers', link: '/en/vue/modifier' },
                { text: 'created vs mounted', link: '/en/vue/created_mounted' },
                {
                  text: 'vue-router',
                  collapsed: true,
                  items: [
                    { text: 'Modes', link: '/en/vue/vue-router/mode' },
                    {
                      text: 'RouterLink',
                      link: '/en/vue/vue-router/routerLink'
                    }
                  ]
                },
                { text: 'SSR', link: '/en/vue/SSR' }
              ]
            }
          ],
          '/en/JavaScript/': [
            {
              text: 'JavaScript',
              items: [
                { text: 'Hidden Classes', link: '/en/JavaScript/' },
                {
                  text: 'Array Fast/Dict Mode',
                  link: '/en/JavaScript/array-fast-dict-mode'
                },
                {
                  text: 'Check Empty Object',
                  link: '/en/JavaScript/judge-object'
                },
                {
                  text: 'Type Conversion',
                  link: '/en/JavaScript/TypeConversion'
                },
                { text: '== vs ===', link: '/en/JavaScript/==&===' },
                { text: 'Data Types', link: '/en/JavaScript/DataTypes' },
                { text: 'Stack & Heap', link: '/en/JavaScript/stack-heap' },
                {
                  text: 'Determine Data Types',
                  link: '/en/JavaScript/JudgeType'
                },
                {
                  text: 'ES Versions (ES6+)',
                  link: '/en/JavaScript/ESVersion'
                },
                {
                  text: 'let, var, const',
                  link: '/en/JavaScript/let_var_const'
                },
                { text: 'Hoisting & TDZ', link: '/en/JavaScript/Hoisting_TDZ' },
                {
                  text: 'Object Equality',
                  link: '/en/JavaScript/JudgeObjectEqual'
                },
                {
                  text: 'null vs undefined',
                  link: '/en/JavaScript/nullUndefined'
                },
                {
                  text: 'Repaint & Reflow',
                  link: '/en/JavaScript/Repaint_Reflow'
                },
                {
                  text: 'Module System',
                  link: '/en/JavaScript/module_commonJS'
                },
                { text: 'Event Loop', link: '/en/JavaScript/EventLoop' },
                {
                  text: 'Bubbling & Capturing',
                  link: '/en/JavaScript/Bubbling_Capturing'
                },
                {
                  text: 'Event Delegation',
                  link: '/en/JavaScript/EventDelegation'
                },
                {
                  text: 'ES6 Class Inheritance',
                  link: '/en/JavaScript/ES6Inherit'
                },
                {
                  text: 'Iterable Objects',
                  link: '/en/JavaScript/IterableObject'
                },
                { text: 'Promise', link: '/en/JavaScript/Promise' },
                { text: 'Chained Call', link: '/en/JavaScript/ChainedCall' },
                { text: 'new Operator', link: '/en/JavaScript/New' },
                {
                  text: 'bind, apply, call',
                  link: '/en/JavaScript/bind_apply_call'
                },
                {
                  text: 'Object Property Monitoring',
                  link: '/en/JavaScript/defineProperty_Proxy'
                },
                {
                  text: 'prototype & __proto__',
                  link: '/en/JavaScript/prototype___proto__'
                },
                {
                  text: 'Prototype Chain',
                  link: '/en/JavaScript/prototypeChain'
                },
                { text: 'this Context', link: '/en/JavaScript/this' },
                {
                  text: 'Function',
                  collapsed: true,
                  items: [
                    { text: 'trim()', link: '/en/JavaScript/trim' },
                    { text: 'parseInt()', link: '/en/JavaScript/parseInt' }
                  ]
                },
                { text: 'Symbol', link: '/en/JavaScript/Stmbol' },
                {
                  text: 'startsWith vs indexOf',
                  link: '/en/JavaScript/startwith_indexof'
                },
                { text: 'Boxing Mechanism', link: '/en/JavaScript/boxing' },
                { text: 'Falsy & Truthy', link: '/en/JavaScript/falsy_truthy' },
                {
                  text: 'Naming Convention',
                  link: '/en/JavaScript/NameConvention'
                }
              ]
            }
          ],
          '/en/': [
            {
              text: 'Examples',
              items: [
                { text: 'Markdown Examples', link: '/en/markdown-examples' },
                { text: 'API Examples', link: '/en/api-examples' }
              ]
            },
            {
              text: 'Front-end',
              items: [{ text: 'Tools', link: '/en/tool' }]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/huangshuheng0405/Tools' }
        ]
      }
    }
  }
})
