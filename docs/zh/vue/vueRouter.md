# vue-router

## Installation

::: code-group

```bash [npm]
npm install vue-router
```

```bash [yarn]
yarn add vue-router
```

```bash [pnpm]
pnpm add vue-router
```

```bun [bun]
bun add vue-router
```

:::

## use

创建文件

```ts [router/index.ts]
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),

  // 定义路由规则
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/user',
      component: () => import('@/views/User.vue'),
    },
  ],
})

export default router
```

在main.ts注册

```ts [main.ts]
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
```

在App.vue中使用路由

```vue [App.vue]
<template>
  <div>
    <router-view></router-view>
  </div>
</template>
```

- push：产生浏览历史
- replace：不产生浏览历史
- back：返回上一页

## 动态路由

```ts
{
  path: '/user/:id',
  component: () => import('@/views/UserDetail.vue')
}
```

获取动态参数

```ts [userDeatil.vue]
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.params.id)
</script>
```

注意：这里`route.params.id`通常是字符串，如果需要数字

`const id = Number(route.params.id)`

## query

例如：`/user?id=100&name=zhangsan`

直接：

```ts
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.query.id)
console.log(route.query.name)
</script>
```

## 嵌套路由

后台管理系统很常见

例如：

```
/layout
   ├── /home
   ├── /user
   └── /order
```

路由：

```ts
{
  path: '/',
  component: () => import('@/layouts/Layout.vue'),

  children: [
    {
      path: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: 'user',
      component: () => import('@/views/User.vue')
    },
    {
      path: 'order',
      component: () => import('@/views/Order.vue')
    }
  ]
}
```

然后`Layout.vue`：

```vue
<template>
  <header>后台管理系统</header>

  <aside>菜单</aside>

  <main>
    <router-view />
  </main>
</template>
```

## 路由懒加载

```ts
component: () => import('@/views/User.vue')
```

## 路由守卫

如果你的项目需要鉴权，比如用户登录后才能访问`/user`，你就可以使用路由守卫。

```ts
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})
```

路由：

```ts
{
  path: '/user',
  component: () => import('@/views/User.vue'),
  meta: {
    requiresAuth: true
  }
}
```

## meta

可以给路由添加一些信息：

```ts
{
  path: '/user',
  component: () => import('@/views/User.vue'),

  meta: {
    title: '用户管理',
    requiresAuth: true,
    permission: 'user:list'
  }
}
```

```ts
const route = useRoute()

console.log(route.meta.title)
```

常用用途

```
meta
├── title
├── requiresAuth
├── permission
├── hidden
└── keepAlive
```

- hash 模式
- history 模式
- memory 模式

## createWebHashHistory

路由的记录依赖于 hash

- 跳转时，href = '/#/xxxxx'
- 浏览器前进退后的操作，window.addEventListener('hashchange', () => {})

## createWebHistory

路由的记录依赖于 浏览器原生记录

- 跳转时，history.pushState popState go forward back
- 浏览器前进退后的操作，window.addEventListener('popstate', () => {})

## createMemoryHistory

路由的记录记录在内存中，内存中定义了一个栈来存储历史记录

- 跳转，自定义
- 监听，不需要，因为不需要与外部路由状态同步的逻辑

# 路由跳转

两种方式

- router-link 组件
- 拿到实例，进行跳转

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goAbout = () => {
  // 压栈跳转
  router.push('/about')
  // 路由栈替换
  //   router.replace('/about')
}
</script>

<template>
  <div>
    home
    <router-link to="/about">about</router-link>
    <button @click="goAbout">go about</button>
  </div>
</template>

<style scoped></style>
```
