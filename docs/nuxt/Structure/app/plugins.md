# Plugins 目录

Nuxt 拥有一个插件系统，允许你在创建 Vue 应用程序时运行代码。这对于使用 Vue 插件（如 Vuetify、i18n 等）或向应用注入全局函数/常量非常有用。

Nuxt 会自动读取 `plugins/` 目录下的文件并加载它们。

## 创建插件

使用 `defineNuxtPlugin` 来定义插件：

```ts [plugins/my-plugin.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp 提供了对 Nuxt 运行时上下文的访问
  console.log("Plugin injected!");
});
```

## 自动注册 (Auto-registration)

你不需要在 `nuxt.config.ts` 中手动定义插件。Nuxt 会扫描 `plugins/` 目录并自动注册顶层文件。

只有 `plugins/` 目录顶层的文件会被自动注册。如果你有子目录，里面的文件不会被自动注册，除非你在 `plugins/index.ts` 中重新导出它们。

## 注册顺序

你可以通过在文件名前加上数字来控制插件的执行顺序：

```bash
plugins/
  ├── 1.init.ts
  └── 2.setup.ts
```

## 执行环境 (Loading Strategy)

你可以通过文件名后缀控制插件是在服务端还是客户端运行：

- `.client.ts`: 仅在客户端运行
- `.server.ts`: 仅在服务端运行
- `.ts`: 在两端都运行

例如：`plugins/analytics.client.ts`。

## 注入 Helper (Providing Helpers)

你可以通过从插件返回一个包含 `provide` 键的对象来向 Nuxt 应用注入 helper。

```ts [plugins/hello.ts]
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
    },
  };
});
```

使用注入的 helper：

```vue [app.vue]
<script setup>
// 在组件中
const { $hello } = useNuxtApp();
console.log($hello("world"));
</script>

<template>
  <div>
    <!-- 在模板中直接使用，自动带有 $ 前缀 -->
    {{ $hello("world") }}
  </div>
</template>
```

## 使用 Vue 插件

插件目录也是注册 Vue 插件的地方。

```ts [plugins/v-calendar.ts]
import VCalendar from "v-calendar";
import "v-calendar/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VCalendar, {});
});
```
