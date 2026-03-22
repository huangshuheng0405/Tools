# ESlint

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
        ...globals.node // 注入 Node 全局变量 (process)
      }
    },
    rules: {
      // 在这里添加你的“家法”
      'no-console': 'warn', // 允许 console，但给出警告
      'no-unused-vars': 'error', // 禁止出现未使用的变量
      'prefer-const': 'error', // 首选 const 声明
      'vue/multi-word-component-names': 'off' // 关闭 Vue 组件名必须多单词的限制
    }
  },

  // 4. 忽略文件 (类似以前的 .eslintignore)
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**']
  }
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

```bash
npm add -D typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

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
        tsconfigRootDir: import.meta.dirname // 确保相对路径从项目根目录开始算
      }
    }
  }
]
```

## 与 `Prettier` 配合

ESLint 负责代码质量，Prettier 负责代码格式。两者可能冲突，需要禁用 ESLint 中与 Prettier 冲突的规则。

1. 安装依赖

```bash
npm add -D eslint-config-prettier
```

2. 在 `eslint.config.js` 最后加入

```js [eslint.config.js]
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // ... 其他配置
  eslintConfigPrettier // 必须放在最后，覆盖前面的规则
]
```

## 与 `Husky` + `lint-staged` 配合

为了防止不符合规范的代码进入仓库，可以在 Git Commit 前自动运行 ESLint。

1. 安装依赖

```bash
npm add -D husky lint-staged
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
