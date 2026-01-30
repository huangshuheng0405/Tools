# Vue 组件通信方式汇总

Vue 组件之间的通信方式多种多样，根据组件之间的关系（父子、兄弟、跨级）选择最合适的方式。

## 1. Props / Emits (父子通信)

最基础、最常用的通信方式。

- **Props**: 父组件向子组件传递数据（单向数据流）。
- **Emits**: 子组件向父组件触发事件传递数据。

```vue
<!-- Parent.vue -->
<template>
  <Child :msg="message" @update="handleUpdate" />
</template>

<script setup>
import { ref } from 'vue'
const message = ref('Hello')
const handleUpdate = (val) => {
  message.value = val
}
</script>

<!-- Child.vue -->
<script setup>
defineProps(['msg'])
const emit = defineEmits(['update'])
const send = () => emit('update', 'New Value')
</script>
```

## 2. v-model (双向绑定)

Vue 3.4+ 推荐使用 `defineModel` 宏，极大简化了父子组件的双向绑定。

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>

<!-- Parent.vue -->
<Child v-model="count" />
```

## 3. Provide / Inject (跨级/依赖注入)

适用于**祖先组件**向**后代组件**（无论层级多深）传递数据。

- **Provide**: 在祖先组件中提供数据。
- **Inject**: 在后代组件中注入数据。

```vue
<!-- Ancestor.vue -->
<script setup>
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)
</script>

<!-- Descendant.vue -->
<script setup>
import { inject } from 'vue'
const theme = inject('theme')
</script>
```

## 4. Refs / Expose (父访子)

父组件通过 `ref` 直接访问子组件的实例或方法。注意 Vue 3 `<script setup>` 默认是**关闭**的，需要通过 `defineExpose` 显式暴露。

```vue
<!-- Child.vue -->
<script setup>
const reset = () => {
  /* ... */
}
defineExpose({ reset })
</script>

<!-- Parent.vue -->
<script setup>
import { ref, onMounted } from 'vue'
const childRef = ref(null)

onMounted(() => {
  childRef.value.reset()
})
</script>

<template>
  <Child ref="childRef" />
</template>
```

## 5. Attributes (透传 Attributes)

父组件传递的属性如果没有被子组件声明为 `props` 或 `emits`，会自动透传到子组件的**根元素**上（如 `class`, `style`, `id`）。

可以使用 `useAttrs()` 在 JS 中访问，或设置 `inheritAttrs: false` 禁用自动透传。

## 6. 全局状态管理 (Pinia)

适用于**任意组件**之间的通信，特别是复杂的应用状态。

```js [store/counter.js]
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

## 7. Mitt (事件总线 EventBus)

Vue 3 移除了 `$on`, `$off`, `$emit`，不再支持官方的 EventBus。如果需要兄弟组件或任意组件间的简单事件通信，可以使用第三方库 `mitt`。

```js
import mitt from 'mitt'
const emitter = mitt()

// Component A
emitter.emit('foo', { a: 'b' })

// Component B
emitter.on('foo', (e) => console.log('foo', e))
```

## 8. Slots (插槽)

父组件向子组件传递**模板内容**。

- **默认插槽**
- **具名插槽**
- **作用域插槽**：子组件将数据回传给父组件的插槽内容使用。

## 总结图表

| 方式                 | 适用场景            | 复杂度 | 推荐指数   |
| :------------------- | :------------------ | :----- | :--------- |
| **Props / Emits**    | 父子组件            | 低     | ⭐⭐⭐⭐⭐ |
| **v-model**          | 父子双向同步        | 低     | ⭐⭐⭐⭐⭐ |
| **Provide / Inject** | 跨级/插件开发       | 中     | ⭐⭐⭐⭐   |
| **Pinia**            | 全局状态/任意组件   | 中     | ⭐⭐⭐⭐⭐ |
| **Refs**             | 父直接操作子        | 低     | ⭐⭐⭐     |
| **Slots**            | 内容分发            | 中     | ⭐⭐⭐⭐   |
| **Mitt**             | 任意组件 (非响应式) | 低     | ⭐⭐       |
