# Throttle

规定在一个周期内，事件最多触发一次。如果事件在周期内再次触发，则忽略

**常规实现思路**：使用一个标志位或时间戳记录上次触发的时间，判断当前触发距离上次触发的时间间隔是否大于等于指定的周期

::: code-group

```html [Throttle.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <style>
      body {
        height: 2000px;
      }
    </style>
  </head>
  <body>
    <script src="./Throttle.js"></script>
  </body>
</html>
```

```js [Throttle.js]
function throttle(func, delay) {
  let lastTime = 0 // 记录上次触发时间

  return function (...args) {
    const context = this
    const now = Date.now() // 当前时间

    if (now - lastTime >= delay) {
      // 距离上次触发时间大于等于 delay 就可以执行
      lastTime = now // 更新上次触发时间
      func.apply(context, args) // 执行函数
    }
  }
}

window.addEventListener(
  'scroll',
  throttle(() => {
    console.log('滚动条')
  }, 2000)
)
```

:::
