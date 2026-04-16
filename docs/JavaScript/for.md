# for

## for in

`for...in`主要用于循环遍历**对象的可枚举属性**。如果用于数组，他遍历的是数组的索引

```js
const list = ['a', 'b', 'c']
list.name = 'my-list' // 为数组添加一个自定义属性

for (let key in list) {
  console.log(key) // 输出: "0", "1", "2", "name"
}
```

- 它返回的是字符串类型的**键名**（即使是数字索引也是字符串`"0"`）
- 它会遍历对象原型链上新增的属性，这在遍历数组是通常会导致意外的错误

## for of

`for...of`是ES6引入的语法，专门用于遍历[**可迭代对象**](./IterableObject.md)

```js
const list = ['a', 'b', 'c']
list.name = 'my-list'

for (let value of list) {
  console.log(value) // 输出: "a", "b", "c"
}
```

- 它只官族数据本身，不会去管自定义属性或原型链上的东西
- 普通对象不能直接用`for...of`遍历，因为对象默认没有实现`Symbol.iterator`接口（会报错`TypeError`），需要先实现`迭代协议`

### 为什么对象不能用`for...of`

`for...of`依赖于对象内部的Iterator（迭代器）。数组、`Map`、`Set`内部都原生实现了这个接口，但`Object`没有
如果想用`for...of`遍历普通对象，可以用以下方法

- `Object.keys(obj)`：遍历键
- `Object.values(obj)`：遍历值
- `Object.entries(obj)`：遍历键值对
