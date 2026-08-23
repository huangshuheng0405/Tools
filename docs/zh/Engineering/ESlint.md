# ESlint

<svg width='200px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#8080F2" d="m182.7 225.3 113.9-65.7a9 9 0 0 1 9.2 0l113.8 65.7a9 9 0 0 1 4.6 8v131.4a9 9 0 0 1-4.6 8l-113.8 65.7a9 9 0 0 1-9.2 0l-113.9-65.7a9 9 0 0 1-4.6-8V233.3c0-3.3 1.8-6.4 4.6-8"/><path fill="#4B32C3" d="M596.3 288.2 460 51.4c-5-8.6-14-15-24-15H163.9a29 29 0 0 0-24 15L3.9 287.7a28 28 0 0 0 0 28l136 234.9a27 27 0 0 0 24 13h272.4a27 27 0 0 0 24-12.9l136-235.3c5-8.6 5-18.6 0-27.2m-112.8 114a10 10 0 0 1-5 8.4L305 510.6a10 10 0 0 1-9.8 0l-173.6-100a10 10 0 0 1-5.1-8.5V202c0-3.5 2-6.7 5-8.4L295 93.5a10 10 0 0 1 9.8 0l173.6 100c3 1.8 5.1 5 5.1 8.5z"/></svg>

## 快速开始

```bash
npm init @eslint/config@latest
```

安装完后会问一些配置问题，接着会安装对应依赖。`eslint`、`@eslint/js`、`globals`、`eslint-plugin-vue`（取决于你回答问题时用什么框架）
也会生成默认的`eslint.config.js`

```js [eslint.config.js]
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  // 1. 基础 JS 推荐规则
  js.configs.recommended,

  // 2. Vue 相关配置
  ...pluginVue.configs['flat/essential'],

  // 3. 自定义全局变量和规则
  {
    files: ['**/*.{js,mjs,vue}'], // 指定检查哪些文件
    languageOptions: {
      ecmaVersion: 'latest', // 使用最新的语法特性
      sourceType: 'module', // 使用 ES Modules
      globals: {
        ...globals.browser, // 注入浏览器全局变量 (window, document)
        ...globals.node, // 注入 Node 全局变量 (process)
      },
    },
    rules: {
      // 在这里添加你的“家法”
      'no-console': 'warn', // 允许 console，但给出警告
      'no-unused-vars': 'error', // 禁止出现未使用的变量
      'prefer-const': 'error', // 首选 const 声明
      'vue/multi-word-component-names': 'off', // 关闭 Vue 组件名必须多单词的限制
    },
  },

  // 4. 忽略文件 (类似以前的 .eslintignore)
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
]
```

## 配置 `package.json`

```json [package.json] {3}
{
  "script": {
    "lint:es": "eslint --config ./eslint.config.js",
    "lint:fix": "eslint --config ./eslint.config.js --fix"
  }
}
```

`npm run lint:fix`：自动修复大部分格式问题（如单双引号、空格等）

## VSCode ESlint

1. 安装插件 `ESLint`
2. 配置 `setting.json`，保存时自动修复

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## 处理 `TypeScript`

1. 安装依赖

::: code-group

```bash [npm]
npm i -D typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```bash [yarn]
yarn add -D typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```bash [pnpm]
pnpm add -D typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```bash [bun]
bun add -D typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

:::

2. 配置 `eslint.config.js`

```js [eslint.config.js]
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.eslint.json', '**/*/tsconfig.json'], // 告诉 eslint 你的 ts 规则在哪
        tsconfigRootDir: import.meta.dirname, // 确保相对路径从项目根目录开始算
      },
    },
  },
]
```

## 与 `Prettier` 配合

ESLint 负责代码质量，Prettier 负责代码格式。两者可能冲突，需要禁用 ESLint 中与 Prettier 冲突的规则。

1. 安装依赖

::: code-group

```bash [npm]
npm i -D eslint-config-prettier
```

```bash [yarn]
yarn add -D eslint-config-prettier
```

```bash [pnpm]
pnpm add -D eslint-config-prettier
```

```bash [bun]
bun add -D eslint-config-prettier
```

:::

2. 在 `eslint.config.js` 最后加入

```js [eslint.config.js]
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // ... 其他配置
  eslintConfigPrettier, // 必须放在最后，覆盖前面的规则
]
```

## 与 `Husky` + `lint-staged` 配合

为了防止不符合规范的代码进入仓库，可以在 Git Commit 前自动运行 ESLint。

1. 安装依赖

::: code-group

```bash [npm]
npm i -D husky lint-staged
```

```bash [yarn]
yarn add -D husky lint-staged
```

```bash [pnpm]
pnpm add -D husky lint-staged
```

```bash [bun]
bun add -D husky lint-staged
```

:::

```bash
npx husky init
```

2. 配置 `package.json`

```json [package.json]
{
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix"]
  }
}
```

3. 在 `.husky/pre-commit` 文件中添加

```bash
npx lint-staged
```

---

## 💡 提示

ESLint 9.0+ 默认使用了 **Flat Config** (扁平配置)，即 `eslint.config.js`。相比以前的 `.eslintrc.js`，它的优势在于：

- **更清晰的优先级**：数组中的配置项按顺序合并，后面的覆盖前面的。
- **原生支持 ESM**：不再需要复杂的 CommonJS 转换。
- **配置更灵活**：可以直接在配置对象中通过 `files` 指定生效范围，而不需要多个配置文件。
