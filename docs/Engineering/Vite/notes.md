# vite

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
  plugins: [react()]
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
