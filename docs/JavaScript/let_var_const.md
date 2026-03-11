# let、var、const

## var

### 基本语法

`var name = '张三'`

### 函数作用域

```js
function example() {
  var x = 10

  if (true) {
    var y = 20 // y 的作用域是整个函数
    console.log(x) // 10
  }

  console.log(y) // 20（可以在 if 块外访问）
}

example()
// console.log(x);  // ReferenceError: x is not defined
```

### 全局对象属性

在全局作用域使用var声明的变量会成为全局对象的属性

```js
var globalVar = '全局变量'
console.log(window.globalVar) // '全局变量'（浏览器环境）
console.log(globalThis.globalVar) // '全局变量'

// let 和 const 不会
let globalLet = '全局 let'
console.log(window.globalLet) // undefined
```

### 变量提升

```js
console.log(name) // undefined（不是 ReferenceError）
var name = '张三'
console.log(name) // '张三'

// 等价于
var name
console.log(name) // undefined
name = '张三'
console.log(name) // '张三'
```

### 重复声明

```js
var x = 10
var x = 20 // 不会报错，x 的值会被更新为 20
console.log(x) // 20
```

### 循环中的变量提升

```js
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i) // 5 个 5
  }, 1000)
}
```

## let

### 基本语法

`let name = '张三'`

###　块级作用域

```js
function example() {
  let x = 10

  if (true) {
    let y = 20 // y 的作用域是 if 块
    console.log(x) // 10
  }

  console.log(y) // ReferenceError: y is not defined
}

example()
```

### 暂时性死区（TDZ）

```js
// console.log(name);  // ReferenceError: Cannot access 'name' before initialization
let name = '张三'
console.log(name) // '张三'

// TDZ 从块的开始一直到声明语句
{
  // TDZ 开始
  // console.log(x);  // ReferenceError
  let x = 10 // TDZ 结束
  console.log(x) // 10
}
```

### 不能重复声明

### 不会成为全局对象的属性

```js
let globalLet = '全局 let'
console.log(window.globalLet) // undefined
```

### 循环中的行为

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i) // 0, 1, 2
  }, 100)
}

// 每次迭代都有自己的 i 变量
```

## const

### 基本语法

必须初始化
`const name = '张三'`

### 不可重新赋值

```js
const x = 10
x = 20 // TypeError: Assignment to constant variable.
```

### 块级作用域

和let一样

### 对象和数组的可变性

const只保证变量的引用不变，不保证对象或数组的不变

```js
const person = {
  name: '张三',
  age: 25
}

// 可以修改属性
person.name = '李四'
person.age = 26
console.log(person) // { name: '李四', age: 26 }

// 可以添加属性
person.email = 'zhangsan@example.com'

// 不能重新赋值
// person = { name: '王五' };  // TypeError

// 数组同理
const numbers = [1, 2, 3]
numbers.push(4) // 可以
numbers[0] = 10 // 可以
console.log(numbers) // [10, 2, 3, 4]

// numbers = [5, 6, 7];  // TypeError
```

### 暂时性死区

和const同样

### 循环中的使用

```js
// for-of 和 for-in 中可以使用 const
const array = [1, 2, 3]
for (const item of array) {
  console.log(item) // 1, 2, 3
}

const obj = { a: 1, b: 2 }
for (const key in obj) {
  console.log(key) // 'a', 'b'
}

// 普通 for 循环不能用 const（需要修改计数器）
// for (const i = 0; i < 3; i++) {}  // TypeError
```
