# 变量提升和暂时性死区（TDZ）

## 变量提升（Hoisting）

变量提升是js引擎在执行代码前的编译阶段，将变量和函数声明移动到其所在作用于顶部的行为

```js
// 实际编写的代码
console.log(name) // undefined
var name = '张三'
console.log(name) // '张三'

// JavaScript 引擎看到的代码（概念上）
var name // 声明被提升
console.log(name) // undefined
name = '张三' // 赋值保持原位
console.log(name) // '张三'
```

### var的变量提升

var 声明的变量会被提升到函数或全局作用域的顶部，并被初始化为undefined

```js
function example() {
  console.log(a) // undefined（不是 ReferenceError）
  var a = 10
  console.log(a) // 10
}

example()

// 等价于
function example() {
  var a // 声明提升到函数顶部
  console.log(a) // undefined
  a = 10 // 赋值保持原位
  console.log(a) // 10
}
```

### 函数提升

当函数声明和变量声明同名时，函数声明优先

```js
console.log(typeof foo) // "function"

var foo = 'variable'

function foo() {
  return 'function'
}

console.log(typeof foo) // "string"

// 解释：
// 1. 函数声明被提升
// 2. var 声明被忽略（因为 foo 已经存在）
// 3. 赋值操作执行，foo 变成字符串
```

## 暂时性死区（TDZ）

暂时性死区是指从块的开始到变量声明语句之前的区域，在这个区域，访问let或const声明的变量会抛出`ReferenceError`错误

### TDZ与typeof

在TDZ中，typeof操作符也会抛出`ReferenceError`错误

```js
// 未声明的变量，typeof 返回 "undefined"
console.log(typeof undeclaredVar) // "undefined"

// TDZ 中的变量，typeof 会报错
{
  // console.log(typeof x);  // ReferenceError
  let x = 10
}
```

### TDZ的范围

TDZ是针对当前块作用域

```js
let a = 'outer'

{
  // 这里的 TDZ 是针对内部的 a，不影响外部的 a
  console.log(a) // ReferenceError: Cannot access 'a' before initialization
  let a = 'inner'
}
```

```js
let a = 'outer'

function example() {
  // 这里访问的是外部的 a，没有 TDZ
  console.log(a) // 'outer'
}

example()
```

## 条件声明中的提升

```js
// var 的提升不受条件影响
function example() {
  console.log(x) // undefined

  if (false) {
    var x = 10 // 声明被提升，但赋值不执行
  }

  console.log(x) // undefined
}

example()

// let 有块级作用域
function example2() {
  // console.log(y);  // ReferenceError

  if (true) {
    let y = 20
    console.log(y) // 20
  }

  // console.log(y);  // ReferenceError
}

example2()
```

## 类中的TDZ

```js
// 类声明也有 TDZ
// const instance = new MyClass();  // ReferenceError

class MyClass {
  constructor() {
    this.name = 'MyClass'
  }
}

const instance = new MyClass()
console.log(instance.name) // 'MyClass'
```

## switch语句中的作用域

```js
// switch 语句共享作用域
function example(value) {
  switch (value) {
    case 1:
      let x = 'one'
      console.log(x)
      break
    case 2:
      // let x = 'two';  // SyntaxError: 已经声明过 x
      x = 'two' // 可以赋值
      console.log(x)
      break
  }
}

// 使用块来创建独立作用域
function example2(value) {
  switch (value) {
    case 1: {
      let x = 'one'
      console.log(x)
      break
    }
    case 2: {
      let x = 'two' // 可以，不同的块
      console.log(x)
      break
    }
  }
}
```
