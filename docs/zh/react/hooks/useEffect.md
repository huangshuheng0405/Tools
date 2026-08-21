# useEffect

`useEffect`是React中用于处理副作用的钩子。并且可以充当生命周期函数

## 副作用函数

副作用函数 指的是那些在执行时会改变外部状态或依赖外部可变状态的函数。

- 操作引用类型
- 操作本地存储例如`localStorage`
- 调用外部`API`，例如`fetch` `ajax`
- 操作`DOM`
- 计时器

```ts
let globalVariable = 0;

function calculateDouble(number){  
  globalVariable += 1; //修改函数外部环境变量

  localStorage.setItem('globalVariable', globalVariable); //修改 localStorage

  fetch(/*…*/).then((res)=>{ //网络请求
   //…  
  }); 

  document.querySelector('.app').style.color = 'red'; //修改 DOM element

  return number *2
}
```

## 语法

```js
useEffect(setup, dependencies?)
```

- `setup`：`Effect`处理函数,可以返回一个清理函数。组件挂载时执行`setup`,依赖项更新时先执行`cleanup`再执行`setup`,组件卸载时执行`cleanup`。
- `dependencies(`可选)：setup中使用到的响应式值列表(`props`、`state`等)。必须以数组形式编写如[`dep1`,`dep2`]。不传则每次重渲染都执行Effect。

返回值是`undefined`

根据第二个参数的不同传入方式，`useEffect`的执行时机有三种情况：

| 依赖性情况                     | 执行时机                                           | 常见用途                                               |
| ------------------------------ | -------------------------------------------------- | ------------------------------------------------------ |
| `useEffect(() => {})`          | **每次组件渲染/更新后**都会执行。                  | 极少使用，容易导致性能问题或死循环。                   |
| `useEffect(() => {}, [])`      | **仅在组件挂载（Mount）完成后**执行一次。          | 初始化数据请求、绑定全局事件、启动定时器。             |
| `useEffect(() => {}, [count])` | **首次挂载后**执行，以及**依赖项发生变化后**执行。 | 联动更新。比如当用户 ID 改变时，重新获取该用户的数据。 |

## 用法

**清理函数应用场景**

例如我们下面这个例子，当`name`值发生改变时，`useEffect`的副作用函数就会执行，并且会开启一个定时器，当`name`值再次发生改变时，`useEffect`的副作用函数就会执行清理函数，清除上一次的定时器。这样就避免了接口请求的重复执行。

```tsx
import { useEffect, useState } from "react"
// 子组件
const Child = (props: { name: string }) => {
   useEffect(() => {
      let timer = setTimeout(() => {
         fetch(`http://localhost:5174/?name=${props.name}`)
      }, 1000)
      return () => {
         clearTimeout(timer)
      }
   }, [props.name])
   return <div>Child</div>
}
const App = () => {
   const [show, setShow] = useState(true)
   const [name, setName] = useState('')
   return (
      <div id='data'>
         <div>
            <h3>父组件</h3>
            <input value={name} onChange={e => setName(e.target.value)} />
            <button onClick={() => setShow(!show)}>显示/隐藏</button>
         </div>
         <hr />
         <h3>子组件</h3>
         {show && <Child name={name} />}
      </div>
   )
}

export default App
```

