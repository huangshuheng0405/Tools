# Higher-Order Function

**高阶函数**至少满足下列一个条件的函数：

- 接受一个或多个函数作为参数
- 返回一个函数作为结果

:::code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <label for="">价格： 2999.00</label>
    <button class="btn">打折</button>
    <script src="./1.js"></script>
    <script>
      const label = document.querySelector('label')
      const btn = document.querySelector('.btn')
      btn.onclick = () => {
        animation(1000, 2999, 299, (value) => {
          label.innerHTML = `价格： ${value.toFixed(2)}`
        })
      }
    </script>
  </body>
</html>
```

```js [index.js]
function animation(duration, from, to, callback) {
  const dist = to - from
  const speed = dist / duration
  const startTime = Date.now()
  let value = from
  console.log(value)
  callback(value)

  function _run() {
    const now = Date.now()
    const time = now - startTime
    // 动画结束
    if (time >= duration) {
      value = to
      console.log(value)
      callback(value)
      return
    }
    const d = time * speed
    value = from + d
    console.log(value)
    callback(value)
    requestAnimationFrame(_run)
  }

  requestAnimationFrame(_run)
}
```

:::

对于这个通用函数`animation`，如果不传递第四个参数，就不能确定怎么使用它。但是传递了我就可以在回调函数里针对当前情况拿到`animation`计算好的值去使用

## 示例二

第二个参数是一个函数，用于生成分组的键值，也可以直接传入一个字符串名，表示根据该属性进行分组，做了参数归一化

```js
const arr = [
  { name: 'zhangsan', age: 18, sex: 'male' },
  { name: 'lisi', age: 19, sex: 'female' },
  { name: 'wangwu', age: 23, sex: 'male' },
  { name: 'zhaoqi', age: 21, sex: 'male' },
  { name: 'liuqi', age: 22, sex: 'female' },
  { name: 'wangqi', age: 23, sex: 'male' }
]

function groupBy(arr, generateKey) {
  // 参数归一化
  if (typeof generateKey === 'string') {
    const propName = generateKey
    generateKey = (item) => item[propName]
  }
  const result = {}
  for (const item of arr) {
    const key = generateKey(item)
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
  }
  return result
}

console.log(groupBy(arr, 'sex'))
console.log(groupBy(arr, 'age'))

console.log(
  groupBy(arr, (item) => {
    return item.age
  })
)

console.log(
  groupBy(arr, (item) => {
    return item.sex
  })
)

// 可以按照 年龄和性别 分组
console.log(
  groupBy(arr, (item) => {
    return `${item.age} - ${item.sex}`
  })
)
```

## 示例三

把大量任务拆成小块执行，避免一次性循环导致页面卡死（长任务阻塞主线程）

::: code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <button id="clickBtn">插入10000条元素</button>
  </head>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

```js [index.js]
const btn = document.getElementById('clickBtn')
const datas = new Array(100000).fill(0).map((_, i) => i)

btn.onclick = () => {
  const consumer = (item, i) => {
    const div = document.createElement('div')
    div.textContent = i
    document.body.appendChild(div)
  }
  //   const chunkSplitor = (task) => {
  //     setTimeout(() => {
  //       task((time) => time < 16.67)
  //     }, 30)
  //   }
  performChunk(100000, consumer)
}

function performChunk(datas, consumer, chunkSplitor) {
  if (typeof datas === 'number') {
    datas = new Array(datas)
  }
  if (datas.length === 0) {
    return
  }
  // 不传递chunkSplitor，默认使用requestIdleCallback
  if (!chunkSplitor && globalThis.requestIdleCallback) {
    chunkSplitor = (task) => {
      requestIdleCallback((idle) => {
        task(() => idle.timeRemaining() > 0)
      })
    }
  }

  let i = 0
  function _run() {
    if (i === datas.length) {
      return
    }
    chunkSplitor((hasTime) => {
      const now = Date.now()
      while (hasTime(Date.now() - now) && i < datas.length) {
        consumer(datas[i], i)
        i++
      }
      _run()
    })
  }
  _run()
}
```

:::
