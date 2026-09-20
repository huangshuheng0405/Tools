# PDF.js、pdfjs-dist 与 vue-pdf-embed

PDF.js 是 Mozilla 社区维护的 PDF 渲染引擎。它用 HTML5 / JavaScript 解析并渲染 PDF，不需要浏览器安装 PDF 插件。`pdfjs-dist` 是 PDF.js 发布到 npm 的预编译版本，`vue-pdf-embed` 是基于 `pdfjs-dist` 封装的 Vue 3 组件，适合直接做 PDF 预览。

## 三者关系

| 名称 | 是什么 | 常见使用场景 |
| --- | --- | --- |
| PDF.js | Mozilla 的开源项目、底层渲染引擎 | 源码开发、学习底层解析与渲染 |
| `pdfjs-dist` | PDF.js 官方编译后的 npm 包 | 在业务代码里直接用 API 解析、渲染 PDF |
| `vue-pdf-embed` | 面向 Vue 3 的 PDF 组件 | 在 Vue 3 项目里快速实现 PDF 预览 |

PDF.js 项目本身主要分成三层：

- **Core**：负责解析 PDF 二进制内容，读取页面、字体、图片等资源。
- **Display**：对外暴露 API，把解析结果渲染到 `canvas`、`svg` 等 Web 能力上。
- **Viewer**：一个完整可用的 PDF 阅读器界面，例如 Firefox 内置 PDF 阅读器使用的就是 PDF.js。

业务项目一般不需要直接使用 Core，也很少把整套 Viewer 原封不动嵌进自己的页面。更多时候是用 `pdfjs-dist` 暴露的 Display API，或者直接使用 `vue-pdf-embed` 这类封装组件。

## pdfjs-dist 是什么

官方仓库名是 PDF.js，但发布到 npm 的包名是 `pdfjs-dist`。这个包把 PDF.js 源码构建成浏览器可以直接使用或打包器可以 import 的文件，主要包含：

- `build/pdf.mjs`：显示层 API 入口。
- `build/pdf.worker.mjs`：Worker 文件，负责 PDF 解析，避免阻塞主线程。
- `build/pdf.worker.min.mjs`：压缩后的 Worker 文件。
- `legacy/build/`：给老浏览器用的降级构建。
- `cmaps/`：非拉丁字符渲染需要的字符映射表。
- `standard_fonts/`：PDF 标准字体。
- `wasm/`：JPEG 2000、JBIG2 等解码需要的 Wasm 文件。

安装命令：

```bash
npm install pdfjs-dist
```

使用前一般要配置 Worker：

```js
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
```

`?url` 是 Vite 把文件作为静态资源 URL 导出的语法。其他构建工具可以改成复制 Worker 文件后配置 `workerSrc`，或使用对应工具提供的资源处理方式。`pdf.mjs` 和 `pdf.worker.mjs` 必须来自同一个 `pdfjs-dist` 版本，否则会出现 API 与 Worker 版本不一致的错误。

## pdfjs-dist 手动渲染示例

下面用 Vue 3 + Canvas 加载 PDF 的第一页：

```vue
<script setup>
import { onMounted, ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const canvasRef = ref()

onMounted(async () => {
  const pdf = await pdfjsLib.getDocument('/pdfs/demo.pdf').promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 1.5 })

  const canvas = canvasRef.value
  const context = canvas.getContext('2d')
  const outputScale = window.devicePixelRatio || 1

  canvas.width = Math.floor(viewport.width * outputScale)
  canvas.height = Math.floor(viewport.height * outputScale)
  canvas.style.width = `${Math.floor(viewport.width)}px`
  canvas.style.height = `${Math.floor(viewport.height)}px`

  await page.render({
    canvasContext: context,
    viewport,
    transform:
      outputScale === 1
        ? null
        : [outputScale, 0, 0, outputScale, 0, 0],
  })
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
```

`getDocument` 除了接收字符串 URL，也接收配置对象：

```js
const loadingTask = pdfjsLib.getDocument({
  url: '/api/pdf/demo',
  httpHeaders: {
    Authorization: `Bearer ${token}`,
  },
})

const pdf = await loadingTask.promise
```

如果 PDF 来自另一个域名，需要目标服务器配置 CORS，或者通过自己的后端代理获取。

## vue-pdf-embed 是什么

`vue-pdf-embed` 把 PDF.js 的加载、Worker、Canvas 渲染、文字层、注释层等内容封装成了 Vue 组件，避免在每个页面里重复编写底层逻辑。它支持：

- 直接传入 URL、Base64、TypedArray 或已经加载好的 `PDFDocumentProxy`。
- 显示单页或多页。
- 控制缩放、旋转、宽度和高度。
- 开启文字选择层和注释层。
- 处理密码保护的 PDF。
- 通过事件监听加载和渲染状态。
- 通过 `usePdfDocument` 复用文档，通过 `usePdfSearch` 做全文搜索。

`vue-pdf-embed` 2.x 是 Vue 3 组件，要求 Vue `^3.3.0`，并把 `pdfjs-dist` 作为普通依赖；Vue 2 项目需要使用 `vue-pdf-embed@1`。对于只需要简单预览的项目，单独安装 2.x 即可：

```bash
npm install vue-pdf-embed
```

如果还要自己配置 Worker、CMap、Wasm 等资源，建议也显式安装 `pdfjs-dist`，并保证项目中实际解析的版本和 `vue-pdf-embed` 内部依赖的 6.x 一致：

```bash
npm install vue-pdf-embed pdfjs-dist
```

## 基础用法

```vue
<script setup>
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'

const source = '/pdfs/demo.pdf'
</script>

<template>
  <VuePdfEmbed annotation-layer text-layer :source="source" />
</template>
```

不写 `page` 时会显示全部页面；只显示某一页：

```vue
<script setup>
import { ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

const source = '/pdfs/demo.pdf'
const page = ref(1)
</script>

<template>
  <VuePdfEmbed
    :source="source"
    :page="page"
    :scale="1.5"
    :rotation="90"
  />
</template>
```

常用 props：

| Prop | 说明 |
| --- | --- |
| `source` | PDF 的 URL、Base64、TypedArray 或 `PDFDocumentProxy` |
| `page` | 显示第几页，可传数字或数字数组 |
| `scale` | 渲染分辨率倍数，控制清晰度 |
| `rotation` | 旋转角度，常用 `0`、`90`、`180`、`270` |
| `width` / `height` | 设置页面宽度或高度，指定宽度时高度会被忽略 |
| `textLayer` | 开启可搜索、可复制的文字层 |
| `annotationLayer` | 开启注释、链接等注释层 |
| `forms` | 渲染表单字段，需要同时开启注释层 |

常用事件：

| 事件 | 触发时机 |
| --- | --- |
| `loaded` | 文档加载完成，参数是 `PDFDocumentProxy` |
| `progress` | 文档下载进度变化，参数含 `loaded` 和 `total` |
| `rendered` | 页面渲染完成 |
| `loading-failed` | 文档加载失败 |
| `rendering-failed` | 页面渲染失败 |
| `password-requested` | PDF 需要密码，参数包含 `callback` 和 `isWrongPassword` |

```vue
<script setup>
import { ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

const loading = ref(true)
const source = '/pdfs/demo.pdf'

function handleLoadError(error) {
  console.error(error)
}
</script>

<template>
  <div v-if="loading">PDF 加载中...</div>

  <VuePdfEmbed
    :source="source"
    @loaded="loading = false"
    @loading-failed="handleLoadError"
  />
</template>
```

## 全文搜索

`vue-pdf-embed` 提供 `usePdfSearch`，把搜索控制器传给组件的 `find-controller`，并开启文字层，即可高亮匹配内容：

```vue
<script setup>
import { ref } from 'vue'
import VuePdfEmbed, { usePdfDocument, usePdfSearch } from 'vue-pdf-embed'

const keyword = ref('')
const { doc } = usePdfDocument({ source: '/pdfs/demo.pdf' })
const { find, findController } = usePdfSearch(doc)

function search() {
  find(keyword.value)
}
</script>

<template>
  <input v-model="keyword" placeholder="输入关键词" @keydown.enter="search" />
  <VuePdfEmbed :source="doc" :find-controller="findController" text-layer />
</template>
```

## 中文 PDF、注释资源与特殊图片格式

某些 PDF 包含非拉丁字符、特殊字体或 JPEG 2000 / JBIG2 图片。此时除了显示页面，还要让 PDF.js 能拿到 `cmaps/`、`wasm/` 等资源：

```vue
<script setup>
import VuePdfEmbed from 'vue-pdf-embed'

const source = {
  url: '/pdfs/demo.pdf',
  cMapUrl: 'https://unpkg.com/pdfjs-dist/cmaps/',
  wasmUrl: 'https://unpkg.com/pdfjs-dist/wasm/',
}
</script>

<template>
  <VuePdfEmbed
    annotation-layer
    image-resources-path="https://unpkg.com/pdfjs-dist/web/images/"
    :source="source"
  />
</template>
```

生产项目不建议直接依赖 CDN。可以把 `pdfjs-dist` 中对应的静态目录复制到自己的静态资源目录，再改成项目内的路径。这里以 unpkg 为例是为了展示参数本身的作用。

## Worker 与 CSP

`vue-pdf-embed` 默认会把 PDF.js Worker 打包成 Blob URL，因此在普通 Vue 3 项目里可以直接使用。如果网站开启了严格的 CSP，禁止 `blob:` Worker，可以改用 essential 构建并手动配置 Worker：

```js
import VuePdfEmbed, {
  GlobalWorkerOptions,
} from 'vue-pdf-embed/dist/index.essential.mjs'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl
```

也可以把 `pdfjs-dist/build/pdf.worker.min.mjs` 复制到 `public/`，然后设置：

```js
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
```

## SSR / Nuxt 注意事项

PDF 渲染依赖浏览器 API，不适合服务端渲染。在 Nuxt 中需要把组件包进 `<ClientOnly>`：

```vue
<template>
  <ClientOnly>
    <PdfPreview />
  </ClientOnly>
</template>
```

如果组件仍被打进服务端 bundle，可以改为异步加载：

```js
import { defineAsyncComponent } from 'vue'

const PdfPreview = defineAsyncComponent(() => import('./PdfPreview.vue'))
```

## 常见坑

- **API 与 Worker 版本不一致**：`pdf.mjs` 和 `pdf.worker.mjs` 必须来自同一个 `pdfjs-dist` 版本，否则会报版本不匹配错误。
- **混用多个 `pdfjs-dist` 版本**：项目里同时存在直接安装的旧版本和 `vue-pdf-embed` 依赖的 6.x 时，优先统一到一个 6.x 版本。
- **跨域 PDF**：`getDocument` 请求遵循浏览器同源策略，需要 CORS 或后端代理。
- **不开文字层无法搜索复制**：全文搜索、选中复制需要 `text-layer`。
- **中文乱码 / CMap 报错**：需要正确提供 `cMapUrl`，尤其是有非拉丁字符的 PDF。
- **注释图标不显示**：注释层需要 `imageResourcesPath` 或 `image-resources-path`。
- **全量渲染多页性能差**：PDF 页面很多时应按需渲染可见页，避免一次性把几百个 Canvas 全部创建。
