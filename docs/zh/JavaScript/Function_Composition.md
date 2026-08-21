# Function Composition

通过一个`compose`或`pipe`函数来实现

- `compose`从右到左执行函数
- `pipe`从左到右执行函数

```js
/**
 * 组合函数 compose(f, g, h) => f(g(h(...args)))
 * @description 从右到左执行函数，返回结果
 * @param  {...any} funcs 函数列表
 * @returns
 */
const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  )
}

const add1 = (x) => x + 1
const multiply2 = (x) => x * 2
const subtract3 = (x) => x - 3

const processedValue = compose(subtract3, multiply2, add1) // 执行流程 add1 -> multiply2 -> subtract3

console.log(processedValue(5)) // 9
```
