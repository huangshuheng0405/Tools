# 异步组件

`Suspense`用于**处理异步加载**的组件。它可以在某些内容没准备好时，先显示一个占位UI（fallback），等内容加载完成后再显示真正的内容

## 背景

假设你的首页有一个很大的组件：

```
<Home>
    <Header />
    <UserInfo />
    <Article />
    <Comment />
</Home>
```

其中 `Comment` 很大（几百 KB）。

如果正常导入：

```jsx
import Comment from "./Comment";
```

浏览器会

```
下载 Header
下载 UserInfo
下载 Article
下载 Comment
```

全部下载完才会显示整个页面，用户体验非常不好

React提供了懒加载

```jsx
const Comment = React.lazy(() => import("./Comment"));
```

但是在下载`Comment`的时候，页面该显示什么？

这就是`Suspense`的作用

## 用法

`fallback`就是等待时，显示的UI

```tsx
import { Suspense, lazy } from 'react'
const Test = lazy(() => import('./components/Test'))

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Test />
      </Suspense>
    </div>
  )
}

export default App

```

::: danger

`React.lazy`必须配合`Suspense`，否则会报错

:::

## 多个组件一起加载

```jsx
<Suspense fallback={<Loading />}>
    <A />
    <B />
    <C />
</Suspense>
```

只要有一个没准备好，整个`Suspense`就会显示`loading`，直到全部加载完

## 代码分割（Coding Splitting）

React 中最常见的 `Suspense` 用法就是**按需加载组件**。

```tsx
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const User = lazy(() => import("./pages/User"));

<Suspense fallback={<Loading />}>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user" element={<User />} />
    </Routes>
</Suspense>
```

进入首页，只会下载`Home`，点击`/about`，才会下载`About.js`

- 首屏更快

- JS包更小

  
