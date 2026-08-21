# Reflect

错误示范：直接使用`target[key]`

```js
const parent = {
  name: 'parent',
  get alias() {
    return this.name
  }
}

const proxy = new Proxy(parent, {
  get(target, p, receiver) {
    return target[p]
  }
})

const child = {
  name: 'child'
}

Object.setPrototypeOf(child, proxy) // child 继承自 proxy

console.log(child.alias) // 输出 parent 但预期应该是 child
```

原因：当调用`child.alias`时，由于`child`自身没有这个属性，它会去原型链找。在`proxy`的`get`中，如果你返回`target[key]`，那么`parent`里
的`getter`函数的this就会指向`target`（即`parent`对象）

正确示范：使用`Reflect.get`

```js {4}
const proxy = new Proxy(parent, {
  get(target, key, receiver) {
    // 传入 receiver，确保 getter 里的 this 指向调用者 child
    return Reflect.get(target, key, receiver)
  }
})

// ... 同样的继承代码
console.log(child.alias) // 输出 "Child"，正确！
```

`Reflect.get(target, key, receiver)`的第三个参数可以把正确的`this`上下文（即`receiver`）传递给底层的`getter`函数，

## 让操作值拥有"状态"返回值

- 赋值操作（`set`）：proxy的set陷阱要求必须返回一个布尔值（成功为`true`，失败为`false`）
  - 直接操作`target[key] = value`返回的是`value`本身
  - `Reflect.set(target, key, value, receiver)`返回的是布尔值，完全符合`Proxy`的规范
- 删除操作（`deleteProperty`）
  - 直接操作`delete target[key]`在严格模式下可能会报错
  - `Reflect.deleteProperty(target, key)`会返会一个布尔值表示是否删除成功
