# subscribeWithSelector 选择器订阅中间件

## 概述

`subscribeWithSelector` 是 Zustand 内置的中间件，为 store 添加一个 `subscribe` 方法，允许你**监听 state 中某个特定字段的变化**，而不是每次 state 变化都触发回调。

> 在 Zustand v4.4.0 以前，`subscribe` 默认支持选择器。从 v4.4.0 起为了减小包体积，选择器能力被移到了这个独立的中间件中。

## 基本用法

```ts [store/counterStore.ts]
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface CounterState {
  count: number
  name: string
  increase: () => void
  setName: (name: string) => void
}

const useCounterStore = create<CounterState>()(
  subscribeWithSelector(
    (set) => ({
      count: 0,
      name: 'hello',
      increase: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name }),
    })
  )
)
```

## 订阅整个 store

当 state **任意字段**变化时触发：

```ts
const unsub = useCounterStore.subscribe((state, prevState) => {
  console.log('state changed:', state, prevState)
})

// 取消订阅
unsub()
```

## 使用选择器订阅特定字段

通过第二个参数传入选择器，**仅在选中值变化时触发**：

```ts
const useCounterStore = create<CounterState>()(
  subscribeWithSelector((set) => ({ /* ... */ }))
)

// 仅监听 count 字段的变化
const unsub = useCounterStore.subscribe(
  (state) => state.count,             // 选择器函数
  (count, prevCount) => {             // 变化回调
    console.log(`count: ${prevCount} → ${count}`)
  }
)
```

选择器支持**任意计算值**：

```ts
// 监听派生数据
const unsub = useCounterStore.subscribe(
  (state) => state.count > 10,        // 选择器返回布尔值
  (isLarge, wasLarge) => {
    if (isLarge !== wasLarge) {
      console.log(`count 刚刚 ${isLarge ? '超过' : '回到'} 10`)
    }
  }
)
```

## 比较函数（判断"是否变化"）

默认使用 `Object.is` 进行相等比较。可通过第三个参数传入自定义比较函数：

```ts
const unsub = useCounterStore.subscribe(
  (state) => state.items,                      // 返回数组引用
  (items, prevItems) => {
    console.log('items changed')
  },
  {
    equalityFn: (a, b) => a.length === b.length // 仅长度变化时触发
  }
)
```

## 订阅特定值前的防误触发

可通过 `equalityFn` 传入 `true`，让回调仅在非 `undefined` 值时触发（常用于等待初始化）：

```ts
const unsub = useCounterStore.subscribe(
  (state) => state.user,       // 选择 user
  (user) => {
    console.log('user loaded:', user)
  },
  { equalityFn: (a, b) => a === b || a == null }
)
```

## 与 persist / devtools 中间件组合

```ts [store/userStore.ts]
import { create } from 'zustand'
import { subscribeWithSelector, persist, devtools } from 'zustand/middleware'

interface UserState {
  user: { name: string } | null
  login: (user: { name: string }) => void
  logout: () => void
}

const useUserStore = create<UserState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set) => ({
          user: null,
          login: (user) => set({ user }),
          logout: () => set({ user: null }),
        }),
        { name: 'user-storage' }
      )
    ),
    { name: 'UserStore' }
  )
)

// 只关心登录状态变化
useUserStore.subscribe(
  (state) => state.user,
  (user, prevUser) => {
    if (user && user.name !== prevUser?.name) {
      console.log(`登录用户: ${user.name}`)
    }
    if (!user && prevUser) {
      console.log('用户已登出')
    }
  }
)
```

## 实用的订阅调用模式

### 初始化后写一次，之后只 watch

```ts
const init = useSomeStore.getState().init
init() // 初始调用一次

// 之后只 watch 变化
useSomeStore.subscribe(
  (s) => s.foo,
  (val) => { /* do something */ }
)
```

### 组件外监听（在 useEffect 中）

```tsx
import { useEffect } from 'react'
import { useCounterStore } from '@/store/counterStore'

function CounterWatcher() {
  useEffect(() => {
    const unsub = useCounterStore.subscribe(
      (state) => state.count,
      (count) => {
        document.title = `Count: ${count}`
      }
    )
    return unsub // 组件卸载时取消订阅
  }, [])

  return null
}
```

### 等待某个条件成立

```ts
function waitForReady(store) {
  return new Promise((resolve) => {
    const unsub = store.subscribe(
      (s) => s.ready,
      (ready) => {
        if (ready) {
          unsub()
          resolve()
        }
      }
    )
  })
}

await waitForReady(useAppStore)
```

## API 参考

```ts
subscribe(listener): () => void
// 订阅整个 store，任意变化触发 listener

subscribe(selector, listener, options?): () => void
// 订阅 selector 选中的值，仅在值变化时触发 listener

options = {
  equalityFn?: (a, b) => boolean  // 默认 Object.is
  fireImmediately?: boolean       // 是否立即触发一次回调
}
```

| 参数 | 说明 |
|------|------|
| `selector` | `(state) => selectedValue`，选中要监听的片段 |
| `listener` | `(selectedValue, previousSelectedValue) => void` |
| `equalityFn` | 自定义相等比较，决定是否触发回调 |
| `fireImmediately` | `true` 时立即执行一次回调 |
| **返回值** | 取消订阅函数 |

## 注意事项

- **`subscribe` 返回值是取消订阅函数**：记得在组件卸载或不再需要时调用它，避免内存泄漏。
- **选择器应保持简单**：避免在 selector 中做复杂计算或创建新对象，否则每次 state 变化都会因引用变化而触发回调。
- **`create<T>()()` 括号**：使用 TypeScript 时 `create<T>()(subscribeWithSelector(...))` 不能省略。
- **何时需要这个中间件**：如果只需要 `getState()` 获取当前值或订阅整个 store，不需要引入；只在需要按字段精细订阅时才用。
