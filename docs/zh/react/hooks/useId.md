# useId

可以生产传递给无障碍属性的唯一ID

## 语法

```tsx
const id = useId()
```

### 参数

不带任何参数

### 返回值

返回一个唯一的字符串ID，与此组件中的`useId`调用相关联

## 用法

即使`PasswordField`多次出现在屏幕上，生成的ID也不会冲突

```tsx
import { useId } from 'react'

const PasswordField = () => {
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>密码</label>
      <input type="password" id={id} />
    </div>
  )
}

const App = () => {
  return (
    <div>
      <PasswordField />
      <PasswordField />
    </div>
  )
}

export default App

```

### 为多个相关元素生成ID

如果你需要为多个相关元素生成 ID，可以调用 `useId` 来为它们生成共同的前缀：

```tsx
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>名字：</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>姓氏：</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}

```

可以使你避免为每个需要唯一 ID 的元素调用 `useId`。