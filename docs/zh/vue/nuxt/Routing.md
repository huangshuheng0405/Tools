# Nuxt 3 路由系统（深度进阶）

Nuxt 3 的路由系统基于 [vue-router](https://router.vuejs.org/)，通过文件系统约定自动配置。

## 1. 基础路由约定

Nuxt 自动扫描 `pages/` 目录：

- `pages/index.vue` -> `/`
- `pages/about.vue` -> `/about`
- `pages/settings/profile.vue` -> `/settings/profile`

---

## 2. 动态路由全解析

### 2.1 基础动态参数

文件名使用方括号 `[id].vue`。

- 路径：`/users/123`
- 获取：`useRoute().params.id`

### 2.2 多参数路由

你可以在路径中组合多个参数：

- 结构：`pages/shop/[category]/[id].vue`
- 路径：`/shop/shoes/123` -> `{ category: 'shoes', id: '123' }`

### 2.3 可选参数（Nuxt 3 特有）

使用双括号 `[[id]].vue`。

- `pages/archive/[[page]].vue`
- 匹配 `/archive` (page 为空) 和 `/archive/1` (page 为 '1')。

### 2.4 全匹配（Catch-all）

使用 `[...slug].vue` 捕获剩余路径。

- `pages/docs/[...slug].vue` 匹配 `/docs/intro` 和 `/docs/guide/install/linux`。

---

## 3. 嵌套路由与视图

嵌套路由允许你在父页面中保留一部分 UI（如侧边栏），只更新子视图。

### 目录结构要求

1. 创建父页面文件 `parent.vue`。
2. 创建同名目录 `parent/`。
3. 在 `parent/` 中放置子页面（如 `child.vue`）。

### 视图渲染

在 `parent.vue` 中必须使用 `<NuxtPage />`：

```vue
<template>
  <div class="layout">
    <aside>侧边栏导航</aside>
    <main>
      <!-- 子页面内容将插入此处 -->
      <NuxtPage />
    </main>
  </div>
</template>
```

---

## 4. 页面元数据 `definePageMeta`

这是 Nuxt 3 最强大的功能之一，用于在页面级别配置路由行为。

```vue
<script setup>
definePageMeta({
  // 1. 指定布局
  layout: 'custom',
  // 2. 路由别名 (可以有多个)
  alias: ['/my-profile', '/account'],
  // 3. 路由守卫
  middleware: ['auth'],
  // 4. 自定义数据 (可通过 route.meta 访问)
  title: '用户设置',
  // 5. 页面转场动画
  pageTransition: { name: 'fade' },
  // 6. 保持页面状态
  keepalive: true
})
</script>
```

---

## 5. 导航与链接

### 5.1 `<NuxtLink>`

- **智能预取**：当链接进入视口时，Nuxt 会自动下载该页面的代码（仅限 JS，不包括数据）。
- **外部链接**：自动检测 `http` 或 `mailto:`，渲染为普通的 `<a>` 标签。
- **活动类名**：自动应用 `.router-link-active`。

### 5.2 `navigateTo` (编程导航)

推荐在 `setup` 或 `methods` 中使用。

```typescript
// 简单跳转
await navigateTo('/dashboard')

// 带参数和历史记录处理
await navigateTo(
  {
    path: '/search',
    query: { q: 'nuxt' }
  },
  {
    replace: true, // 替换当前历史
    external: false // 是否为外部链接
  }
)
```

---

## 6. 路由中间件 (Navigation Guards)

### 执行顺序

1. `global` 中间件（按文件名首字母排序）。
2. 页面内 `definePageMeta` 定义的顺序。

### 返回值规范

- 无返回值：继续导航。
- `navigateTo('/')`：重定向到新路径。
- `abortNavigation()`：停止当前导航。
- `abortNavigation(error)`：停止并抛出错误。

---

## 7. 路由验证与错误处理

使用 `validate` 钩子可以防止非法的参数进入页面。

```vue
<script setup>
definePageMeta({
  validate: async (route) => {
    const isValid = /^\d+$/.test(route.params.id)
    if (!isValid) {
      // 抛出 404 错误
      throw createError({ statusCode: 404, statusMessage: '用户不存在' })
    }
    return true
  }
})
</script>
```

---

## 8. 页面转场动画

在 `nuxt.config.ts` 中开启全局配置：

```typescript
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
```

在 `app.vue` 或全局 CSS 中定义样式：

```css
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
```

```

```
