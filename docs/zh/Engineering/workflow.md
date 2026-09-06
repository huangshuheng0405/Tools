# Git

> 把 `husky` + `lint-staged` + `eslint` + `prettier` + `commitlint` + `git-cz` 串起来，
> 让每次 `git commit` 自动完成：**格式化 → 代码检查 → 提交信息校验**。

## 各工具职责

| 工具                                     | 职责                                               | 触发时机                  |
| ---------------------------------------- | -------------------------------------------------- | ------------------------- |
| [husky](./Husky.md)                      | Git 钩子管理器，在 `commit` 等事件前后自动执行脚本 | 安装时激活                |
| [lint-staged](./Husky.md#lint-staged)    | 只对**暂存区**的文件执行命令，避免全量检查         | `pre-commit` 内           |
| [eslint](./ESlint.md)                    | 代码质量检查 + 自动修复                            | `pre-commit` 内           |
| [prettier](./Prettier.md)                | 代码格式化                                         | `pre-commit` 内           |
| [commitlint](./git-cz.md#搭配commitlint) | 校验提交信息是否符合规范                           | `commit-msg`              |
| [git-cz](./git-cz.md)                    | 交互式生成规范的提交信息                           | 手动运行 `npm run commit` |

## 整体流程

```text
写代码
  │  git add .  先暂存
  ▼
npm run commit        ← git-cz 交互式生成 commit message
  │
  ▼
git commit            ← 触发 husky
  ├─ pre-commit 钩子   → lint-staged
  │                     ├─ eslint --fix     代码检查 + 修复
  │                     └─ prettier --write  代码格式化
  │
  ├─ commit-msg 钩子   → commitlint --edit  校验提交信息格式
  │
  ▼
通过 → commit 成功    |  失败 → 阻止提交并输出错误提示
```

关键点：**代码质量在提交前把关，提交信息在提交时把关**。

## 安装依赖

::: code-group

```bash [npm]
npm i -D husky lint-staged
npm i -D eslint prettier
npm i -D @commitlint/cli @commitlint/config-conventional
npm i -D cz-git commitizen
```

```bash [yarn]
yarn add -D husky lint-staged
yarn add -D eslint prettier
yarn add -D @commitlint/cli @commitlint/config-conventional
yarn add -D cz-git commitizen
```

```bash [pnpm]
pnpm add -D husky lint-staged
pnpm add -D eslint prettier
pnpm add -D @commitlint/cli @commitlint/config-conventional
pnpm add -D cz-git commitizen
```

```bash [bun]
bun add -D husky lint-staged
bun add -D eslint prettier
bun add -D @commitlint/cli @commitlint/config-conventional
bun add -D cz-git commitizen
```

:::

> `commitizen` 建议全局安装，这样任何项目里都能直接用 `cz` / `git cz` 启动。

## 初始化 husky

```bash
npx husky init
```

它会做两件事：

1. 创建 `.husky` 目录，并生成一个 `pre-commit` 钩子
2. 在 `package.json` 里加 `"prepare": "husky"`，保证 `npm install` 时自动激活钩子

## pre-commit 钩子

`.husky/pre-commit`：只跑 lint-staged，让 eslint / prettier 只处理本次要提交的文件

```bash
#!/usr/bin/env sh
npx lint-staged
```

`package.json` 里配置 lint-staged，按文件类型分配要执行的命令

```json [package.json]
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx,vue}": ["eslint --fix", "prettier --write"]
  }
}
```

> 顺序有讲究：先 `eslint --fix` 修质量，再 `prettier --write` 统一格式。
> 因为 prettier 在最后跑，能保证最终落盘的是统一格式。

## commit-msg 钩子

创建 `.husky/commit-msg`：每次提交时校验提交信息

```bash
npx --no -- commitlint --edit "$1"
```

- `--no`：让 npx 不会因为没有依赖而自动去下载
- `"$1"`：git 传入的 commit message 临时文件路径

## commitlint 配置

::: code-group

```js [commitlint.config.cjs]
// 项目 package.json 里 "type": "module" 时，必须用 .cjs 后缀
const { defineConfig } = require('cz-git')

module.exports = defineConfig({
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
  },
  prompt: {
    // git-cz 的交互式配置……
  },
})
```

```js [commitlint.config.js]
// 项目是 CommonJS 时用 .js
const { defineConfig } = require('cz-git')

module.exports = defineConfig({
  rules: {},
  prompt: {},
})
```

:::

> 这里有个技巧：`cz-git` 导出的 `defineConfig` 返回的对象**同时**包含
> commitlint 的 `rules` 和 git-cz 交互的 `prompt` 两部分，
> 所以**一份配置文件 commitlint 和 git-cz 共用**，不用写两份。

## git-cz 配置

`package.json` 中把 commitizen 的路径指向 `cz-git`，并加上 `commit` 命令

```json [package.json]
{
  "scripts": {
    "prepare": "husky",
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git",
      "useEmoji": true
    }
  }
}
```

之后在命令行运行 `npm run commit`，就会弹出交互式选择：类型（feat / fix / docs…）、scope、subject 等，git-cz 帮你拼出规范的提交信息，再交给 commitlint 校验。

## 完整配置速览

```text
项目根目录
├── .husky/
│   ├── pre-commit      # npx lint-staged
│   └── commit-msg      # npx --no -- commitlint --edit "$1"
├── commitlint.config.cjs   # commitlint + git-cz 共用
├── eslint.config.js        # eslint 规则
├── .prettierrc             # prettier 规则
└── package.json            # scripts + lint-staged + commitizen 配置
```

```json [package.json]
{
  "scripts": {
    "prepare": "husky",
    "commit": "git-cz",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx,vue}": ["eslint --fix", "prettier --write"]
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git",
      "useEmoji": true
    }
  }
}
```

## 💡 提示

- **pre-commit vs commit-msg**：`pre-commit` 管"代码合不合格"，`commit-msg` 管"提交信息合不合格"，两者各管一摊，缺一不可。
- **为什么用 lint-staged**：如果直接对全仓库跑 eslint / prettier，提交慢且会误伤无关文件；lint-staged 只看 `git add` 过的文件，又快又精准。
- **钩子没生效？** 检查 `.husky/pre-commit`、`.husky/commit-msg` 是否可执行（`chmod +x`），以及 `package.json` 里是否有 `"prepare": "husky"`。
- **绕过校验**：`git commit --no-verify` 可以跳过钩子，但一般只在紧急情况下用。
