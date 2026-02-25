# this

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
