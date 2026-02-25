# Symbol

1.** 唯一性**：每个`Symbol`值都是唯一的，即使具有相同的描述的字符串也不相等2. **不可枚举**：`Symbol`类型的属性通常是不可枚举的，这意味着它们不会出现在`for...in`循环中3. _用作属性名_：主要用途是作为对象属性的键，以确保属性的唯一性

```js
const sym = Symbol('symbol')
const obj = {
  [sym]: '123'
}
console.log(obj[sym]) // 123
```

4. **Symbol常量**：在代码中，可以使用Symbol来定义常量，以避免意外的值修改

```js
const COLOR_RED = Symbol('red')
const COLOR_GREEN = Symbol('green')
```
