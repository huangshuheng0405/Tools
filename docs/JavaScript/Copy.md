# 浅拷贝和深拷贝

`JS`分为原始类型和引用类型，并没有深浅拷贝的区别

- 浅拷贝和深拷贝都复制了值和地址，都是为了解决引用类型赋值后相互影响的问题
- 浅拷贝**只进行一层复制**，深层次的引用类型还是共享内存地址，原对象和拷贝对象还是会相互影响
- 深拷贝就是**无限层级拷贝**。深拷贝后的原对象和拷贝对象不会互相影响

## 背景

直接赋值，两个对象指向桐一个地址，就会造成引用类型之间互相影响的问题

```js
const obj = { name: 'Alice', age: 30 }

const newObj = obj
newObj.name = 'Bob'

console.log(obj) // { name: 'Bob', age: 30 }
console.log(obj == newObj) // true
```

## 实现浅拷贝

### Object.assign()

```js
const obj = { name: 'Alice', age: 30 }

const newObj = Object.assign({}, obj)

newObj.name = 'Bob'

console.log(obj) // { name: 'Alice', age: 30 }
console.log(newObj) // { name: 'Bob', age: 30 }
console.log(obj === newObj) // false
```

### slice concat

```js
const arr = ['Alice', 30, 'Engineer']

const newArr = arr.slice(0)

newArr[0] = 'Bob'

console.log(newArr == arr) // false
console.log(arr) // ['Alice', 30, 'Engineer']
console.log(newArr) // ['Bob', 30, 'Engineer']
```

```js
const arr = ['Alice', 30, 'Engineer']

const newArr = [].concat(arr)
newArr[0] = 'Bob'

console.log(newArr == arr) // false
console.log(arr) // ['Alice', 30, 'Engineer']
console.log(newArr) // ['Bob', 30, 'Engineer']
```

### Array.from

```js
const arr = ['lin', 'is', 'handsome']
const newArr = Array.from(arr)

arr[2] = 'rich'

console.log(newArr) // ['lin', 'is', 'handsome']

console.log(arr == newArr) // false
```

### 扩展运算符

```js
const arr = ['lin', 'is', 'handsome']
const newArr = [...arr]

arr[2] = 'rich'

console.log(newArr) // ['lin', 'is', 'handsome']

console.log(arr == newArr) // false
```

```js
const obj = {
  name: 'lin',
}
const newObj = { ...obj }

obj.name = 'lin is handsome'

console.log(newObj) // { name: 'lin' }

console.log(obj == newObj) // false
```

## 实现深拷贝

要求：

- 支持对象、数组、日期、正则的拷贝
- 处理原始类型（原始类型直接返回，只有引用类型才有深拷贝）
- 处理Symbol作为键名的情况
- 处理函数（直接返回，拷贝函数没有意义，两个对象使用内存中的同一个地址，问题不大）
- 处理`dom`元素（`dom`元素直接返回，拷贝`dom`没有意义，都是指向页面中同一个）
- 额外开辟一个存储空间`WeakMap`，解决循环引用递归爆栈问题（引入`WeakMap`的另一个意义，配合垃圾回收机制，防止内存泄漏）

先贴答案

```js
function deepClone(target, hash = new WeakMap()) {
  if (target === null) return target // 如果是null 就不进行拷贝操作
  if (target instanceof Data) return new Data(target) // 处理日期
  if (target instanceof RegExp) return new RegExp(target) // 处理正则
  if (target instanceof HTMLElement) return target // 处理dom元素

  if (typeof target !== 'object') return target // 处理原始类型和函数，不需要深拷贝 直接返回

  // 是引用类型的话就用进行深拷贝
  if (hash.get(target)) return hash.get(target) // 当需要拷贝当前对象时， 先去存储空间中找 如果有的话直接返回
  const cloneTarget = new target.construct() // 创建一个新的克隆对象或克隆数组
  hash.set(target, cloneTarget) // 如果存储空间没有 就存进 hash 里

  Reflect.ownKeys(target).forEach((key) => {
    // 引入 Reflect.onKeys 处理 Symbol 作为键名的情况
    cloneTarget[key] = deepClone(target[key], hash) // 递归拷贝没一层
  })

  return cloneTarget // 返回克隆的对象
}
```

### JSON.parse(JSON.stringify(obj))

```js
const obj = {
  person: {
    name: 'lin',
  },
}

const newObj = JSON.parse(JSON.stringify(obj))

obj.person.name = 'xxx' // 改变原来的深层对象

console.log(newObj) // { person: { name: 'lin' } } 新对象不变
```

这种方式存在弊端，会忽略`undefined`、`symbol`、`function`

```js
const obj = {
  a: undefined,
  b: Symbol('b'),
  c: function () {},
}

const newObj = JSON.parse(JSON.stringify(obj))

console.log(newObj) // {}
```

`NaN`、`Infinity`、`-Infinity`会被序列化为`null`

```js
const obj = {
  a: NaN,
  b: Infinity,
  c: -Infinity,
}

const newObj = JSON.parse(JSON.stringify(obj))

console.log(newObj) // { a: null, b: null, c: null }
```

而且不能解循环引用的问题

```js
const obj = {
  a: 1,
}

obj.obj = obj

const newObj = JSON.parse(JSON.stringify(obj))

console.log(newObj) // error
```

这种适合深拷贝一些简单对象

### 简单版本

```js
function deepClone(target) {
  if (typeof target !== 'object') {
    return target
  }

  const cloneTarget = {}
  for (const key in target) {
    cloneTarget[key] = deepClone(target[key])
  }

  return cloneTarget
}

const obj = {
  person: {
    name: 'lin',
  },
}

const newObj = deepClone(obj)
obj.person.name = 'xxx'

console.log(obj)
console.log(newObj)

console.log(obj.person === newObj.person)

// { person: { name: 'xxx' } }
// { person: { name: 'lin' } }
// false
```

### 处理数组、日期、正则、null

null、日期、正则直接返回即可

对于这一行代码

```js
const cloneTarget = new tarfet.constructor()
```

实例的`constructor`其实就是构造函数

```js
class Person {}

const p = new Person()

console.log(p.constructor === Person)
console.log([].constructor === Array)
console.log({}.constructor === Object)

// true
// true
// true
```

```js
new {}.constructor()
// 等价于
new Object()

new [].constructor()
// 等价于
new Array()
```

所以我们不用去判断是数组还是对象，直接调用它的`constructor`创建即可

### 处理Symbol

由于`Symbol`无法被`for in`枚举，所以需要换成`Reflect.ownKeys`

`Reflect.ownKeys`方法返回一个有目标对象自身的属性键组成的数组。他的返回值等同于

```js
Object.getOwnPropertyName(target).concat(Object.getOwnPropertySymbols(target))
```

### 处理循环引用

如果对象存在循环引用的话，递归会进入死循环导致栈内存溢出

可以额外开辟一个存储空间存储当前对象和拷贝对象的对应关系

当需要拷贝当前对象时，先去存储空间找，有没有拷贝过该对象，有则直接返回，这样就不会导致栈溢出

```js
function deepClone (target, hash = {}) { // 额外开辟一个存储空间来存储当前对象和拷贝对象的对应关系
  if (target === null) return target
  if (target instanceof Date) return new Date(target)
  if (target instanceof RegExp) return new RegExp(target)

  if (typeof target !== 'object') return target

  if (hash[target]) return hash[target] // 当需要拷贝当前对象时，先去存储空间中找，如果有的话直接返回
  const cloneTarget = new target.constructor()
  hash[target] = cloneTarget // 如果存储空间中没有就存进存储空间 hash 里

  Reflect.ownKeys(target).forEach(key => {
    cloneTarget[key] = deepClone(target[key], hash) // 递归拷贝每一层
  })
  return cloneTarget
}
```

上述方法还有优化空间，存储空间可以用`Map`或`WeakMap`，这里我们使用`WeakMap`，配合垃圾回收机制，防止内存泄漏
