import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import mathjax from 'markdown-it-mathjax3'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    math: true,
    config(md) {
      md.use(groupIconMdPlugin).use(mathjax)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        defaultLabels: ['npm', 'yarn', 'pnpm', 'bun', 'deno'],
      }) as any,
    ],
  },
  themeConfig: {
    logo: '/nodejs-icon.svg',
    outline: {
      level: [2, 3],
    },
  },
  title: 'front-end',
  description: 'A VitePress Site',
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', href: '/nodejs-icon.svg', sizes: 'any' }]],

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
          { text: 'Misc', link: '/zh/Misc/' },
          {
            text: 'Backend',
            items: [
              { text: 'Java', link: '/zh/backend/java/' },
              { text: 'NodeJS', link: '/zh/backend/nodejs/index.md' },
            ],
          },
        ],
        sidebar: {
          '/zh/backend/nodejs/': [
            {
              text: 'Backend',
              items: [
                { text: 'Overview', link: '/zh/backend/index.md' },
                { text: 'Koa', link: '/zh/backend/koa' },
                {
                  text: 'Node.js',
                  link: '/zh/backend/nodejs',
                  items: [
                    { text: '__dirname', link: '/zh/backend/nodejs/__dirname' },
                    {
                      text: '__filename',
                      link: '/zh/backend/nodejs/__filename',
                    },
                    {
                      text: 'modularity',
                      link: '/zh/backend/nodejs/modularity',
                    },
                  ],
                },
                { text: 'Express', link: '/zh/backend/express' },
                { text: 'Sequelize', link: '/zh/backend/sequelize' },
                { text: 'MongoDB', link: '/zh/backend/MongoDB' },
                { text: 'Mongoose', link: '/zh/backend/mongoose' },
              ],
            },
          ],
          '/zh/backend/java/': [
            {
              text: 'Java',
              items: [{ text: 'index', link: '/zh/backend/java/index.md' }],
            },
            {
              text: 'Java 基础',
              items: [
                { text: 'index', link: '/zh/backend/java/base/index.md' },
                {
                  text: 'inheritance',
                  link: '/zh/backend/java/base/inheritance.md',
                },
                {
                  text: 'Ploymorphism',
                  link: '/zh/backend/java/base/Ploymorphism.md',
                },
                {
                  text: 'interface',
                  link: '/zh/backend/java/base/interface.md',
                },
                {
                  text: 'abstractClass',
                  link: '/zh/backend/java/base/abstractClass.md',
                },
                {
                  text: 'list',
                  link: '/zh/backend/java/base/list.md',
                },
                {
                  text: 'set',
                  link: '/zh/backend/java/base/set.md',
                },
              ],
            },
            {
              text: 'Maven',
              items: [
                { text: 'index', link: '/zh/backend/java/maven/index.md' },
                {
                  text: 'lifeCycle',
                  link: '/zh/backend/java/maven/lifeCycle.md',
                },
              ],
            },
            {
              text: 'Unit Test',
              items: [
                { text: 'index', link: '/zh/backend/java/unitTest/index.md' },
                { text: 'Junit', link: '/zh/backend/java/unitTest/junit.md' },
              ],
            },
            {
              text: 'Spring',
              items: [
                {
                  text: 'three tier',
                  link: '/zh/backend/java/spring/threeTier.md',
                },
                {
                  text: 'IoC DI',
                  link: '/zh/backend/java/spring/IoC_DI.md',
                },
                {
                  text: 'Spring Data Redis',
                  link: '/zh/backend/java/spring/springDataRedis.md',
                },
              ],
            },
            {
              text: 'Spring Boot',
              items: [
                {
                  text: 'index',
                  link: '/zh/backend/java/springboot/index.md',
                },
                {
                  text: 'Filter',
                  link: '/zh/backend/java/springboot/filter.md',
                },
                {
                  text: 'JWT',
                  link: '/zh/backend/java/springboot/jwt.md',
                },
                {
                  text: 'Interceptor',
                  link: '/zh/backend/java/springboot/interceptor.md',
                },
                {
                  text: 'Lombok',
                  link: '/zh/backend/java/springboot/lombok.md',
                },
                {
                  text: 'Mybatis',
                  link: '/zh/backend/java/springboot/mybatis.md',
                },
                {
                  text: 'AOP',
                  link: '/zh/backend/java/springboot/aop.md',
                },
                {
                  text: 'HttpClient',
                  link: '/zh/backend/java/springboot/httpClient.md',
                },
                {
                  text: 'Spring Cache',
                  link: '/zh/backend/java/springboot/springCache.md',
                },
                {
                  text: 'HuTool',
                  link: '/zh/backend/java/springboot/huTool.md',
                },
              ],
            },
          ],

          '/zh/Engineering/': [
            {
              text: 'Engineering',
              items: [
                { text: 'Overview', link: '/zh/Engineering/' },
                {
                  text: 'git-cz',
                  link: '/zh/Engineering/git-cz',
                },
                {
                  text: 'Husky',
                  link: '/zh/Engineering/Husky',
                },
                {
                  text: 'Webpack',
                  collapsed: true,
                  items: [
                    { text: 'index', link: '/zh/Engineering/Webpack/index' },
                    { text: 'notes', link: '/zh/Engineering/Webpack/notes' },
                    { text: 'loader', link: '/zh/Engineering/Webpack/loader' },
                    { text: 'plugin', link: '/zh/Engineering/Webpack/plugin' },
                  ],
                },
                {
                  text: 'Vite',
                  link: '/zh/Engineering/vite',
                },
                {
                  text: 'CLI',
                  link: '/zh/Engineering/scaffold',
                },
                {
                  text: 'CSpell',
                  link: '/zh/Engineering/cspell',
                },
                {
                  text: 'tsup',
                  link: '/zh/Engineering/tsup',
                },
                {
                  text: 'ESlint',
                  link: '/zh/Engineering/ESlint',
                },
                {
                  text: 'Commander',
                  link: '/zh/Engineering/Commander',
                },
                {
                  text: 'consola',
                  link: '/zh/Engineering/consola',
                },
                {
                  text: 'prompts',
                  link: '/zh/Engineering/prompts',
                },
                {
                  text: 'Prettier',
                  link: '/zh/Engineering/Prettier',
                },
                {
                  text: 'esbuild',
                  link: '/zh/Engineering/esbuild',
                },
                {
                  text: 'Axios',
                  link: '/zh/Engineering/axios',
                },
                {
                  text: 'Rollup',
                  link: '/zh/Engineering/rollup',
                },
                {
                  text: 'Workflow',
                  link: '/zh/Engineering/workflow',
                },
                {
                  text: 'nrm',
                  link: '/zh/Engineering/nrm',
                },
              ],
            },
          ],
          '/zh/Misc/': [
            {
              text: 'Tips',
              items: [
                {
                  text: 'vscode plugin',
                  link: '/zh/Misc/vscodePlugin',
                },
                {
                  text: 'performanceOptimization',
                  link: '/zh/Misc/performanceOptimization',
                },
                {
                  text: 'Docker',
                  link: '/zh/Misc/docker',
                },
                {
                  text: 'Git',
                  link: '/zh/Misc/git',
                },
                {
                  text: 'Claude',
                  link: '/zh/Misc/claude',
                },
                {
                  text: 'H5C3',
                  link: '/zh/Misc/h5c3',
                },
                {
                  text: 'wx app',
                  link: '/zh/Misc/wxapp',
                },
                {
                  text: 'Trae',
                  link: '/zh/Misc/trae',
                },
                {
                  text: 'Nginx',
                  link: '/zh/Misc/nginx',
                },
              ],
            },
            {
              text: 'Vitepress Plugin Froup Icons',
              items: [
                {
                  text: 'Getting Started',
                  link: '/zh/Misc/vitepress-icon',
                },
              ],
            },
            {
              text: '面试题',
              items: [
                {
                  text: 'ref reactive',
                  link: '/zh/Misc/ref-reactive',
                },
                {
                  text: '图片懒加载',
                  link: '/zh/Misc/lazyImages',
                },
                {
                  text: '文件上传',
                  link: '/zh/Misc/fileUpload',
                },
                {
                  text: 'Web API',
                  link: '/zh/Misc/WebAPI',
                },
              ],
            },
            {
              text: 'Database',
              items: [
                { text: 'index', link: '/zh/Misc/database/index.md' },
                { text: 'DDL', link: '/zh/Misc/database/DDL.md' },
                { text: 'DataType', link: '/zh/Misc/database/dataType.md' },
                {
                  text: 'Redis',
                  link: '/zh/Misc/database/Redis.md',
                },
                {
                  text: 'MySQL',
                  link: '/zh/Misc/database/mysql.md',
                },
              ],
            },
          ],
          '/zh/vue/nuxt/': [
            {
              text: 'Nuxt',
              items: [
                {
                  text: '快速开始',
                  link: '/zh/vue/nuxt/Structure/app/nuxt-start',
                },
                {
                  text: 'Routing',
                  link: '/zh/vue/nuxt/Routing',
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
                          link: '/zh/vue/nuxt/Structure/app/pages',
                        },
                        {
                          text: 'layouts',
                          link: '/zh/vue/nuxt/Structure/app/layout',
                        },
                        {
                          text: 'components',
                          link: '/zh/vue/nuxt/Structure/app/components',
                        },
                        {
                          text: 'composables',
                          link: '/zh/vue/nuxt/Structure/app/composables',
                        },
                        {
                          text: 'middleware',
                          link: '/zh/vue/nuxt/Structure/app/middleware',
                        },
                        {
                          text: 'plugins',
                          link: '/zh/vue/nuxt/Structure/app/plugins',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          '/zh/vue/': [
            {
              text: 'Vue',
              items: [
                { text: 'index', link: '/zh/vue/index.md' },
                { text: 'Teleport', link: '/zh/vue/teleport.md' },
                { text: '生命周期', link: '/zh/vue/lifecycle' },
                { text: 'Props', link: '/zh/vue/Props' },
                { text: 'connect', link: '/zh/vue/Components-connect' },
                { text: 'Key 的作用', link: '/zh/vue/Key' },
                { text: 'Reflect 与响应式', link: '/zh/vue/Reflect' },
                { text: 'Query 与 Params', link: '/zh/vue/query_params' },
                { text: '动态组件', link: '/zh/vue/dynamic-components' },
                {
                  text: '手写Vue',
                  collapsed: true,
                  items: [
                    {
                      text: 'Vue2-jindu',
                      link: '/zh/vue/handwriting/vue2-jindu',
                    },
                    {
                      text: 'Vue3-jindu',
                      link: '/zh/vue/handwriting/vue3-jindu',
                    },
                    {
                      text: 'Vue-Router',
                      link: '/zh/vue/handwriting/vue-router',
                    },
                    {
                      text: 'Promise',
                      link: '/zh/vue/handwriting/Promise',
                    },
                  ],
                },
                {
                  text: 'Vue2不监听数组下标原因',
                  link: '/zh/vue/vue2_ArrayIndex',
                },
                {
                  text: '修饰符',
                  link: '/zh/vue/modifier',
                },
                {
                  text: 'created 与 mounted 区别',
                  link: '/zh/vue/created_mounted',
                },
                {
                  text: 'SSR',
                  link: '/zh/vue/SSR',
                },
                {
                  text: 'computed',
                  link: '/zh/vue/computed',
                },
                {
                  text: 'watch',
                  link: '/zh/vue/watch',
                },
                {
                  text: 'effect',
                  link: '/zh/vue/effect',
                },
                {
                  text: 'h',
                  link: '/zh/vue/h',
                },
                {
                  text: 'Attribute',
                  link: '/zh/vue/attribute',
                },
                {
                  text: 'virtual list',
                  link: '/zh/vue/virtualList',
                },
                {
                  text: 'Pinia',
                  link: '/zh/vue/pinia',
                },
                {
                  text: 'Vue Router',
                  link: '/zh/vue/vueRouter',
                },
                {
                  text: 'uniapp',
                  link: '/zh/vue/uniapp',
                },
              ],
            },
          ],
          '/zh/JavaScript/': [
            {
              text: 'JavaScript',
              items: [
                { text: 'index', link: '/zh/JavaScript/index' },
                {
                  text: '数组快速模式与字典模式',
                  link: '/zh/JavaScript/array-fast-dict-mode',
                },
                {
                  text: '如何判断object为空',
                  link: '/zh/JavaScript/judge-object',
                },
                {
                  text: 'JSON.stringify',
                  link: '/zh/JavaScript/JSON.stringify',
                },
                {
                  text: 'TypeConversion',
                  link: '/zh/JavaScript/TypeConversion',
                },
                {
                  text: '数据类型',
                  link: '/zh/JavaScript/DataTypes',
                },
                {
                  text: '变量在内存中的堆栈存储',
                  link: '/zh/JavaScript/stack-heap',
                },
                {
                  text: 'Determine DataType',
                  link: '/zh/JavaScript/DetermineDataType',
                },
                {
                  text: 'ES 版本特性 (ES6+)',
                  link: '/zh/JavaScript/ESVersion',
                },
                {
                  text: 'let var const',
                  link: '/zh/JavaScript/let_var_const',
                },
                {
                  text: '变量提升和TDZ',
                  link: '/zh/JavaScript/Hoisting_TDZ',
                },
                {
                  text: 'null和undefined的区别',
                  link: '/zh/JavaScript/nullUndefined',
                },
                {
                  text: 'Repaint & Reflow',
                  link: '/zh/JavaScript/Repaint_Reflow',
                },
                {
                  text: '模块系统',
                  link: '/zh/JavaScript/module_commonJS',
                },
                {
                  text: 'EventLoop',
                  link: '/zh/JavaScript/EventLoop',
                },
                {
                  text: '冒泡和捕获',
                  link: '/zh/JavaScript/Bubbling_Capturing',
                },
                {
                  text: 'Event Delegation',
                  link: '/zh/JavaScript/EventDelegation',
                },
                {
                  text: 'ES6 类继承',
                  link: '/zh/JavaScript/ES6Inherit',
                },
                {
                  text: 'IterableObject',
                  link: '/zh/JavaScript/IterableObject',
                },
                {
                  text: 'Promise',
                  link: '/zh/JavaScript/Promise',
                },
                {
                  text: '链式调用',
                  link: '/zh/JavaScript/ChainedCall',
                },
                {
                  text: 'new',
                  link: '/zh/JavaScript/New',
                },
                {
                  text: 'bind apply call',
                  link: '/zh/JavaScript/bind_apply_call',
                },
                {
                  text: 'JS监听对象属性的改变',
                  link: '/zh/JavaScript/defineProperty_Proxy',
                },
                {
                  text: 'Prototype Chain',
                  link: '/zh/JavaScript/Prototype_Chain',
                },
                {
                  text: 'this',
                  link: '/zh/JavaScript/this',
                },
                {
                  text: 'Function',
                  collapsed: true,
                  items: [
                    { text: 'trim()', link: '/zh/JavaScript/trim' },
                    { text: 'parseInt()', link: '/zh/JavaScript/parseInt' },
                  ],
                },
                { text: 'Symbol', link: '/zh/JavaScript/Symbol' },
                {
                  text: 'startWith和indexOf的区别',
                  link: '/zh/JavaScript/startwith_indexof',
                },
                {
                  text: '装箱机制',
                  link: '/zh/JavaScript/boxing',
                },
                {
                  text: '假值和真值',
                  link: '/zh/JavaScript/falsy_truthy',
                },
                {
                  text: '命名规范',
                  link: '/zh/JavaScript/NameConvention',
                },
                {
                  text: 'for',
                  link: '/zh/JavaScript/for',
                },
                {
                  text: 'Reflect',
                  link: '/zh/JavaScript/Reflect',
                },
                {
                  text: 'Garbage Collection',
                  link: '/zh/JavaScript/Garbage_Collection',
                },
                {
                  text: 'globalThis',
                  link: '/zh/JavaScript/globalThis',
                },
                {
                  text: 'Copy',
                  link: '/zh/JavaScript/Copy',
                },
                {
                  text: 'WeakMap and WeakSet',
                  link: '/zh/JavaScript/WeakMap_WeakSet',
                },
                {
                  text: 'ToPrimitive',
                  link: '/zh/JavaScript/ToPrimitive',
                },
                {
                  text: 'Array',
                  items: [{ text: 'Array', link: '/zh/JavaScript/Array' }],
                },
                {
                  text: 'MapAndSet',
                  link: '/zh/JavaScript/MapAndSet',
                },
                {
                  text: 'HOF',
                  link: '/zh/JavaScript/High-Order',
                },
                {
                  text: 'Throttle',
                  link: '/zh/JavaScript/Throttle',
                },
                {
                  text: 'Lazy Function',
                  link: '/zh/JavaScript/Lazy_Function',
                },
                {
                  text: 'Currying',
                  link: '/zh/JavaScript/Curring',
                },
                {
                  text: 'Function Composition',
                  link: '/zh/JavaScript/Function_Composition',
                },
                {
                  text: 'Canvas',
                  link: '/zh/JavaScript/Canvas',
                },
                {
                  text: 'URL',
                  link: '/zh/JavaScript/URL',
                },
                {
                  text: 'Closure',
                  link: '/zh/JavaScript/Closure',
                },
                {
                  text: 'FormData',
                  link: '/zh/JavaScript/formData',
                },
                {
                  text: 'JSON.stringify',
                  link: '/zh/JavaScript/JSON.stringify',
                },
                {
                  text: 'TypeScript',
                  link: '/zh/JavaScript/ts',
                },
              ],
            },
          ],
          '/zh/': [
            {
              text: '首页',
              items: [{ text: 'Start', link: '/zh/Start' }],
            },
          ],
          '/zh/DesignPatterns/': [
            {
              text: '设计模式',
              items: [
                {
                  text: 'index',
                  link: '/zh/DesignPatterns/index',
                },
                {
                  text: 'Singleton Pattern',
                  link: '/zh/DesignPatterns/Singleton',
                },
                { text: 'Factory Pattern', link: '/zh/DesignPatterns/Factory' },
                { text: 'Pub-Sub Pattern', link: '/zh/DesignPatterns/Pub-Sub' },
                {
                  text: 'Observer Pattern',
                  link: '/zh/DesignPatterns/Observer',
                },
                {
                  text: 'Strategy Pattern',
                  link: '/zh/DesignPatterns/Strategy',
                },
                {
                  text: 'Decorator Pattern',
                  link: '/zh/DesignPatterns/Decorator',
                },
                { text: 'MVVM', link: '/zh/DesignPatterns/MVVM' },
              ],
            },
          ],
          '/zh/network/': [
            {
              text: '计算机网络',
              items: [{ text: 'SSE', link: '/zh/network/SSE' }],
            },
          ],
          '/zh/Security/': [
            {
              text: 'Web 安全',
              items: [{ text: 'XSS 跨站脚本攻击', link: '/zh/Security/xss' }],
            },
          ],
          '/zh/react/': [
            {
              text: 'React',
              items: [{ text: 'index', link: '/zh/react/index' }],
            },
            {
              text: 'CSS',
              items: [
                { text: 'CSS Module', link: '/zh/react/css/cssModule' },
                { text: 'Atomic CSS', link: '/zh/react/css/atomic' },
              ],
            },
            {
              text: 'Hook',
              items: [
                { text: 'index', link: '/zh/react/hooks/index' },
                { text: 'useState', link: '/zh/react/hooks/useState' },
                {
                  text: 'useSyncExternalStore',
                  link: '/zh/react/hooks/useSyncExternalStore',
                },
                {
                  text: 'useTransition',
                  link: '/zh/react/hooks/useTransition',
                },
                {
                  text: 'useDeferredValue',
                  link: '/zh/react/hooks/useDeferredValue',
                },
                {
                  text: 'useEffect',
                  link: '/zh/react/hooks/useEffect',
                },
                {
                  text: 'useLayoutEffect',
                  link: '/zh/react/hooks/useLayoutEffect',
                },
                {
                  text: 'useRef',
                  link: '/zh/react/hooks/useRef',
                },
                {
                  text: 'useImperativeHandle',
                  link: '/zh/react/hooks/useImperativeHandle',
                },
                {
                  text: 'useContext',
                  link: '/zh/react/hooks/useContext',
                },
                {
                  text: 'useMemo',
                  link: '/zh/react/hooks/useMemo',
                },
                {
                  text: 'useCallback',
                  link: '/zh/react/hooks/useCallback',
                },
                {
                  text: 'useId',
                  link: '/zh/react/hooks/useId',
                },
              ],
            },
            {
              text: 'API',
              items: [
                { text: 'memo', link: '/zh/react/apis/memo' },
                { text: 'use', link: '/zh/react/apis/use' },
                { text: 'createPortal', link: '/zh/react/apis/createPortal' },
              ],
            },
            {
              text: 'Component',
              items: [
                { text: 'index', link: '/zh/react/component/index' },
                { text: 'connect', link: '/zh/react/component/connect' },
                { text: 'controlled', link: '/zh/react/component/controlled' },
                {
                  text: '&lt;Suspense&gt;',
                  link: '/zh/react/component/suspense',
                },
              ],
            },
            {
              text: 'Router',
              items: [
                { text: 'index', link: '/zh/react/router/index' },
                { text: 'Installation', link: '/zh/react/router/installation' },
                { text: 'Mode', link: '/zh/react/router/mode' },
                { text: 'Router', link: '/zh/react/router/router' },
                { text: 'Transfer', link: '/zh/react/router/transfer' },
                { text: 'Lazy', link: '/zh/react/router/lazy' },
                { text: 'Operation', link: '/zh/react/router/operation' },
              ],
            },
            {
              text: 'Zustand',
              items: [
                {
                  text: 'Installation',
                  link: '/zh/react/zustand/installation',
                },
                { text: 'handleState', link: '/zh/react/zustand/handleState' },
                {
                  text: 'overRendering',
                  link: '/zh/react/zustand/overRendering',
                },
                {
                  text: 'Middlewares',
                  items: [
                    {
                      text: 'persist',
                      link: '/zh/react/zustand/middlewares/persist',
                    },
                    {
                      text: 'devtools',
                      link: '/zh/react/zustand/middlewares/devtools',
                    },
                    {
                      text: 'subscribeWithSelector',
                      link: '/zh/react/zustand/middlewares/subscribeWithSelector',
                    },
                  ],
                },
              ],
            },
            {
              text: 'Immer',
              items: [
                { text: 'Installation', link: '/zh/react/immer/installation' },
              ],
            },
          ],
        },
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
        sidebar: {
          '/en/backend/nodejs/': [
            {
              text: 'Backend',
              items: [
                { text: 'Overview', link: '/en/backend/index.md' },
                { text: 'Koa', link: '/en/backend/koa' },
                {
                  text: 'Node.js',
                  link: '/en/backend/nodejs',
                  items: [
                    { text: '__dirname', link: '/en/backend/nodejs/__dirname' },
                    {
                      text: '__filename',
                      link: '/en/backend/nodejs/__filename',
                    },
                    {
                      text: 'modularity',
                      link: '/en/backend/nodejs/modularity',
                    },
                  ],
                },
                { text: 'Express', link: '/en/backend/express' },
                { text: 'Sequelize', link: '/en/backend/sequelize' },
                { text: 'MongoDB', link: '/en/backend/MongoDB' },
                { text: 'Mongoose', link: '/en/backend/mongoose' },
              ],
            },
          ],
          '/en/backend/java/': [
            {
              text: 'Java',
              items: [{ text: 'index', link: '/en/backend/java/index.md' }],
            },
            {
              text: 'Java 基础',
              items: [
                { text: 'index', link: '/en/backend/java/base/index.md' },
                {
                  text: 'inheritance',
                  link: '/en/backend/java/base/inheritance.md',
                },
                {
                  text: 'Ploymorphism',
                  link: '/en/backend/java/base/Ploymorphism.md',
                },
                {
                  text: 'interface',
                  link: '/en/backend/java/base/interface.md',
                },
                {
                  text: 'abstractClass',
                  link: '/en/backend/java/base/abstractClass.md',
                },
                {
                  text: 'list',
                  link: '/en/backend/java/base/list.md',
                },
                {
                  text: 'set',
                  link: '/en/backend/java/base/set.md',
                },
              ],
            },
            {
              text: 'Maven',
              items: [
                { text: 'index', link: '/en/backend/java/maven/index.md' },
                {
                  text: 'lifeCycle',
                  link: '/en/backend/java/maven/lifeCycle.md',
                },
              ],
            },
            {
              text: 'Unit Test',
              items: [
                { text: 'index', link: '/en/backend/java/unitTest/index.md' },
                { text: 'Junit', link: '/en/backend/java/unitTest/junit.md' },
              ],
            },
            {
              text: 'Spring',
              items: [
                {
                  text: 'three tier',
                  link: '/en/backend/java/spring/threeTier.md',
                },
                {
                  text: 'IoC DI',
                  link: '/en/backend/java/spring/IoC_DI.md',
                },
              ],
            },
            {
              text: 'Spring Boot',
              items: [
                {
                  text: 'Filter',
                  link: '/en/backend/java/springboot/filter.md',
                },
                {
                  text: 'JWT',
                  link: '/en/backend/java/springboot/jwt.md',
                },
                {
                  text: 'Interceptor',
                  link: '/en/backend/java/springboot/interceptor.md',
                },
                {
                  text: 'Lombok',
                  link: '/en/backend/java/springboot/lombok.md',
                },
                {
                  text: 'Mybatis',
                  link: '/en/backend/java/springboot/mybatis.md',
                },
                {
                  text: 'AOP',
                  link: '/en/backend/java/springboot/aop.md',
                },
              ],
            },
          ],

          '/en/Engineering/': [
            {
              text: 'Engineering',
              items: [
                { text: 'Overview', link: '/en/Engineering/' },
                {
                  text: 'git-cz',
                  link: '/en/Engineering/git-cz',
                },
                {
                  text: 'Husky',
                  link: '/en/Engineering/Husky',
                },
                {
                  text: 'Webpack',
                  collapsed: true,
                  items: [
                    { text: 'index', link: '/en/Engineering/Webpack/index' },
                    { text: 'notes', link: '/en/Engineering/Webpack/notes' },
                    { text: 'loader', link: '/en/Engineering/Webpack/loader' },
                    { text: 'plugin', link: '/en/Engineering/Webpack/plugin' },
                  ],
                },
                {
                  text: 'Vite',
                  link: '/en/Engineering/vite',
                },
                {
                  text: 'CLI',
                  link: '/en/Engineering/scaffold',
                },
                {
                  text: 'CSpell',
                  link: '/en/Engineering/cspell',
                },
                {
                  text: 'tsup',
                  link: '/en/Engineering/tsup',
                },
                {
                  text: 'ESlint',
                  link: '/en/Engineering/ESlint',
                },
                {
                  text: 'Commander',
                  link: '/en/Engineering/Commander',
                },
                {
                  text: 'consola',
                  link: '/en/Engineering/consola',
                },
                {
                  text: 'prompts',
                  link: '/en/Engineering/prompts',
                },
                {
                  text: 'Prettier',
                  link: '/en/Engineering/Prettier',
                },
                {
                  text: 'esbuild',
                  link: '/en/Engineering/esbuild',
                },
                {
                  text: 'Axios',
                  link: '/en/Engineering/axios',
                },
                {
                  text: 'Rollup',
                  link: '/en/Engineering/rollup',
                },
                {
                  text: 'Workflow',
                  link: '/en/Engineering/workflow',
                },
                {
                  text: 'nrm',
                  link: '/en/Engineering/nrm',
                },
              ],
            },
          ],
          '/en/Misc/': [
            {
              text: 'Tips',
              items: [
                {
                  text: 'vscode plugin',
                  link: '/en/Misc/vscodePlugin',
                },
                {
                  text: 'performanceOptimization',
                  link: '/en/Misc/performanceOptimization',
                },
                {
                  text: 'Docker',
                  link: '/en/Misc/docker',
                },
                {
                  text: 'git',
                  link: '/en/Misc/git',
                },
              ],
            },
            {
              text: 'Vitepress Plugin Froup Icons',
              items: [
                {
                  text: 'Getting Started',
                  link: '/en/Misc/vitepress-icon',
                },
              ],
            },
            {
              text: '面试题',
              items: [
                {
                  text: 'ref reactive',
                  link: '/en/Misc/ref-reactive',
                },
                {
                  text: '图片懒加载',
                  link: '/en/Misc/lazyImages',
                },
                {
                  text: '文件上传',
                  link: '/en/Misc/fileUpload',
                },
                {
                  text: 'Web API',
                  link: '/en/Misc/WebAPI',
                },
              ],
            },
            {
              text: 'Database',
              items: [
                { text: 'index', link: '/en/Misc/database/index.md' },
                { text: 'DDL', link: '/en/Misc/database/DDL.md' },
                { text: 'DataType', link: '/en/Misc/database/dataType.md' },
                {
                  text: 'Redis',
                  link: '/en/Misc/database/Redis.md',
                },
              ],
            },
          ],
          '/en/vue/nuxt/': [
            {
              text: 'Nuxt',
              items: [
                {
                  text: '快速开始',
                  link: '/en/vue/nuxt/Structure/app/nuxt-start',
                },
                {
                  text: 'Routing',
                  link: '/en/vue/nuxt/Routing',
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
                          link: '/en/vue/nuxt/Structure/app/pages',
                        },
                        {
                          text: 'layouts',
                          link: '/en/vue/nuxt/Structure/app/layout',
                        },
                        {
                          text: 'components',
                          link: '/en/vue/nuxt/Structure/app/components',
                        },
                        {
                          text: 'composables',
                          link: '/en/vue/nuxt/Structure/app/composables',
                        },
                        {
                          text: 'middleware',
                          link: '/en/vue/nuxt/Structure/app/middleware',
                        },
                        {
                          text: 'plugins',
                          link: '/en/vue/nuxt/Structure/app/plugins',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          '/en/vue/': [
            {
              text: 'Vue',
              items: [
                { text: '生命周期', link: '/en/vue/lifecycle' },
                { text: 'Props', link: '/en/vue/Props' },
                { text: 'connect', link: '/en/vue/Components-connect' },
                { text: 'Key 的作用', link: '/en/vue/Key' },
                { text: 'Reflect 与响应式', link: '/en/vue/Reflect' },
                { text: 'Query 与 Params', link: '/en/vue/query_params' },
                { text: '动态组件', link: '/en/vue/dynamic-components' },
                {
                  text: '手写Vue',
                  collapsed: true,
                  items: [
                    {
                      text: 'Vue2-jindu',
                      link: '/en/vue/handwriting/vue2-jindu',
                    },
                    {
                      text: 'Vue3-jindu',
                      link: '/en/vue/handwriting/vue3-jindu',
                    },
                    {
                      text: 'Vue-Router',
                      link: '/en/vue/handwriting/vue-router',
                    },
                    {
                      text: 'Promise',
                      link: '/en/vue/handwriting/Promise',
                    },
                  ],
                },
                {
                  text: 'Vue2不监听数组下标原因',
                  link: '/en/vue/vue2_ArrayIndex',
                },
                {
                  text: '修饰符',
                  link: '/en/vue/modifier',
                },
                {
                  text: 'created 与 mounted 区别',
                  link: '/en/vue/created_mounted',
                },
                {
                  text: 'SSR',
                  link: '/en/vue/SSR',
                },
                {
                  text: 'computed',
                  link: '/en/vue/computed',
                },
                {
                  text: 'watch',
                  link: '/en/vue/watch',
                },
                {
                  text: 'effect',
                  link: '/en/vue/effect',
                },
                {
                  text: 'h',
                  link: '/en/vue/h',
                },
                {
                  text: 'Attribute',
                  link: '/en/vue/attribute',
                },
                {
                  text: 'virtual list',
                  link: '/en/vue/virtualList',
                },
                {
                  text: 'Pinia',
                  link: '/en/vue/pinia',
                },
                {
                  text: 'vue-router',
                  link: '/en/vue/vueRouter',
                },
              ],
            },
          ],
          '/en/JavaScript/': [
            {
              text: 'JavaScript',
              items: [
                { text: 'index', link: '/en/JavaScript/index' },
                {
                  text: '数组快速模式与字典模式',
                  link: '/en/JavaScript/array-fast-dict-mode',
                },
                {
                  text: '如何判断object为空',
                  link: '/en/JavaScript/judge-object',
                },
                {
                  text: 'JSON.stringify',
                  link: '/en/JavaScript/JSON.stringify',
                },
                {
                  text: 'TypeConversion',
                  link: '/en/JavaScript/TypeConversion',
                },
                {
                  text: '数据类型',
                  link: '/en/JavaScript/DataTypes',
                },
                {
                  text: '变量在内存中的堆栈存储',
                  link: '/en/JavaScript/stack-heap',
                },
                {
                  text: 'Determine DataType',
                  link: '/en/JavaScript/DetermineDataType',
                },
                {
                  text: 'ES 版本特性 (ES6+)',
                  link: '/en/JavaScript/ESVersion',
                },
                {
                  text: 'let var const',
                  link: '/en/JavaScript/let_var_const',
                },
                {
                  text: '变量提升和TDZ',
                  link: '/en/JavaScript/Hoisting_TDZ',
                },
                {
                  text: 'null和undefined的区别',
                  link: '/en/JavaScript/nullUndefined',
                },
                {
                  text: 'Repaint & Reflow',
                  link: '/en/JavaScript/Repaint_Reflow',
                },
                {
                  text: '模块系统',
                  link: '/en/JavaScript/module_commonJS',
                },
                {
                  text: 'EventLoop',
                  link: '/en/JavaScript/EventLoop',
                },
                {
                  text: '冒泡和捕获',
                  link: '/en/JavaScript/Bubbling_Capturing',
                },
                {
                  text: 'Event Delegation',
                  link: '/en/JavaScript/EventDelegation',
                },
                {
                  text: 'ES6 类继承',
                  link: '/en/JavaScript/ES6Inherit',
                },
                {
                  text: 'IterableObject',
                  link: '/en/JavaScript/IterableObject',
                },
                {
                  text: 'Promise',
                  link: '/en/JavaScript/Promise',
                },
                {
                  text: '链式调用',
                  link: '/en/JavaScript/ChainedCall',
                },
                {
                  text: 'new',
                  link: '/en/JavaScript/New',
                },
                {
                  text: 'bind apply call',
                  link: '/en/JavaScript/bind_apply_call',
                },
                {
                  text: 'JS监听对象属性的改变',
                  link: '/en/JavaScript/defineProperty_Proxy',
                },
                {
                  text: 'Prototype Chain',
                  link: '/en/JavaScript/Prototype_Chain',
                },
                {
                  text: 'this',
                  link: '/en/JavaScript/this',
                },
                {
                  text: 'Function',
                  collapsed: true,
                  items: [
                    { text: 'trim()', link: '/en/JavaScript/trim' },
                    { text: 'parseInt()', link: '/en/JavaScript/parseInt' },
                  ],
                },
                { text: 'Symbol', link: '/en/JavaScript/Symbol' },
                {
                  text: 'startWith和indexOf的区别',
                  link: '/en/JavaScript/startwith_indexof',
                },
                {
                  text: '装箱机制',
                  link: '/en/JavaScript/boxing',
                },
                {
                  text: '假值和真值',
                  link: '/en/JavaScript/falsy_truthy',
                },
                {
                  text: '命名规范',
                  link: '/en/JavaScript/NameConvention',
                },
                {
                  text: 'for',
                  link: '/en/JavaScript/for',
                },
                {
                  text: 'Reflect',
                  link: '/en/JavaScript/Reflect',
                },
                {
                  text: 'Garbage Collection',
                  link: '/en/JavaScript/Garbage_Collection',
                },
                {
                  text: 'globalThis',
                  link: '/en/JavaScript/globalThis',
                },
                {
                  text: 'Copy',
                  link: '/en/JavaScript/Copy',
                },
                {
                  text: 'WeakMap and WeakSet',
                  link: '/en/JavaScript/WeakMap_WeakSet',
                },
                {
                  text: 'ToPrimitive',
                  link: '/en/JavaScript/ToPrimitive',
                },
                {
                  text: 'Array',
                  items: [{ text: 'Array', link: '/en/JavaScript/Array' }],
                },
                {
                  text: 'MapAndSet',
                  link: '/en/JavaScript/MapAndSet',
                },
                {
                  text: 'HOF',
                  link: '/en/JavaScript/High-Order',
                },
                {
                  text: 'Throttle',
                  link: '/en/JavaScript/Throttle',
                },
                {
                  text: 'Lazy Function',
                  link: '/en/JavaScript/Lazy_Function',
                },
                {
                  text: 'Currying',
                  link: '/en/JavaScript/Curring',
                },
                {
                  text: 'Function Composition',
                  link: '/en/JavaScript/Function_Composition',
                },
                {
                  text: 'Canvas',
                  link: '/en/JavaScript/Canvas',
                },
                {
                  text: 'URL',
                  link: '/en/JavaScript/URL',
                },
                {
                  text: 'Closure',
                  link: '/en/JavaScript/Closure',
                },
                {
                  text: 'FormData',
                  link: '/en/JavaScript/formData',
                },
                {
                  text: 'JSON.stringify',
                  link: '/en/JavaScript/JSON.stringify',
                },
                {
                  text: 'TypeScript',
                  link: '/en/JavaScript/ts',
                },
              ],
            },
          ],
          '/en/': [
            {
              text: '首页',
              items: [{ text: 'Start', link: '/en/Start' }],
            },
          ],
          '/en/DesignPatterns/': [
            {
              text: '设计模式',
              items: [
                {
                  text: 'index',
                  link: '/en/DesignPatterns/index',
                },
                {
                  text: 'Singleton Pattern',
                  link: '/en/DesignPatterns/Singleton',
                },
                { text: 'Factory Pattern', link: '/en/DesignPatterns/Factory' },
                { text: 'Pub-Sub Pattern', link: '/en/DesignPatterns/Pub-Sub' },
                {
                  text: 'Observer Pattern',
                  link: '/en/DesignPatterns/Observer',
                },
                {
                  text: 'Strategy Pattern',
                  link: '/en/DesignPatterns/Strategy',
                },
                {
                  text: 'Decorator Pattern',
                  link: '/en/DesignPatterns/Decorator',
                },
                { text: 'MVVM', link: '/en/DesignPatterns/MVVM' },
              ],
            },
          ],
          '/en/network/': [
            {
              text: '计算机网络',
              items: [{ text: 'SSE', link: '/en/network/SSE' }],
            },
          ],
          '/en/Security/': [
            {
              text: 'Web 安全',
              items: [{ text: 'XSS 跨站脚本攻击', link: '/en/Security/xss' }],
            },
          ],
          '/en/react/': [
            {
              text: 'React',
              items: [{ text: 'index', link: '/en/react/index' }],
            },
            {
              text: 'CSS',
              items: [
                { text: 'CSS Module', link: '/en/react/css/cssModule' },
                { text: 'Atomic CSS', link: '/en/react/css/atomic' },
              ],
            },
            {
              text: 'Hook',
              items: [
                { text: 'index', link: '/en/react/hooks/index' },
                { text: 'useState', link: '/en/react/hooks/useState' },
                {
                  text: 'useSyncExternalStore',
                  link: '/en/react/hooks/useSyncExternalStore',
                },
                {
                  text: 'useTransition',
                  link: '/en/react/hooks/useTransition',
                },
                {
                  text: 'useDeferredValue',
                  link: '/en/react/hooks/useDeferredValue',
                },
                {
                  text: 'useEffect',
                  link: '/en/react/hooks/useEffect',
                },
                {
                  text: 'useLayoutEffect',
                  link: '/en/react/hooks/useLayoutEffect',
                },
                {
                  text: 'useRef',
                  link: '/en/react/hooks/useRef',
                },
                {
                  text: 'useImperativeHandle',
                  link: '/en/react/hooks/useImperativeHandle',
                },
                {
                  text: 'useContext',
                  link: '/en/react/hooks/useContext',
                },
                {
                  text: 'useMemo',
                  link: '/en/react/hooks/useMemo',
                },
                {
                  text: 'useCallback',
                  link: '/en/react/hooks/useCallback',
                },
                {
                  text: 'useId',
                  link: '/en/react/hooks/useId',
                },
              ],
            },
            {
              text: 'API',
              items: [
                { text: 'memo', link: '/en/react/apis/memo' },
                { text: 'use', link: '/en/react/apis/use' },
                { text: 'createPortal', link: '/en/react/apis/createPortal' },
              ],
            },
            {
              text: 'Component',
              items: [
                { text: 'index', link: '/en/react/component/index' },
                { text: 'connect', link: '/en/react/component/connect' },
                { text: 'controlled', link: '/en/react/component/controlled' },
                {
                  text: '&lt;Suspense&gt;',
                  link: '/en/react/component/suspense',
                },
              ],
            },
            {
              text: 'Router',
              items: [
                { text: 'index', link: '/en/react/router/index' },
                { text: 'Installation', link: '/en/react/router/installation' },
                { text: 'Mode', link: '/en/react/router/mode' },
                { text: 'Router', link: '/en/react/router/router' },
                { text: 'Transfer', link: '/en/react/router/transfer' },
                { text: 'Lazy', link: '/en/react/router/lazy' },
                { text: 'Operation', link: '/en/react/router/operation' },
              ],
            },
            {
              text: 'Zustand',
              items: [
                {
                  text: 'Installation',
                  link: '/en/react/zustand/installation',
                },
                { text: 'handleState', link: '/en/react/zustand/handleState' },
                {
                  text: 'overRendering',
                  link: '/en/react/zustand/overRendering',
                },
                {
                  text: 'Middlewares',
                  items: [
                    {
                      text: 'persist',
                      link: '/en/react/zustand/middlewares/persist',
                    },
                    {
                      text: 'devtools',
                      link: '/en/react/zustand/middlewares/devtools',
                    },
                    {
                      text: 'subscribeWithSelector',
                      link: '/en/react/zustand/middlewares/subscribeWithSelector',
                    },
                  ],
                },
              ],
            },
            {
              text: 'Immer',
              items: [
                { text: 'Installation', link: '/en/react/immer/installation' },
              ],
            },
          ],
        },
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
