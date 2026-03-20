# Husky

1. 安装

```bash
npm install -D husky
```

2. 初始化husky

```bash
npx husky init
```

> 在初始化之前 要先创建仓库 -> `git init`

它会做两件事

- 创建`.husky`目录

```
.husky
├── pre-commit
```

- 在`package.json`里加

```json
"scripts": {
    "prepare": "husky"
}
```

## pre-commit

`.husky/pre-commit`

```bash
#!/usr/bin/env sh
pnpm run lint:vue && pnpm lint:style && pnpm spellcheck
```

每次`git commit` 都会执行`pnpm run lint:vue && pnpm lint:style && pnpm spellcheck`

## lint-staged

`husky`搭配`lint-staged`使用

1. 安装

```bash
npm install -D lint-staged
```

2. `package.json` 里加

```json
"lint-staged": {
    "*.{vue,js,ts,jsx,tsx}": [
        "exlint --fix",
        "prettier --write"
    ]
}
```

3. 修改`.husky/pre-commit`

```bash
#!/usr/bin/env sh
npx lint-staged
```
