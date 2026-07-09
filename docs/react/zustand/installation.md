# Zustand

![](/React/zustand/bear.jpg)

[Zustand](https://zustand-demo.pmnd.rs/)是德语单词，意思是“状态”。中文空耳 猝死丹特,基本上每一个框架都会有自己的状态管理工具，比如 Vue 的 Vuex，React 的 Redux，Zustand 自然也是一个状态管理工具。

那么对比Redux，等状态管理工具Zustand 有什么优势呢？

redux 是老牌状态管理库，能完成各种基本功能，并且有着庞大的中间件生态来扩展额外功能,但 redux 经常被人诟病它的使用繁琐。

轻量级 Zustand 的体积非常小，只有 1kb 左右。
简单易用 Zustand 不需要像Redux，去通过Provider包裹组件，Zustand提供了简洁的API，能够快速上手。
易于集成 Zustand 可以轻松的与React 和 Vue 等框架集成。(Zustand也有Vue版本)
扩拓展性 Zustand 提供了中间件的概念，可以通过插件的方式扩展功能，例如(持久化,异步操作，日志记录)等。
无副作用 Zustand 推荐使用 immer库处理不可变性， 避免不必要的副作用。

## 安装

```bash [npm]
npm install zustand
```

## 快速开始

Zustand 的核心就三步：**创建 store → 组件读取状态 → 组件更新状态**。

### 创建 store

Zustand 没有 Provider、Reducer、Action 这些概念。你只需要调用 `create` 函数，就能得到一个 hook：

```ts [store/counterStore.ts]
import { create } from 'zustand'

interface CounterState {
  count: number
  increase: () => void
  decrease: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 }))
}))

export default useCounterStore
```

`create` 接收一个函数，函数的参数 `set` 用来更新状态。`set` 的用法和 React 的 `useState` 类似 —— 可以直接传新值，也可以传一个基于旧状态计算新值的回调。

### 在组件中使用

不需要 Provider 包裹，在任何组件里直接调用你创建好的 hook 就行：

```tsx [App.tsx]
import useCounterStore from './store/counterStore'

function App() {
  const { count, increase, decrease } = useCounterStore()

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </div>
  )
}

export default App
```

### 选择性订阅

上面的写法会把 store 里的所有字段都解构出来，这意味着 `count` 变化时，`increase` 和 `decrease` 的引用也会触发重渲染（实际上它们不变，但 TypeScript 层面解构会导致组件订阅了整个 store）。

更好的做法是**按需取数据**：

```tsx
function App() {
  const count = useCounterStore((state) => state.count)
  const increase = useCounterStore((state) => state.increase)
  const decrease = useCounterStore((state) => state.decrease)

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </div>
  )
}
```

Zustand 内部用 `Object.is` 做浅比较，只有当你选择的那一部分状态真正变化时，组件才会重新渲染。这比 Redux 的 `useSelector` 更简洁，不需要额外依赖。

### 在组件外读写状态

Zustand 的 store 本质上就是一个普通的 JavaScript 对象，你可以在 React 组件之外读写它：

```ts
// 读取
useCounterStore.getState().count

// 更新
useCounterStore.setState({ count: 100 })
```

这在需要**在拦截器里更新 token**、**在 WebSocket 回调里更新消息列表**等场景下非常有用，完全不需要绕弯子。

### 更简单的方式

如果你不需要 actions，只想存一个值，甚至可以直接这么写：

```ts
const useCountStore = create<number>(() => 0)
```

然后用 `useCountStore` 和 `useCountStore.setState` 读写即可。但实际项目里建议把 state 和 actions 放在一起，方便管理。
