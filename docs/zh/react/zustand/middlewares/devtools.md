# devtools 开发者工具中间件

## 概述

`devtools` 是 Zustand 内置的中间件，用于连接 **Redux DevTools 浏览器扩展**，让你可以在开发时直观地看到 store 状态的变化、时间旅行调试、手动触发 action 等。

## 安装浏览器扩展

首先需要安装 [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)：

- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/redux-devtools/nnkgneoiohoecpdiaponcejilbhhikei)

## 基本用法

```ts [store/counterStore.ts]
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CounterState {
  count: number
  increase: () => void
  decrease: () => void
}

const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'CounterStore', // DevTools 中显示的名称
    }
  )
)
```

打开 Redux DevTools 面板，即可看到 `CounterStore` 及其状态变化。

## 自定义 Action 名称

默认情况下，DevTools 中显示的 action 是 `anonymous`。通过在 `set()` 的第二个参数传入 `type` 来命名：

```ts [store/counterStore.ts]
const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increase: () =>
        set(
          (state) => ({ count: state.count + 1 }),
          false, // 直接替换整个 state 时为 true，默认 false（浅合并）
          'count/increase' // action 名称
        ),
      decrease: () =>
        set(
          (state) => ({ count: state.count - 1 }),
          false,
          'count/decrease'
        ),
    }),
    { name: 'CounterStore' }
  )
)
```

`set()` 完整签名：

```ts
set(partial, replace?, action?)
// partial   — 新的状态片段
// replace   — 是否替换整个 state（默认 false）
// action    — action 类型名称（字符串）或 { type: string, ...customFields }
```

### 传入 action 对象

可以传入对象来携带更多调试信息：

```ts
set(
  (state) => ({ count: state.count + 1 }),
  false,
  { type: 'count/increase', payload: { step: 1 } }
)
```

这样在 DevTools 中点击对应 action 就能看到 `payload` 的详细信息。

## 常用配置

### `name`

store 在 DevTools 面板中展示的名称：

```ts
devtools(storeFn, { name: 'UserStore' })
```

### `enabled`

控制是否启用 devtools（通常根据环境判断）：

```ts
devtools(storeFn, {
  name: 'CounterStore',
  enabled: import.meta.env.DEV, // 仅开发环境开启
})
```

### `anonymousActionType`

未命名 action 的默认显示名称，默认是 `anonymous`：

```ts
devtools(storeFn, {
  name: 'AppStore',
  anonymousActionType: 'unknown',
})
```

### `store`

自定义 Redux DevTools 的 store 名称（一般不需要改动）：

```ts
devtools(storeFn, {
  name: 'MyStore',
  store: 'MyStore', // 也是默认值
})
```

### `serialize`

自定义序列化选项，用于处理不可序列化的数据（如 `Date`、`BigInt` 等）：

```ts
devtools(storeFn, {
  name: 'DataStore',
  serialize: {
    options: {
      date: true,  // 保留 Date 类型，而不是转成字符串
      undefined: true,
    },
  },
})
```

## 日志记录

`devtools` 中间件的 store 上会挂载 `dispatch` 方法，可用于手动触发自定义日志：

```ts
const useCounterStore = create<CounterState>()(
  devtools((set) => ({ /* ... */ }), { name: 'CounterStore' })
)

// 开发调试时手动记录
useCounterStore.dispatch?.({ type: 'CUSTOM_LOG', payload: 'debug info' })
```

## 与 persist 中间件组合

`devtools` 常与 `persist` 等中间件一起使用：

```ts [store/userStore.ts]
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserState {
  user: { name: string; token: string } | null
  login: (user: { name: string; token: string }) => void
  logout: () => void
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        login: (user) =>
          set({ user }, false, 'user/login'),
        logout: () =>
          set({ user: null }, false, 'user/logout'),
      }),
      { name: 'user-storage' }
    ),
    { name: 'UserStore' }
  )
)
```

> **嵌套顺序：** `devtools` 在最外层，包裹 `persist`。这样 DevTools 可以看到持久化恢复（hydration）相关的 action。

## Redux DevTools 功能一览

通过 `devtools` 中间件，你可以在浏览器 DevTools 中：

| 功能 | 说明 |
|------|------|
| **State 面板** | 查看当前 store 的完整状态树 |
| **Action 面板** | 所有 `set()` 调用的历史记录，含 action 名称和 payload |
| **时间旅行** | 点击历史 action，可回退到任意时间点的状态 |
| **Diff 面板** | 对比每次 action 前后的状态差异 |
| **Action 录制/回放** | 录制操作序列并重放 |
| **手动 Dispatch** | 在面板中手动触发 action 来测试 |

## 注意事项

- **仅开发环境使用**：`devtools` 只应在开发环境开启，生产环境记得关闭或用 `enabled` 控制。
- **`create<T>()()` 括号**：使用 TypeScript 时 `create` 后需要加 `()`。
- **中间件嵌套顺序**：`devtools` 一般放在最外层，包裹其他中间件。
- **不可序列化数据**：`Map`、`Set`、`Function` 等无法序列化，DevTools 中可能显示异常，可用 `serialize` 选项配置。
- **多个 store**：每个 store 使用不同的 `name`，可在 DevTools 中通过下拉菜单切换。
