# bind apply call

`call`和`apply`方法非常相似，唯一区别就是**传参的形式**
`bind`不会立即执行函数，而是创建一个副本，并将你指定的obj绑定到该函数的`this`上

```js
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation)
}

const user = { name: 'Alice' }

greet.call(user, 'Hello', '!') // Output: Hello, Alice!
greet.apply(user, ['Hi', '?']) // Output: Hi, Alice?

const boundGreet = greet.bind(user, 'hey')

boundGreet('?') // Output: hey, Alice?
```

## `call()`

用于调用函数，显式指定函数内部的`this`指向，参数以列表的形式传递给函数。

```js
Function.prototype.myCall = function (context, ...args) {
  // 如果context是null或undefined 则指向全局对象 否则转换为对象
  context = context === null || context === undefined ? window : Object(context)

  const uniqueId = Symbol() // 创建一个唯一的键 避免属性名冲突

  context[uniqueId] = this // this就是当前调用的函数

  const result = context[uniqueId](...args) // 执行函数并获取返回值

  delete context[uniqueId] // 删除属性
  return result // 返回函数执行的结果
}

function greet(message) {
  console.log(`${message}, ${this.name}`)
}

const person = {
  name: 'Alice',
}

greet.myCall(person, 'hello') // hello Alice

// 原生
// greet.call(person, 'hello') // hello Alice
```

把目标函数赋值在要传的对象里，所以`this`指向的就是那个对象

`Object(context)`允许你传入基本类型，当你传入空字符串`""`，不会取`window`

## `apply()`

用于调用函数，显式指定函数内部的`this`指向，参数以**数组或类数组**的形式传递给函数。

```js
Function.prototype.maApply = function (context, argsArray) {
  context = context === null || context === undefined ? window : Object(context)
  const uniqueId = Symbol('fn')
  context[uniqueId] = this

  // 处理 argsArray 为空的情况
  const result = Array.isArray(argsArray)
    ? context[uniqueId](...argsArray)
    : context[uniqueId]()

  delete context[uniqueId]
  return result
}

const obj = {
  name: 'Alice',
}

function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}

greet.maApply(obj, ['hello', '!'])

```

## `bind()`

不会立即调用函数，而是创建一个新函数，新函数的`this`指向被绑定的对象，参数以列表的形式传递给函数。

```js
Function.prototype.myBind = function (context, ...args) {
  const self = this // 保存原函数
  return function (...newArgs) {
    // 闭包里调用 apply 合并两次传入的参数
    return self.apply(context, [...args, ...newArgs])
  }
}

function greet(...message) {
  // 使用剩余参数 接收所有参数
  message.forEach((item) => {
    console.log(item)
  })
}

const person = {
  name: 'Alice',
}

const fn = greet.myBind(person, 'hi')
fn('Bob', 'Alice') // 和 hi 合并

const fn1 = greet.bind(person, 'hello')
fn1('Charlie', 'Dave') // 和 hello 合并

```

核心是**闭包**和**参数合并**
