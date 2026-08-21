# JS监听对象属性的改变

- `defineProperty`

```js
const person = {
  firstName: 'John',
  lastName: 'Doe'
}

Object.defineProperty(person, 'firstName', {
  get() {
    return this._firstName
  },
  set(value) {
    this._firstName = value
    console.log('changed')
  },
  configurable: true
})

person.firstName = 'Alice' // 修改属性会触发监听
```

`configurable` 为 `false` 时,不能使用 `delete` 删除属性

如果`configurable`为`false`，不能改回 `true`

- Proxy

```js
const person = {
  firstName: 'John',
  lastName: 'Doe'
}

const proxy = new Proxy(person, {
  get(target, p, receiver) {
    console.log(`Getting ${p}`)
    return target[p]
  },
  set(target, p, newValue, receiver) {
    console.log(`Setting ${p} to ${newValue}`)
    target[p] = newValue
    return true
  }
})

console.log(proxy.firstName) // 输出 Getting firstName  再输出 John
proxy.firstName = 'Alice' // 输出 Setting firstName to Alice
```

## 基本语法

```js
const proxy = new Proxy(target, handler)
```

- target: 要拦截的目标对象
- handler：一个配置对象，定义拦截行为

## Proxy的优点

- **监控整个对象，不只是属性**：`defineProperty`只能监控属性的改变，如果对象后来新增一个属性就拦截不了，Proxy可以拦截新增属性
- **原生支持数组**：`defineProperty`无法有效监控数组索引的变化，`Proxy`天然支持数组下标赋值和`length`改变
- **更多拦截行为**：只能拦截`get`和`set`，`Proxy`还可以拦截其他操作，如`deleteProperty`、`ownKeys`等
