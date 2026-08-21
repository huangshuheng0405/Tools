# 关于本项目

欢迎来到 **Front-End Notes**，这是一套系统化整理的前端学习笔记，记录了从基础到进阶的前端技术知识体系。

## 涵盖内容

### JavaScript 核心

深入 JavaScript 语言本身，涵盖数据类型、作用域与闭包、原型链、异步编程、Event Loop、Promise、模块系统等核心概念，帮助你构建扎实的语言基础。

👉 [开始学习](/zh/JavaScript/)

### TypeScript

TypeScript 类型系统、泛型、工具类型、tsconfig 配置等进阶内容，让 JavaScript 开发更安全高效。

👉 [开始学习](/zh/TypeScript/index)

### React 生态

涵盖内置 Hooks（useState、useEffect、useRef、useMemo、useCallback 等）深度解析、API 用法、组件模式、路由管理等内容。

👉 [开始学习](/zh/react/index)

### Vue 生态

Vue 3 响应式原理、组合式 API、组件通信、Vue Router、Nuxt SSR 服务端渲染等完整知识链，以及手写 Vue 核心源码的实践。

👉 [开始学习](/zh/vue/lifecycle)

### 工程化实践

前端工程化工具链：Webpack、Vite、Rollup、esbuild 构建工具，ESLint、Prettier 代码规范，Husky、git-cz 工作流，以及 CLI 脚手架开发。

👉 [开始学习](/zh/Engineering/)

### 后端技术

Node.js 基础模块、Express / Koa 框架、MongoDB / Mongoose / Sequelize 数据库操作，理解全栈开发中的数据层。

👉 [开始学习](/zh/backend/)

### 设计模式

单例、工厂、发布订阅、观察者、策略、装饰器、MVVM 等常用设计模式及其在前端的应用场景。

👉 [开始学习](/zh/DesignPatterns/index)

### 实用技巧 & 面试题

虚拟列表、事件委托、图片懒加载、文件上传、性能优化等常见前端场景解决方案，以及高频面试题整理。

👉 [开始学习](/zh/Misc/)

### Git

Git 常用操作与进阶技巧：reset vs revert、merge vs rebase 等。

👉 [开始学习](/zh/Git/reset_revert)

### 计算机网络

网络基础协议与前端相关网络知识。

👉 [开始学习](/zh/network/SSE)

## 项目结构

```
docs/
├── JavaScript/       # JavaScript 核心知识
├── TypeScript/       # TypeScript 进阶
├── react/            # React 生态
│   ├── hooks/        #   Hooks 详解
│   ├── apis/         #   API 用法
│   ├── component/    #   组件模式
│   └── router/       #   路由管理
├── vue/              # Vue 生态
│   ├── handwriting/  #   手写源码
│   ├── vue-router/   #   路由
│   └── nuxt/         #   Nuxt 框架
├── Engineering/      # 工程化实践
├── backend/          # 后端技术
├── DesignPatterns/   # 设计模式
├── Misc/             # 实用技巧 & 面试题
├── Git/              # Git 操作
└── network/          # 计算机网络
```

## 开始阅读

建议按需查阅，也可以从自己感兴趣的主题开始：

- 想夯实基础 → [JavaScript 核心](/zh/JavaScript/)
- 想学框架 → [React 生态](/zh/react/index) 或 [Vue 生态](/zh/vue/lifecycle)
- 想提升工程能力 → [工程化实践](/zh/Engineering/)
- 想准备面试 → [实用技巧 & 面试题](/zh/Misc/)

## ACM

<script setup>

const goToSublime = () => {
  window.open('https://www.sublimetext.com/', '_blank')
}

const goToVSCode = () => {
  window.open('https://code.visualstudio.com/', '_blank')
}
</script>

<style scoped>
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px;
    gap: 15px;
    background-color: rgb(66 66 66);
    outline: 3px rgb(66 66 66) solid;
    outline-offset: -3px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: 400ms;
  }

  .button .text {
    color: white;
    font-weight: 700;
    font-size: 1em;
    transition: 400ms;
  }

  .button svg {
    width: 24px;
    height: 24px;
  }

  .button svg path {
    transition: 400ms;
  }

  .button:hover {
    background-color: transparent;
  }

  .button:hover .text {
    color: #F48E00;
  }

  .button:hover svg path:nth-child(1) {
    fill: #FF9700;
  }

  .button:hover svg path:nth-child(2) {
    fill: #F48E00;
  }

  .button:hover svg path:nth-child(3) {
    fill: #FF9800;
  }

  .vscode-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px;
    gap: 15px;
    background-color: #007ACC;
    outline: 3px #007ACC solid;
    outline-offset: -3px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: 400ms;
  }

  .vscode-button .text {
    color: white;
    font-weight: 700;
    font-size: 1em;
    transition: 400ms;
  }

  .vscode-button svg path {
    transition: 400ms;
  }

  .vscode-button:hover {
    background-color: transparent;
  }

  .vscode-button:hover .text {
    color: #007ACC;
  }

  .vscode-button:hover svg path {
    fill: #007ACC;
  }
</style>

<button class="button" @click="goToSublime">
<svg viewBox="-38 0 332 332" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <linearGradient x1="55.1170996%" y1="58.6795405%" x2="63.6801778%" y2="39.5971572%" id="linearGradient-1"> <stop stop-color="#FF9700" offset="0%"> </stop> <stop stop-color="#F48E00" offset="53%"> </stop> <stop stop-color="#D06F00" offset="100%"> </stop> </linearGradient> </defs> <g> <path d="M255.288325,166.794648 C255.288325,162.908052 252.415934,160.666877 248.891046,161.780372 L6.39727934,238.675387 C2.86530029,239.795974 0,243.859878 0,247.73938 L0,326.329461 C0,330.216057 2.86530029,332.464324 6.39727934,331.343737 L248.891046,254.455814 C252.415934,253.335227 255.288325,249.271323 255.288325,245.384729 L255.288325,166.794648 L255.288325,166.794648 Z" fill="url(#linearGradient-1)"> </path> <path d="M5.68434189e-14,164.291056 C5.68434189e-14,168.177652 2.86530029,172.241555 6.39727934,173.362144 L248.926508,250.26425 C252.458487,251.384837 255.323787,249.13657 255.323787,245.257067 L255.323787,166.659893 C255.323787,162.780391 252.458487,158.716487 248.926508,157.595899 L6.39727934,80.693793 C2.86530029,79.5732052 5.68434189e-14,81.8143808 5.68434189e-14,85.7009761 L5.68434189e-14,164.291056 Z" fill="#FF9800"> </path> <path d="M255.288325,5.30235244 C255.288325,1.41575701 252.415934,-0.83251079 248.891046,0.288076943 L6.39727934,77.1759986 C2.86530029,78.2965864 0,82.36049 0,86.2470854 L0,164.837165 C0,168.723761 2.86530029,170.964936 6.39727934,169.851441 L248.891046,92.9564272 C252.415934,91.8358394 255.288325,87.7719358 255.288325,83.8924327 L255.288325,5.30235244 Z" fill="#FF9800"> </path> </g> </g></svg>
<span class="text">Sublime</span>
</button>

<button class="vscode-button" style="margin-top: 10px;" @click="goToVSCode">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
<path fill="white" d="M23.15 2.587L18.21 0.210001C17.9308 0.075557 17.6167 0.031246 17.3113 0.083204C17.0058 0.135162 16.724 0.280818 16.505 0.500001L7.04499 9.13L2.92499 6.002C2.73912 5.86101 2.50976 5.78953 2.27669 5.79994C2.04363 5.81035 1.82156 5.902 1.64899 6.059L0.326993 7.261C0.223973 7.35465 0.141644 7.46878 0.0852761 7.59608C0.0289081 7.72339 -0.00025659 7.86106 -0.000350724 8.00028C-0.000444857 8.1395 0.0285336 8.27721 0.0847294 8.40459C0.140925 8.53197 0.2231 8.64621 0.325993 8.74L3.89899 12L0.325993 15.26C0.2231 15.3538 0.140925 15.468 0.0847294 15.5954C0.0285336 15.7228 -0.000444857 15.8605 -0.000350724 15.9997C-0.00025659 16.1389 0.0289081 16.2766 0.0852761 16.4039C0.141644 16.5312 0.223973 16.6454 0.326993 16.739L1.64999 17.94C1.82256 18.097 2.04463 18.1887 2.27769 18.1991C2.51076 18.2095 2.74012 18.138 2.92599 17.997L7.04599 14.869L16.506 23.499C16.7248 23.7182 17.0064 23.8639 17.3117 23.9159C17.6171 23.9679 17.931 23.9235 18.21 23.789L23.152 21.412C23.4062 21.2893 23.6207 21.0973 23.7707 20.8581C23.9207 20.619 24.0002 20.3423 24 20.06V3.939C24 3.65647 23.9203 3.37967 23.7699 3.14048C23.6195 2.90129 23.4046 2.70943 23.15 2.587ZM18.004 17.448L10.826 12L18.004 6.552V17.448Z"></path>
</svg>
<span class="text">VSCode</span>
</button>
