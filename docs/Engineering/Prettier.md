# Prettier

## Installation

::: code-group

```bash [npm]
npm i -D prettier
```

```bash [yarn]
yarn add -D prettier
```

```bash [pnpm]
pnpm add -D prettier
```

```bash [bun]
bun add -D prettier
```

:::

Then,create an empty config file `.prettierrc`

```bash
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
```

Next,create a `.prettierIgnore` file

```bash
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
```

## `.prettierrc`

```json [.prettierrc]
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

- semi: false 👉 不加分号（你刚刚说的需求）
- singleQuote: true 👉 用单引号 '
- tabWidth: 2 👉 2 空格缩进
- useTabs: false 👉 不用 tab，用空格
- trailingComma: "es5" 👉 尾逗号（对象、数组）
- printWidth: 100 👉 一行最多 100 字符
- bracketSpacing: true 👉 { foo: bar }
- arrowParens: "avoid" 👉 x => x（少括号）
- endOfLine: "lf" 👉 统一换行（防止 git 冲突）

## `.prettierignore`（可选）

```json [.prettierignore]
node_modules
dist
build
coverage
```

## Setting `package.json`

```json [package.json]
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,ts,vue}\"",
    "format:check": "prettier --check \"src/**/*.{js,ts,vue}\""
  }
}
```

- `format`：自动修复
- `format:check`：只检查
