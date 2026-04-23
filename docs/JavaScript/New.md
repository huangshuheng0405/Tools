# new 操作符

```js
function myNew(contstructor, ...args) {
  const obj = Object.create(contstructor.prototype)
  const result = contstructor.apply(obj, args)
  return (result ！== null && typeof result === 'object') ? result : obj
}

let flag = undefined

function Person(name, age) {
  this.name = name
  this.age = age
  flag = this
}

const p = myNew(Person, 'xiaoming', 20)
console.log(p.name) // xiaoming
console.log(p instanceof Person) // true
console.log(flag === p) // true

```

1. 在内存中创建一个空对象（例如（`{}`）
2. 将这个新对象的`__proto__`指向构造函数的`prototype`属性。这一步确保示例可以访问构造函数原型上的方法
3. 执行构造函数，同时将函数内部`this`绑定到这个新对象上。此时，构造函数的`this.xxx = yyy`开始为新对象赋值
4. 如果构造函数返回了一个**非空对象**，则返回该对象；否则，默认返回第一步创建的对象
