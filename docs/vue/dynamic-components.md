# 动态组件 (Dynamic Components)

在 Vue 中，我们经常需要在不同的组件之间进行切换，比如在一个多标签页 (Tab) 界面中。Vue 提供了一个 `<component>` 元素，专门用于实现这种场景。

## 基本用法

通过使用 Vue 的 `<component>` 元素和特殊的 `is` attribute，可以在不同组件之间进行动态切换：

```vue
<component :is="currentTabComponent"></component>
```

`is` 属性的值可以是：

- 被注册的组件名（字符串）
- 导入的组件对象

## 完整示例

下面是一个实现 Tab 切换的完整示例。

```vue [app.vue]
<script setup>
import { ref } from 'vue'
// 假设这些组件已经定义
import Home from './Home.vue'
import Posts from './Posts.vue'
import Archive from './Archive.vue'

const currentTab = ref('Home')

const tabs = {
  Home,
  Posts,
  Archive,
}
</script>

<template>
  <div class="demo">
    <button
      v-for="(_, tab) in tabs"
      :key="tab"
      :class="['tab-button', { active: currentTab === tab }]"
      @click="currentTab = tab"
    >
      {{ tab }}
    </button>

    <!-- 动态组件渲染位置 -->
    <component :is="tabs[currentTab]" class="tab"></component>
  </div>
</template>

<style>
.demo {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}

.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}

.tab-button:hover {
  background: #e0e0e0;
}

.tab-button.active {
  background: #e0e0e0;
}

.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
```

### 组件代码

::: code-group

```vue [Home.vue]
<template>
  <div class="tab">Home component</div>
</template>
```

```vue [Posts.vue]
<template>
  <div class="tab">Posts component</div>
</template>
```

```vue [Archive.vue]
<template>
  <div class="tab">Archive component</div>
</template>
```

:::

## 保持存活 (KeepAlive)

默认情况下，当一个组件被切换掉时，它会被卸载（销毁）。这意味着如果用户在某个组件中输入了内容，切换走再切换回来，内容会丢失。

如果你想让组件在切换时保持状态（不被销毁），可以使用 `<KeepAlive>` 组件包裹动态组件：

```vue
<KeepAlive>
  <component :is="currentTabComponent"></component>
</KeepAlive>
```

这样，失活的组件会被缓存起来，而不是被销毁。
