# this

> 以下代码只要涉及到window，必须在浏览器环境下执行



this的几种模式：

1. 方法调用模式下，`this`总是指向调用它所在方法的对象，`this`的指向与所在方法的调用位置有关，而与方法的声明位置无关
2. 函数调用下，`this`指向window，调用方法没有明确对象的时候，`this`指向`window`，如`setTimeout`、匿名函数等
3. 构造函数调用模式下，`this`指向被构造的对象
4. `apply`、`call`、`bind`调用模式下，`this`指向第一个参数
5. 箭头函数，在**声明**的时候绑定`this`，而非取决调用的位置
6. 严格模式下，如果`this`没有被执行环境（execution context）定义，那`this`是`undefined`

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
  }
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
  }
}

var satHello = A.sayHello() // A.sayHello()返回的是箭头函数S
satHello() // 执行箭头函数S
```

- `call`、`apply`、`bind`方法对于箭头函数来说都只是传入参数，对他的`this`**毫无影响**

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

## 示例一

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

前三个就讲最后一个

`fn0.k()`返回了一个匿名普通函数。随后执行`()`是**独立函数调用**。在非严格模式下，独立调用的函数`this`始终指向**全局对象**

`fn1.m()`：

**关键点：**`fn().call(context)`只是在"生产"这个对象的过程改变了this指向，并没有把生产出来的`m`方法锁死在`context`上，所以当`fn1.m()`的时候，`m`内部的`this`指向`fn1`，而`fn1`长：`{ a: 200, m: function...}`

`fn1.n()`：

`m`是普通函数，`n`是箭头函数，它在定义的那一刻就看准了当时的`this`（也就是`fn`执行时的`this`），因为用了`.call（context）`执行了`fn`，导致n定义时的环境就是`context`。所以输出了300

`fn1.k()`:

`fn1.k()` 返回一个普通函数，接着我们使用 `.call(context)` 显式地将这个返回函数的 `this` 指定为 `context`，所以输出 300。

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
  },
}

const person2 = {
  a: 'person2',
}

person1.foo1() // person1
person1.foo1.call(person2) // person2

person1.foo2() // 100
person1.foo2.call(person2) // 100

person1.foo3()() // 100
person1.foo3.call(person2)() // 100

```

- `person1.foo2().call(person2)`：箭头函数完全无视`call`、`apply`、`bind`等方法，`this`指向外层作用域的`this`，即`globalThis`，因为箭头函数被创建时，已经把`this`固定了
- `foo3.call(person2)`只改变了`foo3`内部的`this`，但返回的是全新创建的函数，这个函数并没有绑定`person2`，所以直接调用时`this`是全局对象->`100`

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

