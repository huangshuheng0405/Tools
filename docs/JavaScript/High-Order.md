# 高阶函数

至少满足下列一个条件的函数：

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
