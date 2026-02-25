# 装箱机制

```js
const a = 1
console.log(a.__proto__ === Number.prototype) // true
console.log(a instanceof Number) // false
```

在JavaScript中，`const a = 1`定义了一个**原始类型**的数字

- **装箱机制（Boxing）**：当你尝试访问原始类型的属性或方法（\_\_proto\_\_）时，JavaScript引擎会自动将其临时包装成对应的包装对象（即Number对象）
- **原型链连接**：这个临时包装对象的原型指向`Number.prototype`，因此，a.\_\_proto\_\_实际上访问的是这个临时对象的原型，结果为`true`

`instanceof` 运算符的工作原理时检查构造函数的`prototype`属性是否出现在某个**对象**的原型链上

- `a`是一个原始数字`1`，它本身并不是一个对象
- `instanceof`的规则：根据ECMAScript规范，如果`instanceof`左侧的操作数不是对象（Object），它会直接返回`false`
- 对比：如果你使用`const b = new Number(1)`创建一个数字对象，那么`b instanceof Number`会返回`true`
