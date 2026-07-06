# 受控组件与非受控组件

React 中的**受控组件（Controlled Component）**和**非受控组件（Uncontrolled Component）**，本质上是在说：

> **表单数据由谁来管理？**

- **受控组件：React 管理数据。**
- **非受控组件：DOM 自己管理数据。**

## 受控组件

表单元素的`value`或`checked`完全由React的`state`控制

```
用户输入
    │
    ▼
onChange 事件
    │
    ▼
修改 state
    │
    ▼
重新渲染
    │
    ▼
value 更新
```

```jsx
import { useState } from 'react'

export default function App() {
  const [username, setUsername] = useState('')

  return (
    <>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />

      <p>{username}</p>
    </>
  )
}
```

### 为什么叫受控组件

因为

`input`的值不是自己决定的，而是由React决定的

你给`input`绑定了`value`，如果不通过`setValue`来更新，那么`input`的值不会改变

### 场景

- 表单校验
- 实时搜索
- 双向绑定
- 提交表单前统一获取数据

## 非受控组件

React不管理input的值，由浏览器DOM自己维护

```tsx
import { useRef, useState } from 'react'

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = () => {
    console.log(inputRef.current.value)
  }

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleChange}>提交</button>
    </div>
  )
}

export default App
```

React并没有保存在`state`，而是去`DOM`里读取

### 场景

- 文件上传（`<inpit type='file' >`，本身就是非受控的）

- 与第三方库集成

  

## defaultValue

```jsx
<input defaultValue="hello" />
```

它属于**非受控组件**

只在第一次渲染有效，更改`defaultValue`也不会更新`input`，而`value`每一次都会同步
