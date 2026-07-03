# Web API

## Intersection Observer

监听元素是否进入视口

## visibilitychange

监听页面是否可见

```js
document.addEventListener('visibilitychange', (e) => {
  if (document.hidden) {
    // 页面不可见
  } else {
    // 页面可见
  }
})
```

## animate

语法

`animate(keyframes, options)`

- keyframes: 动画帧数组
- options: 动画选项对象

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <style>
      body {
        height: 100%;
        display: flex;
        justify-self: center;
        align-items: center;
        background-color: black;
      }

      .newspaper {
        padding: 0.5rem;
        background-color: white;
        text-align: center;
        cursor: pointer;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <div class="newspaper">翻报纸真的会头晕</div>

    <script>
      const newspaperSpinning = [
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(360deg) scale(0)' }
      ]

      const newspaperTiming = {
        // 持续时间
        duration: 2000,
        // 重复次数
        iterations: 1,
        // 动画结束时的填充模式
        fill: 'forwards'
      }

      const newspaper = document.querySelector('.newspaper')

      newspaper.addEventListener('click', () => {
        newspaper.animate(newspaperSpinning, newspaperTiming)
      })
    </script>
  </body>
</html>
```

## navigator.connection

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>网络状态</title>
  </head>
  <body>
    <div>
      <div>网络状态：<span id="networkStatus"></span></div>
      <div>延迟：<span id="delay"></span></div>
      <div>带宽：<span id="bandwidth"></span></div>
    </div>

    <script>
      // 获取网络状态
      const networkStatus = document.getElementById('networkStatus')
      const delay = document.getElementById('delay')
      const bandwidth = document.getElementById('bandwidth')

      function getNetworkInfo() {
        let info
        // console.log('🚀 ~ getNetworkInfo ~ navigator:', navigator)
        if (navigator.onLine) {
          info = {
            type: navigator.connection.effectiveType,
            rtt: navigator.connection.rtt,
            downlink: navigator.connection.downlink
          }
        } else {
          info = {
            type: 'offLine'
          }
        }
        return info
      }

      function updateNetworkStatus() {
        const info = getNetworkInfo()
        if (info.type === 'offLine') {
          networkStatus.textContent = '离线'
          delay.textContent = '离线'
          bandwidth.textContent = '离线'
        } else {
          networkStatus.textContent = info.type
          delay.textContent = info.rtt + 'ms'
          bandwidth.textContent = info.downlink + ' Mbps'
        }
      }
      updateNetworkStatus()

      // 监听离线 和 在线事件
      window.addEventListener('online', updateNetworkStatus)
      window.addEventListener('offline', updateNetworkStatus)

      // 监听网络状态变化事件
      navigator.connection.addEventListener('change', updateNetworkStatus)

      // 更新网络状态每秒一次
      setInterval(updateNetworkStatus, 1000)
    </script>
  </body>
</html>
```

## dragable

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
      * {
        box-sizing: border-box;
      }

      .container {
      }

      .drop-over {
        background-color: gray;
      }
    </style>
  </head>
  <body>
    <div id="container" style="padding: 5px" class="mt-5 ml-6">
      <div
        data-drop="move"
        class="left"
        style="
          width: 300px;
          height: 100px;
          border: 3px solid red;
          padding-top: 15px;
          padding-left: 15px;
        "
      >
        <span
          data-effect="copy"
          style="border: 2px solid red; padding: 5px"
          draggable="true"
          >语文</span
        >
        <span
          data-effect="copy"
          style="border: 2px solid red; padding: 5px"
          draggable="true"
          >数学</span
        >
        <span
          data-effect="copy"
          style="border: 2px solid red; padding: 5px"
          draggable="true"
          >英语</span
        >
      </div>

      <div
        style="width: 100px; height: 100px; border: 3px solid red"
        data-drop="copy"
      ></div>
      <div
        style="width: 100px; height: 100px; border: 3px solid red"
        data-drop="copy"
      ></div>
      <div
        style="width: 100px; height: 100px; border: 3px solid red"
        data-drop="copy"
      ></div>
      <div
        style="width: 100px; height: 100px; border: 3px solid red"
        data-drop="copy"
      ></div>
    </div>

    <script>
      const container = document.getElementById('container')
      let sourceNode = null

      container.ondragstart = (e) => {
        e.dataTransfer.effectAllowed = e.target.dataset.effect
        sourceNode = e.target
      }

      container.ondragover = (e) => {
        e.preventDefault()
        // console.log('over', e.target)
      }

      function clearDropStyle() {
        container.querySelectorAll('.drop-over').forEach((item) => {
          item.classList.remove('drop-over')
        })
      }

      function getDropNode(node) {
        while (node) {
          if (node.dataset && node.dataset.drop) {
            return node
          }
          node = node.parentNode
        }
      }

      container.ondragenter = (e) => {
        clearDropStyle()
        const dropNode = getDropNode(e.target)
        if (
          dropNode &&
          dropNode.dataset.drop === e.dataTransfer.effectAllowed
        ) {
          // 该节点能接受该类型的数据
          e.target.classList.add('drop-over')
        }
      }

      container.ondrop = (e) => {
        clearDropStyle()
        const dropNode = getDropNode(e.target)
        if (
          dropNode &&
          dropNode.dataset.drop === e.dataTransfer.effectAllowed
        ) {
          // 该节点能接受该类型的数据
          if (dropNode.dataset.drop === 'copy') {
            dropNode.innerHTML = ''
            const clone = sourceNode.cloneNode(true)
            clone.dataset.effect = 'move'
            dropNode.appendChild(clone)
          } else {
            sourceNode.remove()
          }
        }
      }
    </script>
  </body>
</html>
```

## navigator.clipboard

复制事件：`document.addEventListener('copy', (e) => { ... })`

- writeText：写文本
- readText：读文本，主动读取需要权限

粘贴事件：`document.addEventListener('paste', (e) => { ... })`

在`paste`事件里用`e.clipboardData`获取粘贴的内容

- 文本：`e.clipboardData.getData('text/plain')`
- HTML：`e.clipboardData.getData('text/html')`
- 文件/图片：`e.clipboardData.files`或`e.clipboardData.items`

## requestidlecallback

它提供了 一种机制
