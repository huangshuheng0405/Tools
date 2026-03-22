# tsup

[tsup](https://www.npmjs.com/package/tsup)

## 安装

```bash
npm install -D tsup typescript
npx tsc --init
```

## 编写源代码

创建一个 `src/index.ts` 文件，写入以下内容：

```ts [src/index.ts]
// src/index.ts
export const add = (a: number, b: number): number => a + b

export const greet = (name: string): string => `Hello, ${name}!`
```

## 配置

创建一个 `tsup.config.ts` 文件，写入以下内容：

```ts [tsup.config.ts]
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // 入口文件
  format: ['cjs', 'esm'], // 同时打包成 CommonJS 和 ES Module
  dts: true, // 生成 .d.ts 类型文件
  splitting: false, // 代码分割（库模式通常关闭）
  sourcemap: true, // 生成 sourcemap 供调试
  clean: true, // 每次打包前先清理 dist 目录
  outDir: 'dist', // 指定输出目录的名字
  shims: true // 确保 __dirname __filename 不会出错 因为node.js 原生不支持
})
```

## `package.json` 配置

在 `package.json` 中添加以下脚本：

```json [package.json] {4,5,6,8,9}
{
  "name": "my-utils",
  "version": "1.0.0",
  "main": "./dist/index.js", // CJS 入口
  "module": "./dist/index.mjs", // ESM 入口
  "types": "./dist/index.d.ts", // 类型定义入口
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch" // 实时打包
  }
}
```

## 打包

运行以下命令打包：

```bash
npm run build
```

打包完成，会生成一个 `dist` 目录，包含以下文件：

- `index.js`：CommonJS 格式的入口文件
- `index.mjs`：ES Module 格式的入口文件
- `index.d.ts`：TypeScript 类型定义文件

## 开发模式

在开发模式下，你可以使用 `npm run dev` 命令实时打包源代码。只要修改了 `src/index.ts` 文件，就会自动重新打包。

```bash
npm run dev
```

## 应用

### 开发`npm`工具库

类似`lodash`、`axios`等工具库，你可以使用`tsup`开发自己的`npm`工具库。

### 构建`nodejs`命令行工具（CLI）

写一个全局安装的工具，tsup非常适合

- **优势**： 可以将ts打包成精简的单个js文件，运行速度快，且支持`shims`（自动处理`__dirname`、`__filename`在`ESM`中的兼容问题等）
- **功能**：支持`minify`（压缩代码）和`treeshaking`（去除无用代码），让你的`CLI`安装包体积更小

### `monorepo` 项目的子包管理

在Turborepo或lerna这种大型仓库里，不同子包之间需要相互引用

- **场景**： 你有一个`package/shared`存放通用类型和函数
- **功能**： 在`shared`包里运行`tsup --watch`，只要修改代码，它会瞬间更新编译产物，其他子包（如`apps/web`）就能立刻拿到最新的代码和类型提示
