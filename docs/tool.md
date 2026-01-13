# 前端工具库导航

## 🎨 UI 组件库

### Vue 生态

- [Element Plus](https://element-plus.org/zh-CN/) - 基于 Vue 3 的桌面端组件库，风格简约，是后台管理系统的首选
- [Ant Design Vue](https://antdv.com/components/overview) - 蚂蚁金服风格的 Vue 组件库，适用于企业级中后台产品
- [Vant4](https://vant-ui.github.io/vant/#/zh-CN/home) - 轻量、可靠的移动端 Vue 组件库，适用于电商或 H5 页面开发
- [Naive UI](https://www.naiveui.com/zh-CN/) - 比较完整的 Vue 3 组件库，主题可调，使用 TypeScript，快

### React 生态

- [Ant Design](https://ant.design/index-cn) - 企业级 UI 设计语言和 React 组件库
- [Material-UI](https://mui.com/zh/) - 基于 Google Material Design 的 React UI 框架

### 样式框架

- [Tailwind CSS](https://tailwindcss.com/) - 原子类 CSS 框架，通过在 HTML 中直接写类名来快速构建自定义界面
- [UnoCSS](https://unocss.dev/) - 即时按需原子 CSS 引擎，比 Tailwind CSS 更快更灵活
- [Sass](https://sass-lang.com/) - 成熟、稳定、强大的 CSS 扩展语言
- [Less](https://lesscss.org/) - 向后兼容的 CSS 扩展语言

---

## ⚡ 核心框架

### 前端框架

- [Vue3](https://cn.vuejs.org/) - 渐进式 JavaScript 框架，用于构建用户界面的主流框架，强调易用与高性能
- [React](https://zh-hans.react.dev/) - 用于构建用户界面的 JavaScript 库，基于组件化和虚拟 DOM，生态极其丰富
- [Nuxt](https://nuxt.com/) - 基于 Vue 的全栈框架，支持 SSR、SSG 等多种渲染模式
- [Next.js](https://nextjs.org/) - 基于 React 的全栈框架，生产级别的 React 应用框架

### 路由 & 状态管理

- [Vue Router](https://router.vuejs.org/zh/) - Vue.js 的官方路由管理器，负责单页面应用（SPA）的页面跳转与导航
- [Pinia](https://pinia.vuejs.org/zh/) - Vue 的新一代状态管理库，设计简洁，对 TypeScript 支持极其完美
- [Pinia Persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/) - Pinia 的插件，用于将状态持久化存储到本地（如 LocalStorage）
- [Vuex](https://vuex.vuejs.org/zh/) - Vue 的状态管理库，集中式存储管理应用的所有组件的状态
- [Redux](https://redux.js.org/) - JavaScript 应用的可预测状态容器
- [Zustand](https://zustand-demo.pmnd.rs/) - 小巧、快速、可扩展的 React 状态管理方案

---

## 🛠️ 构建工具

### 构建 & 打包

- [Vite](https://cn.vitejs.dev/) - 下一代前端构建工具，以极速的热更新（HMR）和项目启动著称，Vue 团队出品
- [Webpack](https://webpack.docschina.org/) - 经典的前端模块打包器，功能极其强大、插件丰富，适合处理极其复杂的构建任务
- [Babel](https://babeljs.io/) - JavaScript 编译器，将现代 JavaScript 转换为向后兼容的版本

### 包管理器

- [pnpm](https://pnpm.io/zh/) - 快速、节省磁盘空间的包管理器，通过软链接机制避免重复下载依赖
- [npm](https://www.npmjs.com/) - Node.js 官方包管理器
- [Yarn](https://yarnpkg.com/) - 快速、可靠、安全的依赖管理工具
- [Bun](https://bun.sh/) - 极速的 JavaScript 运行时和包管理器，比 npm/yarn 快几十倍

### 代码规范

- [ESLint](https://eslint.org/) - 可插拔的 JavaScript 代码检查工具
- [Prettier](https://prettier.io/) - 代码格式化工具，支持多种语言
- [Stylelint](https://stylelint.io/) - 强大的现代 CSS 检查工具
- [Husky](https://typicode.github.io/husky/) - Git hooks 工具，用于在提交前运行脚本

---

## 📦 工具库

### 类型 & 语言

- [TypeScript](https://typescript.bootcss.com/index.html) - JavaScript 的超集，通过引入静态类型定义，让大型项目代码更易维护、更少报错

### 实用函数

- [VueUse](https://vueuse.org/) - 基于 Vue 组合式 API 的实用函数集合（如监听窗口大小、追踪地理位置等）
- [Lodash](https://www.lodashjs.com/) - JavaScript 实用工具库，提供了大量处理数组、对象、数学运算的辅助函数
- [Day.js](https://day.js.org/zh-CN/) - 轻量级的处理时间和日期的 JavaScript 库
- [Moment.js](https://momentjs.com/) - 功能强大的 JavaScript 日期处理库

### 网络请求

- [Axios](https://www.axios-http.cn/) - 基于 Promise 的网络请求库，用于浏览器和 node.js 的数据交互
- [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) - 浏览器原生的现代网络请求接口
- [SWR](https://swr.vercel.app/zh-CN) - React Hooks 数据请求库，支持缓存、重新验证等
- [React Query](https://tanstack.com/query/latest) - 强大的异步状态管理，专为 React 设计

### 实时通信

- [Socket.IO](https://socket.io/) - 实时、双向、基于事件的通信库，支持 WebSocket 和轮询
- [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) - 浏览器原生的全双工通信协议

### 数据可视化

- [ECharts](https://echarts.apache.org/zh/index.html) - 强大的数据可视化图表库，支持绘制复杂的折线图、地图、散点图等
- [Chart.js](https://www.chartjs.org/) - 简单灵活的 JavaScript 图表库
- [D3.js](https://d3js.org/) - 基于数据操作文档的 JavaScript 可视化库
- [AntV](https://antv.vision/zh/) - 蚂蚁集团数据可视化解决方案

---

## 🧪 测试 & Mock

- [Vitest](https://vitest.dev/) - 由 Vite 驱动的下一代测试框架
- [Jest](https://jestjs.io/zh-Hans/) - 零配置的 JavaScript 测试框架
- [Cypress](https://www.cypress.io/) - 快速、简单、可靠的端到端测试工具
- [Playwright](https://playwright.dev/) - 微软出品的端到端测试框架
- [Mock.js](https://s.apifox.cn/aeb0d03e-c713-4f55-afaf-21cddf542751) - 前端模拟数据生成器，让前端开发者在后端接口还没写好之前，能够独立于后端进行开发
- [MSW](https://mswjs.io/) - 通过拦截请求的 API mocking 库

---

## 🚀 跨平台 & 部署

### 跨平台开发

- [Uni-app](https://uniapp.dcloud.net.cn/) - 使用 Vue 开发所有端的框架，一套代码可发布到 iOS、Android、Web 及各类小程序

### 部署平台

- [Vercel](https://vercel.com/) - 前端部署平台，为 Next.js 和其他前端框架提供一键部署
- [Netlify](https://www.netlify.com/) - 自动化的现代 Web 项目部署平台
- [GitHub Pages](https://pages.github.com/) - GitHub 提供的免费静态网站托管服务

### 静态站点生成

- [VitePress](https://vitepress.dev/) - 由 Vite 和 Vue 驱动的静态网站生成器，常用于编写技术文档或个人博客
- [VuePress](https://vuepress.vuejs.org/zh/) - Vue 驱动的静态网站生成器
- [Docusaurus](https://docusaurus.io/zh-CN/) - Facebook 出品的文档网站生成器
- [Astro](https://astro.build/) - 现代化的静态网站构建器

### 进程管理

- [PM2](https://pm2.fenxianglu.cn/) - Node.js 应用的进程管理器，支持负载均衡、自动重启等功能
