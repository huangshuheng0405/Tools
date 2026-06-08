# 默认导出 vs 命名导出

在 JavaScript (ES Modules) 和 Nuxt 开发中，理解**默认导出 (Default Export)** 和 **命名导出 (Named Export)** 的区别非常重要。

## 1. 语法对比

### 命名导出 (Named Export)

可以在一个文件中导出多个值。导入时必须使用相同的名称（或者使用 `as` 重命名）。

**导出:**

```ts [composables/utils.ts]
export const useFormatDate = (date) => {
  /* ... */
}
export const useFormatCurrency = (amount) => {
  /* ... */
}
```

**导入 (在普通 JS/TS 文件中):**

```ts
import { useFormatDate, useFormatCurrency } from './composables/utils'
```

### 默认导出 (Default Export)

每个文件只能有**一个**默认导出。导入时可以随意命名。

**导出:**

```ts [composables/useBar.ts]
export default function () {
  return 'bar'
}
```

**导入 (在普通 JS/TS 文件中):**

```ts
import useBar from './composables/useBar'
// 或者命名为其他任何名字
import myBarFunction from './composables/useBar'
```

## 2. 在 Nuxt 自动导入中的区别

Nuxt 的自动导入机制对这两种导出方式处理略有不同。

### 命名导出

Nuxt 会直接使用导出的变量名作为自动导入的名称。

- `export const useFoo = ...` -> 自动导入为 `useFoo()`

### 默认导出

Nuxt 会使用**文件名**（去除扩展名）作为自动导入的名称。

- 文件 `composables/useUser.ts` 中的 `export default ...` -> 自动导入为 `useUser()`
- 即使你的默认导出函数有名子（如 `export default function useAuth() {}`），Nuxt 仍然优先使用文件名。

## 3. 最佳实践建议

### 推荐：命名导出

在 Nuxt 的 `composables` 目录中，**推荐使用命名导出**。

- **明确性**: 导出名称直接定义在代码中，不依赖于文件名。
- **灵活性**: 一个文件可以包含多个相关的 composables（例如 `useUser` 和 `useUserProfile`）。
- **重构友好**: 重命名文件不会意外破坏代码（因为导出名没变），尽管在 Nuxt 中文件名变了还是会影响自动导入路径，但对于非自动导入场景更安全。

### 何时使用默认导出？

- 当文件只包含一个主要功能，且文件名能够完美描述该功能时。
- 但在 Nuxt `composables` 中，为了保持一致性，即使只有一个导出，许多开发者也倾向于使用命名导出。
