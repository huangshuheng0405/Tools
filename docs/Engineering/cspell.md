# cspell

## 安装

```bash
pnpm add -D cspell
```

## 初始化

```bash
npx cspell init
```

会生成 `cspell.yaml` 文件

## 配置文件

推荐使用 `cspell.config.yaml` 或 `cspell.json`。

```yaml [cspell.config.yaml]
version: '0.2'
language: en
# 检查的文件范围
files:
  - '**'
# 忽略的文件或目录
ignorePaths:
  - node_modules
  - dist
  - '**/dist/**'
  - pnpm-lock.yaml
  - package-lock.json
  - yarn.lock
  - .cspell/words.txt
# 项目专有的白名单单词
words:
  - pnpm
  - vitepress
  - tsconfig
  - miaoma
  - tsup
  - esbuild
  - eslint
  - commitlint
  - commitizen
  - husky
# 自定义字典定义
dictionaryDefinitions:
  - name: project-words
    path: .cspell/words.txt
    addWords: true
# 使用的字典
dictionaries:
  - project-words
```

- `files`: 指定要检查的文件范围。
- `ignorePaths`: 指定忽略的路径，避免检查第三方库或生成的产物。
- `words`: 核心配置，将项目中特有的、不属于标准词典的单词（如库名、缩写）加入白名单，防止误报。
- `dictionaryDefinitions` & `dictionaries`: 用于定义和引用外部字典文件，方便管理大量自定义单词。

---

## 配合 `package.json`

在 `scripts` 中添加检查脚本，方便在 CI/CD 或本地全量检查：

```json [package.json]
{
  "scripts": {
    "lint:spell": "cspell lint \"**\" --no-progress --show-suggestions --show-context"
  }
}
```

- `**`: 检查当前目录下的所有文件。
- `--no-progress`: 不显示每个文件的检查进度，输出更清爽。
- `--show-suggestions`: 拼写错误时显示修复建议。
- `--show-context`: 显示错误单词所在的上下文行。

> **注意**: 如果不指定检查对象（如 `\"**\"`），`cspell` 可能会报错或不执行。

---

## 进阶补充

### 1. VS Code 插件集成 (推荐)

在 VS Code 中搜索并安装 **Code Spell Checker**。它会自动读取项目根目录下的 `cspell.config.yaml`，并在编辑器中实时标记拼写错误。

### 2. 行内忽略 (Inline Ignoring)

有时你只想在某个文件中忽略特定单词，可以使用注释：

- 忽略当前文件中的特定单词：
  ```javascript
  // cspell:ignore mysecretword
  ```
- 忽略下一行：
  ```javascript
  // cspell:disable-next-line
  const strangeVarName = '...'
  ```

### 3. 常用内置词典

CSpell 内置了许多词典（如 `html`, `node`, `typescript` 等）。你可以根据项目类型在 `dictionaries` 中开启它们：

```yaml
dictionaries:
  - html
  - node
  - typescript
  - project-words
```

### 4. 搭配 `husky` & `lint-staged`

为了确保所有提交的代码都经过拼写检查，建议在 `lint-staged` 中配置：

```json [package.json]
{
  "lint-staged": {
    "*.{ts,vue,md,js}": ["cspell lint --no-progress"]
  }
}
```
