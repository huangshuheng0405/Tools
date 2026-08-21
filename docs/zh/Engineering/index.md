# 工程化 (Engineering)

这里记录关于前端工程化的笔记，包括构建工具、代码规范、自动化测试、持续集成等内容。

## Webpack

- [Webpack 笔记](./Webpack/notes.md)

## 新兴工具选型与原理剖析

### 模块化规范

某个文件要用外部的某个文件的内容

1. 被使用的文件，要导出使用的内容
2. 使用的文件，要导入使用的内容

```js
// 被使用的文件
export const a = 1
```

```js
// 使用的文件
import { a } from './a'
console.log(a)
```

这个称之为esm（ECMAScript Moudule）

#### 主要模块化规范

1. cmd
2. amd
3. commonjs
4. esm
5. umd

###### commonjs

```js [banner.js]
module.exports = {
  name: 'banner'
}
```

```js [index.js]
const { name } = require('./banner.js')
```

tree-shakeing，前提条件是esm规范

CommonJS规范只要用于服务端，加载模块是同步的，这并不适合浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了 AMD CMD

## rollup

1. 多模块化规范输出
2. 插件化，常规的一些功能，都需要借助`plugin`完成

```js [rollup.config.js]
const importCss = require('rollup-plugin-import-css') // 解析css
const typescript = require('@rollup/plugin-typescript') // 解析typescript

module.exports = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm'
    },
    plugins: [importCss(), typescript()]
  },
  {
    plugins: [importCss(), typescript()],
    input: 'src/index.ts',
    output: {
      file: 'cjs/index.cjs',
      format: 'cjs'
    }
  }
]
```

多模块化规范输出，分别输出esm和cjs格式的文件

## esbuild

1. 快速，基于`go`实现，打包速度快
2. 插件化，和rollup类似，但是插件数量要少很多
