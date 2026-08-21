# useMemo

`useMemo`在每次重新渲染的时候能够缓存计算结果

## 语法

```tsx
const cachedValue = useMemo(calculateValue, dependencies)
```

### 参数

- `calculateValue`：要缓存计算值的函数，它应该是一个没有任何参数的纯函数，并且可以返回任意类型。React 将会在首次渲染时调用该函数；在之后的渲染中，如果 `dependencies` 没有发生变化，React 将直接返回相同值。否则，将会再次调用 `calculateValue` 并返回最新结果，然后缓存该结果以便下次重复使用。
- `dependencies`：所有在 `calculateValue` 函数中使用的响应式变量组成的数组。

### 返回值 

在初次渲染时，`useMemo` 返回不带参数调用 `calculateValue` 的结果。

在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值；否则将再次调用 `calculateValue`，并返回最新结果。

## 用法

```tsx
import React, { useMemo, useState } from 'react'

function App() {
  const [search, setSearch] = useState('')
  const [goods, setGoods] = useState([
    { id: 1, name: '苹果', price: 10, count: 1 },
    { id: 2, name: '香蕉', price: 20, count: 1 },
    { id: 3, name: '橘子', price: 30, count: 1 }
  ])
  const handleAdd = (id: number) => {
    setGoods(
      goods.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    )
  }
  const handleSub = (id: number) => {
    setGoods(
      goods.map((item) =>
        item.id === id ? { ...item, count: item.count - 1 } : item
      )
    )
  }
  const total = useMemo(() => {
    console.log('total')
    return goods.reduce((total, item) => total + item.price * item.count, 0)
  }, [goods])
  return (
    <div>
      <h1>父组件</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>商品名称</th>
            <th>商品价格</th>
            <th>商品数量</th>
          </tr>
        </thead>
        <tbody>
          {goods.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price * item.count}</td>
              <td>
                <button onClick={() => handleAdd(item.id)}>+</button>
                <span>{item.count}</span>
                <button onClick={() => handleSub(item.id)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>总价：{total}</h2>
    </div>
  )
}

export default App

```

## 执行时机

1. 如果依赖项是个空数组，那么 `useMemo` 的回调函数会执行一次
2. 指定依赖项，当依赖项发生变化时， `useMemo` 的回调函数会执行
3. 不指定依赖项，不推荐这么用，因为每次渲染和更新都会执行

## 注意

如果计算逻辑简单，使用`useMemo`的开销可能比重新计算还大