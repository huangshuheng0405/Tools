export default {
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
      items: [{ text: '总览', link: '/zh/backend/java/index.md' }],
    },
    {
      text: '面向对象',
      link: '/zh/backend/java/oop/index.md',
      items: [
        { text: '继承', link: '/zh/backend/java/oop/inheritance.md' },
        { text: '多态', link: '/zh/backend/java/oop/Polymorphism.md' },
        { text: '接口', link: '/zh/backend/java/oop/interface.md' },
        { text: '抽象类', link: '/zh/backend/java/oop/abstractClass.md' },
      ],
    },
    {
      text: '集合框架',
      link: '/zh/backend/java/collection/index.md',
      items: [
        { text: 'List', link: '/zh/backend/java/collection/list.md' },
        { text: 'Set', link: '/zh/backend/java/collection/set.md' },
        { text: 'Map', link: '/zh/backend/java/collection/map.md' },
      ],
    },
    {
      text: 'Maven',
      link: '/zh/backend/java/maven/index.md',
      items: [
        { text: '安装', link: '/zh/backend/java/maven/install.md' },
        { text: '生命周期', link: '/zh/backend/java/maven/lifeCycle.md' },
      ],
    },
    {
      text: '单元测试',
      link: '/zh/backend/java/unitTest/index.md',
      items: [{ text: 'JUnit', link: '/zh/backend/java/unitTest/junit.md' }],
    },
    {
      text: 'Java 工具库',
      link: '/zh/backend/java/tool/index.md',
      items: [
        { text: 'HttpClient', link: '/zh/backend/java/tool/httpClient.md' },
        { text: 'Hutool', link: '/zh/backend/java/tool/huTool.md' },
        { text: 'Lombok', link: '/zh/backend/java/tool/lombok.md' },
      ],
    },
    {
      text: 'Spring',
      link: '/zh/backend/java/spring/index.md',
      items: [
        { text: 'IoC DI', link: '/zh/backend/java/spring/IoC_DI.md' },
        { text: 'AOP', link: '/zh/backend/java/spring/aop.md' },
        {
          text: 'Spring Cache',
          link: '/zh/backend/java/spring/springCache.md',
        },
        {
          text: 'Spring Data Redis',
          link: '/zh/backend/java/spring/springDataRedis.md',
        },
      ],
    },
    {
      text: 'Spring Boot',
      link: '/zh/backend/java/springboot/index.md',
      items: [
        {
          text: 'Configuration',
          link: '/zh/backend/java/springboot/configuration.md',
        },
        { text: 'Filter', link: '/zh/backend/java/springboot/filter.md' },
        {
          text: 'Interceptor',
          link: '/zh/backend/java/springboot/interceptor.md',
        },
        { text: 'JWT', link: '/zh/backend/java/springboot/jwt.md' },
        { text: 'MyBatis', link: '/zh/backend/java/springboot/mybatis.md' },
        {
          text: 'MyBatis-Plus',
          link: '/zh/backend/java/springboot/mybatisPlus.md',
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
          text: 'Day.js',
          link: '/zh/Engineering/dayjs',
        },
        {
          text: 'Volta',
          link: '/zh/Engineering/volta',
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
  '/zh/frontend/': [
    {
      text: 'frontend',
      items: [
        { text: 'HTML/CSS', link: '/zh/frontend/h5c3' },
        {
          text: 'GSAP',
          link: '/zh/frontend/gsap',
        },
      ],
    },
  ],
  '/zh/devops/': [
    {
      text: 'devOps',
      items: [
        { text: 'Docker', link: '/zh/devops/docker' },
        { text: 'Nginx', link: '/zh/devops/nginx' },
        { text: 'Git', link: '/zh/devops/git' },
        { text: 'JMeter', link: '/zh/devops/jmeter' },
      ],
    },
  ],
  '/zh/database/': [
    {
      text: 'database',
      items: [
        { text: 'index', link: '/zh/database/index' },
        { text: 'SQL', link: '/zh/database/sql' },
        { text: 'MySQL', link: '/zh/database/mysql' },
        { text: 'Redis', link: '/zh/database/redis' },
        { text: 'Redisson', link: '/zh/database/redisson' },
      ],
    },
  ],
  '/zh/misc/': [
    {
      text: 'misc',
      items: [
        { text: 'VSCode plugin', link: '/zh/misc/vscodePlugin' },
        { text: 'Trae', link: '/zh/misc/trae' },
        { text: 'Claude', link: '/zh/misc/claude' },
        { text: 'IDE 配置', link: '/zh/misc/Tutorial' },
        { text: 'VitePress icon', link: '/zh/misc/vitepress-icon' },
        {
          text: 'Design Patterns',
          collapsed: true,
          items: [
            { text: 'index', link: '/zh/misc/DesignPatterns/index' },
            {
              text: 'Singleton Pattern',
              link: '/zh/misc/DesignPatterns/Singleton',
            },
            {
              text: 'Factory Pattern',
              link: '/zh/misc/DesignPatterns/Factory',
            },
            {
              text: 'Pub-Sub Pattern',
              link: '/zh/misc/DesignPatterns/Pub-Sub',
            },
            {
              text: 'Observer Pattern',
              link: '/zh/misc/DesignPatterns/Observer',
            },
            {
              text: 'Strategy Pattern',
              link: '/zh/misc/DesignPatterns/Strategy',
            },
            {
              text: 'Decorator Pattern',
              link: '/zh/misc/DesignPatterns/Decorator',
            },
            { text: 'MVVM', link: '/zh/misc/DesignPatterns/MVVM' },
          ],
        },
        { text: '小程序', link: '/zh/misc/wxapp' },
        { text: 'perf', link: '/zh/misc/performanceOptimization' },
        { text: 'lazy images', link: '/zh/misc/lazyImages' },
        { text: 'file upload', link: '/zh/misc/fileUpload' },
        { text: 'Web API', link: '/zh/misc/WebAPI' },
        { text: 'PDF', link: '/zh/misc/pdfjs' },
        { text: 'rich text', link: '/zh/misc/richtext' },
        { text: 'login', link: '/zh/misc/login' },
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
        { text: 'ref 与 reactive', link: '/zh/vue/ref-reactive' },
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
  '/zh/network/': [
    {
      text: 'network',
      items: [
        { text: 'http', link: '/zh/network/http' },
        { text: 'SSE', link: '/zh/network/SSE' },
      ],
    },
  ],
  '/zh/Security/': [
    {
      text: 'security',
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
      items: [{ text: 'Installation', link: '/zh/react/immer/installation' }],
    },
  ],
}
