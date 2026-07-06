# use

用来直接读取`Promise`或`Context`的值，通常和`Suspense`一起使用

`use()` 可以读取 Promise 或 Context，如果 Promise 还没有完成，React 会暂停渲染，并交给 `Suspense` 显示 fallback。

## 用法

### 异步数据加载

实现卡片效果，在数据加载过程中展示骨架屏，数据加载完后显示卡片详情

::: tip

建议升级到`React19`，因为用到了`use`这个API,在之前版本这个时实验性特性，在19版本才纳入正式特性

:::

模拟数据，我们可以放到`public`目录下

[http://localhost:5173/data.json](http://localhost:5173/data.json)

Card组件

```json [public/data.json]
{
  "data": {
    "id": 1,
    "address": "北京市房山区住岗子村10086",
    "name": "小满",
    "age": 26,
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=小满"
  }
}
```

::: code-group

```tsx [Card/index.tsx] (10-17,20)
import { use } from 'react'
import './index.css'
interface Data {
  name: string
  age: number
  address: string
  avatar: string
}

const getData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return (await fetch('http://localhost:5173/data.json').then((res) =>
    res.json()
  )) as { data: Data }
}

const dataPromise = getData()

const Card: React.FC = () => {
  const { data } = use(dataPromise)
  return (
    <div className="card">
      <header className="card-header">
        <div className="card-name">{data.name}</div>
        <div className="card-age">{data.age}</div>
      </header>
      <section className="card-content">
        <div className="card-address">{data.address}</div>
        <div className="card-avatar">
          <img width={50} height={50} src={data.avatar} alt="" />
        </div>
      </section>
    </div>
  )
}

export default Card
```

```css [Card/index.css]
.card {
  width: 300px;
  height: 150px;
  border: 1px solid #d6d3d3;
  margin: 30px;
  border-radius: 2px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d6d3d3;
  padding: 10px;
}

.card-age {
  font-size: 12px;
  color: #999;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
```

:::

骨架屏组件

::: code-group

```tsx [Skeleton/index.tsx]
import './index.css'
export const Skeleton = () => {
  return (
    <div className="skeleton">
      <header className="skeleton-header">
        <div className="skeleton-name"></div>
        <div className="skeleton-age"></div>
      </header>
      <section className="skeleton-content">
        <div className="skeleton-address"></div>
        <div className="skeleton-avatar"></div>
      </section>
    </div>
  )
}
```

```css [Skeleton/index.css]
.skeleton {
  width: 300px;
  height: 150px;
  border: 1px solid #d6d3d3;
  margin: 30px;
  border-radius: 2px;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d6d3d3;
  padding: 10px;
}

.skeleton-name {
  width: 100px;
  height: 20px;
  background-color: #d6d3d3;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-age {
  width: 50px;
  height: 20px;
  background-color: #d6d3d3;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.skeleton-address {
  width: 100px;
  height: 20px;
  background-color: #d6d3d3;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-avatar {
  width: 50px;
  height: 50px;
  background-color: #d6d3d3;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
```

:::

```tsx [App.tsx]
import React, { Suspense } from 'react'
import Card from './components/Card'
import { Skeleton } from './components/Skeleton'
const App: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <Card />
      </Suspense>
    </>
  )
}

export default App
```

## 与useEffect的区别

`useEffect`时组件已经渲染了，再去请求

而`use`是，发现了`Promise`，等待完成后，再接着渲染
