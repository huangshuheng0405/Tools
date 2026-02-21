# bind, apply, call的区别及实现

## `call()`

用于调用函数，显式指定函数内部的`this`指向，参数以列表的形式传递给函数。

```js
Function.prototype.myCall = function (context, ...args) {
  context = context || window // 如果没有传入上下文 则默认为全局对象
  const uniqueId = Symbol() // 创建一个唯一的键 避免属性名冲突
  context[uniqueId] = this // 在上下文添加一个属性 将函数赋值给这个属性
  const result = context[uniqueId](...args) // 调用函数  context[uniqueId]是个函数
  delete context[uniqueId] // 删除属性
  return result // 返回函数执行的结果
}

function greet(message) {
  console.log(`${message}, ${this.name}`)
}

const person = {
  name: 'Alice'
}

greet.myCall(person, 'hello') // hello Alice

// 原生
greet.call(person, 'hello') // hello Alice
```

## `apply()`

用于调用函数，显式指定函数内部的`this`指向，参数以数组的形式传递给函数。

```js
Function.prototype.myApply = function (context, args = []) {
  context = context || window // 如果没有传入上下文 则默认为全局对象
  const uniqueId = Symbol() // 创建一个唯一的键 避免属性名冲突
  context[uniqueId] = this // 在上下文添加一个属性 将函数赋值给这个属性
  const result = context[uniqueId](...args) // 调用函数  context[uniqueId]是个函数
  delete context[uniqueId] // 删除属性
  return result // 返回函数执行的结果
}

function greet(message) {
  console.log(`${message}, ${this.name}`)
}

const person = {
  name: 'Alice'
}

greet.myApply(person, ['hello']) // hello Alice

// 原生
greet.apply(person, ['hello']) // hello Alice
```

## `bind()`

不会立即调用函数，二十创建一个新函数，新函数的`this`指向被绑定的对象，参数以列表的形式传递给函数。

```js
Function.prototype.myBind = function (context, ...args) {
  const func = this
  return function (...newArgs) {
    return func.apply(context, [...args, ...newArgs]) // 调用时如果有传参 则合并参数
  }
}

function greet(...message) {
  // 使用剩余参数 接收所有参数
  message.forEach((item) => {
    console.log(item)
  })
}

const person = {
  name: 'Alice'
}

const fn = greet.myBind(person, 'hi')
fn('Bob') // 和 hi 合并

const fn1 = greet.bind(person, 'hello')
fn1()
// hi
// Bob
// hello
```
