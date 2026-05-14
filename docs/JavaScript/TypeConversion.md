# 类型转换

## 强制类型转换

```javascript
Number('123') // 123
String(123) // '123'
Boolean(123) // true
```

## 隐式类型转换

```javascript
123 + '456' // '123456'
true === 1 // 布尔值转换为数字1
false === 0 // 布尔值转换为数字0
```

## ==

部分转换规则

```js
null == undefined // true
string == number // string 转 number
boolean == any // boolean 转 number
object == primitive // object 转 primitive
```

toPrimitive转换规则详见[ToPrimitive](./ToPrimitive.md)

---

深度解析`[] == ![]`

1. 逻辑非优先级高于`!`，`[]`是一个`"truthy"`值，对其取反变为`![] // -> false `
2. 当布尔值参与比较时，会被转为`number`，于是表达式变为`[] == 0`
3. 当对象参与比较，对象会被转为原始值，于是表达式变为`"" == 0`
4. 字符串和数字比较，字符串会被转为数字，于是表达式变为`0 == 0`

其他示例

```js
console.log([10] == 10) // true
// [10].toString() -> '10'
// '10' == 10
// 10 == 10
```

```js
console.log({} == '[object Object]') // true

// {}.toString() -> '[object Object]'
// '[object Object]' == '[object Object]'
// true
```

## ===

- 严格相等
- 类型相等
- 值相同
- 从不进行类型转换

```js
console.log(77 === '77') // false
console.log(true === 1) // false
console.log(null === undefined) // false

let obj1 = {}
let obj2 = {}
// 比较的是内存地址 而非内容
console.log(obj1 === obj2) // false
```

