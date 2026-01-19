# Composables 目录

Nuxt 使用 `composables/` 目录来自动导入你的 Vue 组合式函数 (Composables)。这使得你可以将可重用的逻辑封装起来，并在整个应用中直接使用，而无需手动导入。

## 自动导入 (Auto-imports)

Nuxt 会自动扫描 `composables/` 目录下的文件，并将其中的顶层导出 (named exports) 和默认导出 (default exports) 自动导入到你的应用中。

### 示例

创建一个 `composables/useFoo.ts` 文件：

```ts [composables/useFoo.ts]
export const useFoo = () => {
  return useState('foo', () => 'bar')
}
```

现在你可以在组件中直接使用 `useFoo()`：

```vue [app.vue]
<script setup>
const foo = useFoo()
</script>

<template>
  <div>
    {{ foo }}
  </div>
</template>
```

## 命名约定

- **文件名**: 建议使用 `camelCase` 命名，例如 `useUser.ts`。
- **函数名**: 同样建议使用 `camelCase`，并以 `use` 开头，例如 `useUser`, `useAuth`。

## 编写 Composables

### 默认导出 vs 命名导出

你可以使用命名导出：

```ts [composables/utils.ts]
export const useFormatDate = (date) => {
  /* ... */
}
export const useFormatCurrency = (amount) => {
  /* ... */
}
```

也可以使用默认导出（通常用于文件名与函数名一致的情况）：

```ts [composables/useBar.ts]
export default function () {
  return 'bar'
}
```

_注意：使用默认导出时，自动导入的名称就是文件名（不带扩展名）。_ 详见 [默认导出与命名导出的区别](/Tips/default-vs-named-export)

## 状态共享 (useState)

在 Composables 中，你经常需要用到 `useState` 来创建一个跨组件共享的响应式状态。这比使用 `ref` 更安全，因为 `ref` 在服务端渲染 (SSR) 时可能会导致状态在不同请求间泄漏。

```ts [composables/useCounter.ts]
export const useCounter = () => {
  return useState('counter', () => 0)
}
```

## 扫描机制

默认情况下，Nuxt 只会扫描 `composables/` 目录的**顶层文件**。

### 嵌套目录

如果你有嵌套目录，例如 `composables/nested/utils.ts`，里面的函数**不会**被自动导入，除非你重新导出它们或者配置 Nuxt。

**方法 1: 重新导出 (推荐)**

在 `composables/index.ts` 中重新导出：

```ts [composables/index.ts]
export { useNestedUtils } from './nested/utils'
```

**方法 2: 配置扫描路径**

在 `nuxt.config.ts` 中添加目录到扫描列表：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  imports: {
    dirs: [
      // 扫描 composables 目录下的所有子目录
      'composables/**'
    ]
  }
})
```

## 类型支持

Nuxt 会自动生成类型定义，因此你在编写代码时会获得完整的 TypeScript 支持和自动补全，无需额外配置。生成的类型定义位于 `.nuxt/imports.d.ts` 中。
