# useState

它允许你向组件里添加一个状态变量

## 语法

```tsx
const [state, setState] = useState(initialState)
```

### 参数

- `initialState`：你希望state初始化的值。它可以是任何类型的值，但对于函数有特殊的行为。在初始渲染后，此参数将被忽略
  - 如果传递函数作为`initialState`，则它被视为**初始化函数**。它应该是纯函数，不应该接受任何参数，并且应该返回一个任何类型的值。当初始化组件时，React 将调用你的初始化函数，并将其返回值存储为初始状态。

### 返回

`useState`返回一个由两个值组成的数组：

1. 当前的`state`。在首次渲染时，它将与你传递的`initialState`相匹配
2. `set`函数，它可以让你将`state`更新为不同的值并且触发重新渲染

### set函数

`useState` 返回的 `set` 函数允许你将 state 更新为不同的值并触发重新渲染。你可以直接传递新状态，也可以传递一个根据先前状态来计算新状态的函数：

```tsx
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

## 注意事项

- 严格模式下，React将**两次调用初始化函数**，以帮你找到意外的不纯性。这只是开发时的行为，不影响生产。

```js
import React, { useState } from 'react';

function Counter() {
  // 声明一个名为 count 的状态变量，初始值为 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      {/* 点击时调用 setCount 更新状态 */}
      <button onClick={() => setCount(count + 1)}>
        加 1
      </button>
    </div>
  );
}
```

当操作**数组和对象**时，永远不要直接修改状态，而是传入一个**全新的数组或对象**来替换它

因为React是通过比较新旧状态的**内存引用**来决定是否需要重新渲染的，如果直接修改了原对象或原数组（比如`obj.name = 'xxx' ` 或 `arr.push(1)`），由于它们的**内存地址没有变**，React会认为状态没有发生变化，从而拒绝渲染页面

**对于对象**

我们可以使用`...`展开运算符复制旧属性，并覆盖需要修改的属性

```js
const [user, setUser] = useState({ name: 'xiaohuang', age: 20, city: 'Chengdu' });

// 正确姿势
setUser({
  ...user,     // 复制原有属性：name, city
  age: 21      // 覆盖 age 属性
});
```

如果对象有多层嵌套，咱开运算符需要**每一次都展开**

```js
const [user, setUser] = useState({
  name: 'xiaohuang',
  info: { age: 20, score: 100 }
});

// 更新嵌套的 age
setUser({
  ...user,
  info: {
    ...user.info, // 必须展开这一层，否则 score 会丢失！
    age: 21
  }
});
```

**对于数组**

对于数组的操作，凡是**会改变原数组的方法**（如 `push`、`pop`、`splice`、`sort`、`reverse`）都**不能**直接用在状态上。我们必须使用**返回新数组的方法**（如 `concat`、`filter`、`map`）或者结合展开运算符。

## Immer

[immer](https://immerjs.github.io/immer/)

安装

```bash
npm i immer use-immer
```

如果你的状态是一个层级很深的复杂对象或数组，每次更新都写一堆`...`很繁琐，有一个库可以直接修改数据，底层自动帮你生成一个全新的、不可变的对象

```js
import { useImmer } from 'use-immer'; // Immer 专门为 React 封装的 hook

const [user, setUser] = useImmer({
  name: 'xiaohuang',
  info: { age: 20, score: 100 }
});

// 使用 Immer，你可以直接这样写，它非常安全且能触发渲染：
setUser(draft => {
  draft.info.age = 21; // 像写原生 JS 一样直观修改
});
```

## 异步快照

`setCount`并不会立刻改变当前执行上下文中的`count`值

```js
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // ❌ 打印出来的依然是 0，而不是 1！
};
```

这是因为 `count` 是一个常量，在当前这次点击事件的函数作用域里，它的值已经固定是 `0` 了。调用 `setCount` 只是**计划**在下一次渲染时把它变成 `1`

## 函数式更新

如果需要连续多次更新当前状态值，或者在异步回调中获取最新状态，应该给`setRef`传递一个**回调函数**，而不是具体的值

```js
// 错误写法：最终 count 只会加 1，因为三次 count 拿到的都是快照值 0
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);

// 正确写法：最终 count 会加 3。React 会把前一个状态当做参数传给下一个回调
setCount(prevCount => prevCount + 1);
setCount(prevCount => prevCount + 1);
setCount(prevCount => prevCount + 1);
```

## 惰性初始状态

`Lazy Initial State`

如果状态的初始值需要通过一段复杂的计算才能得到，直接把计算函数写在 `useState(expensiveCompute())` 里会导致**每次组件重新渲染时，这个复杂计算函数都会被执行一遍**（虽然 React 之后会忽略它的返回值）。

为了优化性能，可以传入一个**匿名函数**，这样该计算只会在组件**首次挂载（Mount）时执行一次**：

```js
// ❌ 每次渲染都会执行 expensiveCompute()
const [data, setData] = useState(expensiveCompute()); 

//  只在初始化时执行一次
const [data, setData] = useState(() => expensiveCompute());
```

## 底层原理

在 React 内部，当一个函数组件对应的 Fiber 节点被创建时，它身上会有一个 `memoizedState` 属性。这个属性并不是存一个普通的值，而是存了一个**由 Hook 节点组成的单向链表**。

当你连续调用多个 Hook 时：

```js
const [name, setName] = useState('xiaohuang'); // Hook 1
const [age, setAge] = useState(20);           // Hook 2
```

在 Fiber 内部会形成这样的链表结构：
$$
\text{Fiber.memoizedState} \rightarrow \text{Hook 1 (name)} \xrightarrow{\text{next}} \text{Hook 2 (age)}
$$

- **首次渲染（Mount）**：React 按照你代码书写的顺序，依次创建 Hook 节点并连成链表。
- **更新渲染（Update）**：React 重新执行整个函数，每遇到一个 `useState`，就去链表里**按顺序指针挪到下一个 Hook 节点**，把里面存的值取出来返回。

> ⚠️ **这就是为什么 Hook 不能写在 `if` 分支或循环里的原因！** 如果把 `useState` 写在 `if` 里，某次渲染条件不满足，整个链表的读取顺序就会完全错乱（比如本该读取 `age` 的 Hook，结果读到了下一个状态），导致 React 彻底崩溃。