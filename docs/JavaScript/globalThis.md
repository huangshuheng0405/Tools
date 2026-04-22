# globalThis

随着`javascript`运行环境的多样化（浏览器、Node.js、Web Workers），访问全局对象变得非常混乱

- **浏览器**叫`window`
- `Node.js`里叫`global`
- `Web Workers`里只有`self`

为了终结这种环境探测的乱象，`ES2020`引入了`globalThis`

`globalThis`**是一个统一的引用，无论你的代码在哪里跑，它始终指向当前的全局对象**
