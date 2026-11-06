# 二维码

Vue 项目里生成二维码有两个常用方案：

| 方案 | 包 | 特点 |
| --- | --- | --- |
| 底层库 | [`qrcode`](https://github.com/soldair/node-qrcode) 1.5.4 | 命令式 API，可输出 canvas / 图片 / SVG，也能在 Node 端用；灵活但需自己封装 |
| Vue 组件 | [`qrcode.vue`](https://github.com/scopewu/qrcode.vue) 3.11.0 | 声明式，`<qrcode-vue :value="..." />` 即可渲染，适合直接在模板里用（仅支持 Vue 3） |

## 安装

```bash
npm install qrcode qrcode.vue
```

只选一种的话，装对应的那个即可。`qrcode.vue` 内部依赖了 `qrcode`。

## 方式一：qrcode 生成到 canvas

最基本的用法：准备一个 `<canvas>`，把内容画进去。

```vue
<template>
  <canvas ref="canvasRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

const canvasRef = ref(null)

onMounted(async () => {
  await QRCode.toCanvas(canvasRef.value, 'https://vitepress.dev', {
    width: 200,
    margin: 2,
  })
})
</script>
```

内容会变的话，用 `watch` 重新生成即可，`toCanvas` 会覆盖原有内容：

```js
watch(text, async (value) => {
  await QRCode.toCanvas(canvasRef.value, value)
})
```

### 生成图片（data URL）

想用 `<img>` 显示、或需要下载时，用 `toDataURL`：

```vue
<template>
  <img v-if="qrUrl" :src="qrUrl" alt="二维码" />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import QRCode from 'qrcode'

const text = ref('https://vitepress.dev')
const qrUrl = ref('')

watchEffect(async () => {
  if (!text.value) {
    qrUrl.value = ''
    return
  }
  qrUrl.value = await QRCode.toDataURL(text.value, { width: 200, margin: 2 })
})
</script>
```

### 生成 SVG

矢量图适合打印或大尺寸展示：

```js
const svg = await QRCode.toString('https://vitepress.dev', {
  type: 'svg',
  margin: 2,
})
// svg 是字符串，可直接 v-html 或保存为 .svg 文件
```

### 下载二维码

data URL 直接挂到 `<a download>` 上就能下载 PNG：

```js
async function download() {
  const url = await QRCode.toDataURL(text.value, { width: 500, margin: 2 })
  const a = document.createElement('a')
  a.href = url
  a.download = 'qrcode.png'
  a.click()
}
```

### 常用参数

| 参数 | 说明 |
| --- | --- |
| `width` | 输出宽度（像素），默认 256；高度自动等比 |
| `margin` | 四周留白，默认 4（模块数），0 表示不留白 |
| `errorCorrectionLevel` | 容错级别 `'L'` / `'M'` / `'Q'` / `'H'`，默认 `'M'`，`'H'` 最抗污损但容量最小 |
| `color.dark` / `color.light` | 前景色 / 背景色，如 `{ dark: '#000000ff', light: '#ffffffff' }` |
| `type` | `toString` 的输出类型：`'svg'` / `'utf8'` / `'terminal'` |

## 方式二：qrcode.vue 组件

直接用组件，改 `value` 就会自动重绘：

```vue
<template>
  <qrcode-vue
    :value="text"
    :size="200"
    level="H"
    render-as="canvas"
  />
</template>

<script setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const text = ref('https://vitepress.dev')
</script>
```

常用 props：

| Prop | 说明 |
| --- | --- |
| `value` | 二维码内容（必填） |
| `size` | 尺寸，默认 100 |
| `level` | 容错级别，默认 `'M'` |
| `render-as` | `'canvas'`（默认）或 `'svg'` |
| `margin` | 留白，默认 0 |
| `foreground` / `background` | 前景 / 背景色 |

注意 `qrcode.vue` 默认 `margin` 为 0，白色边距太窄时有些扫码器识别率会下降，建议手动传 `:margin="2"`。

## 注意事项

- **内容长度有限制**：url / 文本过长会抛错 `The amount of data is too big to be stored in a QR Code`。降低容错级别或缩短内容可解决。大致容量：数字约 7000 字符，字母数字约 4300，UTF-8 字节约 2900（均为 L 级）。
- **生成是异步的**：`toCanvas` / `toDataURL` / `toString` 都返回 Promise，记得 `await` 或 `.then`。
- **canvas 要有尺寸**：`toCanvas` 默认按 `width` 设置 canvas 的宽高，但页面上的显示尺寸由 CSS 决定，不要用 CSS 压缩到过小，否则失真。
- **长按识别（微信 / 移动端）**：data URL 的 `<img>` 方式最稳；canvas 方式在部分 WebView 里长按无法识别，必要时转成图片再展示。
- **需要扫码识别（读码）**：上面的库只负责「生成」。读取摄像头或图片中的二维码用 [`vue-qrcode-reader`](https://github.com/gruhn/vue-qrcode-reader)（当前 5.7.3）。
- **服务端生成**：`qrcode` 同包支持 Node，`QRCode.toFile('qr.png', text)` 或 `toBuffer` 即可，无需浏览器环境。
