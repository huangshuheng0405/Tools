# createPortal

允许你将JSX作为Children渲染至DOM的不同部分

## 语法

```tsx
createPortal(children, domNode, key?)
```

### 参数

- `children`: React 可以渲染的任何内容，如 JSX 片段（`<div />` 或 `<SomeComponent />` 等等）、Fragment（`<>...</>`）、字符串或数字，以及这些内容构成的数组。
- `domNode`：某个已经存在的 DOM 节点，例如由 `document.getElementById()` 返回的节点。在更新过程中传递不同的 DOM 节点将导致 portal 内容被重建。
- 可选参数`key`：用作 portal key的独特字符串或数字。

### 返回值

`createPortal` 返回一个可以包含在 JSX 中或从 React 组件中返回的 React 节点。如果 React 在渲染输出中遇见它，它将把提供的 `children` 放入提供的 `domNode` 中。

## 用法

- 弹窗
- 下拉框
- 全局提示
- 全局遮罩
- 全局Loading

例如 Antd 的 Modal 组件，就是挂载到 body 上的。

### 封装弹框组件

::: code-group

```tsx [Modal/index.tsx]
import { Modal } from './components/Modal'

const App = () => {
  return (
    <>
      <div
        style={{
          width: '800px',
          height: '600px',
          border: '1px solid #4d4d4d',
          position: 'relative'
        }}
      >
        <Modal />
      </div>
    </>
  )
}

export default App
```

```css [Modal/index.css]
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #4d4d4d;
  width: 500px;
  height: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.modal-content {
  padding: 20px 0;
  flex: 1;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
}
.modal-close-button {
  margin-right: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.modal-confirm-button {
  margin-left: 10px;
  background-color: rgb(46, 46, 164);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
```

```tsx [App.tsx]
import { Modal } from './components/Modal'

const App = () => {
  return (
    <>
      <div
        style={{
          width: '800px',
          height: '600px',
          border: '1px solid #4d4d4d',
          position: 'relative'
        }}
      >
        <Modal />
      </div>
    </>
  )
}

export default App
```

:::

如果外层有`position: relative` 的样式，那么弹框会相对于外层进行定位，如果外层没有`position: relative` 的样式，那么弹框会相对于`body`进行定位,故此这个`Modal`不稳定，所以需要使用`createPortal`来将`Modal`挂载到`body`上，或者直接将定位改成`position: fixed`,两种方案。

使用`createPortal`挂载`Modal`挂载到`body`上

```tsx [Modal/index.tsx] (4,17)
import './index.css'
import { createPortal } from 'react-dom'
export const Modal = () => {
  return createPortal(
    <div className="modal">
      <div className="modal-header">
        <div className="modal-title">标题</div>
      </div>
      <div className="modal-content">
        <h1>Modal</h1>
      </div>
      <div className="modal-footer">
        <button className="modal-close-button">关闭</button>
        <button className="modal-confirm-button">确定</button>
      </div>
    </div>,
    document.body
  )
}
```

我更推荐使用`createPortal`因为他更灵活，可以挂载到任意位置，而`position: fixed`,会有很多问题，在默认的情况下他是根据浏览器视口进行定位的，但是如果父级设置了`transform、perspective、filter 或 backdrop-filter` 属性非 none 时，他就会相对于父级进行定位，这样就会导致Modal组件定位不准确`(他不是一定按照浏览器视口进行定位)`，所以不推荐使用。
