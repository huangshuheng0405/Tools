# null和undefined的区别

## undefined

- 当声明了一个变量但未初始化它时，它的值为`undefined`
- 当访问对象属性或数组元素中不存在的属性或索引时，也会返回`undefined`
- 当函数没有返回值时，返回`undefined`
- 如果函数的参数没有传递或没有被提供值，函数内的对应参数的值为`undefined`

```js
let x
console.log(x) // undefined

const obj = {}
console.log(obj.a) // undefined

function foo() {}
console.log(foo()) // undefined

function add(a, b) {
  return a + b
}

console.log(add(1, 2)) // 3
console.log(add(1)) // NaN
```

## null

- `null`是一个特殊的关键字，表示一个空对象指针
- 它通常用于显示地只是一个变量或属性的值是空的，`null`是一个赋值的操作，用于表示“没有值”或“空”
- `null`通常需要开发人员主动分配给变量，而不是自动分配的默认值
- `null`是原型链的顶层，所有对象都是继承自`Object`原型对象，`Object`原型对象的原型是`null`

```js
const a = null
console.log(a) // null

const obj = { a: 1 }
const proto = obj.__proto__
console.log(proto.__proto__) // null
```
