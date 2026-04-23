# 闭包

## 闭包是什么

闭包是指有权访问另一个函数作用域中变量的函数

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

- 保护函数的私有变量不受外部的干扰。形成不销毁的栈内存
- 保存，把一些函数内的值保存下来。闭包可以实现方法和属性的私有化

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
var n = '林一一';
(function p(){
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

- 节流防抖

```js
// 节流
function throttle(fn, timeout) {
    let timer = null
    return function (...arg) {
        if(timer) return
        timer = setTimeout(() => {
            fn.apply(this, arg)
            timer = null
        }, timeout)
    }
}

// 防抖
function debounce(fn, timeout){
    let timer = null
    return function(...arg){
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arg)
        }, timeout)
    }
}
```

- 柯里化实现

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
