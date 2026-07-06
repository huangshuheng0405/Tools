# memo

`memo`允许你的组件在props没有改变的情况下跳过重新渲染

## 语法

```tsx
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

### 参数

- `Component`：要进行记忆化的组件。
- 可选参数`arePropsEqual`：一个函数，接受两个参数：组件的前一个 props 和新的 props。如果旧的和新的 props 相等，即组件使用新的 props 渲染的输出和表现与旧的 props 完全相同，则它应该返回 `true`。否则返回 `false`。通常情况下，你不需要要指定此函数 ，默认情况下，React会使用`Object.is`比较每个prop

### 返回值

`memo`返回一个新的React组件

## 用法

当我们在输入框输入值时，会导致组件重新渲染，而子组件并没有依赖父组件的任何数据，引起不必要的渲染，所以我们可以使用`memo`缓存

```tsx
import { memo, useState } from 'react'

interface User {
  name: string
  age: number
  email: string
}
interface CardProps {
  user: User
}

const Card = memo((props: CardProps) => {
  const { user } = props
  console.log('card render')
  const styles = {
    backgroundColor: 'lightblue',
    padding: '20px',
    borderRadius: '10px',
    margin: '10px'
  }

  return (
    <div style={styles}>
      <h1>{user.name}</h1>
      <p>age: {user.age}</p>
      <p>email: {user.email}</p>
    </div>
  )
})

function App() {
  const [users, setUsers] = useState<User>({
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com'
  })
  const [search, setSearch] = useState('')

  const changeUser = () => {
    setUsers({
      name: search,
      age: 18,
      email: search + '@example.com'
    })
  }

  return (
    <div>
      <h1>父组件</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={changeUser}>改变用户</button>
      <Card user={users} />
    </div>
  )
}

export default App

```

只有当改变子组件的`props`才会引起重新渲染