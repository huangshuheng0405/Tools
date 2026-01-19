# Pages 目录

Nuxt 提供了一个可选的 `pages/` 目录，基于文件的路由系统。如果你创建了这个目录，Nuxt 会自动根据文件结构生成 Vue Router 配置。

## 基础路由

Nuxt 会根据文件名自动生成路由路径。

- `pages/index.vue` -> `/`
- `pages/about.vue` -> `/about`
- `pages/contact.vue` -> `/contact`

```vue [pages/about.vue]
<template>
  <h1>About Page</h1>
</template>
```

## 动态路由

使用方括号 `[]` 包裹文件名或目录名来创建动态路由。

- `pages/users/[id].vue` -> `/users/1`, `/users/abc`

在页面中可以通过 `useRoute()` 获取参数：

```vue [pages/users/[id].vue]
<script setup>
const route = useRoute()
console.log(route.params.id)
</script>

<template>
  <div>User ID: {{ route.params.id }}</div>
</template>
```

## 捕获所有路由 (Catch-all)

使用 `[...slug].vue` 语法可以匹配所有嵌套路径。

- `pages/posts/[...slug].vue` -> `/posts/a`, `/posts/a/b`, `/posts/a/b/c`

```vue [pages/posts/[...slug].vue]
<script setup>
const route = useRoute()
</script>

<template>
  <p>Path: {{ route.params.slug }}</p>
</template>
```

## 嵌套路由

你可以通过创建一个与目录同名的 `.vue` 文件来定义嵌套路由。父组件需要使用 `<NuxtPage />` 来渲染子路由。

文件结构：

```
pages/
|-- parent/
|   |-- child.vue
|-- parent.vue
```

```vue [pages/parent.vue]
<template>
  <div>
    <h1>Parent</h1>
    <NuxtPage />
  </div>
</template>
```

访问 `/parent/child` 时，`child.vue` 的内容会渲染在 `parent.vue` 的 `<NuxtPage />` 位置。

## 页面元数据 (Page Meta)

你可以使用 `definePageMeta` 宏来为页面定义元数据，如布局、中间件等。

```vue [pages/login.vue]
<script setup>
definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>
```

## 导航

使用 `<NuxtLink>` 组件在页面之间导航。它在客户端导航时表现为 SPA，在 SEO 方面表现为 `<a>` 标签。

```vue [app.vue]
<template>
  <NuxtLink to="/about">Go to About</NuxtLink>
</template>
```

## 只有一个页面？

如果你不需要路由，或者应用很简单，你其实不需要 `pages/` 目录。你可以只使用 `app.vue` 作为入口，这在构建落地页或简单的单页应用时很有用。
