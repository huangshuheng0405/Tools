# Vue 组件通信方式汇总

Vue 组件之间的通信方式多种多样，根据组件之间的关系（父子、兄弟、跨级）选择最合适的方式。

## 1. Props / Emits (父子通信)

最常用的场景，依旧遵循单项数据流，父组件的数据只能由父组件修改，子组件要修改父组件的值，就调用父组件的函数

> `defineProps`和`defineEmits`不需要引入

::: code-group

```vue [App.vue]
<script setup lang="ts">
import { ref } from 'vue'
import Son from './components/Son.vue'

const msg = ref('hello')
const handleUpdate = (val: string) => {
  msg.value = val
}
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>
    <Son :msg="msg" @update="handleUpdate" />
  </div>
</template>

<style scoped></style>
```

```vue [Son.vue]
<script setup lang="ts">
defineProps(['msg'])

const emit = defineEmits(['update'])
const send = () => emit('update', 'new value')
</script>

<template>
  <button @click="send">send</button>
</template>

<style scoped></style>
```

:::

## 2. v-model (双向绑定)

Vue 3.4+ 推荐使用 `defineModel` 宏，它把接受`props`和触发`emit`合二为一了

::: code-group

```vue [App.vue]
<script setup lang="ts">
import { ref } from 'vue'
import Son from './components/Son.vue'

const searchText = ref('11')
const titleText = ref('22')
</script>

<template>
  <div>
    <h1>{{ searchText }}</h1>
    <h1>{{ titleText }}</h1>
    <Son v-model="searchText" v-model:text="titleText" />
  </div>
</template>

<style scoped></style>
```

```vue [Son.vue]
<script setup lang="ts">
const modelValue = defineModel() // 对应 v-model
const text = defineModel('text') // 对应 v-model:text
</script>

<template>
  <input type="text" v-model="modelValue" />
  <input type="text" v-model="text" />
</template>

<style scoped></style>
```

:::

## 3. Provide / Inject (跨级/依赖注入)

当组件嵌套太深，用`props`传递会显得非常繁琐，这是用`provide`和`inject`最合适

- **Provide**: 在祖先组件中提供数据
- **Inject**: 在后代组件中接受数据。

::: code-group

```vue [App.vue]
<script setup lang="ts">
import { provide, ref } from 'vue'
import Child from './components/Child.vue'

const theme = ref('dark')
provide('theme', theme)
</script>

<template>
  <Child></Child>
</template>

<style scoped></style>
```

```vue [Child.vue]
<script setup lang="ts">
import Descendant from './Descendant.vue'
</script>

<template>
  <div class="child">
    <h1>Child Component</h1>
    <Descendant></Descendant>
  </div>
</template>

<style scoped>
.child {
  width: 500px;
  height: 500px;
  border: 1px solid red;
}
</style>
```

```vue [Descendant.vue]
<script setup lang="ts">
import { inject } from 'vue'

const theme = inject('theme')
</script>

<template>
  <h1>Descendant Component</h1>
  <div class="theme">当前主题：{{ theme }}</div>
</template>

<style scoped></style>
```

:::

## 4. Refs / Expose (父访子)

父组件通过 `ref` 直接访问子组件的实例或方法。注意 Vue 3 `<script setup>` 默认是**关闭**的，需要通过 `defineExpose` 显式暴露。

::: code-group

```vue [App.vue]
<script setup lang="ts">
import Child from './components/Child.vue'
import { ref } from 'vue'

const dialogRef = ref()
const openChild = () => {
  dialogRef.value?.open()

  console.log(dialogRef.value?.isVisible)
}
</script>

<template>
  <button @click="openChild">打开子组件</button>
  <Child ref="dialogRef"></Child>
</template>

<style scoped></style>

```

```vue [Child.vue]
<script setup lang="ts">
import { ref } from 'vue'

const isVisible = ref(false)

const open = () => {
  isVisible.value = true
}

const close = () => {
  isVisible.value = false
}

defineExpose({
  open,
  isVisible
})
</script>

<template>
  <div v-if="isVisible" class="dialog">
    <h1>Child Component</h1>
    <button @click="close">关闭</button>
  </div>
</template>

<style scoped>
.dialog {
  width: 500px;
  height: 500px;
  border: 1px solid red;
}
</style>

```

:::

## 5. Attributes (透传 Attributes)

父组件传递的属性如果没有被子组件声明为 `props` 或 `emits`，会自动透传到子组件的**根元素**上（如 `class`, `style`, `id`）。

可以使用 `useAttrs()` 在 JS 中访问，或设置 `inheritAttrs: false` 禁用自动透传。

## 6. 全局状态管理 (Pinia)

详情见 [pinia](/vue/pinia.md)

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
