# Vite

## Proxy

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

如果请求是`/api`开头的，就会被代理到http://localhost:8080

如果后端接口没有`/api`，那么就涉及到`rewrite`

```ts
{
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

比如你发起`/api/user/list`，那么就会被代理到`http://localhost:8080/user/list`

#### 也可以配置多个后端

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    },

    '/ai': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

> 这个代理只在开发环境生效

## alias

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## host

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  server: {
    host: '0.0.0.0',
  },
})
```

配置之后，局域网也可以访问

## .env

比如axios请求的baseURL

```env [.env.development]
VITE_API_BASE_URL=/api
```

> Vite暴露给前端的环境变量必须以`VITE_`开头

- 开发：`npm run dev`，会自动加载`.env.development`
- 生产：`npm run build`，会自动加载`.env.production`

## 开发环境：基于原生 ESM

`Webpack` 在开发时需要抓取整个应用的依赖图并进行打包，而 `Vite` 跳过了此步骤。

- **利用原生 ESM**：现代浏览器支持 `import` 和 `export` 语法。`Vite` 启动时，只启动一个简单的 HTTP 服务器，不进行打包。
- **按需请求**：当你打开页面时，浏览器请求哪个文件，`Vite` 就会实时转换并返回哪个文件。
  - 例如：你请求 `App.vue`，`Vite` 会在后台调用 `Vue` 编译器把它转换为 `JS`，然后丢给浏览器。
- **依赖预构建**：为了解决 `CommonJS` 兼容性和上百个小文件请求过慢的问题，`Vite` 会在初始启动时使用 **`esbuild`** 将 `node_modules` 中的第三方库（如 `React`、`lodash`）预先打包成一个大的 `ESM` 包。

> **💡 提示**
> `esbuild` 是使用 `Go` 语言编写的，速度比传统 `JS` 编写的打包工具快很多。

## 生产环境：基于 Rollup

虽然开发环境不打包，但是为了生产环境的性能（减少 `HTTP` 请求、代码压缩、`Tree Shaking`），`Vite` 在执行 `vite build` 时依然会进行打包。

- **核心引擎**：`Vite` 在生产环境使用 **`Rollup`** 进行打包。
- **为什么用 `Rollup`**：`Rollup` 在处理 `ESM` 模块、`Tree Shaking` 和生成小体积包方面非常成熟且高效。
- **插件兼容**：`Vite` 设计了一套兼容 `Rollup` 的插件接口，这意味着很多 `Rollup` 的插件可以直接在 `Vite` 中使用。

## 热更新（HMR）的底层差异

`Webpack` 和 `Vite` 在热更新（`HMR`）的底层实现上存在显著差异：

- **Webpack**：当你修改一个文件时，`Webpack` 需要重新计算依赖图。即使有缓存，随着项目增大，速度也会变慢。
- **Vite**：由于基于原生 `ESM`，`Vite` 只需要让浏览器重新请求那个改变的文件即可。无论项目多大，热更新速度几乎是恒定延迟

## 为什么预构建要用 `esbuild`

- **编译语言优势**：传统的打包工具如 `Webpack`、`Rollup` 都是用 `JavaScript` 编写的。`JS` 作为解释性语言，存在垃圾回收和 `JIT` 编译的开销。而 `esbuild` 是用 `Go` 语言编写的，直接编译成机器码，能够充分利用多核 `CPU` 的并行能力。
- **性能优势**：在处理大型依赖库时，`esbuild` 的速度通常是 `Webpack` 或 `Rollup` 的 10 到 100 倍。

## 依赖预构建的目的

1. **CommonJS 转 ESM**：
   很多旧的 `npm` 包依然是 `CommonJS` 规范的，而浏览器不支持 `CommonJS` 规范，因此需要将 `CommonJS` 规范的代码转换为 `ESM` 规范的代码。
2. **减少网络请求（Bundle 瘦身）**：
   有些库内部由几百个小文件组成，如果直接请求，会触发几百个 `HTTP` 请求，导致网页加载较慢。`esbuild` 会把这些小文件打包成一个大文件，显著减少 `HTTP` 请求次数。

## 为什么生产环境不用 `esbuild`

生产环境并不在乎打包花多少时间，而是更在乎**最终生成的代码体积有多小**。

- **Rollup**：它是 `Tree Shaking` 的鼻祖，能够精准地分析哪些是没用的代码。在 `CSS` 拆分、代码分割和公共提取方面非常成熟。
- **esbuild**：虽然也有这些功能，但相对来说还不够成熟，生成的代码质量和体积不如 `Rollup` 优化得极致。

`Rollup` 拥有一个庞大且稳定的插件生态系统，而 `esbuild` 还在完善中。对于很多复杂的构建场景，`Rollup` 的插件系统能够灵活地满足需求。

## 基础使用与原理

parcel 对比 零配置 vite 倾向于零配置

### 入口

vite 第一性，默许开发者是开发 web 应用，所以将`index.html`中的`type="module" src="xxx`的文件作为入口

### 模块解析

vite 在开发环境使用的是esbuild 进行构建，所以很多编译工作esbuild（go）都是原生支持的，比如：

- 支持 jsx
- 支持 typescript
- 支持 css 预处理器
- 支持 图片、字体等静态资源

按照需要去进行编译，并且会将编译结果缓存

### 另外一些配置

1. 针对功能增强，plugin配置
2. 模块解析，resolve配置
3. 本地开发构建服务，server配置
4. 样式额外处理, css配置
5. 一些 vite 环境变量 define 配置
   - 一般使用`.env`文件来管理环境变量 注意：但是命名必须以`VITE\_`开头才能作为公共变量使用

6. 产物构建，build，esbuild 来配置

## vite 插件

vite 插件和 webpack 插件差别很大，webpack中plugin一般是用来强化构建过程，通过暴露的插件时机钩子在不同时机做一些处理，要和loader区分开，loader的工作是模块编译与解析

### 基础使用

vite 插件是一个对象，对象中包含了一些钩子函数，这些钩子函数会在不同的时机被调用，插件的工作就是在这些时机做一些处理

```js [vite.config.js]
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### vite 原理

1. 借助浏览器的module支持
2. 需要编译的内容需要做额外的编译
   1. css
   2. ts
3. 两端
   1. 开发阶段，本地通过开打服务实现
   2. rollup打包进行处理

## 手动分包（Manual Chunk）

vite 生产构建使用 rollup，所以“分包”本质上是 rollup 的 chunk 策略。

常见做法有两类：

1. **动态导入**：用 `import()` 触发按需加载（最推荐、最符合路由/功能模块拆分）
2. **manualChunks**：在构建配置里手动指定哪些模块要打到同一个 chunk（更偏工程优化）

### 1）动态导入分包

```js
const { heavy } = await import('./heavy-module')
```

常见应用：路由懒加载、低频功能（编辑器/图表/富文本）按需加载。

### 2）build.rollupOptions.output.manualChunks

在 `vite.config` 里配置：

```ts [vite.config.ts]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/'))
              return 'react'
            if (id.includes('/lodash-es/')) return 'lodash'
            return 'vendor'
          }
        },
      },
    },
  },
})
```

### 分包策略速记

- **优先业务维度**：按路由/功能模块分（动态导入），让首屏更轻、低频更晚加载
- **再做大依赖隔离**：把更新不频繁、体积大的库单独 chunk（例如图表、编辑器、UI 库）
- **vendor 不要太碎**：拆得过细会增加请求数和调度开销，HTTP/2 下也不是越碎越好

### 常见坑

- **共享依赖重复**：拆包不当会让某些依赖在多个 chunk 里重复，导致总体体积变大
- **缓存失效**：随便把业务和 vendor 混在一起，会导致业务改动引起 vendor chunk hash 改变
- **只在 build 生效**：manualChunks 主要影响生产构建，开发态模块加载机制不同
