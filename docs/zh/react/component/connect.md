# 组件通信

React 的组件通信，本质上就是**不同组件之间如何传递数据和触发事件**。

React遵循单向数据流（One-Way Data Flow）

> **数据只能从父组件流向子组件**，不能直接从子组件留向父组件

## 组件关系

可以产生：

- 父 $\rightarrow$ 子
- 子 $\rightarrow$ 父
- 兄弟
- 跨层组件

## 父 $\rightarrow$ 子

父组件把数据作为**props**传给子组件

```tsx
function Child(props) {
  return <h1>{props.name}</h1>
}

function App() {
  return <Child name="Tom" />
}
```

props可以传

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `object`
- `array`
- `function`
- `JSX.Element`

```tsx
function App() {
  return (
    <>
      <Test
        title={'测试'}
        id={1}
        obj={{ a: 1, b: 2 }}
        arr={[1, 2, 3]}
        cb={(a: number, b: number) => a + b}
        empty={null}
        element={<div>测试</div>}
        isGirl={false}
      >
      </Test>
    </>
  )
}
```

## 子组件 $\rightarrow$ 父组件

父组件把一个函数传过去，子组件调用这个函数

```
Parent
   │
 props
   ▼
Child
   │
调用函数
   ▼
Parent 更新 state
```

```jsx
function Child({ send }) {
  return (
    <button onClick={() => send("Hello")}>
      点击
    </button>
  )
}

function App() {
  const receive = (msg) => {
    console.log(msg)
  }

  return <Child send={receive} />
}
```

## 兄弟组件通信

```
App
├── Left
└── Right
```

Left 和 Right 没有直接关系。

React 的做法：

**状态提升（Lifting State Up）**

也就是：

共同的父组件保存数据。

```
      App
     /   \
  Left   Right
```

```tsx
import { useState } from 'react'

const Left = ({ count, add }: { count: number; add: () => void }) => {
  return <button onClick={add}>{count}</button>
}

const Right = ({ count }: { count: number }) => {
  return <h2>{count}</h2>
}

const App = () => {
  const [count, setCount] = useState(0)

  const add = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <Left count={count} add={add} />
      <Right count={count} />
    </div>
  )
}

export default App

```

```
Left更新
↓

App state变化

↓

Right重新渲染
```

## 跨层组件通信

React提供了Context

```
Provider

↓

所有子组件

↓

useContext()
```

创建Context：

```tesx
import { createContext} from 'react'

const UserContext = createContext()
```

提供数据

```tsx
<UserContext.Provider value="Tom">
    <A />
</UserContext.Provider>
```

获取

```tsx
const name = useContext(UserContext)
```

## Ref通信

有时候父组件需要：

- 调子组件的方法
- 获取子组件DOM

React19起，可以直接通过`ref`作为普通prop传递，在React18及之前，自定义组件通常需要配合`forwardRef`（以及需要暴露特点方法时使用`useImperativehandle`）

```tsx
import { useImperativeHandle, useRef, useState } from 'react'

type ChildHandle = {
  focus: () => void
}

type ChildProps = {
  count: number
  ref?: React.Ref<ChildHandle>
}

const Child = ({ count, ref }: ChildProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus()
    }
  }))

  return (
    <>
      <div>当前计数: {count}</div>
      <input ref={inputRef} />
    </>
  )
}

const App = () => {
  const childRef = useRef<ChildHandle | null>(null)
  const [count] = useState(0)

  return (
    <>
      <Child ref={childRef} count={count} />
      <button onClick={() => childRef.current?.focus()}>聚焦</button>
    </>
  )
}

export default App
```

## 全局状态管理

Redux、Zustand、Mobx

以Zustand为例

```jsx
import { create } from "zustand"

const useStore = create((set) => ({
  count: 0,
  add: () => set((state) => ({ count: state.count + 1 })),
}))

function Left() {
  const add = useStore((state) => state.add)

  return <button onClick={add}>+</button>
}

function Right() {
  const count = useStore((state) => state.count)

  return <h1>{count}</h1>
}
```

