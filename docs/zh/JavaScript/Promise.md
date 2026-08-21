# Promise

## Promise.any()

将一个Promise[可迭代对象](./IterableObject.md)作为输入，并返回一个Promise，当输入的任何一个Promise兑现时，返回**第一个兑现**的值，
如果所有Promise都拒绝，返回一个AggregateError异常，包含所有拒绝的原因。

```js
const promise1 = Promise.reject(0)
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'quick'))
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, 'slow'))

const promises = [promise1, promise2, promise3]

Promise.any(promises).then((value) => console.log(value))
// 输出：'quick'
```

拒绝并返回AggregateError

```js
const failure = new Promise((resolve, reject) => {
  reject('always failure')
})

Promise.any([failure]).catch((err) => {
  console.log(err)
})
// [AggregateError: All promises were rejected] {
//   [errors]: [ 'always failure' ]
// }
```

## Promise.allSettled()

将一个Promise[可迭代对象](./IterableObject.md)作为输入，并返回一个Promise，当所有Promise都 settle 时，返回一个包含所有 Promise 结果的数组。
每个结果都是一个对象，包含 `status` 和 `value` 或 `reason` 属性。

- `status` 是一个字符串，值为 `'fulfilled'` 或 `'rejected'`。
- `value` 是兑现的值，仅当 `status` 为 `'fulfilled'` 时存在。
- `reason` 是拒绝的原因，仅当 `status` 为 `'rejected'` 时存在。

```js
Promise.allSettled([
  Promise.resolve(33),
  new Promise((resolve) => setTimeout(() => resolve(66), 0)),
  99,
  Promise.reject(new Error('a error'))
]).then((value) => console.log(value))
// { status: 'fulfilled', value: 33 },
// { status: 'fulfilled', value: 66 },
// { status: 'fulfilled', value: 99 },
// {
//   status: 'rejected',
//   reason: Error: a error
// }
```

## Promise.race()

将一个Promise[可迭代对象](./IterableObject.md)作为输入，并返回一个Promise，当输入的任何一个Promise settle 时，返回 settle 的值。
如果输入的 Promise 中没有 settle 的值，返回一个 AggregateError 异常，包含所有 Promise 的拒绝原因。

```js
Promise.race([
  Promise.resolve(33),
  new Promise((resolve) => setTimeout(() => resolve(66), 0)),
  99,
  Promise.reject(new Error('a error'))
]).then((value) => console.log(value))
// 33
```

和Promise.any()不同，Promise.race()返回第一个settle的值，而Promise.any()返回第一个兑现的值。

应用场景：
请求超时控制

```js
async function selfFetch(api, { timeout }) {
  return Promise.race([
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('fetch success')
      }, 500)
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('request timeout')
      }, timeout)
    })
  ])
}

selfFetch('/api', { timeout: 500 })
  .then((res) => {
    console.log('success', res)
  })
  .catch((error) => {
    console.error('fail', error)
  })
```
