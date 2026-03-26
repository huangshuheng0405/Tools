# SSR

**SSR**(**Server-Side Rendering**，**服务端渲染**)是一种将vue组件在服务器上转换成HTML字符串，并且直接发给浏览器的渲染方式

在传统的**CSR**(**Client-Side Rendering**,**客户端渲染**)中浏览器拿到的是一个“空壳“HTML和一堆JS文件，必须等到JS下载并执行完，页面内容才会显示，而**SSR**让页面在到达浏览器时就已经包含完整内容

## 同构

SSR并不是完全抛弃客户端渲染，而是结合两者

1. **服务端：**
   - 接受浏览器请求
   - 通过 `@vue/server-renderer`（或 Vite SSR 插件）将 Vue 组件渲染为 HTML 字符串
   - 将该 HTML 注入到模板中，返回给浏览器

2. **浏览器：**
   - 接收到包含完整HTML的页面，用户立即看到内容
   - **水合（Hydration）**：这是关键步骤。浏览器下载Vue的JS代码，Vue会接管现有的HTML，为其绑定事件监听器，使其成为一个交互式的单页应用（SPA）

## 缺点

- 开发限制：
  - 组件的生命周期只有 `created` 和 `beforeCreate` 会在服务端执行，`mounted` 等在服务端不会触发
  - 不能直接使用浏览器特有的API（如 `window`、`document`、`localStorage`），必须在特定钩子中判断环境

- 服务器负载：服务端需要实时运行 Vue 实例并渲染 HTML，比单纯提供静态文件（CSR）要消耗更多的 CPU 和内存
- 部署复杂：需要 Node.js 运行环境，且需要处理缓存策略、反向代理（如 Nginx）配置等

## 手写`SSR`

基于`Vite + Express`

### Directory

```
my-vite-ssr-app/
├── index.html          # HTML 模板（包含 SSR 注入占位符）
├── server.js           # Express 服务端主文件（处理 HTTP 请求和 Vite 中间件）
├── package.json
├── vite.config.js      # Vite 配置
├── src/
│   ├── main.js         # 通用创建逻辑（导出 createApp，供首屏和客户端同时使用）
│   ├── entry-client.js # 客户端入口（挂载 App 到 DOM，激活交互）
│   ├── entry-server.js # 服务端入口（将 App 转换为字符串）
│   ├── router/
│   │   └── index.js    # 你之前写的那段路由代码（区分 History 模式）
│   ├── views/          # 页面组件
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── App.vue         # 根组件
│   └── assets/         # 静态资源（CSS, Images）
└── dist/               # 打包后的目录（执行 build 后生成）
    ├── client/         # 客户端静态资源
    └── server/         # 服务端渲染专用包
```

### Code

::: code-group

```js [entry-client.js]
import { createClientApp } from './main'

const { app, router } = createClientApp()

// 等待路由准备就绪再挂载 防止水合时出现不匹配
router.isReady().then(() => {
  app.mount('#app')
})
```

```js [entry-server.js]
import { renderToString } from 'vue/server-renderer'
import { createServerApp } from './main'

export async function render(url) {
  const { app, router } = createServerApp()

  router.push(url)
  await router.isReady()

  const ctx = {}
  const html = await renderToString(app, ctx)
  return html
}
```

```js [main.js]
import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createServerApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}

export function createClientApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}
```

```json [package.json]
{
  "name": "vue-ssr",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "express": "^4.2.1",
    "pinia": "^2.2.0",
    "prettier": "^3.3.0",
    "vue": "^3.5.0",
    "vue-router": "^4.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.5",
    "vite": "^8.0.2"
  }
}
```

```js [server.js]
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // 创建 Vite 开发服务器实例（中间件模式）
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 vite 的中间件来处理请求
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // req 请求对象 res 响应对象
    const url = req.originalUrl

    try {
      // 1. 读取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // 2. 应用 Vite 的 HTML 转换（处理 HMR 和热更新脚本）
      template = await vite.transformIndexHtml(url, template)

      // 3. 加载服务端入口文件
      // vite.ssrLoadModule 会自动将 ESM 转为能在 Node.js 运行的代码
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')

      // 4. 渲染 Vue 组件内容
      const appHtml = await render(url)

      // 5. 将渲染出的 HTML 注入到模板占位符处
      const html = template.replace(
        '<div id="app"></div>',
        `<div id="app">${appHtml}</div>`
      )

      // 6. 返回最终生成的 HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // 如果出错，让 Vite 修复堆栈信息并打印
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  console.log('Server started at http://localhost:5173')
  app.listen(5173)
}

createServer()
```

```js [router/index.js]
import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory
} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('../views/About.vue')
  }
]

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  })
}
```

```vue [App.vue]
<script setup></script>

<template>
  <div>
    <nav>
      <RouterLink to="/">Home | </RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
```

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite SSR</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/entry-client.js"></script>
  </body>
</html>
```

```js [vite.config.js]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()]
})
```

:::

### Detail

调用流程可以分为三个主要阶段

#### 1. 服务端启动

1. 执行入口：运行命令，Node.js开始执行`server.js`
2. 初始化服务器：在`server.js`中，创建了一个`Express`实例，并以中间件模式启动了`Vite`服务。让`Vite`处理静态资源和热更新，而`Express`处理页面路由
3. 监听端口：服务器开始监听`5173`端口，等待用户访问

#### 2. 处理浏览器请求

当你在浏览器打开`localhost:5173`

1. 拦截请求：`Express`的`app.use('*', async(req,res) => {})`拦截到你的请求
2. 读取模板：读取项目根目录下的`index.html`
3. 加载服务端 入口：通过`Vite`的`ssrLoadModule`动态加载`entry-server.js`
4. 创建`Vue`实例：
   - `entry-server.js`调用`main.js`中的`createServerApp()`
   - `main.js`创建了一个全新的Vue实例和Router实例返回

5. 匹配路由并渲染：
   - `entry-server.js`根据当前请求的URL（如`/`或`/about`），通过`router.push(url)`让路由跳转到相应的页面
   - 匹配到页面组件（如`Home.vue`）后，使用`renderToString`再把这个Vue组件树渲染成语段纯静态的HTML字符串

6. 返回HTML：`server.js`将这段HTML字符串替换到`index.html`的`<div id="app"></div>`占位符中，然后把完整的HTML发给浏览器

#### 3. 客户端接管与水合

1. 浏览器初次渲染 ：浏览器收到 HTML， 立刻就能把页面展示出来 （此时页面可见，但按钮等交互还没生效，因为还没有挂载 JS 事件）。
2. 加载客户端脚本 ：浏览器解析 HTML 时，发现里面有一句 `<script type="module" src="/src/entry-client.js"></script>`（在 index.html 中定义的），于是开始请求并执行客户端代码。

3. 客户端初始化 ：
   - 执行 `entry-client.js` 。
   - 它调用 `main.js` 中的 `createClientApp()` ，在浏览器端 再次创建 了一个`Vue`实例和`Router`实例。

4. 激活页面（水合） ：
   - 客户端路由就绪后，执行 `app.mount("#app")` 。
   - Vue 会检查现有的 DOM（也就是服务端刚才发过来的那些 HTML），并不会重新生成 DOM，而是把事件监听器（比如按钮的 `@click` ）"绑定"到现有的静态 DOM 上。
   - 至此，页面彻底“活”了过来，后续的路由跳转（如点击 `About`）就完全由 `Vue Router` 在前端接管，变成了传统的 SPA（单页应用）体验。

## ⚠️ 进阶与常见问题 (Important)

### 1. 水合不匹配 (Hydration Mismatch)

如果客户端生成的虚拟 DOM 和服务端返回的实际 DOM 结构不一致，Vue 就会抛出水合错误（Hydration Mismatch）。

**常见原因：**

- **使用了不确定的数据**：例如在组件渲染时使用了 `Math.random()` 或是当前的时间 `new Date()`，导致服务端渲染的值和客户端渲染的值不一样。
- **HTML 结构不规范**：例如在 `<p>` 标签中嵌套了块级元素（如 `<div>`），浏览器会自动纠正 HTML 结构，这就会导致客户端在水合时找不到对应的 DOM。
- **特定环境的变量**：代码中使用了 `typeof window !== 'undefined'` 进行判断渲染，导致服务端和客户端走入了不同的分支。

**解决方案：**
将只属于客户端的逻辑放到 `onMounted` 钩子中，因为 `onMounted` 只有在客户端水合完成后才会执行。

```vue
<script setup>
import { ref, onMounted } from 'vue'

const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <div v-if="isClient">
    <!-- 这里只在客户端渲染，避免服务端参与导致结构不一致 -->
    <p>{{ Math.random() }}</p>
  </div>
</template>
```

### 2. 状态管理与数据预取 (Data Fetching)

在 SSR 中，如果页面需要发起接口请求拉取数据，我们不能让客户端重新发起一遍请求（这样就失去了 SSR 的意义）。我们需要在 **服务端预取数据**，然后把数据随着 HTML 一起发送给客户端。

**流程：**

1. 服务端在组件层面请求数据。
2. 数据请求完毕后，服务端利用状态管理工具（如 `Pinia`）保存这些状态。
3. 服务端将 Pinia 的状态序列化为一段内联脚本（例如 `window.__INITIAL_STATE__ = {...}`），嵌入到 `index.html` 中。
4. 客户端在初始化应用前，直接从 `window.__INITIAL_STATE__` 读取数据，注入到客户端的 Pinia 中（这个过程叫做 **脱水与注水 / Dehydration & Hydration**）。

### 3. 跨请求状态污染 (Cross-Request State Pollution)

在传统客户端（CSR）开发中，我们习惯在文件顶部定义单例变量：

```javascript
// ❌ 在 SSR 中这是灾难！
const state = reactive({ count: 0 })
export default {
  /* ... */
}
```

**原因**：Node.js 服务端是长时间运行的进程。如果有两个不同的用户同时访问，他们会共享这个全局的 `state`，造成数据污染和安全泄漏！

**正确做法**：
**必须为每个请求创建全新的 Vue 实例、Router 实例和 Pinia 实例。** 这就是为什么在前面的手写代码中，`main.js` 提供的是一个 `createApp()` 的工厂函数，而不是直接导出一个 `app` 实例。

```javascript
// ✅ 每次请求都创建一个独立的作用域
export function createServerApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  const pinia = createPinia() // 每次也是新的 Pinia

  app.use(router)
  app.use(pinia)

  return { app, router, pinia }
}
```
