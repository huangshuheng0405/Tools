# Canvas

## 示例一

::: code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      canvas {
        position: fixed;
        left: 0;
        top: 0;
        background: #222;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <canvas></canvas>
    <script src="./index.js"></script>
  </body>
</html>
```

```js [index.js]
const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

function init() {
  cvs.width = window.innerWidth * window.devicePixelRatio
  cvs.height = window.innerHeight * window.devicePixelRatio
}
init()

/**
 * 随机数
 * @param {*} min 最小值
 * @param {*} max 最大值
 * @returns 随机数
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Point {
  constructor() {
    this.r = 6
    this.x = getRandom(0, cvs.width - this.r / 2)
    this.y = getRandom(0, cvs.height - this.r / 2)
    this.xSpeed = getRandom(-50, 50)
    this.ySpeed = getRandom(-50, 50)
    this.lastDrawTime = null
  }

  draw() {
    // 更新坐标
    if (this.lastDrawTime) {
      // 计算新的坐标
      const duration = (Date.now() - this.lastDrawTime) / 1000
      const xDis = this.xSpeed * duration
      const yDis = this.ySpeed * duration

      const x = this.x + xDis
      const y = this.y + yDis

      // 处理边界反弹
      if (x > cvs.width - this.r / 2) {
        this.xSpeed = -this.xSpeed
      }
      if (x < this.r / 2) {
        this.xSpeed = -this.xSpeed
      }
      if (y > cvs.height - this.r / 2) {
        this.ySpeed = -this.ySpeed
      }
      if (y < this.r / 2) {
        this.ySpeed = -this.ySpeed
      }

      this.x = x
      this.y = y
    }
    ctx.beginPath()
    // 画小圆圈
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(200, 200, 200, 1)'
    ctx.fill()
    // 记录当前绘制时间
    this.lastDrawTime = Date.now()
  }
}

class Graph {
  constructor(pointNumber = 30, maxDistance = 500) {
    this.maxDistance = maxDistance
    this.points = new Array(pointNumber).fill(0).map(() => new Point())
  }

  draw() {
    requestAnimationFrame(() => {
      this.draw()
    })
    // 清除前一帧画布画布
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    for (let i = 0; i < this.points.length; i++) {
      const p1 = this.points[i]
      p1.draw()
      for (let j = i + 1; j < this.points.length; j++) {
        const p2 = this.points[j]
        const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
        if (distance > this.maxDistance) continue
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.closePath()
        // 根据两点之间的距离处理清晰度
        ctx.strokeStyle = `rgba(200, 200, 200, ${1 - distance / this.maxDistance})`
        ctx.stroke()
      }
    }
  }
}

const g = new Graph()
g.draw()
```

:::

## 示例二

文字

::: code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      canvas {
        display: block;
        width: 100%;
        height: 100%;
        background: #000;
      }
    </style>
  </head>
  <body>
    <canvas></canvas>
    <script src="./index.js"></script>
  </body>
</html>
```

```js [index.js]
const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

function init() {
  cvs.width = window.innerWidth * devicePixelRatio
  cvs.height = window.innerHeight * devicePixelRatio
}

init()

const fontSize = 10 * devicePixelRatio
ctx.font = `${fontSize}px "JetBrains Mono"`
// 一屏能放多少列
const columnCount = Math.floor(cvs.width / fontSize)
// 每一列当前画到第几行
const charIndex = new Array(columnCount).fill(0)

/**
 * 每一帧怎么画
 */
function draw() {
  // 用很淡的黑色覆盖全屏 不是完全清空 所以后续字符会慢慢变淡 形成拖影
  ctx.fillStyle = 'rgba(0,0,0,0.1)'
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  ctx.fillStyle = '#6be445'
  ctx.textBaseline = 'top'
  for (let i = 0; i < columnCount; i++) {
    const text = getRandomChar()
    // 列位置
    const x = i * fontSize
    // 该列当前下落到的 y
    const y = charIndex[i] * fontSize
    // 画字符
    ctx.fillText(text, x, y)
    // 下移一行
    charIndex[i]++
    // 跑出屏幕 重新从顶部开始  （设置概率 让每列重置时间不一致）
    if (y >= cvs.height && Math.random() > 0.99) {
      charIndex[i] = 0
    }
  }
}

ctx.fillStyle = '#fff'
ctx.fillText('hello world', 300, 400)

function getRandomChar() {
  return String.fromCharCode(Math.floor(Math.random() * 128))
}

setInterval(draw, 50)
```

:::

## 示例三

图片

::: code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <canvas></canvas>
    <script src="./index.js"></script>
  </body>
</html>
```

```js [index.js]
const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d', {
  willReadFrequently: true
})

function init() {
  const img = new Image()
  img.onload = () => {
    cvs.width = img.width
    cvs.height = img.height
    ctx.drawImage(img, 0, 0)
  }
  img.src = './na.jpg'
}
init()

cvs.addEventListener('click', (e) => {
  const x = e.offsetX
  const y = e.offsetY
  // console.log(x, y)
  // 拿到整张图片的每个像素点的数据
  const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height)
  const clickColor = getColor(x, y, imgData)
  const greenColor = [0, 255, 0, 255]

  function _changeColor(x, y) {
    if (x < 0 || x >= cvs.width || y < 0 || y >= cvs.height) return
    const i = point2Index(x, y)

    const color = getColor(x, y, imgData)
    if (diffColor(color, clickColor) > 100) return
    if (imgData.data[i] === 0) return

    // 第二个参数是偏移量
    imgData.data.set(greenColor, i)
    _changeColor(x + 1, y)
    _changeColor(x, y + 1)
    _changeColor(x - 1, y)
    _changeColor(x, y - 1)
  }
  _changeColor(x, y)
  // 把 imgData 绘制到 canvas 上
  ctx.putImageData(imgData, 0, 0)
  // console.log(clickColor)
})

function point2Index(x, y) {
  return (y * cvs.width + x) * 4
}

function getColor(x, y, imgData) {
  const i = point2Index(x, y)
  return [
    imgData.data[i],
    imgData.data[i + 1],
    imgData.data[i + 2],
    imgData.data[i + 3]
  ]
}

function diffColor(color1, color2) {
  return (
    Math.abs(color1[0] - color2[0]) +
    Math.abs(color1[1] - color2[1]) +
    Math.abs(color1[2] - color2[2]) +
    Math.abs(color1[3] - color2[3])
  )
}
```

:::

## 示例四

绘制矩形 能拖动

::: code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="color" name="" id="" />
    <canvas></canvas>
    <script src="./index.js"></script>
  </body>
</html>
```

```js [index.js]
const colorPicker = document.querySelector('input')
const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

function init() {
  const w = 500
  const h = 300
  cvs.width = w * devicePixelRatio
  cvs.height = h * devicePixelRatio
  cvs.style.width = w + 'px'
  cvs.style.height = h + 'px'
  cvs.style.backgroundColor = '#978e8eff'
}
init()

const shapes = []

class Rectangle {
  constructor(color, startX, startY) {
    this.color = color
    this.startX = startX
    this.startY = startY
    this.endX = startX
    this.endY = startY
  }

  get minX() {
    return Math.min(this.startX, this.endX)
  }
  get maxX() {
    return Math.max(this.startX, this.endX)
  }
  get minY() {
    return Math.min(this.startY, this.endY)
  }
  get maxY() {
    return Math.max(this.startY, this.endY)
  }

  draw() {
    ctx.beginPath()
    ctx.moveTo(this.maxX * devicePixelRatio, this.minY * devicePixelRatio)
    ctx.lineTo(this.maxX * devicePixelRatio, this.maxY * devicePixelRatio)
    ctx.lineTo(this.minX * devicePixelRatio, this.maxY * devicePixelRatio)
    ctx.lineTo(this.minX * devicePixelRatio, this.minY * devicePixelRatio)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'square'
    ctx.lineWidth = 3 * devicePixelRatio
    ctx.stroke()
  }

  /**
   * 判断是否在矩形内
   * @param {*} x 点的x坐标
   * @param {*} y 点的y坐标
   * @returns 是否在矩形内
   */
  isInside(x, y) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY
  }
}

const rect = new Rectangle(colorPicker.value, 100, 100)
// rect.endX = 200
// rect.endY = 200
// rect.draw()

// 鼠标按下
cvs.onmousedown = (e) => {
  // 获取canvas的坐标
  const rect = cvs.getBoundingClientRect()
  // 记录点击时的坐标  后续用鼠标移动距离并计算拖动的距离
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top
  // 判断是否在矩形内
  const shape = getShape(clickX, clickY)
  if (shape) {
    // 拖动
    const { startX, startY, endX, endY } = shape
    window.onmousemove = (e) => {
      // 计算拖动的距离
      const disX = e.clientX - rect.left - clickX
      const disY = e.clientY - rect.top - clickY
      shape.startX = startX + disX
      shape.startY = startY + disY
      shape.endX = endX + disX
      shape.endY = endY + disY
    }
  } else {
    // 新建
    const newRect = new Rectangle(colorPicker.value, clickX, clickY)
    shapes.push(newRect)
    window.onmousemove = (e) => {
      // 指定矩阵结束坐标为鼠标松开时的坐标
      newRect.endX = e.clientX - rect.left
      newRect.endY = e.clientY - rect.top
      newRect.draw()
    }
  }

  // 鼠标松开 接触绑定事件
  window.onmouseup = () => {
    window.onmouseup = null
    window.onmousemove = null
  }
}

/**
 * 获取点击的矩形对象
 * @param {Number} x 点的x坐标
 * @param {Number} y 点的y坐标
 * @returns 矩形对象
 */
function getShape(x, y) {
  // 从后往前遍历，先绘制的矩形在后面，所以先判断后面的矩形是否在点击点内
  for (let i = shapes.length - 1; i >= 0; i--) {
    const s = shapes[i]
    if (s.isInside(x, y)) {
      return s
    }
  }
  return null
}

function draw() {
  requestAnimationFrame(draw)
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  // 可自行设置状态值 来判断是否需要重新绘制
  shapes.forEach((shape) => shape.draw())
}
draw()
```

:::
