# 路由中间件 (Middleware)

Nuxt 提供了一个可定制的**路由中间件**框架，允许你在导航到特定路由之前运行代码。这对于权限验证（如检查用户是否登录）、重定向、日志记录或修改页面元数据非常有用。

Nuxt 的中间件运行在 Vue Router 的导航守卫之上。

## 中间件类型

Nuxt 中有三种类型的路由中间件：

1.  **匿名/内联中间件**: 直接在页面组件中使用 `definePageMeta` 定义。
2.  **命名中间件**: 放置在 `middleware/` 目录下，并在页面中异步导入。
3.  **全局中间件**: 放置在 `middleware/` 目录下，并以 `.global.ts` 或 `.global.js` 结尾，会对**每次**路由变更运行。

## 1. 命名中间件

在 `middleware/` 目录下创建文件，文件名即为中间件名称。

```ts [middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  // isAuthenticated() 是一个示例组合式函数
  if (isAuthenticated() === false) {
    return navigateTo('/login')
  }
})
```

在页面中使用该中间件：

```vue [pages/dashboard.vue]
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

你也可以传入一个数组来应用多个中间件：

```ts
definePageMeta({
  middleware: ['auth', 'other-middleware']
})
```

## 2. 全局中间件

如果你希望某个中间件在**每次**路由切换时都执行，只需在文件名后加上 `.global` 后缀。

```ts [middleware/analytics.global.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('导航到:', to.path)
})
```

全局中间件按文件名的字母顺序执行（除非使用前缀如 `01.setup.global.ts` 来控制顺序）。

## 3. 内联中间件

对于简单的、特定于某个页面的逻辑，可以直接在页面内定义。

```vue [pages/secret.vue]
<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      // 自定义内联逻辑
      if (to.params.id === '1') {
        return abortNavigation()
      }
    }
  ]
})
</script>
```

## 中间件返回值

中间件函数可以返回以下值来控制导航：

- **无返回值 (undefined/void)**: 批准导航，继续执行下一个中间件。
- **`navigateTo(route)`**: 重定向到给定的路径。
- **`abortNavigation(error)`**: 终止导航。可选地传入一个错误信息。

### 示例：重定向

```ts [middleware/redirect.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
```

## 执行顺序

中间件的执行顺序如下：

1.  **全局中间件** (按字母顺序或数字前缀排序)
2.  **页面定义的中间件** (按数组顺序)

## 动态添加中间件

你可以使用 `addRouteMiddleware()` 辅助函数在插件或页面中动态添加中间件。

```ts [plugins/middleware.ts]
export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    'global-test',
    () => {
      console.log('这是一个动态添加的全局中间件')
    },
    { global: true }
  )
})
```

## 服务端与客户端

默认情况下，中间件会在服务端渲染（首次加载）和客户端导航时运行。

如果你只想在特定环境运行，可以添加逻辑判断：

```ts [middleware/client-only.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return
  // 仅在客户端执行的逻辑
  console.log('Client navigation')
})
```
