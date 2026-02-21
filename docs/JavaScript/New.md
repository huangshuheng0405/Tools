# new 操作符

```js
function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype) // 创建一个新对象并链接到构造函数的原型
  const result = constructor.apply(obj, args) // 将构造函数的this指向新对象并执行构造函数
  return result instanceof Object ? result : obj // 确保构造函数返回一个对象 如果没有则返回新对象
}

function Person(name) {
  this.name = name
}

const person1 = myNew(Person, 'Alice')
console.log(person1.name) // Alice
```
