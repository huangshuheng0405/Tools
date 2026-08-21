# 闭包

## 定义

**闭包是指一个函数有权访问另一个函数作用域中的变量。** 在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。通俗来说：**闭包 = 函数 + 该函数能够访问的外部自由变量**。

## 形成闭包的原因

内部函数存在外部作用域的引用就会导致闭包

```js
var a = 0
function foo() {
  var b = 14
  function fo() {
    console.log(a, b)
  }
  fo()
}
foo()
```

## 闭包的作用

闭包在 JavaScript 进阶开发中几乎无处不在，主要用于**封装私有变量**和**保持状态**。

## 闭包经典使用场景

- `return`一个函数

```js
var n = 10
function fn() {
  var n = 20
  function f() {
    n++
    console.log(n)
  }
  return f
}

var x = fn()
x() // 21
```

这里的`return f`，`f()`就是一个闭包，存在上级作用域的引用

- 函数作为参数

```js
var a = 'linyi'
function foo() {
  var a = 'foo'
  function fo() {
    console.log(a)
  }
  return fo
}

function f(p) {
  var a = 'f'
  p()
}

f(foo()) // foo
```

`return fo`返回回来，`fo()`就是闭包，`f(foo())`执行的参数就是函数`fo`，因为`fo()`中的`a`的上级作用域就是函数`foo()`，所以输出就是`foo`

- `IIFE`（自执行函数）

```js
var n = '林一一'
;(function p() {
  console.log(n)
})()
// 林一一
```

同样是产生了闭包`p()`，存在`window`下的引用`n`

- 循环赋值

```js
for (var i = 0; i < 10; i++) {
  ;(function (j) {
    setTimeout(function () {
      console.log(j)
    }, 1000)
  })(i)
}
```

因为存在闭包的原因上面能依次输出`0~9`，闭包形成了`10`个互不干扰的私有作用域

- 使用回调函数就是在使用闭包

```js
window.name = 'linyi'
setTimeout(function timeHandler() {
  console.log(window.name)
}, 100)
// linyi
```

在浏览器下运行

- 防抖（Debounce）

在事件被触发 n 秒后再执行回调，如果这 n 秒内又被触发，则重新计时。（常用于搜索框输入打字停止后发送请求）

```js
function debounce(fn, delay) {
    let timer = null; // 闭包变量，记录定时器
    return function(...args) {
        if (timer) clearTimeout(timer); // 重新触发时，清除上一次的定时器
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
```

- 节流（Throttle）

规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发了多次函数，只有一次生效。（常用于滚动加载、抢购按钮点击）

```js
function throttle(fn, delay) {
    let lastTime = 0; // 闭包变量，记录上一次执行的时间戳
    return function(...args) {
        let now = Date.now();
        if (now - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = now; // 更新执行时间
        }
    };
}
```

- 柯里化实现

柯里化是一种将接收多个参数的函数转化为接收一个单一参数（最初函数的第一个参数）并返回一个新函数的技术。新函数接收余下的参数。

```js [Curry.js]
// 普通函数
function add(x, y) {
  return x + y
}

// 柯里化函数
function curryAdd(x) {
  return function (y) {
    return x + y // 闭包记住了 x
  }
}

const addTen = curryAdd(10)
console.log(addTen(5)) // 15
console.log(addTen(20)) // 30
```

## 经典面试题

- for循环和闭包

```js
var data = []

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i)
  }
}

data[0]()
data[1]()
data[2]()
```

这里的`i`时全局的`i`，共用一个作用域，当函数执行的时候这时的`i=3`，导致输出都是`3`

```js
var result = []
var a = 3
var total = 0

function foo(a) {
  for (var i = 0; i < 3; i++) {
    result[i] = function () {
      total += i * a
      console.log(total)
    }
  }
}

foo(1)
result[0]() // 3
result[1]() // 6
result[2]() // 9
```

这里形成了闭包，`total`被外层引用没有被销毁

## 示例一

```js
var name = 'the window'

let obj = {
  name: 'my obj',

  getName: function () {
    var that = this
    return function () {
      return that.name
    }
  }
}

console.log(obj.getName()()) // my obj
```

- 当调用`obj.getName`时,此时内部的this指向调用它的对象`obj`

- 代码执行`var that = this`，相当于`var that = obj`

- 这个匿名函数尝试访问`that.name`

- 虽然这个匿名函数在全局环境下独立调用的，但因为它是一个**闭包**，但依然记得自己出生时那个环境的变量`that`

- 此时`that`依然执行`obj`，所以`that.name`就是`my obj`

## 内存泄漏

闭包会使得函数中的变量都被保存在内存中，内存消耗很大。如果闭包长期存活，且引用的外部变量占用了大量内存，而你**不再需要**这些变量时，就会造成**内存泄漏**（即该释放的内存没有被释放）。

### 示例

```js
function outer() {
    let hugeArray = new Array(1000000).fill("data"); // 大对象

    return function inner() {
        console.log("I am functional");
        // 注意：inner 虽然没有显式写 hugeArray，
        // 但由于 JS 引擎的闭包优化策略，同一父作用域下的闭包共享同一个闭包对象。
        // 如果 inner 被挂载到全局，hugeArray 将无法被回收。
    };
}

window.leak = outer(); // window.leak 持有了 inner 的引用，导致 hugeArray 永远驻留内存
```

### 解决

- **手动解除引用**：当闭包不再使用时，将其赋值为 `null`，以便垃圾回收器回收。

```js
window.leak = null; // 切断引用，hugeArray 将被 GC 回收
```

- **避免滥用全局变量**：尽量少将闭包挂载到全局对象（如 `window`）上。
- **及时销毁**：在框架（如 Vue、React）中，如果在组件挂载时使用了闭包（如定时器、事件监听），在组件销毁（`unmounted` / `useEffect return`）时务必清除定时器、解绑事件。
