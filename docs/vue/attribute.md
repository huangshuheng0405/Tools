

# 透传Attribute

透传指的是传递给一个组件，却没有被该组件声明为`props`或`emits`的attribute或者`v-on`的事件监听器。常见的是`class`、`style`、`id`

## 示例

假设你封装了一个名为 `MyButton.vue` 的基础按钮组件：

```vue
<!-- MyButton.vue (子组件) -->
<template>
  <button class="base-btn">点击我</button>
</template>
```

父组件在使用时，加了一大堆样式和点击事件，而你并没有在子组件里写任何 props：

```vue
<!-- Parent.vue (父组件) -->
<template>
  <MyButton 
    class="large-btn" 
    style="margin-top: 10px;" 
    id="submit-btn"
    @click="handleClick" 
  />
</template>
```

最终渲染的DOM结果是

```vue
<button 
  class="base-btn large-btn" 
  style="margin-top: 10px;" 
  id="submit-btn"
>
  点击我
</button>
```

### 对`class`和`style`的合并

`class` 和 `style` 如果两边都有，Vue 会极其智能地将它们**合并**（如上面的 `base-btn large-btn`）。

### `v-on`监听器继承

`click` 监听器会被添加到 `<MyButton>` 的根元素，即那个原生的 `<button>` 元素之上。当原生的 `<button>` 被点击，会触发父组件的 `onClick` 方法。同样的，如果原生 `button` 元素自身也通过 `v-on` 绑定了一个事件监听器，则这个监听器和从父组件继承的监听器都会被触发。

## 禁用继承

如果你**不想要**一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```

这些透传进来的attribute可以在模板表达式中直接使用`$attrs`访问到

```vue
<span>Fallthrough attribute: {{ $attrs }}</span>
```

这个`$attrs`对象包含了出组件声明的`props`和`emits`之外的所有其他attribute，例如`class`、`style`、`v-on`监听器等

有几个点需要注意

- 和 props 有所不同，透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 `foo-bar` 这样的一个 attribute 需要通过 `$attrs['foo-bar']` 来访问。
- 像 `@click` 这样的一个 `v-on` 事件监听器将在此对象下被暴露为一个函数 `$attrs.onClick`。

有时候我们可能为了样式，需要在 `<button>` 元素外包装一层 `<div>`：

```vue
<div class="btn-wrapper">
  <button class="btn">Click Me</button>
</div>
```

我们想要所有像 `class` 和 `v-on` 监听器这样的透传 attribute 都应用在内部的 `<button>` 上而不是外层的 `<div>` 上。我们可以通过设定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 来实现：

```vue
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

::: tip

没有参数的`v-bind`会将一个对象的所有属性都作为 attribute 应用到目标元素上。

:::

## 多根节点的Attribute继承

和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。如果 `$attrs` 没有被显式绑定，将会抛出一个运行时警告。

```vue
<CustomLayout id="custom-layout" @click="changeValue" />
```

如果 `<CustomLayout>` 有下面这样的多根节点模板，由于 Vue 不知道要将 attribute 透传到哪里，所以会抛出一个警告。

```vue
<header>...</header>
<main>...</main>
<footer>...</footer>
```

如果 `$attrs` 被显式绑定，则不会有警告：

```vue
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## 在 JavaScript 中访问 Attribute

如果需要，你可以在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute：

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

