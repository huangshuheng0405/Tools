// docs/.vitepress/config.mts
import { defineConfig } from "file:///D:/front-end-tutorial/node_modules/vitepress/dist/node/index.js";
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from "file:///D:/front-end-tutorial/node_modules/vitepress-plugin-group-icons/dist/index.mjs";
import mathjax from "file:///D:/front-end-tutorial/node_modules/markdown-it-mathjax3/index.js";
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
    outline: {
      level: [2, 6],
      label: "\u76EE\u5F55"
    }
  },
  title: "front-end",
  description: "A VitePress Site",
  head: [
    // 使用你指定的图标（把 vitepress.ico 放到 docs/public/vitepress.ico）
    ["link", { rel: "icon", href: "/vitepress.ico", sizes: "any" }]
  ],
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
          { text: "JavaScript", link: "/JavaScript/" },
          { text: "Vue", link: "/vue/lifecycle" },
          { text: "Nuxt", link: "/nuxt/Structure/app/nuxt" },
          { text: "Engineering", link: "/Engineering/" },
          { text: "Tips", link: "/Tips/" },
          { text: "Git", link: "/Git/reset_revert" }
        ],
        sidebar: {
          "/Git/": [
            {
              text: "Git",
              items: [
                { text: "Reset vs Revert", link: "/Git/reset_revert" },
                { text: "Merge vs Rebase", link: "/Git/rebase-merge" }
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
                  text: "CommonJS vs ESM",
                  link: "/Engineering/Webpack/CommonJS_ESMA"
                },
                {
                  text: "dependencies \u548C devDependencies \u7684\u533A\u522B",
                  link: "/Engineering/dependencies_devDependencies"
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
                }
              ]
            }
          ],
          "/Tips/": [
            {
              text: "Tips",
              items: [
                {
                  text: "\u9ED8\u8BA4\u5BFC\u51FA vs \u547D\u540D\u5BFC\u51FA",
                  link: "/Tips/default-vs-named-export"
                },
                {
                  text: "Axios \u8BF7\u6C42\u4E2D\u65AD\u4E0E\u91CD\u8BD5",
                  link: "/Tips/axios-cancel-retry"
                },
                {
                  text: "\u865A\u62DF\u5217\u8868 (Virtual List)",
                  link: "/Tips/virtual-list"
                },
                {
                  text: "\u4E8B\u4EF6\u59D4\u6258 (Event Delegation)",
                  link: "/Tips/event-delegation"
                },
                {
                  text: "vscode \u63D2\u4EF6",
                  link: "/Tips/vscodePlugin"
                }
              ]
            }
          ],
          "/nuxt/": [
            {
              text: "Nuxt",
              items: [
                {
                  text: "\u5FEB\u901F\u5F00\u59CB",
                  link: "/nuxt/Structure/app/nuxt-start"
                },
                {
                  text: "Routing",
                  link: "/nuxt/Routing"
                },
                {
                  text: "Structure",
                  collapsed: false,
                  items: [
                    {
                      text: "app",
                      collapsed: false,
                      items: [
                        { text: "pages", link: "/nuxt/Structure/app/pages" },
                        { text: "layouts", link: "/nuxt/Structure/app/layout" },
                        {
                          text: "components",
                          link: "/nuxt/Structure/app/components"
                        },
                        {
                          text: "composables",
                          link: "/nuxt/Structure/app/composables"
                        },
                        {
                          text: "middleware",
                          link: "/nuxt/Structure/app/middleware"
                        },
                        {
                          text: "plugins",
                          link: "/nuxt/Structure/app/plugins"
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
                { text: "Props (\u5C5E\u6027)", link: "/vue/Props" },
                { text: "\u7EC4\u4EF6\u901A\u4FE1\u65B9\u5F0F", link: "/vue/Components-connect" },
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
                }
              ]
            }
          ],
          "/JavaScript/": [
            {
              text: "JavaScript",
              items: [
                { text: "\u9690\u85CF\u7C7B (Hidden Classes)", link: "/JavaScript/" },
                {
                  text: "\u6570\u7EC4\u5FEB\u901F\u6A21\u5F0F\u4E0E\u5B57\u5178\u6A21\u5F0F",
                  link: "/JavaScript/array-fast-dict-mode"
                },
                {
                  text: "\u5982\u4F55\u5224\u65ADobject\u4E3A\u7A7A",
                  link: "/JavaScript/judge-object"
                },
                {
                  text: "\u7C7B\u578B\u8F6C\u6362",
                  link: "/JavaScript/TypeConversion"
                },
                {
                  text: "== \u548C === \u7684\u533A\u522B",
                  link: "/JavaScript/==&==="
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
                  text: "\u5982\u4F55\u5224\u65ADJavaScript\u7684\u6570\u636E\u7C7B\u578B",
                  link: "/JavaScript/JudgeType"
                },
                {
                  text: "ES \u7248\u672C\u7279\u6027 (ES6+)",
                  link: "/JavaScript/ESVersion"
                },
                {
                  text: "let\u3001var\u3001const",
                  link: "/JavaScript/let_var_const"
                },
                {
                  text: "\u53D8\u91CF\u63D0\u5347\u548CTDZ",
                  link: "/JavaScript/Hoisting_TDZ"
                },
                {
                  text: "\u5224\u65AD\u4E24\u4E2A\u5BF9\u8C61\u662F\u5426\u76F8\u7B49",
                  link: "/JavaScript/JudgeObjectEqual"
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
                  text: "\u4E8B\u4EF6\u5FAA\u73AF",
                  link: "/JavaScript/EventLoop"
                },
                {
                  text: "\u5192\u6CE1\u548C\u6355\u83B7",
                  link: "/JavaScript/Bubbling_Capturing"
                },
                {
                  text: "\u4E8B\u4EF6\u59D4\u6258",
                  link: "/JavaScript/EventDelegation"
                },
                {
                  text: "ES6 \u7C7B\u7EE7\u627F",
                  link: "/JavaScript/ES6Inherit"
                },
                {
                  text: "\u53EF\u8FED\u4EE3\u5BF9\u8C61",
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
                  text: "new \u64CD\u4F5C\u7B26",
                  link: "/JavaScript/New"
                },
                {
                  text: "bind, apply, call\u7684\u533A\u522B\u53CA\u5B9E\u73B0",
                  link: "/JavaScript/bind_apply_call"
                },
                {
                  text: "JS\u76D1\u542C\u5BF9\u8C61\u5C5E\u6027\u7684\u6539\u53D8",
                  link: "/JavaScript/defineProperty_Proxy"
                },
                {
                  text: "prototype \u548C __proto__",
                  link: "/JavaScript/prototype___proto__"
                },
                {
                  text: "\u539F\u578B\u94FE",
                  link: "/JavaScript/prototypeChain"
                },
                {
                  text: "this\u6307\u5411",
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
                { text: "Symbol", link: "/JavaScript/Stmbol" },
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
                }
              ]
            }
          ],
          "/": [
            {
              text: "\u793A\u4F8B",
              items: [
                { text: "Markdown \u793A\u4F8B", link: "/markdown-examples" },
                { text: "API \u793A\u4F8B", link: "/api-examples" }
              ]
            },
            {
              text: "\u524D\u7AEF",
              items: [{ text: "\u5DE5\u5177", link: "/tool" }]
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
    },
    en: {
      label: "English",
      lang: "en-US",
      link: "/en/",
      themeConfig: {
        nav: [
          { text: "Home", link: "/en/" },
          { text: "Examples", link: "/en/markdown-examples" },
          { text: "Tools", link: "/en/tool" }
        ],
        sidebar: [
          {
            text: "Examples",
            items: [
              { text: "Markdown Examples", link: "/en/markdown-examples" },
              { text: "Runtime API Examples", link: "/en/api-examples" }
            ]
          },
          {
            text: "Front-end",
            items: [{ text: "Tools", link: "/en/tool" }]
          },
          {
            text: "Algorithm",
            items: [{ text: "Tutorial", link: "/en/Tutorial" }]
          },
          {
            text: "Nuxt",
            items: [
              { text: "Nuxt Start", link: "/en/nuxt/nuxt-start" },
              {
                text: "Routing",
                link: "/en/nuxt/Routing"
              },
              {
                text: "Structure",
                collapsed: false,
                items: [
                  {
                    text: "app",
                    collapsed: false,
                    items: [
                      { text: "pages", link: "/en/nuxt/Structure/app/pages" },
                      {
                        text: "layouts",
                        link: "/en/nuxt/Structure/app/layout"
                      },
                      {
                        text: "components",
                        link: "/en/nuxt/Structure/app/components"
                      },
                      {
                        text: "composables",
                        link: "/en/nuxt/Structure/app/composables"
                      },
                      {
                        text: "middleware",
                        link: "/en/nuxt/Structure/app/middleware"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        socialLinks: [
          { icon: "github", link: "https://github.com/huangshuheng0405" }
        ]
      }
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxmcm9udC1lbmQtdHV0b3JpYWxcXFxcZG9jc1xcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxmcm9udC1lbmQtdHV0b3JpYWxcXFxcZG9jc1xcXFwudml0ZXByZXNzXFxcXGNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2Zyb250LWVuZC10dXRvcmlhbC9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcydcclxuaW1wb3J0IHtcclxuICBncm91cEljb25NZFBsdWdpbixcclxuICBncm91cEljb25WaXRlUGx1Z2luXHJcbn0gZnJvbSAndml0ZXByZXNzLXBsdWdpbi1ncm91cC1pY29ucydcclxuaW1wb3J0IG1hdGhqYXggZnJvbSAnbWFya2Rvd24taXQtbWF0aGpheDMnXHJcblxyXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgbWFya2Rvd246IHtcclxuICAgIG1hdGg6IHRydWUsXHJcbiAgICBjb25maWcobWQpIHtcclxuICAgICAgbWQudXNlKGdyb3VwSWNvbk1kUGx1Z2luKS51c2UobWF0aGpheClcclxuICAgIH1cclxuICB9LFxyXG4gIHZpdGU6IHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgZ3JvdXBJY29uVml0ZVBsdWdpbih7XHJcbiAgICAgICAgZGVmYXVsdExhYmVsczogWyducG0nLCAneWFybicsICdwbnBtJywgJ2J1bicsICdkZW5vJ11cclxuICAgICAgfSkgYXMgYW55XHJcbiAgICBdXHJcbiAgfSxcclxuICB0aGVtZUNvbmZpZzoge1xyXG4gICAgb3V0bGluZToge1xyXG4gICAgICBsZXZlbDogWzIsIDZdLFxyXG4gICAgICBsYWJlbDogJ1x1NzZFRVx1NUY1NSdcclxuICAgIH1cclxuICB9LFxyXG4gIHRpdGxlOiAnZnJvbnQtZW5kJyxcclxuICBkZXNjcmlwdGlvbjogJ0EgVml0ZVByZXNzIFNpdGUnLFxyXG4gIGhlYWQ6IFtcclxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NEY2MFx1NjMwN1x1NUI5QVx1NzY4NFx1NTZGRVx1NjgwN1x1RkYwOFx1NjI4QSB2aXRlcHJlc3MuaWNvIFx1NjUzRVx1NTIzMCBkb2NzL3B1YmxpYy92aXRlcHJlc3MuaWNvXHVGRjA5XHJcbiAgICBbJ2xpbmsnLCB7IHJlbDogJ2ljb24nLCBocmVmOiAnL3ZpdGVwcmVzcy5pY28nLCBzaXplczogJ2FueScgfV1cclxuICBdLFxyXG5cclxuICAvLyBcdTU5MUFcdThCRURcdThBMDBcdTkxNERcdTdGNkVcclxuICBsb2NhbGVzOiB7XHJcbiAgICByb290OiB7XHJcbiAgICAgIGxhYmVsOiAnXHU3QjgwXHU0RjUzXHU0RTJEXHU2NTg3JyxcclxuICAgICAgbGFuZzogJ3poLUNOJyxcclxuICAgICAgdGhlbWVDb25maWc6IHtcclxuICAgICAgICBvdXRsaW5lOiB7XHJcbiAgICAgICAgICBsZXZlbDogWzIsIDZdLFxyXG4gICAgICAgICAgbGFiZWw6ICdcdTc2RUVcdTVGNTUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYXY6IFtcclxuICAgICAgICAgIHsgdGV4dDogJ0hvbWUnLCBsaW5rOiAnLycgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ0phdmFTY3JpcHQnLCBsaW5rOiAnL0phdmFTY3JpcHQvJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnVnVlJywgbGluazogJy92dWUvbGlmZWN5Y2xlJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnTnV4dCcsIGxpbms6ICcvbnV4dC9TdHJ1Y3R1cmUvYXBwL251eHQnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdFbmdpbmVlcmluZycsIGxpbms6ICcvRW5naW5lZXJpbmcvJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnVGlwcycsIGxpbms6ICcvVGlwcy8nIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdHaXQnLCBsaW5rOiAnL0dpdC9yZXNldF9yZXZlcnQnIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHNpZGViYXI6IHtcclxuICAgICAgICAgICcvR2l0Lyc6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdHaXQnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdSZXNldCB2cyBSZXZlcnQnLCBsaW5rOiAnL0dpdC9yZXNldF9yZXZlcnQnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdNZXJnZSB2cyBSZWJhc2UnLCBsaW5rOiAnL0dpdC9yZWJhc2UtbWVyZ2UnIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAnL0VuZ2luZWVyaW5nLyc6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdFbmdpbmVlcmluZycsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ092ZXJ2aWV3JywgbGluazogJy9FbmdpbmVlcmluZy8nIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdnaXQtY3onLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0VuZ2luZWVyaW5nL2dpdC1jeidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdIdXNreScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvSHVza3knXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnV2VicGFjaycsXHJcbiAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdpbmRleCcsIGxpbms6ICcvRW5naW5lZXJpbmcvV2VicGFjay9pbmRleCcgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdub3RlcycsIGxpbms6ICcvRW5naW5lZXJpbmcvV2VicGFjay9ub3RlcycgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdsb2FkZXInLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1dlYnBhY2svbG9hZGVyJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ3BsdWdpbicsIGxpbms6ICcvRW5naW5lZXJpbmcvV2VicGFjay9wbHVnaW4nIH1cclxuICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1ZpdGUnLFxyXG4gICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnaW5kZXgnLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1ZpdGUvaW5kZXgnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnbm90ZXMnLCBsaW5rOiAnL0VuZ2luZWVyaW5nL1ZpdGUvbm90ZXMnIH1cclxuICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0NvbW1vbkpTIHZzIEVTTScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvV2VicGFjay9Db21tb25KU19FU01BJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ2RlcGVuZGVuY2llcyBcdTU0OEMgZGV2RGVwZW5kZW5jaWVzIFx1NzY4NFx1NTMzQVx1NTIyQicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvZGVwZW5kZW5jaWVzX2RldkRlcGVuZGVuY2llcydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdDTEknLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0VuZ2luZWVyaW5nL3NjYWZmb2xkJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0NTcGVsbCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvRW5naW5lZXJpbmcvY3NwZWxsJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3RzdXAnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0VuZ2luZWVyaW5nL3RzdXAnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnRVNsaW50JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9FbmdpbmVlcmluZy9FU2xpbnQnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnQ29tbWFuZGVyJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9FbmdpbmVlcmluZy9Db21tYW5kZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy9UaXBzLyc6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdUaXBzJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBIHZzIFx1NTQ3RFx1NTQwRFx1NUJGQ1x1NTFGQScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvVGlwcy9kZWZhdWx0LXZzLW5hbWVkLWV4cG9ydCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdBeGlvcyBcdThCRjdcdTZDNDJcdTRFMkRcdTY1QURcdTRFMEVcdTkxQ0RcdThCRDUnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL1RpcHMvYXhpb3MtY2FuY2VsLXJldHJ5J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1ODY1QVx1NjJERlx1NTIxN1x1ODg2OCAoVmlydHVhbCBMaXN0KScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvVGlwcy92aXJ0dWFsLWxpc3QnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU0RThCXHU0RUY2XHU1OUQ0XHU2MjU4IChFdmVudCBEZWxlZ2F0aW9uKScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvVGlwcy9ldmVudC1kZWxlZ2F0aW9uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ3ZzY29kZSBcdTYzRDJcdTRFRjYnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL1RpcHMvdnNjb2RlUGx1Z2luJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgICcvbnV4dC8nOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnTnV4dCcsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvbnV4dC9TdHJ1Y3R1cmUvYXBwL251eHQtc3RhcnQnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnUm91dGluZycsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvbnV4dC9Sb3V0aW5nJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1N0cnVjdHVyZScsXHJcbiAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2FwcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAncGFnZXMnLCBsaW5rOiAnL251eHQvU3RydWN0dXJlL2FwcC9wYWdlcycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnbGF5b3V0cycsIGxpbms6ICcvbnV4dC9TdHJ1Y3R1cmUvYXBwL2xheW91dCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdjb21wb25lbnRzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL251eHQvU3RydWN0dXJlL2FwcC9jb21wb25lbnRzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2NvbXBvc2FibGVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL251eHQvU3RydWN0dXJlL2FwcC9jb21wb3NhYmxlcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdtaWRkbGV3YXJlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL251eHQvU3RydWN0dXJlL2FwcC9taWRkbGV3YXJlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ3BsdWdpbnMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICcvbnV4dC9TdHJ1Y3R1cmUvYXBwL3BsdWdpbnMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAnL3Z1ZS8nOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnVnVlJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3NTFGXHU1NDdEXHU1NDY4XHU2NzFGJywgbGluazogJy92dWUvbGlmZWN5Y2xlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnUHJvcHMgKFx1NUM1RVx1NjAyNyknLCBsaW5rOiAnL3Z1ZS9Qcm9wcycgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0VDNFx1NEVGNlx1OTAxQVx1NEZFMVx1NjVCOVx1NUYwRicsIGxpbms6ICcvdnVlL0NvbXBvbmVudHMtY29ubmVjdCcgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ0tleSBcdTc2ODRcdTRGNUNcdTc1MjgnLCBsaW5rOiAnL3Z1ZS9LZXknIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdSZWZsZWN0IFx1NEUwRVx1NTRDRFx1NUU5NFx1NUYwRicsIGxpbms6ICcvdnVlL1JlZmxlY3QnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdRdWVyeSBcdTRFMEUgUGFyYW1zJywgbGluazogJy92dWUvcXVlcnlfcGFyYW1zJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MkE4XHU2MDAxXHU3RUM0XHU0RUY2JywgbGluazogJy92dWUvZHluYW1pYy1jb21wb25lbnRzJyB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2MjRCXHU1MTk5VnVlJyxcclxuICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdWdWUyLWppbmR1JyxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL2hhbmR3cml0aW5nL3Z1ZTItamluZHUnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnVnVlMy1qaW5kdScsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9oYW5kd3JpdGluZy92dWUzLWppbmR1J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1Z1ZS1Sb3V0ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvaGFuZHdyaXRpbmcvdnVlLXJvdXRlcidcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9taXNlJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL2hhbmR3cml0aW5nL1Byb21pc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnVnVlMlx1NEUwRFx1NzZEMVx1NTQyQ1x1NjU3MFx1N0VDNFx1NEUwQlx1NjgwN1x1NTM5Rlx1NTZFMCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL3Z1ZTJfQXJyYXlJbmRleCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTRGRUVcdTk5NzBcdTdCMjYnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS9tb2RpZmllcidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdjcmVhdGVkIFx1NEUwRSBtb3VudGVkIFx1NTMzQVx1NTIyQicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvdnVlL2NyZWF0ZWRfbW91bnRlZCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICd2dWUtcm91dGVyJyxcclxuICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdThERUZcdTc1MzFcdTZBMjFcdTVGMEYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogJy92dWUvdnVlLXJvdXRlci9tb2RlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OERFRlx1NzUzMVx1OERGM1x1OEY2QycsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL3Z1ZS92dWUtcm91dGVyL3JvdXRlckxpbmsnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy9KYXZhU2NyaXB0Lyc6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdKYXZhU2NyaXB0JyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU5NjkwXHU4NUNGXHU3QzdCIChIaWRkZW4gQ2xhc3NlcyknLCBsaW5rOiAnL0phdmFTY3JpcHQvJyB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2NTcwXHU3RUM0XHU1RkVCXHU5MDFGXHU2QTIxXHU1RjBGXHU0RTBFXHU1QjU3XHU1MTc4XHU2QTIxXHU1RjBGJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2FycmF5LWZhc3QtZGljdC1tb2RlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NTk4Mlx1NEY1NVx1NTIyNFx1NjVBRG9iamVjdFx1NEUzQVx1N0E3QScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9qdWRnZS1vYmplY3QnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU3QzdCXHU1NzhCXHU4RjZDXHU2MzYyJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L1R5cGVDb252ZXJzaW9uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJz09IFx1NTQ4QyA9PT0gXHU3Njg0XHU1MzNBXHU1MjJCJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0Lz09Jj09PSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY1NzBcdTYzNkVcdTdDN0JcdTU3OEInLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvRGF0YVR5cGVzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NTNEOFx1OTFDRlx1NTcyOFx1NTE4NVx1NUI1OFx1NEUyRFx1NzY4NFx1NTgwNlx1NjgwOFx1NUI1OFx1NTBBOCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9zdGFjay1oZWFwJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NTk4Mlx1NEY1NVx1NTIyNFx1NjVBREphdmFTY3JpcHRcdTc2ODRcdTY1NzBcdTYzNkVcdTdDN0JcdTU3OEInLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvSnVkZ2VUeXBlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0VTIFx1NzI0OFx1NjcyQ1x1NzI3OVx1NjAyNyAoRVM2KyknLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvRVNWZXJzaW9uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ2xldFx1MzAwMXZhclx1MzAwMWNvbnN0JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2xldF92YXJfY29uc3QnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1M0Q4XHU5MUNGXHU2M0QwXHU1MzQ3XHU1NDhDVERaJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0hvaXN0aW5nX1REWidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUyMjRcdTY1QURcdTRFMjRcdTRFMkFcdTVCRjlcdThDNjFcdTY2MkZcdTU0MjZcdTc2RjhcdTdCNDknLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvSnVkZ2VPYmplY3RFcXVhbCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdudWxsXHU1NDhDdW5kZWZpbmVkXHU3Njg0XHU1MzNBXHU1MjJCJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L251bGxVbmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnUmVwYWludCAmIFJlZmxvdycsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9SZXBhaW50X1JlZmxvdydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTZBMjFcdTU3NTdcdTdDRkJcdTdFREYnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvbW9kdWxlX2NvbW1vbkpTJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NEU4Qlx1NEVGNlx1NUZBQVx1NzNBRicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9FdmVudExvb3AnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1MTkyXHU2Q0UxXHU1NDhDXHU2MzU1XHU4M0I3JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L0J1YmJsaW5nX0NhcHR1cmluZydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTRFOEJcdTRFRjZcdTU5RDRcdTYyNTgnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvRXZlbnREZWxlZ2F0aW9uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0VTNiBcdTdDN0JcdTdFRTdcdTYyN0YnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvRVM2SW5oZXJpdCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUzRUZcdThGRURcdTRFRTNcdTVCRjlcdThDNjEnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvSXRlcmFibGVPYmplY3QnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnUHJvbWlzZScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9Qcm9taXNlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OTRGRVx1NUYwRlx1OEMwM1x1NzUyOCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9DaGFpbmVkQ2FsbCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICduZXcgXHU2NENEXHU0RjVDXHU3QjI2JyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L05ldydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdiaW5kLCBhcHBseSwgY2FsbFx1NzY4NFx1NTMzQVx1NTIyQlx1NTNDQVx1NUI5RVx1NzNCMCcsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9iaW5kX2FwcGx5X2NhbGwnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnSlNcdTc2RDFcdTU0MkNcdTVCRjlcdThDNjFcdTVDNUVcdTYwMjdcdTc2ODRcdTY1MzlcdTUzRDgnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvZGVmaW5lUHJvcGVydHlfUHJveHknXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAncHJvdG90eXBlIFx1NTQ4QyBfX3Byb3RvX18nLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvcHJvdG90eXBlX19fcHJvdG9fXydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUzOUZcdTU3OEJcdTk0RkUnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvcHJvdG90eXBlQ2hhaW4nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAndGhpc1x1NjMwN1x1NTQxMScsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC90aGlzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ0Z1bmN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ3RyaW0oKScsIGxpbms6ICcvSmF2YVNjcmlwdC90cmltJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ3BhcnNlSW50KCknLCBsaW5rOiAnL0phdmFTY3JpcHQvcGFyc2VJbnQnIH1cclxuICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1N5bWJvbCcsIGxpbms6ICcvSmF2YVNjcmlwdC9TdG1ib2wnIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdzdGFydFdpdGhcdTU0OENpbmRleE9mXHU3Njg0XHU1MzNBXHU1MjJCJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L3N0YXJ0d2l0aF9pbmRleG9mJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1ODhDNVx1N0JCMVx1NjczQVx1NTIzNicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6ICcvSmF2YVNjcmlwdC9ib3hpbmcnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1MDQ3XHU1MDNDXHU1NDhDXHU3NzFGXHU1MDNDJyxcclxuICAgICAgICAgICAgICAgICAgbGluazogJy9KYXZhU2NyaXB0L2ZhbHN5X3RydXRoeSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTU0N0RcdTU0MERcdTg5QzRcdTgzMDMnLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiAnL0phdmFTY3JpcHQvTmFtZUNvbnZlbnRpb24nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJy8nOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiAnXHU3OTNBXHU0RjhCJyxcclxuICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnTWFya2Rvd24gXHU3OTNBXHU0RjhCJywgbGluazogJy9tYXJrZG93bi1leGFtcGxlcycgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ0FQSSBcdTc5M0FcdTRGOEInLCBsaW5rOiAnL2FwaS1leGFtcGxlcycgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6ICdcdTUyNERcdTdBRUYnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zOiBbeyB0ZXh0OiAnXHU1REU1XHU1MTc3JywgbGluazogJy90b29sJyB9XVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzb2NpYWxMaW5rczogW1xyXG4gICAgICAgICAgeyBpY29uOiAnZ2l0aHViJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9odWFuZ3NodWhlbmcwNDA1L1Rvb2xzJyB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICAvLyBcdTRFMkRcdTY1ODdcdTc1NENcdTk3NjJcdTY1ODdcdTY3MkNcdTkxNERcdTdGNkVcclxuICAgICAgICBkb2NGb290ZXI6IHtcclxuICAgICAgICAgIHByZXY6ICdcdTRFMEFcdTRFMDBcdTk4NzUnLFxyXG4gICAgICAgICAgbmV4dDogJ1x1NEUwQlx1NEUwMFx1OTg3NSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJldHVyblRvVG9wTGFiZWw6ICdcdTU2REVcdTUyMzBcdTk4NzZcdTkwRTgnLFxyXG4gICAgICAgIHNpZGViYXJNZW51TGFiZWw6ICdcdTgzRENcdTUzNTUnLFxyXG4gICAgICAgIGRhcmtNb2RlU3dpdGNoTGFiZWw6ICdcdTRFM0JcdTk4OTgnLFxyXG4gICAgICAgIGxpZ2h0TW9kZVN3aXRjaFRpdGxlOiAnXHU1MjA3XHU2MzYyXHU1MjMwXHU2RDQ1XHU4MjcyXHU2QTIxXHU1RjBGJyxcclxuICAgICAgICBkYXJrTW9kZVN3aXRjaFRpdGxlOiAnXHU1MjA3XHU2MzYyXHU1MjMwXHU2REYxXHU4MjcyXHU2QTIxXHU1RjBGJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZW46IHtcclxuICAgICAgbGFiZWw6ICdFbmdsaXNoJyxcclxuICAgICAgbGFuZzogJ2VuLVVTJyxcclxuICAgICAgbGluazogJy9lbi8nLFxyXG4gICAgICB0aGVtZUNvbmZpZzoge1xyXG4gICAgICAgIG5hdjogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnSG9tZScsIGxpbms6ICcvZW4vJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnRXhhbXBsZXMnLCBsaW5rOiAnL2VuL21hcmtkb3duLWV4YW1wbGVzJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnVG9vbHMnLCBsaW5rOiAnL2VuL3Rvb2wnIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHNpZGViYXI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ0V4YW1wbGVzJyxcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdNYXJrZG93biBFeGFtcGxlcycsIGxpbms6ICcvZW4vbWFya2Rvd24tZXhhbXBsZXMnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnUnVudGltZSBBUEkgRXhhbXBsZXMnLCBsaW5rOiAnL2VuL2FwaS1leGFtcGxlcycgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnRnJvbnQtZW5kJyxcclxuICAgICAgICAgICAgaXRlbXM6IFt7IHRleHQ6ICdUb29scycsIGxpbms6ICcvZW4vdG9vbCcgfV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdBbGdvcml0aG0nLFxyXG4gICAgICAgICAgICBpdGVtczogW3sgdGV4dDogJ1R1dG9yaWFsJywgbGluazogJy9lbi9UdXRvcmlhbCcgfV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdOdXh0JyxcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdOdXh0IFN0YXJ0JywgbGluazogJy9lbi9udXh0L251eHQtc3RhcnQnIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ1JvdXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgbGluazogJy9lbi9udXh0L1JvdXRpbmcnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnU3RydWN0dXJlJyxcclxuICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2FwcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAncGFnZXMnLCBsaW5rOiAnL2VuL251eHQvU3RydWN0dXJlL2FwcC9wYWdlcycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2xheW91dHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL2VuL251eHQvU3RydWN0dXJlL2FwcC9sYXlvdXQnXHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnY29tcG9uZW50cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICcvZW4vbnV4dC9TdHJ1Y3R1cmUvYXBwL2NvbXBvbmVudHMnXHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnY29tcG9zYWJsZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnL2VuL251eHQvU3RydWN0dXJlL2FwcC9jb21wb3NhYmxlcydcclxuICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdtaWRkbGV3YXJlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJy9lbi9udXh0L1N0cnVjdHVyZS9hcHAvbWlkZGxld2FyZSdcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHNvY2lhbExpbmtzOiBbXHJcbiAgICAgICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2h1YW5nc2h1aGVuZzA0MDUnIH1cclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAg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Q0Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFVBQVU7QUFBQSxZQUNSO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixPQUFPO0FBQUEsZ0JBQ0w7QUFBQSxrQkFDRSxNQUFNO0FBQUEsa0JBQ04sTUFBTTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxNQUFNO0FBQUEsa0JBQ04sTUFBTTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxNQUFNO0FBQUEsa0JBQ04sTUFBTTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxNQUFNO0FBQUEsa0JBQ04sTUFBTTtBQUFBLGdCQUNSO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxNQUFNO0FBQUEsa0JBQ04sTUFBTTtBQUFBLGdCQUNSO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxVQUFVO0FBQUEsWUFDUjtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGdCQUNMO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxnQkFDUjtBQUFBLGdCQUNBO0FBQUEsa0JBQ0UsTUFB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QUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7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
