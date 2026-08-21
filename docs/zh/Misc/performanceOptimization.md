# vue 性能分析优化

## 性能分析

- 产物体积：借助工具（`rollup-plugin-visualizer、lighthouse`）
  - [静态分包](#静态分包)：通过 `rollupOptions.output.manualChunks`
  - [动态分包](#动态分包)：按需加载依赖
- devtools：在开发环境进行
- Performance：用来做一些具体的渲染与交互的指标分析
  - 主要分析`js`执行时长，导致渲染掉帧
  - 函数调用栈深度，函数执行耗时
- Mermory、lighthouse，这些都是基于产物进行分析

## 静态分包

### 定义

在**编译阶段**由构建工具根据代码的引用关系，预先将代码拆分成多个独立的`Bundle`

1.

```js
// main.js
import { heavyTool } from './utils.js' // 无论是否使用，都会随着主包一起加载

heavyTool.run()
```

### 常见场景

- 第三方库拆分：将`vue`、`react`、`axios`等不长变动的库单独打成一个`vendor.js`，利用浏览器缓存
- 公共模块提取：多个页面共同使用的代码被提取到`common.js`中

## 动态分包

### 定义

运行时按需加载代码

1. 例如在vue/react中的路由懒加载

```js
;`const Home = () => import('./Home.vue')`
```

2.

```js
// main.js
const button = document.getElementById('loadBtn')

button.onclick = () => {
  // 只有点击按钮时，才会发起网络请求加载 utils.js
  import('./utils.js').then((module) => {
    module.heavyTool.run()
  })
}
```

### 特点

- 按需加载
- 减少首屏体积
- 随着用户操作触发新的网络请求

## `rollup-plugin-visualizer`

[rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)

### Installation

```bash
npm install -d rollup-plugin-visualizer
```

### Usage

```js
// ESM
import { visualizer } from 'rollup-plugin-visualizer'
```

Rollup

```js [rolluo.config.js]
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [
    // Keep it last.
    visualizer()
  ]
}
```

Vite

```js [vite.config.js]
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [visualizer()]
}
```
