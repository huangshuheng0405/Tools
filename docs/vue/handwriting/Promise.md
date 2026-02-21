# Promise

手写代码

::: code-group

```js [Promise.js]
const PENDING = 'pending'
const SUCCESS = 'fulfilled'
const FAIL = 'rejected'

const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
    return reject(new TypeError('循环引用'))
  }

  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 有可能是一个 Promise 对象 凡是 Promise 对象必须有then方法
    let called //  代表成功或者 是否执行过
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            // resolve(y)
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 如果不是 Promise 对象 基本值
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING //  初始状态
    this.value = undefined
    this.reason = undefined

    // 订阅容器
    this.onResolvedCallbacks = [] // 成功容器
    this.onRejectedCallbacks = [] // 失败容器

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = SUCCESS //  成功
        // 发布
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = FAIL //  失败
        // 发布
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e
          }

    const promise2 = new Promise((resolve, reject) => {
      // 同步处理
      if (this.status === SUCCESS) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value) // x 的值需要判断 如果是普通值 直接resolve
            // 是 Promise 对象 应该根据状态处理 然后再交给resolve reject
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === FAIL) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === PENDING) {
        // 异步处理 设计模式
        // 订阅
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promise2
  }

  static resolve(val) {
    if (val instanceof Promise) return val

    return new Promise((resolve) => resolve(val))
  }
}

Promise.defer = Promise.deferred = () => {
  const result = {}
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

module.exports = Promise
```

```js [testPromise.js]
const MyPromise = require('./06-Promise.js')

const p1 = new MyPromise((resolve, reject) => {
  // resolve('success')
  // reject('failed')

  setTimeout(() => {
    resolve(['success', 12])
    // reject('failed')
  }, 2000)
})

p1.then(
  (data) => {
    console.log(data[0], data[1])
  },
  (e) => {
    console.log(e)
  }
)

console.log('================================')
console.log(MyPromise.resolve(123))

let a = MyPromise.resolve(p1)

console.log(a, a === p1)
```

:::

## 测试

[promise-aplus-tests](https://github.com/promises-aplus/promises-tests)

1. `npm i promise-aplus-tests -D`
2. 测试套件需要一个入口来调用你的 Promise。你需要在你的 Promise 文件中导出一个包含 `deferred` 方法的对象。

```js
// MyPromise.js 的末尾添加
MyPromise.deferred = function () {
  let result = {}
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

module.exports = MyPromise
```

3. 在`package.json`中添加命令

```js
{
  "scripts": {
    "test": "promises-aplus-tests MyPromise.js"
  }
}
```

4. 运行`npm test`

## race

1. **状态锁定**：你在 `constructor` 里实现的 `resolve` 和 `reject` 函数都有 `if (this.status === PENDING)` 的判断。这意味着 `race` 循环调用所有 Promise 时，只有第一个调用的 `resolve/reject` 能生效，后面的会被 `if` 挡掉。
2. **空数组陷阱**：根据规范，如果传给 `Promise.race` 的是一个**空数组**，那么返回的 Promise 将**永远处于 pending 状态**（因为它里面没有选手，比赛永远不会结束）。
3. **普通值处理**：如果数组里混入了非 Promise 对象（如 `Promise.race([1, p2])`），数字 `1` 会立刻被 `Promise.resolve(1)` 包装并执行 `then` 回调，这通常意味着它会直接赢得比赛。

通常用于“请求接口超时处理”

```js
// 让业务请求和定时器比赛
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("请求超时")), ms);
  });
  return Promise.race([promise, timeout]);
}

withTimeout(fetch('/data'), 3000)
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

