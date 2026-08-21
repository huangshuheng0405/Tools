# Immer

![](/React/immer/immer-logo.svg)

[Immer](https://immerjs.github.io/immer/) 是德语单词，意思是"总是"。它的核心思想是：**让你以可变的方式编写不可变数据**。

在 React 中，状态是不可变的，这意味着你不能直接修改 state，而是要创建一个新的对象。这在处理嵌套对象时会变得非常繁琐：

```ts
// 传统的不可变更新（深层嵌套）
const newState = {
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      name: 'new name'
    }
  }
}
```

Immer 通过 `Proxy` 拦截你的修改操作，自动帮你生成新的不可变对象，让你可以像写可变代码一样更新状态：

```ts
// 使用 Immer
const newState = produce(state, (draft) => {
  draft.user.profile.name = 'new name'
})
```

## 安装

```bash [npm]
npm install immer
```

Immer 本身无其他依赖，体积约 3KB（gzip），支持 ES5 浏览器。

**搭配状态管理库使用：**

```bash [npm]
npm install immer   # 单独使用
npm install zustand immer  # 配合 Zustand（Zustand 内置了 Immer 中间件）
```

## 快速开始

Immer 的核心就是一个 `produce` 函数：**传入原对象 + 变更回调 → 得到新对象**。

### 基本用法

```ts
import { produce } from 'immer'

const baseState = [
  { title: 'Learn React', done: true },
  { title: 'Learn Immer', done: false }
]

const nextState = produce(baseState, (draft) => {
  draft[1].done = true
  draft.push({ title: 'Learn Zustand', done: false })
})
```

`baseState` 不会被修改，`nextState` 是一个全新的对象，只修改了变化的部分，未变的部分保持引用不变。

### 在 React 中使用

Immer 最常用的场景是配合 `useState` 或 `useReducer`：

```tsx
import { useState } from 'react'
import { produce } from 'immer'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '学习 React', completed: false }
  ])

  const toggleTodo = (id: number) => {
    setTodos(
      produce((draft) => {
        const todo = draft.find((t) => t.id === id)
        if (todo) {
          todo.completed = !todo.completed
        }
      })
    )
  }

  const addTodo = (text: string) => {
    setTodos(
      produce((draft) => {
        draft.push({ id: Date.now(), text, completed: false })
      })
    )
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

注意这里 `produce` 只传了一个参数，它返回一个 **柯里化** 的函数：接收原对象，返回新对象。这样可以直接作为 `setState` 的回调。

### 在 useReducer 中使用

```tsx
import { useReducer } from 'react'
import { produce } from 'immer'

interface Todo {
  id: number
  text: string
  completed: boolean
}

type Action = { type: 'add'; text: string } | { type: 'toggle'; id: number }

const reducer = produce((draft: Todo[], action: Action) => {
  switch (action.type) {
    case 'add':
      draft.push({ id: Date.now(), text: action.text, completed: false })
      break
    case 'toggle': {
      const todo = draft.find((t) => t.id === action.id)
      if (todo) {
        todo.completed = !todo.completed
      }
      break
    }
  }
})

function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, [])

  // ...
}
```

这是 Immer 最推荐的用法 —— 直接将 `produce` 包装后的 reducer 传给 `useReducer`，所有 case 都可以像写可变代码一样直接修改 draft。

### 与 Zustand 集成

Zustand 内置了 Immer 中间件，无需手动调用 `produce`：

```ts [store/counterStore.ts]
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface TodoState {
  todos: { id: number; text: string; completed: boolean }[]
  toggleTodo: (id: number) => void
}

const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: [],
    toggleTodo: (id) =>
      set((draft) => {
        const todo = draft.todos.find((t) => t.id === id)
        if (todo) {
          todo.completed = !todo.completed
        }
      })
  }))
)
```

## 核心原则

1. **`produce` 只修改变化的属性** —— 未修改的部分保持引用不变，对 PureComponent、memo、useMemo 的优化友好
2. **总是返回新对象** —— 原始对象不受影响，符合 React 不可变数据要求
3. **可以自由使用 JS 语法** —— `push`、`splice`、`delete`、赋值等都可以写，Immer 会正确处理
