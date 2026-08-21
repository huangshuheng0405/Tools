# esbuild

## Installation

::: code-group

```bash [npm]
npm i -D esbuild
```

```bash [yarn]
yarn add -D esbuild
```

```bash [pnpm]
pnpm i -D esbuild
```

```bash [bun]
bun add -D esbuild
```

:::

## Usage

```js [build.js]
import esbuild from 'esbuild'

esbuild
  .context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: false,
    sourcemap: true,
    target: ['es2020'],
    format: 'esm',
    outfile: 'dist/runtime-dom.mjs'
  })
  .then((context) => {
    console.log('successfully build by esbuild')

    // 持续监听文件变化 持续进行打包
    return context.watch()
  })
```
