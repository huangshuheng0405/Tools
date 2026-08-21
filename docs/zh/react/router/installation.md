# 安装

[React Router](https://reactrouter.com/) 是 React 的官方路由库。当前最新版本为 **v8**。

::: warning 注意
React Router v8 需要 **Node.js >= 22**、**React >= 19.2.7**、**Vite >= 7**（框架模式），且仅支持 **ESM**。
:::

`react-router`在最新版本中，设计了三种模式

## 框架模式（Framework）

框架模式就是使用，React-router 提供的脚手架模板去安装，安装完成后会自带路由功能。

```bash
npx create-react-router@latest my-react-router-app # 创建项目
cd my-react-router-app # 进入项目
npm i # 安装依赖
npm run dev # 启动项目
```

## 数据模式（Data）

数据模式就是，我们可以使用自己的模板去创建`React`项目，比如使用`vite` `webpack` 等，然后自己安装`React-router`。

```ts
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/about',
    Component: About,
  },
]);
```

## 声明模式（Declarative）

适用于仅需 URL 匹配与导航的简单应用。

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app";
import About from '../about'
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
```

::: tip

数据模式和声明模式的区别，数据模式可以享用`React-router`所有的功能，包括数据处理。而声明模式只能享用`React-router`的一部分功能，比如路由跳转。

如果做一个小项目可以使用`声明模式`，如果要做企业级项目可以使用`数据模式`。

:::

## 基本使用

pages目录创建两个组件，Home和About

新建目录`router`，在目录新建文件`index.ts`，在文件引入`React-router`，然后使用`createBrowserRouter`创建路由。

```ts [router/index.ts]
import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
import About from '../pages/About';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/about',
    Component: About,
  },
]);

export default router;
```

在`App.tsx`文件中引入路由，然后使用`RouterProvider`包裹`App`组件。

```tsx [App.tsx]
import React from 'react';
import { RouterProvider } from 'react-router';
import router from './router';
const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
```



## v7 → v8 迁移要点

- `react-router-dom` 包已移除，所有导入改为 `react-router`
- `future.v8_*` 标志已移除，对应行为现为默认
- 仅支持 ESM，不再发布 CommonJS
