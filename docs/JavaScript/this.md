# this

> 以下代码只要涉及到window，必须在浏览器环境下执行

## 箭头函数的this

所谓没有`this`，不是箭头函数没有`this`指向，而是箭头函数不绑定自己的`this`，它会捕获其所在的上下文的`this`值，作为自己的`this`值，这对于回调函数特别有用，例如，在对象方法中使用箭头函数可以确保`this`保持一致

## this

| 环境        | 代码位置               | `this`指向                  | 说明                                         |
| ----------- | ---------------------- | --------------------------- | -------------------------------------------- |
| 浏览器      | 最外层                 | `window`                    | 全局对象                                     |
| `node.js`   | 最外层                 | `module.exports`            | 模块的到处对象                               |
| `node.js`   | 普通函数里直接调用     | `global`（或 `globalThis`） | 非严格模式下默认绑定到全局对象               |
| `node.js`   | 严格模式函数里直接调用 | `undefined`                 | 严格模式下普通函数调用`this`不再指向`global` |
| 浏览器/node | 箭头函数               | 外层作用域的`this`          | 箭头函数不绑定自己的`this`                   |

## 示例1

```js
globalThis.a = 100
function fn() {
  return {
    a: 200,
    m: function () {
      console.log(this.a)
    },
    n: () => {
      console.log(this.a)
    },
    k: function () {
      return function () {
        console.log(this.a)
      }
    }
  }
}

const fn0 = fn()

fn0.m() // 200 this指向 { a, m, n}
fn0.n() // 100 this指向 globalThis
fn0.k()() // 100 this指向globalThis

const context = { a: 300 }
const fn1 = fn().call(context) // 改变 箭头函数 this指向
fn1.m() // 200 this指向 { a, m, n }
fn1.n() // 300 this指向 context
fn1.k().call(context) // 300 this指向 context
```

## 示例2

```js
globalThis.a = 100

const person1 = {
  a: 'person1',
  foo1: function () {
    console.log(this.a)
  },
  foo2: () => {
    console.log(this.a)
  },
  foo3: function () {
    return function () {
      console.log(this.a)
    }
  }
}

const person2 = {
  a: 'person2'
}

person1.foo1() // person1
person1.foo1.call(person2) // person2

person1.foo2() // undefined
person1.foo2.call(person2) // undefined

person1.foo3()() // 100
person1.foo3.call(person2)() // 100
```

- `person1.foo2().call(person2)`：箭头函数完全无视`call`、`apply`、`bind`等方法，`this`指向外层作用域的`this`，即`globalThis`，因为箭头函数被创建时，已经把`this`固定了
- `foo3.call(person2)`只改变了`foo3`内部的`this`，但返回的是全新创建的函数，这个函数并没有绑定`person2`，所以直接调用时`this`是全局对象->`undefined`

## 示例3

```js
let length = 10

function fn() {
  return this.length + 1
}

const obj = {
  length: 5,
  test1: function () {
    return fn()
  }
}

obj.test2 = fn

console.log(obj.test1()) // window 的窗口数
console.log(fn() === obj.test2()) // false
```

## 方法调用模式

```js
var test = function () {
  console.log(this.x)
}

var x = '2'

var obj = {
  x: '1',
  fn: test
}

obj.fn() // 1
test() // 2
```

可以看出，`this`指向调用它所在方法的对象，`test`方法在`obj`对象下，所以`this`指向`obj`，`test`在`window`对象下，所以`this`指向`window`。也可以看出：`this`和声明位置无关，和调用位置有关

```js
let obj1 = {
  a: 222
}

let obj2 = {
  a: 111,
  fn: function () {
    console.log(this.a)
  }
}

obj1.fn = obj2.fn
obj1.fn() // 222
```

这个其实不难理解，虽然`obj1.fn`是从`obj2.fn`赋值而来，但是调用函数的是`obj1`，所以`this`指向`obj1`

## 函数调用模式

```js
var a = 1
function fn1() {
  console.log(this.a) // 1
}

fn1() // 1

window.b = 2
function fn2() {
  console.log(this.b) // 2
}
fn2() // 可以理解为 window.fn()
```

需要在浏览器下运行代码，因为`window`是浏览器的全局对象

---

匿名函数，`setTimeout`

```js
;(function () {
  console.log('1', this) // window
})()

setTimeout(() => {
  console.log('2', this) // window
}, 0)

setTimeout(function () {
  console.log('3', this) // window
}, 0)
```

## 构造函数模式

```js
var flag = undefined

function Fn() {
  flag = this
}

var obj = new Fn()

console.log(flag === obj) // true
```

这个`this`指向`obj`，内部原理还是用`apply`把`this`指向`obj`的，回忆一下`js`中`new`一个对象的过程

## call apply bind

call和apply作用完全一样，唯一区别就是**参数**

```js
var obj = {
  name: '111',
  getName: function () {
    console.log(this.name)
  }
}

var otherObj = {
  name: '222'
}

var name = '333'

obj.getName() // 111
obj.getName.call() // 333
obj.getName.call(otherObj) // 222
obj.getName.apply() // 333
obj.getName.apply(otherObj) // 222
obj.getName.bind(this)() // 333
obj.getName.bind(otherObj)() // 222
```

不传参数，`call`和`apply`和`bind`会把`this`指向`window`，那些`333`由此而来

## 箭头函数

关于`ES6`的箭头函数，官方解释是：箭头函数里面的`this`是山下文（`context`），外部作用域的`this`就是箭头函数的`this`

```js
let obj = {
  a: 222,
  fn: function () {
    setTimeout(() => console.log(this.a), 0)
  }
}

obj.fn() // 222
```

由于`fn`是由`obj`调用的，`fn`内部的`this`指向`obj`，箭头函数寻找`this`，会往外层函数`fn`找，发现`fn`的`this`是`obj`，于是，这个箭头函数的`this`就永久的寄生在`obj`了

如果不用箭头函数

```js
let obj = {
  a: 222,
  fn: function () {
    setTimeout(function () {
      console.log(this.a)
    })
  }
}
obj.fn() // 输出：undefined (在非严格模式浏览器中可能是 100 等全局变量)
```

普通函数作为回调被`setTimeout`调用时，由于`js`引擎在全局环境触发的，此时内部的`this`会丢失，指向全局对象（`window`或`global`），而全局对象找不到`a`，所以是`undefined`

```js
var name = 'window'
var A = {
  name: 'A',
  sayHello: () => {
    console.log(this.name)
  },
}

A.sayHello() // 输出的是 window var 会把变量挂载到 window全局变量上
```

那么如何永远绑定A呢

```js
var name = 'window'
var A = {
  name: 'A',
  sayHello: function () {
    var s = () => console.log(this.name)
    return s // 返回的是箭头函数S
  },
}

var satHello = A.sayHello() // A.sayHello()返回的是箭头函数S
satHello() // 执行箭头函数S
```

- call、apply、bind方法对于箭头函数来说都只是传入参数，对他的this毫无影响

```js
var globalObject = this
var foo = () => this

console.log(globalObject === foo()) // true

var obj = { foo: foo }
console.log(foo.call(obj) === globalObject) // true

foo = foo.bind(obj)
console.log(foo() === globalObject) // true
```

## 严格模式

非严格模式下，`this`默认指向全局对象`window`

```js
// 非严格模式下
function f() {
  return this
}

console.log(f() === window) // true
```

严格模式下，this为undefined

```js
'use strict'
function f() {
  return this
}

console.log(f() === window) // true

```

