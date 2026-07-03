# useRef

当你在React中需要处理DOM元素或需要在组件渲染之间保持持久性数据时，便可以使用useRef

## 语法

`useRef` 的使用非常简单，它只接收一个初始值，并返回一个**包含 `current` 属性的普通 JavaScript 对象**

```js
const myRef = useRef(initialValue);
// 返回的结果其实就是：{ current: initialValue }
```

### 参数

- `initialValue`：ref 对象的 `current` 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。

### 返回值

`useRef` 返回一个只有一个属性的对象:

- `current`：初始值为传递的 `initialValue`。之后可以将其设置为其他值。如果将 ref 对象作为一个 JSX 节点的 `ref` 属性传递给 React，React 将为它设置 `current` 属性。

在后续的渲染中，`useRef` 将返回同一个对象。

### 关键特性

1. **持久性**：组件在多次重新渲染之间，`myRef` 对象始终是同一个引用，里面的 `current` 值不会丢失
2. **静默性**：修改 `myRef.current = newValue` 时，**绝对不会**导致组件重新渲染
3. **即时性**：因为修改它不触发渲染，所以你修改了 `current` 之后，在下一行代码就能**立刻**拿到最新值（不像 `useState` 的修改是异步的）

## 场景

### 直接操作真实DOM节点

React 提倡声明式 UI，但有些时候你必须触碰真实的 DOM。比如：让输入框聚焦、滚动到页面指定位置、测量 DOM 的宽高、或者初始化第三方图表库。

示例：点击按钮让输入框自动聚焦

```jsx
import React, { useRef } from 'react';

function TextInputWithFocusButton() {
  // 1. 创建一个 ref，初始为 null
  const inputRef = useRef(null);

  const onButtonClick = () => {
    // 3. 通过 inputRef.current 拿到真实的 <input> DOM 元素，并调用原生 focus 方法
    inputRef.current.focus();
  };

  return (
    <>
      {/* 2. 通过 ref 属性把这个“口袋”绑定到特定的 DOM 元素上 */}
      <input ref={inputRef} type="text" />
      <button onClick={onButtonClick}>点我聚焦输入框</button>
    </>
  );
}
```

### 存储“不需要参与页面渲染”的持久化数据

如果一个数据需要在多次渲染之间共享，但它**完全不需要显示在 HTML 结构里**，用 `useState` 就会导致每次修改都引发无意义的页面重绘，这时用 `useRef` 是完美的性能优化手段。

- **典型例子**：定时器 ID（`timerId`）、网络请求的取消令牌（AbortController）、记录组件是否是首次挂载（IsFirstRender）、或者在 `useEffect` 中记录上一次的旧状态。

示例：实现一个秒表

```jxs
import React, { useState, useRef } from 'react'

function Stopwatch() {
  const [startTime, setStartTime] = useState(null)
  const [now, setNow] = useState(null)

  // 用 useRef 存定时器 ID，因为修改它不需要更新页面
  const timerRef = useRef(null)

  const handleStart = () => {
    setStartTime(Date.now())
    setNow(Date.now())

    clearInterval(timerRef.current)
    // 把定时器 ID 存入“隐形口袋”
    timerRef.current = setInterval(() => {
      setNow(Date.now())
    }, 10)
  }

  const handleStop = () => {
    // 随时可以从口袋里拿出来清理，不会触发额外的渲染
    clearInterval(timerRef.current)
  }

  let secondsPassed = 0
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000
  }

  return (
    <>
      <h1>过去的时间: {secondsPassed.toFixed(3)} 秒</h1>
      <button onClick={handleStart}>开始</button>
      <button onClick={handleStop}>停止</button>
    </>
  )
}

export default Stopwatch
```

## 比较useState

| **特性**     | **useState**                            | **useRef**                                    |
| ------------ | --------------------------------------- | --------------------------------------------- |
| **返回值**   | `[state, setState]`（当前值与修改函数） | `{ current: ... }`（包含 current 的普通对象） |
| **改动值时** | 触发组件重新渲染（Re-render）           | **不会**触发重新渲染                          |
| **数据用途** | 存储**需要渲染到页面上**的数据          | 存储 DOM 节点或**渲染无关**的幕后变量         |
| **获取新值** | 异步。修改后不能在下一行立刻拿到新值    | 同步。修改后立马能通过 `.current` 拿到        |

## 注意

千万不要在渲染期间读写`.current`

```jsx
// ❌ 错误示范
function BadComponent() {
  const countRef = useRef(0);
  
  // 严禁在渲染期间直接修改它！
  countRef.current++; 

  // 严禁在渲染期间直接依赖它展示！因为即使它变了，React 也不会更新这段 UI
  return <h1>当前渲染了 {countRef.current} 次</h1>; 
}
```

- `useRef`的值不能作为`useEffect`等其他`hooks`的依赖项，因为它并不是一个响应式状态
- `useRef`不能直接获取子组件的实例，需要使用`forwardRef`
- 组件在重新渲染的时候，`useRef`的值不会被重新初始化