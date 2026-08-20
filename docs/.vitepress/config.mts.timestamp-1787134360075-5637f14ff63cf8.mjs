// docs/.vitepress/config.mts
import { defineConfig } from "file:///C:/front-end-tutorial/node_modules/.pnpm/vitepress@1.6.4_@algolia+cl_a6cdba45eecef8114cda2338ecf3ceb2/node_modules/vitepress/dist/node/index.js";
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from "file:///C:/front-end-tutorial/node_modules/.pnpm/vitepress-plugin-group-icon_57afd7e8182dbdef6a52394fb25699cb/node_modules/vitepress-plugin-group-icons/dist/index.mjs";
import mathjax from "file:///C:/front-end-tutorial/node_modules/.pnpm/markdown-it-mathjax3@4.3.2/node_modules/markdown-it-mathjax3/index.js";
var config_default = defineConfig({
  markdown: {
    math: true,
    config(md) {
      md.use(groupIconMdPlugin).use(mathjax);
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        defaultLabels: ["npm", "yarn", "pnpm", "bun", "deno"]
      })
    ]
  },
  themeConfig: {
    logo: "/nodejs-icon.svg",
    outline: {
      level: [2, 6],
      label: "\u76EE\u5F55"
    }
  },
  title: "front-end",
  description: "A VitePress Site",
  head: [["link", { rel: "icon", href: "/nodejs-icon.svg", sizes: "any" }]],
  // 多语言配置
  locales: {
    root: {
      label: "\u7B80\u4F53\u4E2D\u6587",
      lang: "zh-CN",
      themeConfig: {
        outline: {
          level: [2, 6],
          label: "\u76EE\u5F55"
        },
        nav: [
          { text: "Home", link: "/" },
          {
            text: "JavaScript",
            items: [
              { text: "JavaScript", link: "/JavaScript/" },
              { text: "TypeScript", link: "/TypeScript/index" }
            ]
          },
          {
            text: "Vue",
            items: [
              { text: "Vue", link: "/vue/lifecycle" },
              { text: "Nuxt", link: "/vue/nuxt/Structure/app/nuxt" }
            ]
          },
          { text: "React", link: "/react/index" },
          { text: "Engineering", link: "/Engineering/" },
          { text: "Misc", link: "/Misc/" },
          {
            text: "Backend",
            items: [
              { text: "Java", link: "/backend/java/" },
              { text: "NodeJS", link: "/backend/nodejs/index.md" }
            ]
          }
        ],
        sidebar: {
          "/backend/nodejs/": [
            {
              text: "Backend",
              items: [
                { text: "Overview", link: "/backend/index.md" },
                { text: "Koa", link: "/backend/koa" },
                {
                  text: "Node.js",
                  link: "/backend/nodejs",
                  items: [
                    { text: "__dirname", link: "/backend/nodejs/__dirname" },
                    { text: "__filename", link: "/backend/nodejs/__filename" },
                    { text: "modularity", link: "/backend/nodejs/modularity" }
                  ]
                },
                { text: "Express", link: "/backend/express" },
                { text: "Sequelize", link: "/backend/sequelize" },
                { text: "MongoDB", link: "/backend/MongoDB" },
                { text: "Mongoose", link: "/backend/mongoose" }
              ]
            }
          ],
          "/backend/java/": [
            {
              text: "Java",
              items: [{ text: "index", link: "/backend/java/index.md" }]
            },
            {
              text: "Java \u57FA\u7840",
              items: [
                { text: "index", link: "/backend/java/base/index.md" },
                {
                  text: "inheritance",
                  link: "/backend/java/base/inheritance.md"
                },
                {
                  text: "Ploymorphism",
                  link: "/backend/java/base/Ploymorphism.md"
                },
                {
                  text: "interface",
                  link: "/backend/java/base/interface.md"
                },
                {
                  text: "abstractClass",
                  link: "/backend/java/base/abstractClass.md"
                },
                {
                  text: "list",
                  link: "/backend/java/base/list.md"
                },
                {
                  text: "set",
                  link: "/backend/java/base/set.md"
                }
              ]
            },
            {
              text: "Maven",
              items: [
                { text: "index", link: "/backend/java/maven/index.md" },
                { text: "lifeCycle", link: "/backend/java/maven/lifeCycle.md" }
              ]
            },
            {
              text: "Unit Test",
              items: [
                { text: "index", link: "/backend/java/unitTest/index.md" },
                { text: "Junit", link: "/backend/java/unitTest/junit.md" }
              ]
            },
            {
              text: "Spring",
              items: [
                {
                  text: "three tier",
                  link: "/backend/java/spring/threeTier.md"
                },
                {
                  text: "IoC DI",
                  link: "/backend/java/spring/IoC_DI.md"
                }
              ]
            },
            {
              text: "Spring Boot",
              items: [
                {
                  text: "Filter",
                  link: "/backend/java/springboot/filter.md"
                },
                {
                  text: "JWT",
                  link: "/backend/java/springboot/jwt.md"
                },
                {
                  text: "Interceptor",
                  link: "/backend/java/springboot/interceptor.md"
                },
                {
                  text: "Lombok",
                  link: "/backend/java/springboot/lombok.md"
                },
                {
                  text: "Mybatis",
                  link: "/backend/java/springboot/mybatis.md"
                },
                {
                  text: "AOP",
                  link: "/backend/java/springboot/aop.md"
                }
              ]
            }
          ],
          "/Engineering/": [
            {
              text: "Engineering",
              items: [
                { text: "Overview", link: "/Engineering/" },
                {
                  text: "git-cz",
                  link: "/Engineering/git-cz"
                },
                {
                  text: "Husky",
                  link: "/Engineering/Husky"
                },
                {
                  text: "Webpack",
                  collapsed: true,
                  items: [
                    { text: "index", link: "/Engineering/Webpack/index" },
                    { text: "notes", link: "/Engineering/Webpack/notes" },
                    { text: "loader", link: "/Engineering/Webpack/loader" },
                    { text: "plugin", link: "/Engineering/Webpack/plugin" }
                  ]
                },
                {
                  text: "Vite",
                  collapsed: true,
                  items: [
                    { text: "index", link: "/Engineering/Vite/index" },
                    { text: "notes", link: "/Engineering/Vite/notes" }
                  ]
                },
                {
                  text: "CLI",
                  link: "/Engineering/scaffold"
                },
                {
                  text: "CSpell",
                  link: "/Engineering/cspell"
                },
                {
                  text: "tsup",
                  link: "/Engineering/tsup"
                },
                {
                  text: "ESlint",
                  link: "/Engineering/ESlint"
                },
                {
                  text: "Commander",
                  link: "/Engineering/Commander"
                },
                {
                  text: "consola",
                  link: "/Engineering/consola"
                },
                {
                  text: "prompts",
                  link: "/Engineering/prompts"
                },
                {
                  text: "Prettier",
                  link: "/Engineering/Prettier"
                },
                {
                  text: "esbuild",
                  link: "/Engineering/esbuild"
                },
                {
                  text: "Axios",
                  link: "/Engineering/Axios"
                },
                {
                  text: "Rollup",
                  link: "/Engineering/rollup"
                },
                {
                  text: "nrm",
                  link: "/Engineering/nrm"
                }
              ]
            }
          ],
          "/Misc/": [
            {
              text: "Tips",
              items: [
                {
                  text: "vscode plugin",
                  link: "/Misc/vscodePlugin"
                },
                {
                  text: "performanceOptimization",
                  link: "/Misc/performanceOptimization"
                },
                {
                  text: "Docker",
                  link: "/Misc/docker"
                },
                {
                  text: "git",
                  link: "/Misc/git"
                }
              ]
            },
            {
              text: "Vitepress Plugin Froup Icons",
              items: [
                {
                  text: "Getting Started",
                  link: "/Misc/vitepress-icon"
                }
              ]
            },
            {
              text: "\u9762\u8BD5\u9898",
              items: [
                {
                  text: "ref reactive",
                  link: "/Misc/ref-reactive"
                },
                {
                  text: "\u56FE\u7247\u61D2\u52A0\u8F7D",
                  link: "/Misc/lazyImages"
                },
                {
                  text: "\u6587\u4EF6\u4E0A\u4F20",
                  link: "/Misc/fileUpload"
                },
                {
                  text: "Web API",
                  link: "/Misc/WebAPI"
                }
              ]
            },
            {
              text: "Database",
              items: [
                { text: "index", link: "/Misc/database/index.md" },
                { text: "DDL", link: "/Misc/database/DDL.md" },
                { text: "DataType", link: "/Misc/database/dataType.md" }
              ]
            }
          ],
          "/vue/nuxt/": [
            {
              text: "Nuxt",
              items: [
                {
                  text: "\u5FEB\u901F\u5F00\u59CB",
                  link: "/vue/nuxt/Structure/app/nuxt-start"
                },
                {
                  text: "Routing",
                  link: "/vue/nuxt/Routing"
                },
                {
                  text: "Structure",
                  collapsed: false,
                  items: [
                    {
                      text: "app",
                      collapsed: false,
                      items: [
                        {
                          text: "pages",
                          link: "/vue/nuxt/Structure/app/pages"
                        },
                        {
                          text: "layouts",
                          link: "/vue/nuxt/Structure/app/layout"
                        },
                        {
                          text: "components",
                          link: "/vue/nuxt/Structure/app/components"
                        },
                        {
                          text: "composables",
                          link: "/vue/nuxt/Structure/app/composables"
                        },
                        {
                          text: "middleware",
                          link: "/vue/nuxt/Structure/app/middleware"
                        },
                        {
                          text: "plugins",
                          link: "/vue/nuxt/Structure/app/plugins"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "/vue/": [
            {
              text: "Vue",
              items: [
                { text: "\u751F\u547D\u5468\u671F", link: "/vue/lifecycle" },
                { text: "Props", link: "/vue/Props" },
                { text: "connect", link: "/vue/Components-connect" },
                { text: "Key \u7684\u4F5C\u7528", link: "/vue/Key" },
                { text: "Reflect \u4E0E\u54CD\u5E94\u5F0F", link: "/vue/Reflect" },
                { text: "Query \u4E0E Params", link: "/vue/query_params" },
                { text: "\u52A8\u6001\u7EC4\u4EF6", link: "/vue/dynamic-components" },
                {
                  text: "\u624B\u5199Vue",
                  collapsed: true,
                  items: [
                    {
                      text: "Vue2-jindu",
                      link: "/vue/handwriting/vue2-jindu"
                    },
                    {
                      text: "Vue3-jindu",
                      link: "/vue/handwriting/vue3-jindu"
                    },
                    {
                      text: "Vue-Router",
                      link: "/vue/handwriting/vue-router"
                    },
                    {
                      text: "Promise",
                      link: "/vue/handwriting/Promise"
                    }
                  ]
                },
                {
                  text: "Vue2\u4E0D\u76D1\u542C\u6570\u7EC4\u4E0B\u6807\u539F\u56E0",
                  link: "/vue/vue2_ArrayIndex"
                },
                {
                  text: "\u4FEE\u9970\u7B26",
                  link: "/vue/modifier"
                },
                {
                  text: "created \u4E0E mounted \u533A\u522B",
                  link: "/vue/created_mounted"
                },
                {
                  text: "vue-router",
                  collapsed: true,
                  items: [
                    {
                      text: "\u8DEF\u7531\u6A21\u5F0F",
                      link: "/vue/vue-router/mode"
                    },
                    {
                      text: "\u8DEF\u7531\u8DF3\u8F6C",
                      link: "/vue/vue-router/routerLink"
                    }
                  ]
                },
                {
                  text: "SSR",
                  link: "/vue/SSR"
                },
                {
                  text: "computed",
                  link: "/vue/computed"
                },
                {
                  text: "watch",
                  link: "/vue/watch"
                },
                {
                  text: "effect",
                  link: "/vue/effect"
                },
                {
                  text: "h",
                  link: "/vue/h"
                },
                {
                  text: "Attribute",
                  link: "/vue/attribute"
                },
                {
                  text: "virtual list",
                  link: "/vue/virtualList"
                },
                {
                  text: "Pinia",
                  link: "/vue/pinia"
                }
              ]
            }
          ],
          "/JavaScript/": [
            {
              text: "JavaScript",
              items: [
                { text: "index", link: "/JavaScript/index" },
                {
                  text: "\u6570\u7EC4\u5FEB\u901F\u6A21\u5F0F\u4E0E\u5B57\u5178\u6A21\u5F0F",
                  link: "/JavaScript/array-fast-dict-mode"
                },
                {
                  text: "\u5982\u4F55\u5224\u65ADobject\u4E3A\u7A7A",
                  link: "/JavaScript/judge-object"
                },
                {
                  text: "JSON.stringify",
                  link: "/JavaScript/JSON.stringify"
                },
                {
                  text: "TypeConversion",
                  link: "/JavaScript/TypeConversion"
                },
                {
                  text: "\u6570\u636E\u7C7B\u578B",
                  link: "/JavaScript/DataTypes"
                },
                {
                  text: "\u53D8\u91CF\u5728\u5185\u5B58\u4E2D\u7684\u5806\u6808\u5B58\u50A8",
                  link: "/JavaScript/stack-heap"
                },
                {
                  text: "Determine DataType",
                  link: "/JavaScript/DetermineDataType"
                },
                {
                  text: "ES \u7248\u672C\u7279\u6027 (ES6+)",
                  link: "/JavaScript/ESVersion"
                },
                {
                  text: "let var const",
                  link: "/JavaScript/let_var_const"
                },
                {
                  text: "\u53D8\u91CF\u63D0\u5347\u548CTDZ",
                  link: "/JavaScript/Hoisting_TDZ"
                },
                {
                  text: "null\u548Cundefined\u7684\u533A\u522B",
                  link: "/JavaScript/nullUndefined"
                },
                {
                  text: "Repaint & Reflow",
                  link: "/JavaScript/Repaint_Reflow"
                },
                {
                  text: "\u6A21\u5757\u7CFB\u7EDF",
                  link: "/JavaScript/module_commonJS"
                },
                {
                  text: "EventLoop",
                  link: "/JavaScript/EventLoop"
                },
                {
                  text: "\u5192\u6CE1\u548C\u6355\u83B7",
                  link: "/JavaScript/Bubbling_Capturing"
                },
                {
                  text: "Event Delegation",
                  link: "/JavaScript/EventDelegation"
                },
                {
                  text: "ES6 \u7C7B\u7EE7\u627F",
                  link: "/JavaScript/ES6Inherit"
                },
                {
                  text: "IterableObject",
                  link: "/JavaScript/IterableObject"
                },
                {
                  text: "Promise",
                  link: "/JavaScript/Promise"
                },
                {
                  text: "\u94FE\u5F0F\u8C03\u7528",
                  link: "/JavaScript/ChainedCall"
                },
                {
                  text: "new",
                  link: "/JavaScript/New"
                },
                {
                  text: "bind apply call",
                  link: "/JavaScript/bind_apply_call"
                },
                {
                  text: "JS\u76D1\u542C\u5BF9\u8C61\u5C5E\u6027\u7684\u6539\u53D8",
                  link: "/JavaScript/defineProperty_Proxy"
                },
                {
                  text: "Prototype Chain",
                  link: "/JavaScript/Prototype_Chain"
                },
                {
                  text: "this",
                  link: "/JavaScript/this"
                },
                {
                  text: "Function",
                  collapsed: true,
                  items: [
                    { text: "trim()", link: "/JavaScript/trim" },
                    { text: "parseInt()", link: "/JavaScript/parseInt" }
                  ]
                },
                { text: "Symbol", link: "/JavaScript/Symbol" },
                {
                  text: "startWith\u548CindexOf\u7684\u533A\u522B",
                  link: "/JavaScript/startwith_indexof"
                },
                {
                  text: "\u88C5\u7BB1\u673A\u5236",
                  link: "/JavaScript/boxing"
                },
                {
                  text: "\u5047\u503C\u548C\u771F\u503C",
                  link: "/JavaScript/falsy_truthy"
                },
                {
                  text: "\u547D\u540D\u89C4\u8303",
                  link: "/JavaScript/NameConvention"
                },
                {
                  text: "for",
                  link: "/JavaScript/for"
                },
                {
                  text: "Reflect",
                  link: "/JavaScript/Reflect"
                },
                {
                  text: "Garbage Collection",
                  link: "/JavaScript/Garbage_Collection"
                },
                {
                  text: "globalThis",
                  link: "/JavaScript/globalThis"
                },
                {
                  text: "Copy",
                  link: "/JavaScript/Copy"
                },
                {
                  text: "WeakMap and WeakSet",
                  link: "/JavaScript/WeakMap_WeakSet"
                },
                {
                  text: "ToPrimitive",
                  link: "/JavaScript/ToPrimitive"
                },
                {
                  text: "Array",
                  items: [{ text: "Array", link: "/JavaScript/Array" }]
                },
                {
                  text: "MapAndSet",
                  link: "/JavaScript/MapAndSet"
                },
                {
                  text: "HOF",
                  link: "/JavaScript/High-Order"
                },
                {
                  text: "Throttle",
                  link: "/JavaScript/Throttle"
                },
                {
                  text: "Lazy Function",
                  link: "/JavaScript/Lazy_Function"
                },
                {
                  text: "Currying",
                  link: "/JavaScript/Curring"
                },
                {
                  text: "Function Composition",
                  link: "/JavaScript/Function_Composition"
                },
                {
                  text: "Canvas",
                  link: "/JavaScript/Canvas"
                },
                {
                  text: "URL",
                  link: "/JavaScript/URL"
                },
                {
                  text: "Closure",
                  link: "/JavaScript/Closure"
                },
                {
                  text: "FormData",
                  link: "/JavaScript/formData"
                },
                {
                  text: "JSON.stringify",
                  link: "/JavaScript/JSON.stringify"
                }
              ]
            }
          ],
          "/": [
            {
              text: "\u9996\u9875",
              items: [{ text: "Start", link: "/Start" }]
            }
          ],
          "/TypeScript/": [
            {
              text: "TypeScript",
              items: [
                { text: "index", link: "/TypeScript/index" },
                { text: "Start", link: "/TypeScript/Start" },
                {
                  text: "tsconfig.json",
                  link: "/TypeScript/tsconfig"
                }
              ]
            }
          ],
          "/DesignPatterns/": [
            {
              text: "\u8BBE\u8BA1\u6A21\u5F0F",
              items: [
                {
                  text: "index",
                  link: "/DesignPatterns/index"
                },
                {
                  text: "Singleton Pattern",
                  link: "/DesignPatterns/Singleton"
                },
                { text: "Factory Pattern", link: "/DesignPatterns/Factory" },
                { text: "Pub-Sub Pattern", link: "/DesignPatterns/Pub-Sub" },
                { text: "Observer Pattern", link: "/DesignPatterns/Observer" },
                { text: "Strategy Pattern", link: "/DesignPatterns/Strategy" },
                {
                  text: "Decorator Pattern",
                  link: "/DesignPatterns/Decorator"
                },
                { text: "MVVM", link: "/DesignPatterns/MVVM" }
              ]
            }
          ],
          "/network/": [
            {
              text: "\u8BA1\u7B97\u673A\u7F51\u7EDC",
              items: [{ text: "SSE", link: "/network/SSE" }]
            }
          ],
          "/Security/": [
            {
              text: "Web \u5B89\u5168",
              items: [{ text: "XSS \u8DE8\u7AD9\u811A\u672C\u653B\u51FB", link: "/Security/xss" }]
            }
          ],
          "/react/": [
            {
              text: "React",
              items: [{ text: "index", link: "/react/index" }]
            },
            {
              text: "CSS",
              items: [
                { text: "CSS Module", link: "/react/css/cssModule" },
                { text: "Atomic CSS", link: "/react/css/atomic" }
              ]
            },
            {
              text: "Hook",
              items: [
                { text: "index", link: "/react/hooks/index" },
                { text: "useState", link: "/react/hooks/useState" },
                {
                  text: "useSyncExternalStore",
                  link: "/react/hooks/useSyncExternalStore"
                },
                {
                  text: "useTransition",
                  link: "/react/hooks/useTransition"
                },
                {
                  text: "useDeferredValue",
                  link: "/react/hooks/useDeferredValue"
                },
                {
                  text: "useEffect",
                  link: "/react/hooks/useEffect"
                },
                {
                  text: "useLayoutEffect",
                  link: "/react/hooks/useLayoutEffect"
                },
                {
                  text: "useRef",
                  link: "/react/hooks/useRef"
                },
                {
                  text: "useImperativeHandle",
                  link: "/react/hooks/useImperativeHandle"
                },
                {
                  text: "useContext",
                  link: "/react/hooks/useContext"
                },
                {
                  text: "useMemo",
                  link: "/react/hooks/useMemo"
                },
                {
                  text: "useCallback",
                  link: "/react/hooks/useCallback"
                },
                {
                  text: "useId",
                  link: "/react/hooks/useId"
                }
              ]
            },
            {
              text: "API",
              items: [
                { text: "memo", link: "/react/apis/memo" },
                { text: "use", link: "/react/apis/use" },
                { text: "createPortal", link: "/react/apis/createPortal" }
              ]
            },
            {
              text: "Component",
              items: [
                { text: "index", link: "/react/component/index" },
                { text: "connect", link: "/react/component/connect" },
                { text: "controlled", link: "/react/component/controlled" },
                { text: "&lt;Suspense&gt;", link: "/react/component/suspense" }
              ]
            },
            {
              text: "Router",
              items: [
                { text: "index", link: "/react/router/index" },
                { text: "Installation", link: "/react/router/installation" },
                { text: "Mode", link: "/react/router/mode" },
                { text: "Router", link: "/react/router/router" },
                { text: "Transfer", link: "/react/router/transfer" },
                { text: "Lazy", link: "/react/router/lazy" },
                { text: "Operation", link: "/react/router/operation" }
              ]
            },
            {
              text: "Zustand",
              items: [
                { text: "Installation", link: "/react/zustand/installation" },
                { text: "handleState", link: "/react/zustand/handleState" },
                { text: "overRendering", link: "/react/zustand/overRendering" },
                {
                  text: "Middlewares",
                  items: [
                    {
                      text: "persist",
                      link: "/react/zustand/middlewares/persist"
                    },
                    {
                      text: "devtools",
                      link: "/react/zustand/middlewares/devtools"
                    },
                    {
                      text: "subscribeWithSelector",
                      link: "/react/zustand/middlewares/subscribeWithSelector"
                    }
                  ]
                }
              ]
            },
            {
              text: "Immer",
              items: [
                { text: "Installation", link: "/react/immer/installation" }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: "github", link: "https://github.com/huangshuheng0405/Tools" }
        ],
        // 中文界面文本配置
        docFooter: {
          prev: "\u4E0A\u4E00\u9875",
          next: "\u4E0B\u4E00\u9875"
        },
        returnToTopLabel: "\u56DE\u5230\u9876\u90E8",
        sidebarMenuLabel: "\u83DC\u5355",
        darkModeSwitchLabel: "\u4E3B\u9898",
        lightModeSwitchTitle: "\u5207\u6362\u5230\u6D45\u8272\u6A21\u5F0F",
        darkModeSwitchTitle: "\u5207\u6362\u5230\u6DF1\u8272\u6A21\u5F0F"
      }
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxmcm9udC1lbmQtdHV0b3JpYWxcXFxcZG9jc1xcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxmcm9udC1lbmQtdHV0b3JpYWxcXFxcZG9jc1xcXFwudml0ZXByZXNzXFxcXGNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2Zyb250LWVuZC10dXRvcmlhbC9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcydcclxuaW1wb3J0IHtcclxuICBncm91cEljb25NZFBsdWdpbixcclxuICBncm91cEljb25WaXRlUGx1Z2luLFxyXG59IGZyb20gJ3ZpdGVwcmVzcy1wbHVnaW4tZ3JvdXAtaWNvbnMnXHJcbmltcG9ydCBtYXRoamF4IGZyb20gJ21hcmtkb3duLWl0LW1hdGhqYXgzJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIG1hcmtkb3duOiB7XHJcbiAgICBtYXRoOiB0cnVlLFxyXG4gICAgY29uZmlnKG1kKSB7XHJcbiAgICAgIG1kLnVzZShncm91cEljb25NZFBsdWdpbikudXNlKG1hdGhqYXgpXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdml0ZToge1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBncm91cEljb25WaXRlUGx1Z2luKHtcclxuICAgICAgICBkZWZhdWx0TGFiZWxzOiBbJ25wbScsICd5YXJuJywgJ3BucG0nLCAnYnVuJywgJ2Rlbm8nXSxcclxuICAgICAgfSkgYXMgYW55LFxyXG4gICAgXSxcclxuICB9LFxyXG4gIHRoZW1lQ29uZmlnOiB7XHJcbiAgICBsb2dvOiAnL25vZGVqcy1pY29uLnN2ZycsXHJcbiAgICBvdXRsaW5lOiB7XHJcbiAgICAgIGxldmVsOiBbMiwgNl0sXHJcbiAgICAgIGxhYmVsOiAnXHU3NkVFXHU1RjU1JyxcclxuICAgIH0sXHJcbiAgfSxcclxuICB0aXRsZTogJ2Zyb250LWVuZCcsXHJcbiAgZGVzY3JpcHRpb246ICdBIFZpdGVQcmVzcyBTaXRlJyxcclxuICBoZWFkOiBbWydsaW5rJywgeyByZWw6ICdpY29uJywgaHJlZjogJy9ub2RlanMtaWNvbi5zdmcnLCBzaXplczogJ2FueScgfV1dLFxyXG5cclxuICAvLyBcdTU5MUFcdThCRURcdThBMDBcdTkxNERcdTdGNkVcclxuICBsb2NhbGVzOiB7XHJcbiAgICByb290OiB7XHJcbiAgICAgIGxhYmVsOiAnXHU3QjgwXHU0RjUzXHU0RTJEXHU2NTg3JyxcclxuICAgICAgbGFuZzogJ3poLUNOJyxcclxuICAgICAgdGhlbWVDb25maWc6IHtcclxuICAgICAgICBvdXRsaW5lOiB7XHJcbiAgICAgICAgICBsZXZlbDogWzIsIDZdLFxyXG4gICAgICAgICAgbGFiZWw6ICdcdTc2RUVcdTVGNTUnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmF2OiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdIb21lJywgbGluazogJy8nIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdKYXZhU2NyaXB0JyxcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdKYXZhU2NyaXB0JywgbGluazogJy9KYXZhU2NyaXB0LycgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdUeXBlU2NyaXB0JywgbGluazogJy9UeXBlU2NyaXB0L2luZGV4JyB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ1Z1ZScsXHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnVnVlJywgbGluazogJy92dWUvbGlmZWN5Y2xlJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ051eHQnLCBsaW5rOiAnL3Z1ZS9udXh0L1N0cnVjdHVyZS9hcHAvbnV4dCcgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdSZWFjdCcsIGxpbms6ICcvcmVhY3QvaW5kZXgnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdFbmdpbmVlcmluZycsIGxpbms6ICcvRW5naW5lZXJpbmcvJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnTWlzYycsIGxpbms6ICcvTWlzYy8nIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdCYWNrZW5kJyxcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdKYXZhJywgbGluazogJy9iYWNrZW5kL2phdmEvJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ05vZGVKUycsIGxpbms6ICcvYmFja2VuZC9ub2RlanMvaW5kZXgubWQnIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgc2lkZWJhcjoge1xyXG4gICAgICAgICAgJy9iYWNrZW5kL25vZGVqcy8nOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnQmFja2VuZCcsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ092ZXJ2aWV3JywgbGluazogJy9iYWNrZW5kL2luZGV4Lm1kJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnS29hJywgbGluazogJy9iYWNrZW5kL2tvYScgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ05vZGUuanMnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL2JhY2tlbmQvbm9kZWpzJyxcclxuICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdfX2Rpcm5hbWUnLCBsaW5rOiAnL2JhY2tlbmQvbm9kZWpzL19fZGlybmFtZScgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdfX2ZpbGVuYW1lJywgbGluazogJy9iYWNrZW5kL25vZGVqcy9fX2ZpbGVuYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ21vZHVsYXJpdHknLCBsaW5rOiAnL2JhY2tlbmQvbm9kZWpzL21vZHVsYXJpdHknIH0sXHJcbiAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnRXhwcmVzcycsIGxpbms6ICcvYmFja2VuZC9leHByZXNzJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnU2VxdWVsaXplJywgbGluazogJy9iYWNrZW5kL3NlcXVlbGl6ZScgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ01vbmdvREInLCBsaW5rOiAnL2JhY2tlbmQvTW9uZ29EQicgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ01vbmdvb3NlJywgbGluazogJy9iYWNrZW5kL21vbmdvb3NlJyB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy9iYWNrZW5kL2phdmEvJzogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ0phdmEnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL2JhY2tlbmQvamF2YS9pbmRleC5tZCcgfV0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnSmF2YSBcdTU3RkFcdTc4NDAnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdpbmRleCcsIGxpbms6ICcvYmFja2VuZC9qYXZhL2Jhc2UvaW5kZXgubWQnIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdpbmhlcml0YW5jZScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL2Jhc2UvaW5oZXJpdGFuY2UubWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1Bsb3ltb3JwaGlzbScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL2Jhc2UvUGxveW1vcnBoaXNtLm1kJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdpbnRlcmZhY2UnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL2JhY2tlbmQvamF2YS9iYXNlL2ludGVyZmFjZS5tZCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnYWJzdHJhY3RDbGFzcycsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL2Jhc2UvYWJzdHJhY3RDbGFzcy5tZCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnbGlzdCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL2Jhc2UvbGlzdC5tZCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnc2V0JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9iYWNrZW5kL2phdmEvYmFzZS9zZXQubWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ01hdmVuJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL2JhY2tlbmQvamF2YS9tYXZlbi9pbmRleC5tZCcgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ2xpZmVDeWNsZScsIGxpbms6ICcvYmFja2VuZC9qYXZhL21hdmVuL2xpZmVDeWNsZS5tZCcgfSxcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ1VuaXQgVGVzdCcsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ2luZGV4JywgbGluazogJy9iYWNrZW5kL2phdmEvdW5pdFRlc3QvaW5kZXgubWQnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdKdW5pdCcsIGxpbms6ICcvYmFja2VuZC9qYXZhL3VuaXRUZXN0L2p1bml0Lm1kJyB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnU3ByaW5nJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAndGhyZWUgdGllcicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL3NwcmluZy90aHJlZVRpZXIubWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0lvQyBESScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL3NwcmluZy9Jb0NfREkubWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ1NwcmluZyBCb290JyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnRmlsdGVyJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9iYWNrZW5kL2phdmEvc3ByaW5nYm9vdC9maWx0ZXIubWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0pXVCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL3NwcmluZ2Jvb3Qvand0Lm1kJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdJbnRlcmNlcHRvcicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL3NwcmluZ2Jvb3QvaW50ZXJjZXB0b3IubWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0xvbWJvaycsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvYmFja2VuZC9qYXZhL3NwcmluZ2Jvb3QvbG9tYm9rLm1kJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdNeWJhdGlzJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9iYWNrZW5kL2phdmEvc3ByaW5nYm9vdC9teWJhdGlzLm1kJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdBT1AnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL2JhY2tlbmQvamF2YS9zcHJpbmdib290L2FvcC5tZCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG5cclxuICAgICAgICAgICcvRW5naW5lZXJpbmcvJzogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ0VuZ2luZWVyaW5nJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL0VuZ2luZWVyaW5nLycgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ2dpdC1jeicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvZ2l0LWN6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdIdXNreScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvSHVza3knLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1dlYnBhY2snLFxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1dlYnBhY2svaW5kZXgnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnbm90ZXMnLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1dlYnBhY2svbm90ZXMnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnbG9hZGVyJywgbGluazogJy9FbmdpbmVlcmluZy9XZWJwYWNrL2xvYWRlcicgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdwbHVnaW4nLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1dlYnBhY2svcGx1Z2luJyB9LFxyXG4gICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1ZpdGUnLFxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1ZpdGUvaW5kZXgnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnbm90ZXMnLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1ZpdGUvbm90ZXMnIH0sXHJcbiAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnQ0xJJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9FbmdpbmVlcmluZy9zY2FmZm9sZCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnQ1NwZWxsJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9FbmdpbmVlcmluZy9jc3BlbGwnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3RzdXAnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0VuZ2luZWVyaW5nL3RzdXAnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0VTbGludCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvRVNsaW50JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdDb21tYW5kZXInLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0VuZ2luZWVyaW5nL0NvbW1hbmRlcicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnY29uc29sYScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvY29uc29sYScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAncHJvbXB0cycsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvcHJvbXB0cycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnUHJldHRpZXInLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0VuZ2luZWVyaW5nL1ByZXR0aWVyJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdlc2J1aWxkJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9FbmdpbmVlcmluZy9lc2J1aWxkJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdBeGlvcycsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvQXhpb3MnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1JvbGx1cCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvcm9sbHVwJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICducm0nLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0VuZ2luZWVyaW5nL25ybScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy9NaXNjLyc6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdUaXBzJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAndnNjb2RlIHBsdWdpbicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvTWlzYy92c2NvZGVQbHVnaW4nLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3BlcmZvcm1hbmNlT3B0aW1pemF0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9NaXNjL3BlcmZvcm1hbmNlT3B0aW1pemF0aW9uJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdEb2NrZXInLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL01pc2MvZG9ja2VyJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdnaXQnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL01pc2MvZ2l0JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdWaXRlcHJlc3MgUGx1Z2luIEZyb3VwIEljb25zJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnR2V0dGluZyBTdGFydGVkJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9NaXNjL3ZpdGVwcmVzcy1pY29uJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdcdTk3NjJcdThCRDVcdTk4OTgnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdyZWYgcmVhY3RpdmUnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL01pc2MvcmVmLXJlYWN0aXZlJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTU2RkVcdTcyNDdcdTYxRDJcdTUyQTBcdThGN0QnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL01pc2MvbGF6eUltYWdlcycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2NTg3XHU0RUY2XHU0RTBBXHU0RjIwJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9NaXNjL2ZpbGVVcGxvYWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1dlYiBBUEknLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL01pc2MvV2ViQVBJJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdEYXRhYmFzZScsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ2luZGV4JywgbGluazogJy9NaXNjL2RhdGFiYXNlL2luZGV4Lm1kJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnRERMJywgbGluazogJy9NaXNjL2RhdGFiYXNlL0RETC5tZCcgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ0RhdGFUeXBlJywgbGluazogJy9NaXNjL2RhdGFiYXNlL2RhdGFUeXBlLm1kJyB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy92dWUvbnV4dC8nOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnTnV4dCcsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL251eHQvU3RydWN0dXJlL2FwcC9udXh0LXN0YXJ0JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdSb3V0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvbnV4dC9Sb3V0aW5nJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdTdHJ1Y3R1cmUnLFxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdhcHAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAncGFnZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL251eHQvU3RydWN0dXJlL2FwcC9wYWdlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnbGF5b3V0cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvbnV4dC9TdHJ1Y3R1cmUvYXBwL2xheW91dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnY29tcG9uZW50cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvbnV4dC9TdHJ1Y3R1cmUvYXBwL2NvbXBvbmVudHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2NvbXBvc2FibGVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9udXh0L1N0cnVjdHVyZS9hcHAvY29tcG9zYWJsZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ21pZGRsZXdhcmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL251eHQvU3RydWN0dXJlL2FwcC9taWRkbGV3YXJlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdwbHVnaW5zJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9udXh0L1N0cnVjdHVyZS9hcHAvcGx1Z2lucycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy92dWUvJzogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ1Z1ZScsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NzUxRlx1NTQ3RFx1NTQ2OFx1NjcxRicsIGxpbms6ICcvdnVlL2xpZmVjeWNsZScgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1Byb3BzJywgbGluazogJy92dWUvUHJvcHMnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdjb25uZWN0JywgbGluazogJy92dWUvQ29tcG9uZW50cy1jb25uZWN0JyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnS2V5IFx1NzY4NFx1NEY1Q1x1NzUyOCcsIGxpbms6ICcvdnVlL0tleScgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1JlZmxlY3QgXHU0RTBFXHU1NENEXHU1RTk0XHU1RjBGJywgbGluazogJy92dWUvUmVmbGVjdCcgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1F1ZXJ5IFx1NEUwRSBQYXJhbXMnLCBsaW5rOiAnL3Z1ZS9xdWVyeV9wYXJhbXMnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTUyQThcdTYwMDFcdTdFQzRcdTRFRjYnLCBsaW5rOiAnL3Z1ZS9keW5hbWljLWNvbXBvbmVudHMnIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTYyNEJcdTUxOTlWdWUnLFxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1Z1ZTItamluZHUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvaGFuZHdyaXRpbmcvdnVlMi1qaW5kdScsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnVnVlMy1qaW5kdScsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9oYW5kd3JpdGluZy92dWUzLWppbmR1JyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdWdWUtUm91dGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL2hhbmR3cml0aW5nL3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1Byb21pc2UnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvaGFuZHdyaXRpbmcvUHJvbWlzZScsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdWdWUyXHU0RTBEXHU3NkQxXHU1NDJDXHU2NTcwXHU3RUM0XHU0RTBCXHU2ODA3XHU1MzlGXHU1NkUwJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvdnVlMl9BcnJheUluZGV4JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTRGRUVcdTk5NzBcdTdCMjYnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9tb2RpZmllcicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnY3JlYXRlZCBcdTRFMEUgbW91bnRlZCBcdTUzM0FcdTUyMkInLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9jcmVhdGVkX21vdW50ZWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OERFRlx1NzUzMVx1NkEyMVx1NUYwRicsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS92dWUtcm91dGVyL21vZGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OERFRlx1NzUzMVx1OERGM1x1OEY2QycsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS92dWUtcm91dGVyL3JvdXRlckxpbmsnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnU1NSJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvU1NSJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdjb21wdXRlZCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL2NvbXB1dGVkJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICd3YXRjaCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL3dhdGNoJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdlZmZlY3QnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9lZmZlY3QnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ2gnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9oJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdBdHRyaWJ1dGUnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9hdHRyaWJ1dGUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3ZpcnR1YWwgbGlzdCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL3ZpcnR1YWxMaXN0JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdQaW5pYScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL3BpbmlhJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAnL0phdmFTY3JpcHQvJzogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ0phdmFTY3JpcHQnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdpbmRleCcsIGxpbms6ICcvSmF2YVNjcmlwdC9pbmRleCcgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NjU3MFx1N0VDNFx1NUZFQlx1OTAxRlx1NkEyMVx1NUYwRlx1NEUwRVx1NUI1N1x1NTE3OFx1NkEyMVx1NUYwRicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9hcnJheS1mYXN0LWRpY3QtbW9kZScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1OTgyXHU0RjU1XHU1MjI0XHU2NUFEb2JqZWN0XHU0RTNBXHU3QTdBJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2p1ZGdlLW9iamVjdCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnSlNPTi5zdHJpbmdpZnknLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvSlNPTi5zdHJpbmdpZnknLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1R5cGVDb252ZXJzaW9uJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L1R5cGVDb252ZXJzaW9uJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY1NzBcdTYzNkVcdTdDN0JcdTU3OEInLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvRGF0YVR5cGVzJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUzRDhcdTkxQ0ZcdTU3MjhcdTUxODVcdTVCNThcdTRFMkRcdTc2ODRcdTU4MDZcdTY4MDhcdTVCNThcdTUwQTgnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvc3RhY2staGVhcCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnRGV0ZXJtaW5lIERhdGFUeXBlJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0RldGVybWluZURhdGFUeXBlJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdFUyBcdTcyNDhcdTY3MkNcdTcyNzlcdTYwMjcgKEVTNispJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0VTVmVyc2lvbicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnbGV0IHZhciBjb25zdCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9sZXRfdmFyX2NvbnN0JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUzRDhcdTkxQ0ZcdTYzRDBcdTUzNDdcdTU0OENURFonLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvSG9pc3RpbmdfVERaJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdudWxsXHU1NDhDdW5kZWZpbmVkXHU3Njg0XHU1MzNBXHU1MjJCJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L251bGxVbmRlZmluZWQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1JlcGFpbnQgJiBSZWZsb3cnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvUmVwYWludF9SZWZsb3cnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NkEyMVx1NTc1N1x1N0NGQlx1N0VERicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9tb2R1bGVfY29tbW9uSlMnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0V2ZW50TG9vcCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9FdmVudExvb3AnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NTE5Mlx1NkNFMVx1NTQ4Q1x1NjM1NVx1ODNCNycsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9CdWJibGluZ19DYXB0dXJpbmcnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0V2ZW50IERlbGVnYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvRXZlbnREZWxlZ2F0aW9uJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdFUzYgXHU3QzdCXHU3RUU3XHU2MjdGJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0VTNkluaGVyaXQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0l0ZXJhYmxlT2JqZWN0JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0l0ZXJhYmxlT2JqZWN0JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9taXNlJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L1Byb21pc2UnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OTRGRVx1NUYwRlx1OEMwM1x1NzUyOCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9DaGFpbmVkQ2FsbCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnbmV3JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L05ldycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnYmluZCBhcHBseSBjYWxsJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2JpbmRfYXBwbHlfY2FsbCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnSlNcdTc2RDFcdTU0MkNcdTVCRjlcdThDNjFcdTVDNUVcdTYwMjdcdTc2ODRcdTY1MzlcdTUzRDgnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvZGVmaW5lUHJvcGVydHlfUHJveHknLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1Byb3RvdHlwZSBDaGFpbicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9Qcm90b3R5cGVfQ2hhaW4nLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3RoaXMnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvdGhpcycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnRnVuY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAndHJpbSgpJywgbGluazogJy9KYXZhU2NyaXB0L3RyaW0nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAncGFyc2VJbnQoKScsIGxpbms6ICcvSmF2YVNjcmlwdC9wYXJzZUludCcgfSxcclxuICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdTeW1ib2wnLCBsaW5rOiAnL0phdmFTY3JpcHQvU3ltYm9sJyB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnc3RhcnRXaXRoXHU1NDhDaW5kZXhPZlx1NzY4NFx1NTMzQVx1NTIyQicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9zdGFydHdpdGhfaW5kZXhvZicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU4OEM1XHU3QkIxXHU2NzNBXHU1MjM2JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2JveGluZycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1MDQ3XHU1MDNDXHU1NDhDXHU3NzFGXHU1MDNDJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2ZhbHN5X3RydXRoeScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1NDdEXHU1NDBEXHU4OUM0XHU4MzAzJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L05hbWVDb252ZW50aW9uJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdmb3InLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvZm9yJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdSZWZsZWN0JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L1JlZmxlY3QnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0dhcmJhZ2UgQ29sbGVjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9HYXJiYWdlX0NvbGxlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ2dsb2JhbFRoaXMnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvZ2xvYmFsVGhpcycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnQ29weScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9Db3B5JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdXZWFrTWFwIGFuZCBXZWFrU2V0JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L1dlYWtNYXBfV2Vha1NldCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnVG9QcmltaXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvVG9QcmltaXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0FycmF5JyxcclxuICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHRleHQ6ICdBcnJheScsIGxpbms6ICcvSmF2YVNjcmlwdC9BcnJheScgfV0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnTWFwQW5kU2V0JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L01hcEFuZFNldCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnSE9GJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0hpZ2gtT3JkZXInLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1Rocm90dGxlJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L1Rocm90dGxlJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdMYXp5IEZ1bmN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0xhenlfRnVuY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0N1cnJ5aW5nJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0N1cnJpbmcnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0Z1bmN0aW9uIENvbXBvc2l0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0Z1bmN0aW9uX0NvbXBvc2l0aW9uJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdDYW52YXMnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvQ2FudmFzJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdVUkwnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvVVJMJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdDbG9zdXJlJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0Nsb3N1cmUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0Zvcm1EYXRhJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2Zvcm1EYXRhJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdKU09OLnN0cmluZ2lmeScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9KU09OLnN0cmluZ2lmeScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy8nOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnXHU5OTk2XHU5ODc1JyxcclxuICAgICAgICAgICAgICBpdGVtczogW3sgdGV4dDogJ1N0YXJ0JywgbGluazogJy9TdGFydCcgfV0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy9UeXBlU2NyaXB0Lyc6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdUeXBlU2NyaXB0JyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL1R5cGVTY3JpcHQvaW5kZXgnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdTdGFydCcsIGxpbms6ICcvVHlwZVNjcmlwdC9TdGFydCcgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3RzY29uZmlnLmpzb24nLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL1R5cGVTY3JpcHQvdHNjb25maWcnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgICcvRGVzaWduUGF0dGVybnMvJzogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ1x1OEJCRVx1OEJBMVx1NkEyMVx1NUYwRicsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ2luZGV4JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9EZXNpZ25QYXR0ZXJucy9pbmRleCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnU2luZ2xldG9uIFBhdHRlcm4nLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0Rlc2lnblBhdHRlcm5zL1NpbmdsZXRvbicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnRmFjdG9yeSBQYXR0ZXJuJywgbGluazogJy9EZXNpZ25QYXR0ZXJucy9GYWN0b3J5JyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnUHViLVN1YiBQYXR0ZXJuJywgbGluazogJy9EZXNpZ25QYXR0ZXJucy9QdWItU3ViJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnT2JzZXJ2ZXIgUGF0dGVybicsIGxpbms6ICcvRGVzaWduUGF0dGVybnMvT2JzZXJ2ZXInIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdTdHJhdGVneSBQYXR0ZXJuJywgbGluazogJy9EZXNpZ25QYXR0ZXJucy9TdHJhdGVneScgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0RlY29yYXRvciBQYXR0ZXJuJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9EZXNpZ25QYXR0ZXJucy9EZWNvcmF0b3InLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ01WVk0nLCBsaW5rOiAnL0Rlc2lnblBhdHRlcm5zL01WVk0nIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAnL25ldHdvcmsvJzogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ1x1OEJBMVx1N0I5N1x1NjczQVx1N0Y1MVx1N0VEQycsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFt7IHRleHQ6ICdTU0UnLCBsaW5rOiAnL25ldHdvcmsvU1NFJyB9XSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAnL1NlY3VyaXR5Lyc6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdXZWIgXHU1Qjg5XHU1MTY4JyxcclxuICAgICAgICAgICAgICBpdGVtczogW3sgdGV4dDogJ1hTUyBcdThERThcdTdBRDlcdTgxMUFcdTY3MkNcdTY1M0JcdTUxRkInLCBsaW5rOiAnL1NlY3VyaXR5L3hzcycgfV0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy9yZWFjdC8nOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnUmVhY3QnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL3JlYWN0L2luZGV4JyB9XSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdDU1MnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdDU1MgTW9kdWxlJywgbGluazogJy9yZWFjdC9jc3MvY3NzTW9kdWxlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnQXRvbWljIENTUycsIGxpbms6ICcvcmVhY3QvY3NzL2F0b21pYycgfSxcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ0hvb2snLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdpbmRleCcsIGxpbms6ICcvcmVhY3QvaG9va3MvaW5kZXgnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICd1c2VTdGF0ZScsIGxpbms6ICcvcmVhY3QvaG9va3MvdXNlU3RhdGUnIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICd1c2VTeW5jRXh0ZXJuYWxTdG9yZScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvcmVhY3QvaG9va3MvdXNlU3luY0V4dGVybmFsU3RvcmUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3VzZVRyYW5zaXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L2hvb2tzL3VzZVRyYW5zaXRpb24nLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3VzZURlZmVycmVkVmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L2hvb2tzL3VzZURlZmVycmVkVmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3VzZUVmZmVjdCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvcmVhY3QvaG9va3MvdXNlRWZmZWN0JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICd1c2VMYXlvdXRFZmZlY3QnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L2hvb2tzL3VzZUxheW91dEVmZmVjdCcsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAndXNlUmVmJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9yZWFjdC9ob29rcy91c2VSZWYnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3VzZUltcGVyYXRpdmVIYW5kbGUnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L2hvb2tzL3VzZUltcGVyYXRpdmVIYW5kbGUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3VzZUNvbnRleHQnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L2hvb2tzL3VzZUNvbnRleHQnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3VzZU1lbW8nLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L2hvb2tzL3VzZU1lbW8nLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3VzZUNhbGxiYWNrJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9yZWFjdC9ob29rcy91c2VDYWxsYmFjaycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAndXNlSWQnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L2hvb2tzL3VzZUlkJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdBUEknLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdtZW1vJywgbGluazogJy9yZWFjdC9hcGlzL21lbW8nIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICd1c2UnLCBsaW5rOiAnL3JlYWN0L2FwaXMvdXNlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnY3JlYXRlUG9ydGFsJywgbGluazogJy9yZWFjdC9hcGlzL2NyZWF0ZVBvcnRhbCcgfSxcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogJ0NvbXBvbmVudCcsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ2luZGV4JywgbGluazogJy9yZWFjdC9jb21wb25lbnQvaW5kZXgnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdjb25uZWN0JywgbGluazogJy9yZWFjdC9jb21wb25lbnQvY29ubmVjdCcgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ2NvbnRyb2xsZWQnLCBsaW5rOiAnL3JlYWN0L2NvbXBvbmVudC9jb250cm9sbGVkJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnJmx0O1N1c3BlbnNlJmd0OycsIGxpbms6ICcvcmVhY3QvY29tcG9uZW50L3N1c3BlbnNlJyB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnUm91dGVyJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL3JlYWN0L3JvdXRlci9pbmRleCcgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ0luc3RhbGxhdGlvbicsIGxpbms6ICcvcmVhY3Qvcm91dGVyL2luc3RhbGxhdGlvbicgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ01vZGUnLCBsaW5rOiAnL3JlYWN0L3JvdXRlci9tb2RlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnUm91dGVyJywgbGluazogJy9yZWFjdC9yb3V0ZXIvcm91dGVyJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnVHJhbnNmZXInLCBsaW5rOiAnL3JlYWN0L3JvdXRlci90cmFuc2ZlcicgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ0xhenknLCBsaW5rOiAnL3JlYWN0L3JvdXRlci9sYXp5JyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnT3BlcmF0aW9uJywgbGluazogJy9yZWFjdC9yb3V0ZXIvb3BlcmF0aW9uJyB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnWnVzdGFuZCcsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ0luc3RhbGxhdGlvbicsIGxpbms6ICcvcmVhY3QvenVzdGFuZC9pbnN0YWxsYXRpb24nIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdoYW5kbGVTdGF0ZScsIGxpbms6ICcvcmVhY3QvenVzdGFuZC9oYW5kbGVTdGF0ZScgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ292ZXJSZW5kZXJpbmcnLCBsaW5rOiAnL3JlYWN0L3p1c3RhbmQvb3ZlclJlbmRlcmluZycgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ01pZGRsZXdhcmVzJyxcclxuICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAncGVyc2lzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3JlYWN0L3p1c3RhbmQvbWlkZGxld2FyZXMvcGVyc2lzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnZGV2dG9vbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogJy9yZWFjdC96dXN0YW5kL21pZGRsZXdhcmVzL2RldnRvb2xzJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdzdWJzY3JpYmVXaXRoU2VsZWN0b3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogJy9yZWFjdC96dXN0YW5kL21pZGRsZXdhcmVzL3N1YnNjcmliZVdpdGhTZWxlY3RvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdJbW1lcicsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ0luc3RhbGxhdGlvbicsIGxpbms6ICcvcmVhY3QvaW1tZXIvaW5zdGFsbGF0aW9uJyB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc29jaWFsTGlua3M6IFtcclxuICAgICAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vaHVhbmdzaHVoZW5nMDQwNS9Ub29scycgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIC8vIFx1NEUyRFx1NjU4N1x1NzU0Q1x1OTc2Mlx1NjU4N1x1NjcyQ1x1OTE0RFx1N0Y2RVxyXG4gICAgICAgIGRvY0Zvb3Rlcjoge1xyXG4gICAgICAgICAgcHJldjogJ1x1NEUwQVx1NEUwMFx1OTg3NScsXHJcbiAgICAgICAgICBuZXh0OiAnXHU0RTBCXHU0RTAwXHU5ODc1JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJldHVyblRvVG9wTGFiZWw6ICdcdTU2REVcdTUyMzBcdTk4NzZcdTkwRTgnLFxyXG4gICAgICAgIHNpZGViYXJNZW51TGFiZWw6ICdcdTgzRENcdTUzNTUnLFxyXG4gICAgICAgIGRhcmtNb2RlU3dpdGNoTGFiZWw6ICdcdTRFM0JcdTk4OTgnLFxyXG4gICAgICAgIGxpZ2h0TW9kZVN3aXRjaFRpdGxlOiAnXHU1MjA3XHU2MzYyXHU1MjMwXHU2RDQ1XHU4MjcyXHU2QTIxXHU1RjBGJyxcclxuICAgICAgICBkYXJrTW9kZVN3aXRjaFRpdGxlOiAnXHU1MjA3XHU2MzYyXHU1MjMwXHU2REYxXHU4MjcyXHU2QTIxXHU1RjBGJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUyxTQUFTLG9CQUFvQjtBQUM5VDtBQUFBLEVBQ0U7QUFBQSxFQUNBO0FBQUEsT0FDSztBQUNQLE9BQU8sYUFBYTtBQUdwQixJQUFPLGlCQUFRLGFBQWE7QUFBQSxFQUMxQixVQUFVO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixPQUFPLElBQUk7QUFDVCxTQUFHLElBQUksaUJBQWlCLEVBQUUsSUFBSSxPQUFPO0FBQUEsSUFDdkM7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsTUFDUCxvQkFBb0I7QUFBQSxRQUNsQixlQUFlLENBQUMsT0FBTyxRQUFRLFFBQVEsT0FBTyxNQUFNO0FBQUEsTUFDdEQsQ0FBQztBQUFBLElB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a0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGdCQUNMLEVBQUUsTUFBTSxTQUFTLE1BQU0sK0JBQStCO0FBQUEsZ0JBQ3RELEVBQUUsTUFBTSxhQUFhLE1BQU0sbUNBQW1DO0FBQUEsY0FDaEU7QUFBQSxZQUNGO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGdCQUNMLEVBQUUsTUFBTSxTQUFTLE1BQU0sa0NBQWtDO0FBQUEsZ0JBQ3pELEVBQUUsTUFBTSxTQUFTLE1BQU0sa0NBQWtDO0FBQUEsY0FDM0Q7QUFBQSxZQUNGO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGdCQUNMO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGdCQUNMO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFVBRUEsaUJBQWlCO0FBQUEsWUFDZjtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGdCQUNMLEVBQUUsTUFBTSxZQUFZLE1BQU0sZ0JBQWdCO0FBQUEsZ0JBQzFDO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLFdBQVc7QUFBQSxrQkFDWCxPQUFPO0FBQUEsb0JBQ0wsRUFBRSxNQUFNLFNBQVMsTUFBTSw2QkFBNkI7QUFBQSxvQkFDcEQsRUFBRSxNQUFNLFNBQVMsTUFBTSw2QkFBNkI7QUFBQSxvQkFDcEQsRUFBRSxNQUFNLFVBQVUsTUFBTSw4QkFBOEI7QUFBQSxvQkFDdEQsRUFBRSxNQUFNLFVBQVUsTUFBTSw4QkFBOEI7QUFBQSxrQkFDeEQ7QUFBQSxnQkFDRjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLFdBQVc7QUFBQSxrQkFDWCxPQUFPO0FBQUEsb0JBQ0wsRUFBRSxNQUFNLFNBQVMsTUFBTSwwQkFBMEI7QUFBQSxvQkFDakQsRUFBRSxNQUFNLFNBQVMsTUFBTSwwQkFBMEI7QUFBQSxrQkFDbkQ7QUFBQSxnQkFDRjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFVBQ0EsVUFBVTtBQUFBLFlBQ1I7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE9BQU87QUFBQSxnQkFDTDtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE9BQU87QUFBQSxnQkFDTDtBQUFBLGtCQUNFLE1BQU07QUFBQSxr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U0FBUyxNQUFNLG9CQUFvQjtBQUFBLGdCQUMzQztBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixXQUFXO0FBQUEsa0JBQ1gsT0FBTztBQUFBLG9CQUNMLEVBQUUsTUFBTSxVQUFVLE1BQU0sbUJBQW1CO0FBQUEsb0JBQzNDLEVBQUUsTUFBTSxjQUFjLE1BQU0sdUJBQXVCO0FBQUEsa0JBQ3JEO0FBQUEsZ0JBQ0Y7QUFBQSxnQkFDQSxFQUFFLE1BQU0sVUFBVSxNQUFNLHFCQUFxQjtBQUFBLGdCQUM3QztBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixPQUFPLENBQUMsRUFBRSxNQUFNLFNBQVMsTUFBTSxvQkFBb0IsQ0FBQztBQUFBLGdCQUN0RDtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEs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
