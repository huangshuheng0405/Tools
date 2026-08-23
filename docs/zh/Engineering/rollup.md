# Rollup

<svg width='200px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-rollupjs-7-a)"><path fill="url(#devicon-rollupjs-8-b)" d="M529.6 197.5a196 196 0 0 0-25.6-97.1c-43.2-44.5-137.2-54.8-160.5-.2-24 56 40.2 118.2 68.3 113.2 35.8-6.3-6.3-88.3-6.3-88.3 54.7 103 42 71.5-56.8 166.1S149 585.5 134.3 594l-2 1h387.6a9.2 9.2 0 0 0 8.2-13.3L426.7 381a9 9 0 0 1 3.6-12.1c59.3-34 99.3-98 99.3-171.4"/><path fill="url(#devicon-rollupjs-9-c)" d="M529.6 197.5a196 196 0 0 0-25.6-97.1c-43.2-44.5-137.2-54.8-160.5-.2-24 56 40.2 118.2 68.3 113.2 35.8-6.3-6.3-88.3-6.3-88.3 54.7 103 42 71.5-56.8 166.1S149 585.5 134.3 594l-2 1h387.6a9.2 9.2 0 0 0 8.2-13.3L426.7 381a9 9 0 0 1 3.6-12.1c59.3-34 99.3-98 99.3-171.4"/><path fill="url(#devicon-rollupjs-10-d)" d="M134.3 593.9C149 585.5 249.9 385.7 348.7 291s111.5-63 56.8-166.1c0 0-209.2 293.3-284.9 438.4"/><path fill="url(#devicon-rollupjs-11-e)" d="M163.7 331C305 71.4 323.5 45.2 397.1 45.2a134 134 0 0 1 103 48.5A197 197 0 0 0 335 0H95c-5 0-9.2 4.1-9.2 9.1V493c14.3-37 38.6-89.7 77.8-162"/><path fill="url(#devicon-rollupjs-12-f)" d="M348.7 291.1C250 385.7 149 585.5 134.3 594s-39.5 9.4-52.6-5.3c-14-15.6-35.7-41 82-257.5C305 71.3 323.5 45 397.1 45a134 134 0 0 1 103 48.5l4 6.8C461 55.9 367 45.6 343.6 100.2c-24 56 40.2 118.2 68.3 113.2 35.8-6.3-6.3-88.3-6.3-88.3 54.6 103 42 71.4-56.9 166"/><path fill="url(#devicon-rollupjs-13-g)" d="M175.3 342.6C316.6 82.8 335 56.6 408.7 56.6A135 135 0 0 1 497 90a134 134 0 0 0-100-44.9c-73.5 0-92 26.2-233.3 286C46 547.6 67.7 573 81.7 588.6q3 3.3 6.7 5.7c-12.3-17.9-17.7-59.4 86.9-251.7" opacity=".3"/></g><defs><linearGradient id="devicon-rollupjs-8-b" x1="10789.2" x2="27193.9" y1="25712.3" y2="27851.9" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6533"/><stop offset=".2" stop-color="#FF5633"/><stop offset=".4" stop-color="#FF4333"/><stop offset=".7" stop-color="#FF3733"/><stop offset="1" stop-color="#F33"/></linearGradient><linearGradient id="devicon-rollupjs-9-c" x1="8257" x2="40897.2" y1="20345.5" y2="34465.6" gradientUnits="userSpaceOnUse"><stop stop-color="#BF3338"/><stop offset="1" stop-color="#F33"/></linearGradient><linearGradient id="devicon-rollupjs-10-d" x1="10358.8" x2="15499.1" y1="18644.4" y2="21112.1" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6533"/><stop offset=".2" stop-color="#FF5633"/><stop offset=".4" stop-color="#FF4333"/><stop offset=".7" stop-color="#FF3733"/><stop offset="1" stop-color="#F33"/></linearGradient><linearGradient id="devicon-rollupjs-11-e" x1="21439" x2="19656.4" y1="38620.4" y2="20589.5" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6533"/><stop offset=".2" stop-color="#FF5633"/><stop offset=".4" stop-color="#FF4333"/><stop offset=".7" stop-color="#FF3733"/><stop offset="1" stop-color="#F33"/></linearGradient><linearGradient id="devicon-rollupjs-12-f" x1="17504.6" x2="24037.9" y1="26244.6" y2="28958.2" gradientUnits="userSpaceOnUse"><stop stop-color="#FBB040"/><stop offset="1" stop-color="#FB8840"/></linearGradient><linearGradient id="devicon-rollupjs-13-g" x1="23624" x2="13603.5" y1="3278.7" y2="69760.7" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="devicon-rollupjs-7-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg>

[rollup](https://www.npmjs.com/package/rollup) 是一个以 ES Module 为核心的打包器，擅长打包库（library）与可 Tree Shaking 的产物。Vite 的生产构建底层也基于 Rollup。

## Installation

::: code-group

```bash [npm]
npm i -D rollup
```

```bash [yarn]
yarn add -D rollup
```

```bash [pnpm]
pnpm add -D rollup
```

```bash [bun]
bun add -d rollup
```

:::

## 快速使用

### 1）一个最小可用的打包

`src/index.js`：

```js
export function add(a, b) {
  return a + b
}
```

`rollup.config.mjs`：

```js
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.esm.js', format: 'es', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
  ],
}
```

运行：

```bash
rollup -c
```

### 2）Watch

```bash
rollup -c -w
```

## 配置结构速记

Rollup 配置是一个对象（或对象数组）：

- `input`：入口文件（也可以是多入口对象）
- `output`：输出配置（可以是数组，产出多种格式）
- `plugins`：插件链
- `external`：不打进产物的依赖（库打包时很常用）

## 常见配置项

### input（入口）

```js
export default {
  input: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
}
```

### output（输出）

#### format（常见产物格式）

- `es`：ESM（现代打包/浏览器/Node ESM）
- `cjs`：CommonJS（Node）
- `umd` / `iife`：更偏浏览器直接引入（需要 `name`，并且常配 `globals`）

#### dir vs file

- 多入口、分包（code splitting）通常用 `output.dir`
- 单文件输出可以用 `output.file`

```js
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    entryFileNames: '[name].js',
    chunkFileNames: 'chunks/[name]-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
  },
}
```

#### name / globals（UMD/IIFE 常用）

```js
export default {
  input: 'src/index.js',
  external: ['react', 'react-dom'],
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'MyLib',
    globals: { react: 'React', 'react-dom': 'ReactDOM' },
  },
}
```

### external（库打包必看）

把依赖标记为 external，避免把它们打进产物（由使用方来提供）：

```js
export default {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  output: [{ file: 'dist/index.esm.js', format: 'es' }],
}
```

常见搭配：从 `package.json` 读取 dependencies/peerDependencies 自动 external（项目里如果没有现成脚本，就先手写列表）。

### treeshake（Tree Shaking）

Tree Shaking 依赖 ESM 的静态结构（`import/export`）。常见关注点：

- 尽量输出 `format: 'es'`，让下游继续 Tree Shaking
- 确保依赖库支持 ESM（例如优先 `lodash-es`）
- 避免“有副作用”的顶层代码（会影响摇树优化）

## 分包（Code Splitting）

### 动态导入

动态导入会天然触发拆分 chunk：

```js
export async function loadHeavy() {
  const mod = await import('./heavy.js')
  return mod
}
```

### manualChunks（手动分包）

```js
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    manualChunks(id) {
      if (id.includes('node_modules')) return 'vendor'
    },
  },
}
```

## preserveModules（按文件结构输出）

库开发里很常见：保持模块边界，输出更贴近源码结构（也更利于按需引入）。

```js
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
}
```

## Plugins（常用插件）

Rollup 的能力大多来自插件。常见插件组合（按需选择）：

- `@rollup/plugin-node-resolve`：解析第三方包（node_modules）
- `@rollup/plugin-commonjs`：把 CommonJS 转成 ESM（兼容老包）
- `@rollup/plugin-json`：导入 JSON
- `@rollup/plugin-replace`：替换环境变量/常量
- `@rollup/plugin-typescript` 或 `rollup-plugin-esbuild`：处理 TS
- `@rollup/plugin-babel`：Babel 编译
- `rollup-plugin-postcss`：处理 CSS
- `@rollup/plugin-terser`：压缩（更常见于应用构建或 UMD/IIFE）

## 常见场景配置模板

### 1）打包一个 TypeScript 库（ESM + CJS）

```js
export default {
  input: 'src/index.ts',
  external: [],
  output: [
    { file: 'dist/index.esm.js', format: 'es', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
  ],
}
```

如果你有 peerDependencies（例如 React 组件库），通常把它们放进 `external`，并在 UMD 场景配置 `globals`。

### 2）多入口构建

```js
export default {
  input: { index: 'src/index.ts', utils: 'src/utils.ts' },
  output: { dir: 'dist', format: 'es', sourcemap: true },
}
```

## 常见问题速记

- 依赖重复/产物变大：检查 `external` 是否漏了、分包是否造成重复依赖
- 路径解析失败：一般缺 `node-resolve` 插件或 `commonjs` 插件
- Tree Shaking 无效：确认产物格式是 `es`、依赖是否 ESM、是否存在副作用代码
