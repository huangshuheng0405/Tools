# Nuxt 3 布局系统 (Layouts)

Nuxt 提供了一个强大的布局系统，允许你将通用的 UI 结构（如页眉、页脚、侧边栏）提取到可重用的布局组件中。

## 1. 启用布局

要使用布局系统，首先需要在项目根目录下创建一个 `layouts/` 目录。Nuxt 会自动导入该目录下的所有组件。

布局组件必须包含 `<slot />` 插槽，用于渲染页面内容。

## 2. 默认布局

如果你的项目中存在 `layouts/default.vue`，它将被用作所有页面的默认布局。

```vue [layouts/default.vue]
<template>
  <div class="default-layout">
    <header>
      <nav>通用导航栏</nav>
    </header>

    <main>
      <!-- 页面内容将渲染在这里 -->
      <slot />
    </main>

    <footer>通用页脚</footer>
  </div>
</template>
```

在 `app.vue` 中使用 `<NuxtLayout>` 包裹 `<NuxtPage>`：

```vue [app.vue]
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## 3. 自定义布局

你可以创建具名布局来服务于特定的页面，例如登录页或管理后台。

### 创建自定义布局

创建一个名为 `layouts/custom.vue` 的文件：

```vue [layouts/custom.vue]
<template>
  <div class="custom-layout">
    <p>这是自定义布局的特定头部</p>
    <slot />
  </div>
</template>
```

### 在页面中使用

在页面组件中，通过 `definePageMeta` 宏来指定布局：

```vue [pages/about.vue]
<script setup lang="ts">
definePageMeta({
  layout: 'custom'
})
</script>

<template>
  <div>
    <h1>关于页面</h1>
    <p>这个页面使用 custom 布局</p>
  </div>
</template>
```

如果你想完全禁用布局，可以设置 `layout: false`：

```vue
<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
```

## 4. 动态更改布局

你可以使用 `setPageLayout` 组合式函数在运行时动态更改布局。

```vue
<script setup lang="ts">
function enableCustomLayout() {
  setPageLayout('custom')
}
</script>

<template>
  <div>
    <button @click="enableCustomLayout">切换到 Custom 布局</button>
  </div>
</template>
```

## 5. 配合 `<NuxtLayout>` 使用

在某些场景下，你可能希望手动控制布局的渲染位置，或者在 `app.vue` 之外使用布局。

```vue [pages/login.vue]
<script setup lang="ts">
definePageMeta({
  layout: false // 禁用默认布局机制
})
</script>

<template>
  <NuxtLayout name="auth">
    <div class="login-form">
      <h1>登录</h1>
      <!-- 登录表单 -->
    </div>
  </NuxtLayout>
</template>
```

这种方式允许你将布局作为普通组件使用，并向其传递 props。

## 6. 常见应用场景

- **Default Layout**: 包含顶部导航和底部版权信息的标准页面。
- **Auth Layout**: 登录/注册页，通常没有导航栏，背景简洁。
- **Admin Layout**: 带有侧边栏和顶部面包屑的后台管理界面。
- **Empty Layout**: 用于 404 页面或全屏展示页。

## 参考文档

- [Nuxt 3 Docs - Layouts](https://nuxt.com/docs/guide/directory-structure/layouts)
