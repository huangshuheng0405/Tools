# useImperativeHandle

父组件可以调用子组件的方法，或者访问子组件的属性。 如果你学过Vue，就类似于Vue的`defineExpose`

## 语法

```jsx
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... 你的方法 ...
    };
  }, []);
  // ...
```

### 参数

- `ref`：该 `ref` 是你从 `MyInput` 组件的 prop 中提取的参数。
- `createHandle`：该函数无需参数，它返回你想要暴露的 ref 的句柄。该句柄可以包含任何类型。通常，你会返回一个包含你想暴露的方法的对象。
- **可选的** `dependencies`：函数 `createHandle` 代码中所用到的所有反应式的值的列表。反应式的值包含 props、状态和其他所有直接在你组件体内声明的变量和函数。倘若你的代码检查器已 [为 React 配置好](https://zh-hans.react.dev/learn/editor-setup#linting)，它会验证每一个反应式的值是否被正确指定为依赖项。该列表的长度必须是一个常数项，并且必须按照 `[dep1, dep2, dep3]` 的形式罗列各依赖项。React 会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 来比较每一个依赖项与其对应的之前值。如果一次重新渲染导致某些依赖项发生了改变，或你没有提供这个参数列表，你的函数 `createHandle` 将会被重新执行，而新生成的句柄则会被分配给 ref。

::: tip
从React19开始，`ref`可以作为`prop`使用。在React18及更早需要通过`forwardRef`来获取`ref`
:::

### 返回值

`useImperativeHandle` 返回 `undefined`。

### 执行时机

类似`useEffect`

- 如果不传第三个参数，那么会在组件挂载时执行一次，然后状态更新时，都会执行一次
- 如果传入的是一个空数组，那么会在组件挂载时执行一次，然后状态更新时，不会执行
- 如果传入且有值，那么会在组件挂载时执行一次，然后会根据依赖项的变化，决定是否重新执行

## 用法

你通过命令式句柄暴露出来的方法不一定需要完全匹配 DOM 节点的方法。例如，这个 `Post` 组件暴露了一个 `scrollAndFocusAddComment` 方法。它可以让你在点击按钮后，使父组件 `Page` 滚动到评论列表的底部并聚焦到输入框：

::: code-group

```tsx [App.tsx]
import Post from './views/Post.tsx'
import { useRef } from 'react'

function App() {
  const postRef = useRef(null)
  return (
    <div>
      <button onClick={() => postRef.current?.scrollToBottomAndFocus()}>
        Scroll to bottom and focus
      </button>
      <Post ref={postRef} />
    </div>
  )
}

export default App
```

```tsx [AddComment.tsx]
function AddComment({ ref }) {
  return <input type="text" placeholder="Add comment" ref={ref} />
}

export default AddComment
```

```tsx [CommentList.tsx]
import { useImperativeHandle, useRef } from 'react'

function CommentList({ ref }) {
  const divRef = useRef(null)

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current
        if (node) {
          node.scrollTop = node.scrollHeight
        }
      }
    }
  }, [])

  const comments = []
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment {i}</p>)
  }

  return <div ref={divRef}>{comments}</div>
}

export default CommentList
```

```tsx [Post.tsx]
import { useRef } from 'react'
import CommentList from '../components/CommentList'
import AddComment from '../components/AddComment'
import { useImperativeHandle } from 'react'

function Post({ ref }) {
  const commentListRef = useRef(null)
  const addCommentRef = useRef(null)

  useImperativeHandle(ref, () => {
    return {
      scrollToBottomAndFocus() {
        commentListRef.current?.scrollToBottom()
        addCommentRef.current?.focus()
      }
    }
  }, [])

  return (
    <div>
      <article>
        <p>welcome to react study</p>
      </article>
      <CommentList ref={commentListRef} />
      <AddComment ref={addCommentRef} />
    </div>
  )
}

export default Post
```

:::
