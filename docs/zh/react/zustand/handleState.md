# 状态处理

## 深层次状态处理

`Zustand`会合并第一层的 state，但是对于深层次的状态更新，我们需要特别注意。让我们通过一个葫芦娃的例子来演示。

```tsx [stores/user.ts]
import { create } from 'zustand'

interface User {
    gourd: {
        oneChild: string,
        twoChild: string,
        threeChild: string,
        fourChild: string,
        fiveChild: string,
        sixChild: string,
        sevenChild: string,
    },
    updateGourd: () => void
}

// 创建 store
const useUserStore = create<User>(((set) => ({
    // 初始化葫芦娃状态
    gourd: {
        oneChild: '大娃',
        twoChild: '二娃',
        threeChild: '三娃',
        fourChild: '四娃',
        fiveChild: '五娃',
        sixChild: '六娃',
        sevenChild: '七娃',
    },
    // 更新方法
    updateGourd: () => set((state) => ({
        gourd: {
            // ...state.gourd,  // 需要手动合并状态 // [!code highlight]
            oneChild: '大娃-超进化',
        }
    }))
})))

export default useUserStore;
```

> 注意：如果不进行状态合并，其他状态会丢失。每次更新都需要手动合并状态，这在实际开发中会变得很繁琐。

## 使用immer中间件

因为 Zustand 本身不会帮你处理深层对象更新，所以通常会结合 Immer 使用。

```ts [stores/user.ts]
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface User {
  gourd: {
    oneChild: string
    twoChild: string
    threeChild: string
    fourChild: string
    fiveChild: string
    sixChild: string
    sevenChild: string
  }
  updateGourd: () => void
}

// 创建 store
const useUserStore = create<User>()(
  immer((set) => ({
    // 初始化葫芦娃状态
    gourd: {
      oneChild: '大娃',
      twoChild: '二娃',
      threeChild: '三娃',
      fourChild: '四娃',
      fiveChild: '五娃',
      sixChild: '六娃',
      sevenChild: '七娃'
    },
    // 更新方法
    updateGourd: () =>
      set((state) => {
        state.gourd.oneChild = '大娃-超进化'
      })
  }))
)

export default useUserStore

```

> 更推荐的方式是直接使用 Zustand 官方提供的 `immer` 中间件，而不是每次都手动调用 `produce`。
