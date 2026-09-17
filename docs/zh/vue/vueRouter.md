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

## History Hash

Vue的打包结果在nginx

```
/usr/share/nginx/html/
├── index.html
├── assets/
│   ├── index-xxx.js
│   └── index-xxx.css
```

History（createWebHistory）

- URL形如`xxx.com/qulification`，没有`#`
- 刷新浏览器时把完整路径发给服务器，服务器收到`GET /qulification`
- 服务器时静态托管的（nginx/OSS/CDN）,目录下只有`index.html`，其他文件都不存在，会返回404错误
- 解决办法：服务端配置fallback，把所有位置路径重定向到`index.html`（nginx用`try_files`，OSS控制台开 [默认首页+404都指向index.html`]）

配置如下

```
location / {
    try_files $uri $uri/ /index.html;
}
```

Hash（createWebHashHistory）

- URL形如`xxx.com/#/qulification`，`#`后面叫hash片段
- 按HTTP规范，hash片段不会发送到服务器，服务器只收到`GET /`
- 服务器根目录本来就有`index.html`，正常返回
- 浏览器拿到`index.html`，Vue Router 读取`location.hash`在客户端切到`/qulification`路由，然后正常显示
- 不需要服务端配合
