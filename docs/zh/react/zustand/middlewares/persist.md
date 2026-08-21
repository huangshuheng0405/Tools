# persist 持久化中间件

## 概述

`persist` 是 Zustand 内置的中间件，用于将 store 状态**持久化到本地存储**（如 `localStorage`、`sessionStorage`），页面刷新后状态仍然保留。

## 基本用法

```ts [store/counterStore.ts]
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CounterState {
  count: number
  increase: () => void
  decrease: () => void
}

const useCounterStore = create<CounterState>()(
  persist(
    (set) => ({
      count: 0,
      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'counter-storage', // 保存到 localStorage 的 key 名
    }
  )
)
```

> **注意：** `create` 后需要加 `()` 调用（`create<T>()(...)`），这是 TypeScript 使用中间件时的写法要求。

## 组件中使用

和普通 store 完全一样，不需要任何额外的 Provider 或配置：

```tsx [components/Counter.tsx]
import { useCounterStore } from '@/store/counterStore'

function Counter() {
  const { count, increase, decrease } = useCounterStore()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </div>
  )
}
```

刷新页面后 `count` 的值会从 `localStorage` 中自动恢复。

## 常用配置

### `name`

存储的 key 名，**必填**。

```ts
{ name: 'my-app-store' }
// localStorage 中 key 为 'my-app-store'
```

### `storage`

指定存储引擎，默认 `localStorage`。可以换成 `sessionStorage` 或者自定义存储：

```ts [store/userStore.ts]
import { persist } from 'zustand/middleware'

const useUserStore = create<UserState>()(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'user-storage',
      storage: sessionStorage, // 页面关闭后自动清除
    }
  )
)
```

对于 React Native 等非浏览器环境，可以用 `AsyncStorage`：

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'

persist(storeFn, {
  name: 'app-storage',
  storage: AsyncStorage,
})
```

### `partialize`

**选择性持久化** —— 只保存你关心的字段：

```ts [store/appStore.ts]
const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      formDraft: '',  // 这个字段不持久化
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setFormDraft: (formDraft) => set({ formDraft }),
    }),
    {
      name: 'app-storage',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== 'formDraft')
        ),
    }
  )
)
```

> `partialize` 接收完整的 state，返回需要持久化的部分。返回的内容会在页面加载时通过 `merge` 合并回 state。

### `merge`

自定义**恢复数据时的合并策略**（默认是浅合并）：

```ts
persist(storeFn, {
  name: 'counter-storage',
  merge: (persistedState, currentState) => {
    // 比如：只恢复 count，其他字段用默认值
    return {
      ...currentState,
      count: (persistedState as { count: number }).count ?? 0,
    }
  },
})
```

### `skipHydration`

跳过首次自动恢复，手动控制 hydration 时机：

```ts
persist(storeFn, {
  name: 'app-storage',
  skipHydration: true,
})

// 在合适时机手动触发
useAppStore.persist.rehydrate()
```

这在需要等待用户登录或其他异步初始化的场景下很有用。

### `version`

用于**数据迁移** —— 当存储结构发生变化时，可以升级旧数据：

```ts
persist(storeFn, {
  name: 'user-storage',
  version: 2, // 当前版本号
  migrate: (persistedState, version) => {
    // persistedState 类型为 unknown
    const state = persistedState as { firstName?: string; lastName?: string }
    if (version === 1) {
      // v1 只有 firstName，v2 拆成了 firstName + lastName
      return { ...state, lastName: '' }
    }
    return state as UserState
  },
})
```

## 清除持久化数据

```ts
// 清除指定 store 的持久化数据
useCounterStore.persist.clearStorage()
```

`persist` 中间件会在 store 上挂载 `persist` 对象，提供两个方法：

| API | 说明 |
|-----|------|
| `store.persist.rehydrate()` | 手动从存储中恢复数据 |
| `store.persist.clearStorage()` | 清除存储中的数据 |
| `store.persist.hasHydrated()` | 返回是否已完成 hydration |
| `store.persist.onHydrate(fn)` | hydration 开始时触发 |
| `store.persist.onFinishHydration(fn)` | hydration 完成时触发 |

## 完整示例

```ts [store/cartStore.ts]
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: localStorage,
      version: 1,
      partialize: (state) => ({ items: state.items }), // 只持久化购物车列表
    }
  )
)
```

## 注意事项

- **`create` 后面需要加 `()`**：使用 TypeScript 时，`create<T>()(persist(...))` 的括号不能省略。
- **不要存不可序列化的内容**：`localStorage` 只能存字符串，函数、`Map`、`Set`、`Symbol` 等不会被正确序列化。用 `partialize` 过滤掉不可序列化的字段。
- **敏感信息不要存 localStorage**：token 等敏感数据应放在 `httpOnly` cookie 中，`localStorage` 中的内容可以被任意 JS 代码读取。
- **`name` 必须唯一**：多个 store 使用相同的 `name` 会互相覆盖。
