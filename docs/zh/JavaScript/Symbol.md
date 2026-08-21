# Symbol

根据规范，只有两种原始类型可以用作对象属性键：

- 字符串类型
- `Symbol` 类型

否则，如果使用另一种类型，例如数字，它会被自动转换为字符串。所以`obj[1]`与`obj['1']`相同，而`obj[true]` 与 `obj["true"]` 相同。

## Symbol

`Symbol` 保证是唯一的。即使我们创建了许多具有相同描述的 `Symbol`，它们的值也是不同的。

```js
let id1 = Symbol('id')
let id2 = Symbol('id')

console.log(id1 == id2) // false
```

`Symbol` 不会被自动转换为字符串。

```js
let id = Symbol('id')
alert(id) // TypeError: Cannot convert a Symbol value to a string
```

## 对象字面量中的 Symbol

如果我们要在对象字面量 `{...}` 中使用 `Symbol`，则需要使用方括号把它括起来。

```js
let id = Symbol('id')

let user = {
  name: 'hsh',
  [id]: 123, // 而不是 'id': 123
}

console.log(user)
```

这是因为我们需要变量 `id` 的值作为键，而不是字符串 `"id"`。

## Symbol 在 for...in 中会被跳过

`Symbol` 不参与 `for...in` 循环。

```js
let id = Symbol('id')

let user = {
  name: 'hsh',
  age: 30,
  [id]: 123,
}

for (let key in user) {
  console.log(key) // name, age（不包含 Symbol 键）
}

console.log(user[id]) // 123
```

`Object.keys(user)` 也会忽略它们。

相反，`Object.assign()` 会同时复制字符串和 `Symbol` 属性。

```js
let id = Symbol('id')
let user = {
  [id]: 123
}

let clone = Object.assign({}, user)

alert(clone[id]) // 123
```

这并不矛盾，我们通常希望所有属性被复制（包括像 `id` 这样的 `Symbol`）。

## 全局 Symbol

有时我们希望名字相同的 `Symbol` 具有相同的值。为了实现这一点，JavaScript 提供了**全局 Symbol 注册表**。我们可以在其中创建 `Symbol` 并在稍后访问它们，它可以确保每次访问同名 `Symbol` 时，返回的都是同一个 `Symbol`。

要从注册表中读取 `Symbol`，请使用 `Symbol.for(key)`。

该方法会检查全局注册表，如果有一个键为 `key` 的 `Symbol`，则返回该 `Symbol`；否则创建一个新的 `Symbol`，并通过给定的 `key` 将其存储在注册表中。

```js
let id = Symbol.for('id') // 如果该 symbol 不存在 就创建它

// 再次读取
let idAgain = Symbol.for('id')

console.log(id === idAgain) // true
```

### Symbol.keyFor

`Symbol.for(key)` 按名字返回一个 `Symbol`。相反，如果想通过全局 `Symbol` 获取其名字，我们可以使用 `Symbol.keyFor(sym)`。

```js
let id1 = Symbol.for('id')

// 通过 symbol 获取 name
console.log(Symbol.keyFor(id1)) // id
```

`Symbol.keyFor` 内部使用全局 Symbol 注册表来查找 `Symbol` 的键。所以它不适用于非全局 `Symbol`。如果 `Symbol` 不是全局的，它将无法找到并返回 `undefined`。

```js
let globalSymbol = Symbol.for('name')
let localSymbol = Symbol('name')

console.log(Symbol.keyFor(globalSymbol)) // name
console.log(Symbol.keyFor(localSymbol)) // undefined 非全局

console.log(localSymbol.description) // name
```

## 总结

从技术上来说，symbol不是100%隐藏的。有一个方法`Object.getOwnPropertySymbols(obj) `允许我们获取所有的symbol，还有一个名为`Reflect.ownKeys(obj)`方法可以返回一个对象的**所有**键，包括symbol
从技术上来说，`Symbol` 不是 100% 隐藏的。有一个方法 `Object.getOwnPropertySymbols(obj)` 允许我们获取所有的 `Symbol` 键，还有一个名为 `Reflect.ownKeys(obj)` 的方法可以返回一个对象的**所有**键（包括 `Symbol`）。

```js
let globalSymbol = Symbol.for('name')
let localSymbol = Symbol('name')

const obj = {
  [localSymbol]: 'hs',
  [globalSymbol]: 'sj',
}

const symbols = Object.getOwnPropertySymbols(obj)
console.log(symbols) // [ Symbol(name), Symbol(name) ]
```

