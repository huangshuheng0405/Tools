# Nuxt 3 Project Knowledge Points Summary

> Summary of core Nuxt 3 knowledge points based on the "Heima Interview" project.

---

## 📚 Table of Contents

1. [Basic Configuration](#1-basic-configuration)
2. [Directory Structure and Conventions](#2-directory-structure-and-conventions)
3. [Routing System](#3-routing-system)
4. [Data Fetching and SSR](#4-data-fetching-and-ssr)
5. [Composables](#5-composables)
6. [Middleware System](#6-middleware-system)
7. [State Management](#7-state-management)
8. [SEO Optimization](#8-seo-optimization)
9. [Built-in Components](#9-built-in-components)
10. [Utility Functions](#10-utility-functions)

---

## 1. Basic Configuration

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

**Key Points:**

- `defineNuxtConfig()` - Nuxt configuration function.
- `modules` - Module system for integrating third-party libraries.
- `postcss` - PostCSS configuration for mobile adaptation.
- `devtools` - Developer tools configuration.

---

## 2. Directory Structure and Conventions

### 2.1 Standard Directory Structure

```
starter-3/
├── pages/              # Pages directory (auto-generates routes)
├── layouts/            # Layouts directory
├── components/         # Components directory (auto-import)
├── composables/        # Composables directory (auto-import)
├── middleware/         # Middleware directory
├── utils/              # Utility functions directory (auto-import)
├── types/              # TypeScript type definitions
├── public/             # Static assets directory
├── app.vue             # Application entry point
└── nuxt.config.ts      # Nuxt configuration file
```

**Conventions:**

- Files under `pages/` automatically generate routes.
- Components under `components/` are automatically registered globally.
- `composables/` and `utils/` are auto-imported, no manual import required.

---

## 3. Routing System

### 3.1 File-based Routing

```
pages/
├── article.vue          → /article
├── login.vue           → /login
├── user.vue            → /user
├── collect.vue         → /collect
└── detail/
    └── [id].vue        → /detail/:id
```

### 3.2 Dynamic Routing

**File Naming:** `[id].vue` represents a dynamic parameter.

```vue
<!-- pages/detail/[id].vue -->
<script setup lang="ts">
const { params } = useRoute()
console.log(params.id) // Get dynamic parameter
</script>
```

**Access Examples:**

- `/detail/11` → `params.id = '11'`
- `/detail/123` → `params.id = '123'`

### 3.3 Route Navigation

```typescript
// Programmatic Navigation
navigateTo('/article')
navigateTo('/detail/11')
navigateTo('/login', { replace: true })

// Go back
$router.back()
```

### 3.4 Layout System

```vue
<!-- layouts/tabbar.vue -->
<template>
  <div class="layout-page">
    <slot />
    <van-tabbar route>
      <van-tabbar-item to="/article" icon="notes-o">Articles</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<!-- Usage in a page -->
<template>
  <NuxtLayout name="tabbar">
    <div>Page Content</div>
  </NuxtLayout>
</template>
```

---

## 4. Data Fetching and SSR

### 4.1 useFetch - SSR-friendly Data Fetching

```typescript
// ⭐ Core: Use await at the top level of <script setup>
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

**Features:**

- ✅ Executes on both server and client.
- ✅ Waits for data to return during server-side rendering.
- ✅ Automatically handles reactive data.
- ✅ Supports parameter watching (`watch`).

### 4.2 Important: Using await

```typescript
// ❌ Incorrect: Doesn't wait for data, page is empty during SSR
const getList = async () => {
  const res = await useFetch('/api/list')
  list.value = res.data.value
}
getList() // Called directly, no wait

// ✅ Correct: Waits for data to load
const getList = async () => {
  const res = await useFetch('/api/list')
  list.value = res.data.value
}
await getList() // Use await to wait
```

**Crucial Rule:**

> In Nuxt 3's `<script setup>`, if you need to correctly return data during server-side rendering, you must use `await` to wait for asynchronous function execution to complete.

---

## 5. Composables

### 5.1 Custom Composables

**File Location:** `composables/useRequest.ts`

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

**Usage:**

```typescript
// Auto-imported, no import needed
const article = await useRequest<ArticleDetail>('/admin/interview/show', {
  params: { id: params.id },
})
```

---

## 6. Middleware System

### 6.1 Global Middleware

**File Naming:** `middleware/router.global.ts` (`.global` indicates global execution)

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  // Redirection
  if (to.path === '/') {
    return navigateTo('/article')
  }

  // Authorization check
  const token = getToken()
  const whiteList = ['/login', '/register']

  // White-list check: supports dynamic routes
  const isInWhiteList =
    whiteList.includes(to.path) || to.path.startsWith('/detail/')

  if (!token && !isInWhiteList) {
    return navigateTo('/login')
  }
})
```

---

## 7. State Management

### 7.1 useCookie - SSR-friendly State Storage

**File Location:** `utils/token.ts`

```typescript
const KEY = 'hmmj-token'

// Get
export const getToken = () => {
  return useCookie(KEY).value
}

// Set (14-day validity)
export const setToken = (newToken: string) => {
  useCookie(KEY, { maxAge: 60 * 60 * 24 * 14 }).value = newToken
}

// Delete
export const delToken = () => {
  useCookie(KEY).value = undefined
}
```

**Features:**

- ✅ Works on both server and client.
- ✅ Automatically syncs to Cookies.
- ✅ Returns a reactive `ref` object.

---

## 8. SEO Optimization

### 8.1 useSeoMeta - Dynamically Setting Meta Tags

```typescript
// app.vue - Global SEO Configuration
useSeoMeta({
  titleTemplate: (title) => {
    return title
      ? `${title} - Heima Interview`
      : 'Heima Interview - Job Hunting Tool|Test Bank|Interview Experience'
  },
  description: 'Before hunting for a job, go to Heima Interview...',
  keywords: 'Heima Interview, Job Hunting Tool, Test Bank, Interview Experience',
})
```

---

## 9. Built-in Components

### 9.1 NuxtPage

Equivalent to Vue Router's `<router-view>`.

### 9.2 NuxtLayout

Specifies which layout to use.

### 9.3 NuxtLink

Automatic optimization (pre-fetching, smart pre-fetching).

---

## 10. Utility Functions

### 10.1 Routing Related

- `navigateTo('/article')`
- `const route = useRoute()`
- `const router = useRouter()`

### 10.2 Reactive State

Auto-imported `ref`, `computed`, `reactive` from Vue.

---

## 11. TypeScript Support

Nuxt provides excellent TS support with auto-generated types in `.nuxt/` directory.

---

## 12. Practical Tips

### 12.1 Pagination Loading

When loading list data, ensure you handle server-side rendering by using `await` for the initial fetch.

### 12.2 Exit Login Flow

1. Delete token (`delToken()`).
2. Show notification.
3. Redirect to login using `navigateTo('/login', { replace: true })`.

---

## 13. FAQ

### ❓ Why is data not showing after refresh?
**Reason:** `await` was not used in `<script setup>` for data fetching.

### ❓ localStorage error?
**Reason:** `localStorage` is not available on the server. Use `useCookie` instead.

---

## 14. Core Concepts Summary

| Concept | Description | Example |
| --- | --- | --- |
| Convention Routing | Auto-generated routes based on file system | `pages/article.vue` → `/article` |
| Dynamic Routing | Parameters defined with `[param]` | `[id].vue` → `params.id` |
| SSR | Server-side rendering, requires `await` | `await useFetch()` |
| Auto Import | Composables/utils available globally | No `import` needed |
| useCookie | SSR-friendly state storage | Replaces `localStorage` |
