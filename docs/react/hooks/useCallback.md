# useCallback

在React中，函数组件的重新渲染会导致组件内的函数被重新创建，这可能会导致性能问题。useCallback 通过缓存函数，可以减少不必要的重新渲染，提高性能。

## 语法

```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 参数

- `callback`：要缓存的函数
- `dependencies`：有关是否更新`callback`的所以响应式值的一个列表

### 返回值

在初次渲染时，`useCallback` 返回你已经传入的 `fn` 函数

在之后的渲染中, 如果依赖没有改变，`useCallback` 返回上一次渲染中缓存的 `fn` 函数；否则返回这一次渲染传入的 `fn`。

## 用法

### 一

创建了一个`WeakMap`，用来观察函数是否因为重新渲染而重复创建

```tsx
import { useCallback, useState } from 'react'
const functionMap = new WeakMap()
let counter = 1
const App: React.FC = () => {
   console.log('Render App')
   const [search, setSearch] = useState('')
   const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
   }
   if(!functionMap.has(changeSearch)) {
      functionMap.set(changeSearch, counter++)
   }
   console.log('函数Id', functionMap.get(changeSearch))
   return <>
      <input type="text" value={search} onChange={changeSearch} />
   </>;
};
export default App;
```

因为`WeakMap`根据**引用地址**判断，所以`changeSearch`确实被重复创建了

### 二

- 我们创建了一个Child子组件，并使用`React.memo`进行优化，`memo`在上一章讲过了，他会检测`props`是否发生变化，如果发生变化，就会重新渲染子组件。
- 我们创建了一个`childCallback`函数，传递给子组件，然后我们输入框更改值，发现子组件居然重新渲染了，但是我们并没有更改`props`，这是为什么呢？
- 这是因为输入框的值发生变化，`App`就会重新渲染，然后`childCallback`函数就会被重新创建，然后传递给子组件，子组件会判断这个函数是否发生变化，但是每次创建的函数内存地址都不一样，所以子组件会重新渲染。

```tsx
import React, { useCallback, useState } from 'react'
const Child = React.memo(({ user, callback }: { user: { name: string; age: number }, callback: () => void }) => {
   console.log('Render Child')
   const styles = {
      color: 'red',
      fontSize: '20px',
   }
   return <div style={styles}>
      <div>{user.name}</div>
      <div>{user.age}</div>
      <button onClick={callback}>callback</button>
   </div>
})

const App: React.FC = () => {
   const [search, setSearch] = useState('')
   const [user, setUser] = useState({
      name: 'John',
      age: 20
   })
   const childCallback = () => {
      console.log('callback 执行了')
   }
   return <>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
      <Child callback={childCallback} user={user} />
   </>;
};

export default App;
```

因为App重新渲染了，所以childCallback函数会被重新创建，然后传递给子组件，子组件会判断这个函数是否发生变化，但是每次创建的函数内存地址都不一样，所以子组件会重新渲染。

::: tip

只需要在childCallback函数上使用useCallback，就可以优化性能。

:::

```tsx
const childCallback = useCallback(() => {
    console.log('callback 执行了')
}, [])
```

