# 过度渲染

举个例子

```tsx
const useStore = create(() => ({
  hobby: {
    basketball: 1,
    football: 2
  },
  name: 'Tom'
}))
```

Left.tsx

```tsx
function Left() {
  const { hobby } = useStore()

  return <div>{hobby.basketball}</div>
}
```

Right.tsx

```tsx
function Right() {
  const { hobby } = useStore()

  return <div>{hobby.football}</div>
}
```

Left修改

```tsx
set((state) => ({
  hobby: {
    ...state.hobby,
    basketball: state.hobby.basketball + 1
  }
}))
```

虽然 `football` 没变，但是 **Left 和 Right 都会重新渲染。**

**为什么**

```tsx
const hobby = useStore(state => state.hobby) // 返回的是整个对象

{
  basketball:1,
  football:2
}

// 更新后

{
  basketball:2,
  football:2
}

// 虽然只有basketball改了
// 但是 旧对象 === 新对象  false

// react认为hobby变化了就会重新渲染
```

## 解决

订阅最小颗粒度

```tsx
const { hobby } = useStore() // 不要解构整个 store
const basketball = useStore(state => state.hobby.basketball) // 推荐
```

## 优化

但是多个属性时，写起来太繁琐了，这时候可以使用`useShallow`来解决这个问题

```tsx
import { useShallow } from 'zustand/react/shallow'

const { name, age } = useStore(
  useShallow(state => ({
    name: state.name,
    age: state.age
  }))
)
```

::: tip

`useShallow` 只检查顶层对象的引用是否变化，如果顶层对象的引用没有变化（即使其内部属性或子对象发生了变化，但这些变化不影响顶层对象的引用），使用 `useShallow` 的组件将不会重新渲染

:::
