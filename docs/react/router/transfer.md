# 参数传递

参数传递指的是在路由跳转时，将参数传递给目标路由

## query

用`?`来传递参数

```bash
#多个参数用 & 连接
/user?name=小满zs&age=18
```

跳转方式：

```tsx
<NavLink  to="/about?id=123">About</NavLink> //1. NavLink 跳转

import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/about?id=123') //2. useNavigate 跳转
```

获取参数：

`useSearchParams`

```tsx
//1. 获取参数
import { useSearchParams } from 'react-router'
const [searchParams, setSearchParams] = useSearchParams()
console.log(searchParams.get('id')) //获取id参数

//2. 获取参数
import { useLocation } from 'react-router'
const { search } = useLocation()
console.log(search) //获取search参数 ?id=123
```

## params

使用`:[name]`来传递参数

```bash
/user/:id
```

跳转方式同上

获取参数

`useParams`

```tsx
import { useParams } from 'react-router'
const { id } = useParams()
console.log(id) //获取id参数
```

## State

state在URL中不显示，但是可以传递参数，例如：

```bash
/user
```

跳转方式

```tsx
<Link to="/user" state={{ name: '小满zs', age: 18 }}>User</Link> //1. Link 跳转
<NavLink to="/user" state={{ name: '小满zs', age: 18 }}>User</NavLink> //2. NavLink 跳转
import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate('/user', { state: { name: '小满zs', age: 18 } }) //3. useNavigate 跳转
```

获取参数：

`useLocation`

```tsx
import { useLocation } from 'react-router'
const { state } = useLocation()
console.log(state) //获取state参数
console.log(state.name) //获取name参数
console.log(state.age) //获取age参数
```

## 总结

params（`/user/:id`）

- 适用于：传递必要的路径参数（如ID）
- 特点：符合 RESTful 规范，刷新不丢失
- 限制：只能传字符串，参数显示在URL中

query（`/user?name=xiaoman`）

- 适用于：传递可选的查询参数
- 特点：灵活多变，支持多参数
- 限制：URL可能较长，参数公开可见

state

- 适用于：传递复杂数据结构
- 特点：支持任意类型数据，参数不显示在URL
- 限制：刷新可能丢失，不利于分享