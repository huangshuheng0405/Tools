# useSyncExternalStore

用于从外部存储（例如状态管理库、浏览器 API 等）获取状态并在组件中同步显示。这对于需要跟踪外部状态的应用非常有用。

## 基本语法

```js
const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);
```

- `subscribe`：一个接收回调函数的函数。当外部 Store 改变时，应该调用这个回调，通知 React 数据变了，该重新检查了。它需要返回一个清理订阅的方法。

- `getSnapshot`：一个函数，用来获取当前外部状态的快照。React 会用它返回的值来决定组件是否需要重新渲染。**注意：如果数据没变，这个函数必须返回相同的引用/值！**

- `getServerSnapshot`（可选）：在服务端渲染（SSR）或 hydration 期间使用的快照。

## 用法

### 订阅浏览器api实现自定义hook

我们实现一个useStorage Hook，用于订阅 localStorage 数据。这样做的好处是，我们可以确保组件在 localStorage 数据发生变化时，自动更新同步。

实现代码

我们将创建一个 useStorage Hook，能够存储数据到 localStorage，并在不同浏览器标签页之间同步这些状态。此 Hook 接收一个键值参数用于存储数据的键名，还可以接收一个默认值用于在无数据时的初始化。

在 hooks/useStorage.ts 中定义 useStorage Hook：

```js
import { useSyncExternalStore } from "react"

/**
 *
 * @param key 存储到localStorage 的key
 * @param defaultValue 默认值
 */
export const useStorage = (key: any, defaultValue?: any) => {
    const subscribe = (callback: () => void) => {
        window.addEventListener('storage', (e) => {
            console.log('触发了', e)
            callback()
        })
        return () => window.removeEventListener('storage', callback)
    }
    //从localStorage中获取数据 如果读不到返回默认值
    const getSnapshot = () => {
        return (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null) || defaultValue
    }
    //修改数据
    const setStorage = (value: any) => {
        localStorage.setItem(key, JSON.stringify(value))
        window.dispatchEvent(new StorageEvent('storage')) //手动触发storage事件
    }
    //返回数据
    const res = useSyncExternalStore(subscribe, getSnapshot)

    return [res, setStorage]
}
```

在 App.tsx 中，我们可以直接使用 useStorage，来实现一个简单的计数器。值会存储在 localStorage 中，并且在刷新或其他标签页修改数据时自动更新。

```js
import { useStorage } from './hooks/useStorage'
const App = () => {
  const [val, setVal] = useStorage('data', 1)
  return (
    <>
      <h3>{val}</h3>
      <button onClick={() => setVal(val + 1)}>设置val</button>
    </>
  )
}

export default App
```

### 订阅history实现路由跳转

::: code-group

```js [hooks/useHistory.ts]
import { useSyncExternalStore } from "react"
export const useHistory = () => {
    const subscribe = (callback: () => void) => {
        window.addEventListener('popstate', callback)
        window.addEventListener('hashchange', callback)
        return () => {
            window.removeEventListener('popstate', callback)
            window.removeEventListener('hashchange', callback)
        }
    }
    const getSnapshot = () => {
        return window.location.href
    }
    const push = (path: string) => {
        window.history.pushState(null, '', path)
        window.dispatchEvent(new PopStateEvent('popstate'))
    }
    const replace = (path: string) => {
        window.history.replaceState(null, '', path)
        window.dispatchEvent(new PopStateEvent('popstate'))
    }
    const res = useSyncExternalStore(subscribe, getSnapshot)
    return [res, push, replace] as const
}
```

```tsx [App.tsx]
import { useHistory } from './hooks/useHistory'
const App = () => {
  const [history, push, replace] = useHistory()
  return (
    <>
      <div>当前url:{history}</div>
      <button
        onClick={() => {
          push('/aaa')
        }}
      >
        跳转
      </button>
      <button
        onClick={() => {
          replace('/bbb')
        }}
      >
        替换
      </button>
    </>
  )
}

export default App
```

:::

`popstate`监听的是浏览器历史记录条目的激活与切换，主要是监听用户点击了**浏览器的前进和后退按钮**

在`js`调用 `history.back()`、`history.forward()` 或 `history.go()`也能触发

调用 `history.pushState()`（新增历史记录）或 `history.replaceState()`（修改历史记录）时，**不会**触发 `popstate` 事件

## getSnapshot的引用问题

不能在`getSnapshot`里每次都返回一个新对象

```js
// ❌ 错误示范：会导致无限循环渲染！
function getSnapshot() {
  return { value: myStore.value } // 每次执行都返回全新对象
}
```

因为 React 内部会使用 `Object.is` 对 `getSnapshot()` 的返回值进行浅比较。如果它每次都返回一个新对象，React 就会认为“数据永远在变”，从而陷入**死循环渲染（Infinite Re-renders）**，直到页面崩溃。
