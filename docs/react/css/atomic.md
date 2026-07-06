# Atomic CSS

## 基本概念

一个CSS类只负责一个样式

```html
<style>
  .bg-red {
    color: red;
  }
  .text-center {
    text-align: center;
  }
  .p-10 {
    padding: 10px;
  }
</style>
<section class="bg-red text-center p-10">原子化 css</section>
```

框架：`tailwindcss`、`UnoCSS`、`Windi CSS`

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/)

```bash [npm]
npm install tailwindcss @tailwindcss/vite
```

配置插件

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()]
})
```

新建一个`css`文件（比如`tailwind.css`）引入样式

```css
@import 'tailwindcss';
```

在`src/main.tsx`引入

```tsx
import './tailwind.css'
```

如果用的是VS Code，可以下在一个插件，会自动提示`tailwindcss`的样式

![](/React/tailwindcss.png)

### 简单演示

```tsx
import React from 'react'
const App: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 h-screen w-screen flex justify-center items-center">
        <div className="text-white text-4xl font-bold hover:text-gray-300">
          Esther
        </div>
      </div>
    </>
  )
}

export default App
```

![](/React/tailwind-demo.png)

### 进阶用法

我们可以看到上述代码中，类名用了很多都是堆在一起的，这样看起来很不美观，我们可以使用 `tailwindcss` 的 `@apply` 来解决这个问题。

```css [src/tailwind.css]
@import "tailwindcss";

.blob-bg {
    @apply bg-gradient-to-r from-pink-600 to-purple-600 h-screen w-screen flex justify-center items-center;
}

.blob-text {
    @apply text-white text-4xl font-bold hover:text-gray-300;
}
```

```tsx [src/App.tsx]
<div className="blob-bg">
    <div className="blob-text">
        Esther
    </div>
</div>
```

更简洁
