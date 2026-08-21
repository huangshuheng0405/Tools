# CSS Module

CSS Modules 是 React 中一种**解决 CSS 样式冲突**的方案，它的核心思想就是：

> **让每个组件的 CSS 默认都是局部作用域（Local Scope），避免全局污染。**

如果你学过 Vue 的 `scoped`，可以把 CSS Modules 理解成 React 官方推荐的一种类似方案。

## 如何在Vite中使用 CSS Modules

css modules，可以配合各种css预处理去使用，例如`less`，`sass`，`stylus`等。

```bash [npm]
npm i sass -D
npm i less -D
npm i stylus -D
```

以上任选其一即可

::: tip
在Vite中css Modules 是开箱即用的，只需要把文件名设置为`xxx.module.[css|less|sass|stylus]`，就可以使用css modules了。
:::

```scss [src/components/Button/index.module.scss]
.button {
  color: red;
}
```

```tsx [src/components/Button/index.tsx]
//使用方法，直接引入即可
import styles from './index.module.scss'

export default function Button() {
  return <button className={styles.button}>按钮</button>
}
```

- 编译结果, 可以看到`button`类名被编译成了`button_pmkzx_6`，这就是css modules的实现原理，通过在类名前添加一个唯一的哈希值，来实现样式隔离。

```html
<button class="button_pmkzx_6">按钮</button>
```

## 修改css modules 规则

在`vite.config.ts`中配置css modules 规则：

```ts [vite.config.ts]
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: 'button-[hash:8]'
    }
  }
})
```

- `localsConvention`：指定类名的命名规范，默认是`camelCase`， 可以选择`dashedCase`
- `generateScopedName`：修改css modules的类名规则，默认是`[name]_[hash:8]`， 可以自定义。

::: warning
camelCase 和 camelCaseOnly 区别在于，camelCase 会把非驼峰的命名转为驼峰，并保留之前的类名，而 camelCaseOnly 只会把非驼峰的命名转为驼峰，并删除之前的类名。
:::

## 如何写全局样式

如果希望某个类变成全局：

```css
:global(.container) {
  width: 1200px;
}
```
