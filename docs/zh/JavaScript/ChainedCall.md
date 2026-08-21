# 链式调用

通过在对象的方法中返回对象自身（this）来实现

```js
class Calc {
  constructor(num) {
    this.value = num
  }

  add(num) {
    this.value += num
    return this
  }

  mul(num) {
    this.value *= num
    return this
  }
}

const c = new Calc(10)
const res = c.add(5).mul(20)

console.log(res.value) // 300
```
