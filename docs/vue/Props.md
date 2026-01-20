# Props (组件属性)

Props 是 Vue 组件之间通信的核心机制，允许父组件向子组件传递数据。

## 什么是 Props？

Props 是子组件上注册的自定义属性。父组件通过这些属性将数据向下传递给子组件。

> **注意**：Props 遵循**单向数据流**原则。子组件不应该直接修改 Props 的值，否则会破坏数据的单一数据源。如果需要修改，应该通过抛出事件 (`emit`) 通知父组件修改。

## 定义 Props

### 组合式 API (`<script setup>`)

在 `<script setup>` 中，使用 `defineProps` 宏来声明 props。它不需要导入。

#### 1. 运行时声明 (Runtime Declaration)

传递一个数组或对象给 `defineProps`。

```vue
<script setup>
// 数组语法
const props = defineProps(['foo'])

// 对象语法 (推荐，可以指定类型)
const props = defineProps({
  title: String,
  likes: Number,
})

console.log(props.title)
</script>
```

#### 2. 基于类型的声明 (Type-based Declaration) - TypeScript

如果你使用 TypeScript，推荐使用泛型参数来定义 props，这样可以获得更好的类型推断。

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number // 可选 prop
}

const props = defineProps<Props>()
</script>
```

#### 默认值 (withDefaults)

在使用基于类型的声明时，可以使用 `withDefaults` 编译器宏来声明默认值：

```vue
<script setup lang="ts">
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two'],
})
</script>
```

给对象添加默认值：

```vue
<script setup lang="ts">
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  // 数组默认值必须从一个工厂函数返回
  labels: () => ['one', 'two'],
})
</script>
```

### 选项式 API (Options API)

在 `export default` 对象中使用 `props` 选项。

```js
export default {
  props: {
    title: String,
    likes: {
      type: Number,
      default: 0,
    },
  },
}
```

## Props 校验

Vue 提供了多种方式来校验传入的 props。

```js
defineProps({
  // 基础类型检查
  // (null 和 undefined 会通过任何类型验证)
  propA: Number,

  // 多种可能的类型
  propB: [String, Number],

  // 必传
  propC: {
    type: String,
    required: true,
  },

  // 默认值
  propD: {
    type: Number,
    default: 100,
  },

  // 对象/数组的默认值必须从一个工厂函数返回
  propE: {
    type: Object,
    default(rawProps) {
      return { message: 'hello' }
    },
  },

  // 自定义验证函数
  propF: {
    validator(value) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    },
  },
})
```

## 传递 Props

### 静态传递

```vue
<BlogPost title="My journey with Vue" />
```

### 动态传递 (`v-bind`)

使用 `v-bind` 或简写 `:` 来传递动态值（变量、表达式）。

```vue
<!-- 传递变量 -->
<BlogPost :title="post.title" />

<!-- 传递复杂表达式 -->
<BlogPost :title="post.title + ' by ' + post.author.name" />

<!-- 传递数字 -->
<BlogPost :likes="42" />

<!-- 传递布尔值 -->
<BlogPost is-published />
<!-- 等同于 :is-published="true" -->
```

### 绑定所有 Props

如果你想将一个对象的所有属性都作为 props 传入，可以使用不带参数的 `v-bind`。

```js
const post = {
  id: 1,
  title: 'My Journey with Vue',
}
```

```vue
<BlogPost v-bind="post" />
<!-- 等同于 -->
<BlogPost :id="post.id" :title="post.title" />
```

## $emit (事件抛出)

子组件可以使用 `$emit` 方法触发事件，父组件可以监听这些事件。

### 触发事件

```vue
<script setup>
const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>
```

### 监听事件

```vue
<template>
  <ChildComponent @click="handleClick" />
</template>

<script setup>
function handleClick() {
  console.log('ChildComponent clicked!')
}
</script>
```

### 传递事件参数

```vue
<script setup>
const emit = defineEmits(['click'])

function handleClick() {
  emit('click', 'hello from child')
}
</script>
```

```vue
<template>
  <ChildComponent @click="handleClick" />
</template>

<script setup>
function handleClick(msg) {
  console.log(msg) // 输出: 'hello from child'
}
</script>
```
