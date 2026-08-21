# Nuxt 3 项目知识点总结

> 基于黑马面经项目的 Nuxt 3 核心知识点整理

---

## 📚 目录

1. [基础配置](#1-基础配置)
2. [目录结构与约定](#2-目录结构与约定)
3. [路由系统](#3-路由系统)
4. [数据获取与 SSR](#4-数据获取与ssr)
5. [组合式函数 (Composables)](#5-组合式函数-composables)
6. [中间件系统](#6-中间件系统)
7. [状态管理](#7-状态管理)
8. [SEO 优化](#8-seo优化)
9. [内置组件](#9-内置组件)
10. [工具函数](#10-工具函数)

---

## 1. 基础配置

### 1.1 nuxt.config.ts

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@vant/nuxt'],
  postcss: {
    plugins: {
      'postcss-px-to-viewport': {
        viewportWidth: 375,
      },
    },
  },
})
```

**知识点：**

- `defineNuxtConfig()` - Nuxt 配置函数
- `modules` - 模块系统，集成第三方库
- `postcss` - PostCSS 配置，用于移动端适配
- `devtools` - 开发者工具配置

---

## 2. 目录结构与约定

### 2.1 标准目录结构

```
starter-3/
├── pages/              # 页面目录（自动生成路由）
├── layouts/            # 布局目录
├── components/         # 组件目录（自动导入）
├── composables/        # 组合式函数（自动导入）
├── middleware/         # 中间件目录
├── utils/              # 工具函数目录（自动导入）
├── types/              # TypeScript 类型定义
├── public/             # 静态资源目录
├── app.vue             # 应用入口
└── nuxt.config.ts      # Nuxt 配置文件
```

**约定：**

- `pages/` 下的文件自动生成路由
- `components/` 下的组件自动全局注册
- `composables/` 和 `utils/` 自动导入，无需手动 import

---

## 3. 路由系统

### 3.1 基于文件系统的路由

```
pages/
├── article.vue          → /article
├── login.vue           → /login
├── user.vue            → /user
├── collect.vue         → /collect
└── detail/
    └── [id].vue        → /detail/:id
```

### 3.2 动态路由

**文件命名：** `[id].vue` 表示动态参数

```vue
<!-- pages/detail/[id].vue -->
<script setup lang="ts">
const { params } = useRoute()
console.log(params.id) // 获取动态参数
</script>
```

**访问示例：**

- `/detail/11` → `params.id = '11'`
- `/detail/123` → `params.id = '123'`

### 3.3 路由导航

```typescript
// 编程式导航
navigateTo('/article')
navigateTo('/detail/11')
navigateTo('/login', { replace: true })

// 返回上一页
$router.back()
```

### 3.4 布局系统

```vue
<!-- layouts/tabbar.vue -->
<template>
  <div class="layout-page">
    <slot />
    <van-tabbar route>
      <van-tabbar-item to="/article" icon="notes-o">面经</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<!-- 页面中使用 -->
<template>
  <NuxtLayout name="tabbar">
    <div>页面内容</div>
  </NuxtLayout>
</template>
```

---

## 4. 数据获取与 SSR

### 4.1 useFetch - SSR 友好的数据请求

```typescript
// ⭐ 核心：在 <script setup> 顶层使用 await
const { data, error } = await useFetch('/api/articles', {
  baseURL: 'https://api.example.com',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  params: {
    page: 1,
    pageSize: 10,
  },
})
```

**特点：**

- ✅ 服务端和客户端都会执行
- ✅ 服务端渲染时等待数据返回
- ✅ 自动处理响应式数据
- ✅ 支持参数监听（watch）

### 4.2 重要：await 的使用

```typescript
// ❌ 错误：不等待数据，SSR 时页面为空
const getList = async () => {
  const res = await useFetch('/api/list')
  list.value = res.data.value
}
getList() // 直接调用，不等待

// ✅ 正确：等待数据加载完成
const getList = async () => {
  const res = await useFetch('/api/list')
  list.value = res.data.value
}
await getList() // 使用 await 等待
```

**关键规则：**

> 在 Nuxt 3 的 `<script setup>` 中，若需在服务端渲染时正确返回数据，必须使用 `await` 等待异步函数执行完成。

### 4.3 watch 选项的使用

```typescript
const pageParams = ref({ page: 1, pageSize: 10 })

// 默认情况：useFetch 会监听 params 变化，自动重新请求
const { data } = await useFetch('/api/list', {
  params: pageParams,
})

// 禁用监听：手动控制请求时机
const { data } = await useFetch('/api/list', {
  params: pageParams,
  watch: false, // 不监听参数变化
})
```

---

## 5. 组合式函数 (Composables)

### 5.1 自定义 Composables

**文件位置：** `composables/useRequest.ts`

```typescript
import type { UseFetchOptions } from '#app'

export const useRequest = async <T = any>(
  url: string,
  options?: UseFetchOptions<any>
) => {
  const { data, error } = await useFetch<any>(url, {
    baseURL: 'https://interview-api-t.itheima.net',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  })

  if (error.value) {
    return Promise.reject(error.value)
  }
  return data.value.data as T
}
```

**使用：**

```typescript
// 自动导入，无需 import
const article = await useRequest<ArticleDetail>('/admin/interview/show', {
  params: { id: params.id },
})
```

**特点：**

- ✅ 自动导入，无需手动 import
- ✅ 封装通用逻辑（如请求头、错误处理）
- ✅ 支持 TypeScript 泛型

---

## 6. 中间件系统

### 6.1 全局中间件

**文件命名：** `middleware/router.global.ts`（`.global` 表示全局）

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  // 重定向
  if (to.path === '/') {
    return navigateTo('/article')
  }

  // 权限验证
  const token = getToken()
  const whiteList = ['/login', '/register']

  // 白名单判断：支持动态路由
  const isInWhiteList =
    whiteList.includes(to.path) || to.path.startsWith('/detail/')

  if (!token && !isInWhiteList) {
    return navigateTo('/login')
  }
})
```

**知识点：**

- `defineNuxtRouteMiddleware` - 定义中间件
- 全局中间件：文件名包含 `.global`
- 支持路由拦截、重定向、权限验证
- `to.path.startsWith()` - 动态路由白名单处理

---

## 7. 状态管理

### 7.1 useCookie - SSR 友好的状态存储

**文件位置：** `utils/token.ts`

```typescript
const KEY = 'hmmj-token'

// 获取
export const getToken = () => {
  return useCookie(KEY).value
}

// 设置（14天有效期）
export const setToken = (newToken: string) => {
  useCookie(KEY, { maxAge: 60 * 60 * 24 * 14 }).value = newToken
}

// 删除
export const delToken = () => {
  useCookie(KEY).value = undefined
}
```

**特点：**

- ✅ 服务端和客户端通用
- ✅ 自动同步到 Cookie
- ✅ 支持过期时间配置
- ✅ 返回响应式 ref 对象

**对比：**

- ❌ `localStorage` - 仅客户端，SSR 报错
- ✅ `useCookie` - 服务端和客户端都可用

---

## 8. SEO 优化

### 8.1 useSeoMeta - 动态设置 Meta 标签

```typescript
// app.vue - 全局 SEO 配置
useSeoMeta({
  titleTemplate: (title) => {
    return title
      ? `${title} - 黑马面经`
      : '黑马面经 - 找工作神器|笔试题库|面试经验'
  },
  description: '求职之前，先上黑马面经...',
  keywords: '黑马面经, 找工作神器, 笔试题库, 面试经验',
})

// 页面级别 - 动态设置标题
useSeoMeta({
  title: `黑马面经 - ${article.stem}`,
})
```

**生成结果：**

```html
<head>
  <title>具体文章标题 - 黑马面经</title>
  <meta name="description" content="..." />
  <meta name="keywords" content="..." />
</head>
```

---

## 9. 内置组件

### 9.1 NuxtPage

```vue
<!-- app.vue -->
<template>
  <div>
    <NuxtPage :keepalive="{ max: 10 }" />
  </div>
</template>
```

**作用：** 相当于 Vue Router 的 `<router-view>`

**属性：**

- `keepalive` - 缓存页面组件
- `max` - 最大缓存数量

### 9.2 NuxtLayout

```vue
<template>
  <NuxtLayout name="tabbar">
    <div>页面内容</div>
  </NuxtLayout>
</template>
```

**作用：** 指定使用哪个布局

### 9.3 NuxtLink

```vue
<NuxtLink to="/login">去登录</NuxtLink>
<NuxtLink class="link" to="/register">注册账号</NuxtLink>
```

**特点：**

- 自动优化（预加载、智能预取）
- 支持所有 Vue Router 的属性

---

## 10. 工具函数

### 10.1 路由相关

```typescript
// 导航到指定路由
navigateTo('/article')
navigateTo({ path: '/detail', query: { id: 11 } })

// 替换当前路由（不留历史记录）
navigateTo('/login', { replace: true })

// 获取当前路由信息
const route = useRoute()
console.log(route.params.id)
console.log(route.query.page)

// 获取路由实例
const router = useRouter()
router.back()
router.push('/article')
```

### 10.2 响应式状态

```typescript
import { ref, computed, reactive } from 'vue'

const count = ref(0)
const list = ref<ArticleItem[]>([])
const form = reactive({ username: '', password: '' })
const doubleCount = computed(() => count.value * 2)
```

### 10.3 自动导入

**无需 import 即可使用：**

- Vue 相关：`ref`, `computed`, `reactive`, `watch`, `onMounted` 等
- Nuxt 内置：`useFetch`, `useRoute`, `useRouter`, `navigateTo`, `useCookie` 等
- `composables/` 目录下的函数
- `utils/` 目录下的工具函数

---

## 11. TypeScript 支持

### 11.1 类型定义

```typescript
// types/article.d.ts
export type ArticleItem = {
  id: string
  avatar: string
  content: string
  createdAt: string
  creator: string
  likeCount: number
  stem: string
  views: number
}

export type ArticleDetail = {
  avatar?: string
  collectFlag?: number
  content?: string
  // ...
}
```

### 11.2 泛型使用

```typescript
// 定义返回类型
const article = await useRequest<ArticleDetail>('/api/show/11')

// 数组类型
const list = ref<ArticleItem[]>([])

// 对象类型
type UserInfo = {
  avatar?: string
  username?: string
}
const userInfo = await useRequest<UserInfo>('/user/info')
```

---

## 12. 实战技巧

### 12.1 列表分页加载

```typescript
const list = ref<ArticleItem[]>([])
const loading = ref(false)
const finished = ref(false)
const pageParams = ref({ page: 1, pageSize: 10 })

const getList = async () => {
  const res = await useRequest('/api/list', {
    params: pageParams.value,
    watch: false, // 关键：禁用自动监听
  })

  loading.value = false
  list.value.push(...res.rows)
  pageParams.value.page++

  if (pageParams.value.page >= res.pageTotal) {
    finished.value = true
  }
}

await getList() // 首次加载用 await
```

### 12.2 动态路由参数处理

```typescript
// 获取路由参数
const { params } = useRoute()

// 确保 id 是字符串
const id = String(params.id)

// 用于请求
const article = await useRequest(`/api/show/${id}`)
```

### 12.3 退出登录流程

```typescript
const logout = async () => {
  delToken() // 1. 删除 token
  showSuccessToast('退出成功') // 2. 提示
  await navigateTo('/login', { replace: true }) // 3. 跳转（不留历史）
}
```

---

## 13. 常见问题

### ❓ 为什么刷新后数据不显示？

**原因：** `<script setup>` 中没有使用 `await` 等待数据加载

```typescript
// ❌ 错误
const getList = async () => {
  /* ... */
}
getList()

// ✅ 正确
const getList = async () => {
  /* ... */
}
await getList()
```

### ❓ localStorage 报错？

**原因：** 服务端没有 `localStorage`

**解决：** 使用 `useCookie` 代替

```typescript
// ❌ 错误
localStorage.setItem('token', token)

// ✅ 正确
useCookie('token').value = token
```

### ❓ params 还是 query？

**区别：**

- `params` - URL 路径参数：`/detail/11` → `params.id = '11'`
- `query` - URL 查询参数：`/article?page=1` → `query.page = '1'`

**最佳实践：**

- 资源标识用 `params`（如用户 ID、文章 ID）
- 可选参数用 `query`（如分页、筛选）

### ❓ 组件自动导入不生效？

**检查：**

1. 组件是否在 `components/` 目录下
2. 组件文件名是否符合规范（PascalCase）
3. 重启开发服务器

---

## 14. 核心概念总结

| 概念       | 说明                       | 示例                             |
| ---------- | -------------------------- | -------------------------------- |
| 约定式路由 | 基于文件系统自动生成路由   | `pages/article.vue` → `/article` |
| 动态路由   | 使用 `[param]` 定义参数    | `[id].vue` → `params.id`         |
| SSR        | 服务端渲染，需用 `await`   | `await useFetch()`               |
| 自动导入   | composables/utils 自动可用 | 无需 `import useRequest`         |
| useCookie  | SSR 友好的状态存储         | 替代 `localStorage`              |
| 中间件     | 路由守卫，权限控制         | `.global.ts` 全局执行            |
| useSeoMeta | 动态 SEO 优化              | 设置 title、description          |
| NuxtLayout | 布局系统                   | 共享页面结构                     |
