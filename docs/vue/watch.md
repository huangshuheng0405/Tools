# watch

## resource

要观察的数据对象

- 一个ref
- 一个reactive响应式对象
- 一个getter函数（例如：`() => state.count`）
- 由以上类型组成的数组（用于同时侦听多个源）

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

注意，你**不能直接侦听响应式对象的属性值**，例如

```js
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`Count is: ${count}`)
})
```

需要一个返回该属性的getter函数

## callback

当侦听的数据发生变化时，该函数会被调用。它接受三个参数

$$
(newValue, oldValue,onCleanup) => ...
$$

- newValue：变化后的新值
- oldValue：变化后的旧值
- onCleanup：一个用于注册清理回调的函数（常用于取消过期的API请求或定时器）

## options

这是可选的对象

| **属性名**      | **类型**                  | **描述**                                                     |
| --------------- | ------------------------- | ------------------------------------------------------------ |
| **`immediate`** | `boolean`                 | 是否在侦听器创建时**立即执行**一次回调。                     |
| **`deep`**      | `boolean`                 | 是否开启**深层侦听**。如果源是对象，会遍历其所有嵌套属性。   |
| **`flush`**     | `pre` \| `post` \| `sync` | 控制回调的**触发时机**。`post` 常用于在 DOM 更新后访问元素。 |
| **`once`**      | `boolean`                 | (Vue 3.4+) 侦听器是否只触发一次，触发后自动停止。            |

### flush

#### pre

默认值

**触发时机：**在Vue组件更新**DOM之前**

**适用场景：**当你只需要处理逻辑数据，且不需要访问更新后的DOM元素时

```js
watch(count, (val) => {
  // 此时 DOM 还是旧的
  console.log('DOM 还没变');
}, { flush: 'pre' });
```

#### post

**触发时机：**在Vue组件更新**DOM之后**

**适用场景：**当你的逻辑依赖更新后的DOM状态（例如获取元素尺寸、滚动位置或操作第三方DOM库）时

#### sync

**触发时机：**在数据变化时**立即同步执行**

**适用场景：**极少数情况，用于极高实时性，且不涉及大量DOM更新的逻辑（因为同步触发会阻碍代码执行流程，多次修改导致多次性能开销）

```js
const count = ref(0);

watch(count, (val) => {
  console.log('实时捕获:', val);
}, { flush: 'sync' });

// 如果是默认的 'pre'，下面这三次修改可能只会触发一次 watch
// 但使用 'sync' 会立刻依次打印 1, 2, 3
count.value = 1;
count.value = 2;
count.value = 3;
```

## 深层侦听器

直接给`watch`传入一个响应式对象

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```

相比之下，一个返回响应式对象的getter函数，只有在返回不同的对象，才会触发回调

```js
import { reactive, ref, watch } from 'vue'

const obj = reactive({
  count: 0,
  name: 'John',
})

watch(
  () => obj.count,
  (newVal, oldVal) => {
    console.log(`new: ${newVal}, old: ${oldVal}`)
  },
)

obj.count = 10
```

## 一次性侦听器

>仅支持3.4及以上版本

如果只希望回调在源变化时触发一次，可以使用`once:true`

```js
watch(
  source,
  (newValue, oldValue) => {
    // 当 `source` 变化时，仅触发一次
  },
  { once: true }
)
```

## watchEffect

侦听器的回调使用与源完全相同的响应式状态时很常见的。例如，每当`todoId`的引用发生变化时使用侦听器来加载一个远程资源

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

可以用`watchEffect`来简化上面的代码，`watchEffect`允许我们自动跟踪回调的响应式依赖

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

## 停止侦听器

在`<script setup>`中用同步语句创建的侦听器，并且会在组件卸载时自动停止。因此在大多数情况下，你无需关系怎么停止一个侦听器

值得注意的，侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么他不会绑定到当前组件上，你必须手动停止它，以防内存泄漏

```js
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

要手动停止一个侦听器，调用`watch`或`watchEffect`返回的函数

```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

需要异步创建侦听器的情况很少，请尽量选择同步创建。如果需要等待一些异步数据，你可以使用条件的侦听逻辑

```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```

