```js
let data = {
  A0: 1,
  A1: 2
}

function update(receiver) {
  let A2 = receiver.A0 + receiver.A1
  console.log(A2)
}

function whenDepsChange(callback) {
  const proxy_data = new Proxy(data, {
    set: function name(target, propKey, value, receiver) {
      // 每次A0 A1 发生变化执行callback
      target[propKey] = value
      callback(receiver)
    },
    get: function (target, propKey, receiver) {
      return target[propKey]
    }
  })

  return proxy_data

  console.log(proxy_data.A0)
}

const proxy_data = whenDepsChange(update)

proxy_data.A0 = 5
```
