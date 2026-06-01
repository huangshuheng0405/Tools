# Memoization

通常通过一个高阶函数或装饰器来实现

- 提升性能：显著减少计算密集型或重复性调用的时间，特别是在递归或处理大量数据时
- 减少资源消耗：避免因为重复计算而额外消耗额外的CPU资源

```js
const memoize = (fn) => {
  const cache = {} // 使用对象作为一个简单的缓存

  return function (...args) {
    // 创建一个简单的缓存key 这里只考虑第一个参数或者多个参数的json字符串表示
    const key = args.length === 1 ? args[0] : JSON.stringify(args)

    if (cache.hasOwnProperty(key)) {
      console.log(`Fetch from cache for key: ${key}`)
      return cache[key]
    } else {
      console.log(`Calculating result for key: ${key}`)
      const result = fn.apply(this, args)
      cache[key] = result
      return result
    }
  }
}

const fibonacci = (n) => {
  if (n <= 1) {
    return n
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const memoizedFibonacci = memoize(fibonacci)

console.log(memoizedFibonacci(10)) // 会进行计算并缓存中间结果
console.log(memoizedFibonacci(10)) // 直接从缓存读取
console.log(memoizedFibonacci(15)) // 会进行计算并缓存中间结果
console.log(memoizedFibonacci(10)) // 直接从缓存读取
```
