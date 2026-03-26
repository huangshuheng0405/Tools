# Components 目录

`components/` 目录是 Nuxt 项目中用于存放 Vue 组件的地方。Nuxt 会自动导入这些组件，这意味着你可以在页面和其他组件中直接使用它们，而无需显式地 `import`。

## 自动导入 (Auto-imports)

Nuxt 会自动扫描 `components/` 目录下的文件，并根据文件名自动注册组件。

例如，如果你有一个文件 `components/AppHeader.vue`：

```vue [components/AppHeader.vue]
<template>
  <header>
    <h1>My App</h1>
  </header>
</template>
```

你可以在 `app.vue` 或其他页面中直接使用它：

```vue
<template>
  <div>
    <AppHeader />
    <NuxtPage />
  </div>
</template>
```

## 目录结构与组件名称

如果在 `components/` 目录下有嵌套的目录，组件名称将基于路径和文件名生成，并将重复的段（segments）移除。

### 示例

假设你的目录结构如下：

```
components/
|-- base/
|   |-- foo/
|   |   |-- Button.vue
|-- BaseButton.vue
```

- `components/base/foo/Button.vue` 对应的组件名为 `<BaseFooButton />`
- `components/BaseButton.vue` 对应的组件名为 `<BaseButton />`

Nuxt 足够智能，如果目录名和文件名的一部分重复，它会自动去重。例如 `components/base/BaseButton.vue` 也会变成 `<BaseButton />` 而不是 `<BaseBaseButton />`。

## 动态组件 (Dynamic Components)

如果你需要使用 Vue 的 `<component :is="someComponent">` 语法来动态渲染组件，你需要使用 `resolveComponent` 辅助函数。

```vue
<template>
  <component :is="clickable ? MyButton : 'div'" />
</template>

<script setup lang="ts">
const MyButton = resolveComponent('MyButton')
</script>
```

或者，如果你使用的是字符串形式的组件名：

```vue
<component :is="resolveComponent('MyComponent')" />
```

## 懒加载组件 (Lazy Loading)

为了优化打包大小，你可以在组件名前加上 `Lazy` 前缀来按需加载组件。这对那些只有在特定交互后才显示的组件特别有用。

```vue
<template>
  <div>
    <button @click="show = true">Show List</button>
    <LazyTheList v-if="show" />
  </div>
</template>

<script setup>
const show = ref(false)
</script>
```

在上面的例子中，`TheList` 组件及其依赖只有在 `show` 变为 `true` 时才会被加载。

## 客户端与服务端组件

### 仅客户端组件 (.client.vue)

如果一个组件只能在客户端运行（例如使用了浏览器特定的 API 如 `window` 或 `document`），你可以给文件加上 `.client.vue` 后缀。

- 文件: `components/Comments.client.vue`
- 使用: `<Comments />`

该组件只会在客户端挂载。在服务端渲染期间，它会被渲染为一个占位符。

### 仅服务端组件 (.server.vue)

**服务端组件**是 Nuxt 的一个高级特性，允许你在服务端渲染复杂的组件，而不需要向客户端发送任何 JavaScript。这对于渲染静态内容（如 Markdown 转换后的 HTML）非常有用。

- 文件: `components/Highlight.server.vue`
- 使用: `<Highlight />`

### `<ClientOnly>` 组件

如果你想在模板中包裹一段仅在客户端渲染的内容，可以使用 `<ClientOnly>` 组件。

```vue
<template>
  <ClientOnly>
    <CommentSection />
    <template #fallback>
      <p>Loading comments...</p>
    </template>
  </ClientOnly>
</template>
```

## 全局注册 (.global.vue)

默认情况下，Nuxt 组件是按需自动导入的。如果你希望某个组件在全局范围内注册（例如在动态 Markdown 内容中使用），可以添加 `.global.vue` 后缀。

- 文件: `components/BaseUtils.global.vue`

这样该组件就会被注册为全局组件，可以在任何地方使用，甚至是在不经过 Nuxt 编译的动态内容中。

## 配置扫描目录

如果你想将其他目录添加到组件扫描路径中，可以在 `nuxt.config.ts` 中配置 `components` 选项：

```ts
export default defineNuxtConfig({
  components: [
    // 等同于默认行为
    { path: '~/components' },
    // 添加一个自定义目录
    { path: '~/ui-components', prefix: 'UI' }
  ]
})
```

在这个配置下，`ui-components/Button.vue` 可以通过 `<UIButton />` 来使用。
