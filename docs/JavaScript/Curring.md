# Currying

**柯里化**（Currying）是指将一个接受多个参数的函数，转换成一系列只接受一个参数的函数序列，并返回一个新的函数。每次调用新的函数时，它会接受一个参数，并返回一个新的函数，直到接收到最后一个参数时，才会执行原始函数并返回结果

```js
function sum(a, b, c) {
  return a + b + c
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function (...restArgs) {
        return curried.apply(this, args.concat(restArgs))
      }
    }
  }
}

const curriedSum = curry(sum)

console.log(curriedSum(1)(2)(3))
console.log(curriedSum(1, 2)(3))
console.log(curriedSum(1)(2, 3))
console.log(curriedSum(1, 2, 3))
```
