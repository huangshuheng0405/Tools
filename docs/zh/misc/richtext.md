# rich text（Vue）

富文本编辑器没有"最好用"的，只有"最合适"的。选型时真正决定成本的是三件事：**内核架构**（决定了你能改到什么程度）、**是否自带 UI**（决定了你从零开始还是从半成品开始）、**维护状态与 License**（决定了半年后会不会变成技术债）。

## 先看结论

| 编辑器          | 内核                 | Vue 3 包                          | 维护状态               | 适合场景                        |
| --------------- | -------------------- | --------------------------------- | ---------------------- | ------------------------------- |
| Tiptap          | ProseMirror          | `@tiptap/vue-3`                   | 活跃（3.x）            | 深度定制、协同编辑、Notion 风格 |
| wangEditor-next | Slate                | `@wangeditor-next/editor-for-vue` | 活跃（6.x）            | 中文后台、要开箱即用            |
| Quill 2         | 自研 Delta 模型      | `@vueup/vue-quill`                | 编辑器活跃，封装更新慢 | 结构简单的中轻量编辑            |
| CKEditor 5      | 自研                 | `@ckeditor/ckeditor5-vue`         | 活跃（商业）           | 企业级内容生产、排版要求高      |
| TinyMCE         | 自研                 | `@tinymce/tinymce-vue`            | 活跃（商业）           | 老项目、Word 内容粘贴           |
| Milkdown        | ProseMirror + remark | `@milkdown/vue`                   | 活跃（7.x）            | Markdown 所见即所得             |
| md-editor-v3    | 自研 + CodeMirror 6  | 内置，无需适配器                  | 活跃（7.x）            | 纯 Markdown 编辑器              |
| Umo Editor      | Tiptap               | 内置 Vue 3 组件                   | 活跃                   | 类 Word / 类飞书文档            |

一句话选择：**要做别人没有的编辑体验选 Tiptap，要在后台两周内上线选 wangEditor-next，要编辑 Markdown 选 md-editor-v3。**

> 注意区分 wangEditor 和 wangEditor-next。原版 `@wangeditor/editor`（5.x）作者已在 2023 年停止维护，最后版本停在 5.1.23。`@wangeditor-next/editor` 是社区接手的 fork，API 基本兼容，目前更新到 6.x。新项目应该直接用 next 版。

## 三类编辑器的本质区别

理解这个分类，比记住一堆名字有用得多。

**无头编辑器（headless）**——Tiptap、Milkdown、Lexical。它们只提供数据模型和命令 API，工具栏、气泡菜单、图片上传弹窗全都要自己写。好处是没有任何样式和交互包袱，你能做出完全贴合设计稿的编辑器；代价是上手成本明显更高，一个"能用的"编辑器通常要写几百行。

**开箱即用编辑器**——wangEditor-next、Quill、CKEditor 5、TinyMCE、Umo Editor。工具栏、弹窗、主题、快捷键都打包好了，`<Editor />` 一放就能用。代价是想改默认交互会很别扭，经常要跟它的内部样式和 DOM 结构较劲。

**Markdown 编辑器**——md-editor-v3、Vditor、bytemd。输入的是 Markdown 源码，输出的是 Markdown 或渲染后的 HTML。适合博客、文档站、评论这些场景，不适合需要复杂排版的正式文档。

## Tiptap

基于 ProseMirror 的无头编辑器，是目前 Vue 3 生态里定制能力最强、社区最活跃的选择。ProseMirror 提供了非常严谨的文档模型和事务系统，协同编辑（Yjs）、评论、版本历史这些高级能力都有成熟的扩展生态。

### 安装

```bash
npm install @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit
```

`@tiptap/pm` 必须显式安装。它是 ProseMirror 各个底层包的聚合出口，从 Tiptap 3 开始被拆成独立的 peer 依赖，漏装会在运行时报找不到模块。

### 最小可用示例

```vue
<script setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>Hello Tiptap</p>',
  extensions: [StarterKit],
})
</script>

<template>
  <div v-if="editor">
    <button @click="editor.chain().focus().toggleBold().run()">加粗</button>
    <EditorContent :editor="editor" />
  </div>
</template>
```

`editor` 初始是 `null`，要等客户端挂载后才创建，所以模板里得加 `v-if="editor"`，否则会在 SSR 或首屏渲染时报错。

### 配合 v-model

Tiptap 不内置 `v-model`，需要自己桥接一层：

```vue
<script setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const model = defineModel({ type: String, default: '' })

const editor = useEditor({
  content: model.value,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML()
  },
})
</script>

<template>
  <EditorContent v-if="editor" :editor="editor" />
</template>
```

这里有个容易踩的坑：`onUpdate` 只在用户输入时触发，外部直接改 `model` 不会回写到编辑器。如果要双向同步，得 `watch` 外部值再调 `editor.commands.setContent()`，而且一定要先判断内容是否真的变了，否则每次输入都会重设内容、光标跳到开头。

### StarterKit 打包了什么

`StarterKit` 已经包含：Document、Paragraph、Text、Bold、Italic、Strike、Underline、Code、CodeBlock、Blockquote、Heading、BulletList、OrderedList、ListItem、ListKeymap、Link、HardBreak、HorizontalRule、Dropcursor、Gapcursor、TrailingNode、UndoRedo。

两点值得注意：**Link 和 Underline 是 v3 才并入 StarterKit 的**，v2 项目需要单独装 `@tiptap/extension-link` 和 `@tiptap/extension-underline`；**撤销重做在 v3 里叫 `UndoRedo`**，v2 时代叫 `History`，从 v2 升级时旧代码里的 `History` 会失效。

### 常用扩展

```bash
npm install @tiptap/extension-image @tiptap/extension-table @tiptap/extension-placeholder
```

`@tiptap/extension-placeholder` 现在位于 `@tiptap/extensions` 包里，不需要单独安装。表格用的是 `@tiptap/extension-table`，需要同时注册 `Table`、`TableRow`、`TableHeader`、`TableCell` 四个扩展。

### Nuxt / SSR 场景

服务端渲染时必须关掉立即渲染：

```js
const editor = useEditor({
  immediatelyRender: false,
  extensions: [StarterKit],
})
```

否则会在服务端尝试访问 `document` 而报错。

### 协同编辑

多人协同用 `@tiptap/extension-collaboration` 加 `yjs`，配一个 WebSocket 服务端（如 Hocuspocus）。这是 Tiptap 相对其他方案最大的优势——ProseMirror 的事务模型天生适合做 OT / CRDT，其他内核的编辑器做协同要困难得多。

## wangEditor-next

中文项目里落地最快的方案。国内的图片上传、视频、代码块、表格、全屏这些需求都开箱即得，文档全中文，配置项少。

### 安装

```bash
npm install @wangeditor-next/editor @wangeditor-next/editor-for-vue
```

### 示例

```vue
<script setup>
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import '@wangeditor-next/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'

const editorRef = shallowRef()
const valueHtml = ref('<p>hello</p>')

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

const handleCreated = (editor) => {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      mode="default"
      style="height: 500px; overflow-y: hidden"
      @onCreated="handleCreated"
    />
  </div>
</template>
```

三个必须注意的点：

- `editorRef` 要用 `shallowRef`，不能用 `ref`。编辑器实例是复杂对象，用 `ref` 会把它整个变成响应式对象，导致严重的性能问题甚至栈溢出。
- **必须在 `onBeforeUnmount` 里调 `destroy()`**。wangEditor 基于 Slate，不销毁会残留事件监听和 DOM 引用，在 SPA 里反复进出页面会造成内存泄漏。
- `@onCreated` 是获取实例的唯一途径，`Toolbar` 组件需要拿到这个实例才能联动。

图片上传通过 `editorConfig.MENU_CONF.uploadImage` 配置，视频、代码块同理。需要注意 v5 到 v6 的升级中，视频节点的对齐方式改成了块级媒体布局，导出的 HTML 用响应式 `<figure>` 包裹，如果下游有解析 HTML 的逻辑要一起改。

## Quill 2 与 @vueup/vue-quill

Quill 是最经典的轻量富文本编辑器，2.0 重写了内部实现，输出的 HTML 比 1.x 干净很多。`@vueup/vue-quill` 是 Vue 3 封装（1.5.x 版本内部已经依赖 Quill 2）。

```bash
npm install @vueup/vue-quill
```

```vue
<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const content = ref('<p>hello</p>')
</script>

<template>
  <QuillEditor theme="snow" v-model:content="content" contentType="html" />
</template>
```

注意绑定语法是 `v-model:content` 加上 `contentType="html"`（默认是 `delta`，会拿到 Quill 的 Delta 格式而不是 HTML）。

Quill 的问题在于生态明显老化：官方 Vue 封装更新慢，Quill 2 的 `Clipboard`、`History` 等模块改成按需注册后，很多网上流传的旧教程已经对不上了。要定制贴纸、拖拽块这类交互，Quill 的 Delta 模型会比 ProseMirror 吃力。

## CKEditor 5

功能最完整、排版质量最高的商业级编辑器。表格、图片、媒体嵌入、协作、修订建议、AI 助手都有官方模块，缺点是 License 需要认真对待。

```bash
npm install ckeditor5 @ckeditor/ckeditor5-vue
```

```vue
<script setup>
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  List,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'

const content = defineModel({ type: String, default: '' })

const editor = ClassicEditor
const config = {
  licenseKey: 'GPL',
  plugins: [Essentials, Paragraph, Bold, Italic, Heading, List],
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    '|',
    'bulletedList',
    'numberedList',
  ],
}
</script>

<template>
  <Ckeditor v-model="content" :editor="editor" :config="config" />
</template>
```

从 v42 开始，CKEditor 5 的 npm 包结构改成了 `ckeditor5` 单包 + 按需导入，旧的 `@ckeditor/ckeditor5-build-classic` 之类的预构建包已经废弃，网上大量老教程都还是旧写法。

**License 是最需要提前确认的一点。** CKEditor 5 是 GPL2+ 与商业许可双授权：按 GPL 用就必须把整个项目开源，闭源商业项目必须购买商业许可。`licenseKey: 'GPL'` 就是声明走开源路径。TinyMCE 同理，自托管场景下免费版需要填 `license_key: 'gpl'`。

## TinyMCE

老牌编辑器，对 Word 内容粘贴的支持是同类里最好的——从 Word 复制一段带复杂格式的文字粘进来，它能把样式清理得比较干净，这在传统后台系统里往往是刚需。

```bash
npm install tinymce @tinymce/tinymce-vue
```

```vue
<script setup>
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'

const content = defineModel({ type: String, default: '' })

const init = {
  license_key: 'gpl',
  plugins: 'lists link',
  toolbar: 'undo redo | bold italic | bullist numlist',
  base_url: '/tinymce',
  suffix: '.min',
}
</script>

<template>
  <Editor v-model="content" :init="init" />
</template>
```

自托管时 `base_url` 和 `suffix` 是必须的，要把 `node_modules/tinymce` 下的皮肤、图标、主题资源复制到 public 目录。不想自己托管就用它的云服务，但要绑定域名并受 API Key 限制。TinyMCE 从 7.0 版本起也改成了 GPL + 商业双授权，自托管免费版必须声明 `license_key: 'gpl'`。

## Milkdown

如果内容本质上是 Markdown，又想要所见即所得的编辑体验，Milkdown 是目前最好的选择。它用 remark 解析 Markdown、用 ProseMirror 做编辑内核，Markdown 语法和快捷键（`**粗体**`、`# 标题`）都能实时生效。

```bash
npm install @milkdown/kit @milkdown/vue @milkdown/theme-nord
```

`useEditor` 依赖 `MilkdownProvider` 提供的注入，所以它必须写在 Provider 的子组件里，通常拆成两个文件：

```vue
<!-- MilkdownEditor.vue -->
<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import MilkdownContent from './MilkdownContent.vue'
</script>

<template>
  <MilkdownProvider>
    <MilkdownContent />
  </MilkdownProvider>
</template>
```

```vue
<!-- MilkdownContent.vue -->
<script setup>
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { nord } from '@milkdown/theme-nord'
import { Milkdown, useEditor } from '@milkdown/vue'

const { get } = useEditor((root) =>
  Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, '# Hello Milkdown')
    })
    .config(nord)
    .use(commonmark),
)
</script>

<template>
  <Milkdown />
</template>
```

取值时用 `get()` 拿实例，再配合 `@milkdown/kit/utils` 的 `getMarkdown()`：

```js
import { getMarkdown } from '@milkdown/kit/utils'

const markdown = get()?.action(getMarkdown())
```

Milkdown 还提供了 `@milkdown/crepe`——一个把工具栏、气泡菜单、斜杠命令、代码块语言选择都打包好的完整编辑器，用法是 `new Crepe({ root })` 传给 `useEditor`，适合不想自己拼扩展的场景。

## Markdown 编辑器：md-editor-v3

如果需求就是纯 Markdown 编辑（博客、文档站、Issue 区），没必要上 Milkdown，直接用 md-editor-v3。它内置了 CodeMirror 6 做源码模式、markdown-it 做预览、xss 做内容清洗，支持目录、全屏、图片粘贴上传、主题切换、导出 PDF。

```bash
npm install md-editor-v3
```

```vue
<script setup>
import { ref } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const text = ref('# Hello')
</script>

<template>
  <MdEditor v-model="text" />
</template>
```

7.x 版本要求 Vue `^3.5.3`，升级前先确认 Vue 版本。数学公式、Mermaid 图表这些需要额外安装对应依赖。

同类的还有 **Vditor**（4.x，框架无关，需自己封 Vue 组件）和 **bytemd**（掘金开源，基于 CodeMirror 5，更新已经放缓），新项目优先选 md-editor-v3。

## 其它值得一提的

**Umo Editor** 是基于 Tiptap 二次开发的国产文档编辑器，定位是网页版的 Word / 飞书文档，页面设置、分页、目录、水印、涂鸦、导出 PDF / Word 都有，适合要做"在线文档"类产品的场景。

**Lexical** 是 Meta 出品的新一代编辑器内核，性能很好，但它没有官方 Vue 适配，社区封装（如 `lexical-vue`）成熟度远不如 Tiptap。

**Editor.js** 是块级编辑器，输出结构化 JSON 而不是 HTML，适合"内容以块为单位存储和渲染"的场景。它有官方 Vue 示例但不是开箱组件。

**ProseMirror / Slate** 是底层框架，Tiptap 和 wangEditor 分别基于它们。除非有非常特殊的需求，否则不建议直接使用——直接上手要处理的细节比 Tiptap 多一个数量级。

## 选型建议

按场景对照：

- **后台管理系统，两周内要上线，编辑内容就是图文混排** → wangEditor-next，中文文档、上传配置开箱即用
- **内容平台、需要自己设计编辑器交互（气泡菜单、斜杠命令、块级拖拽）** → Tiptap
- **多人协同编辑** → Tiptap + Yjs，这是目前唯一有成熟方案的路线
- **博客、文档站，内容本身就是 Markdown** → md-editor-v3
- **正式文档、合同、排版要求高，且预算允许** → CKEditor 5 商业版
- **需要粘贴 Word 内容且格式不能乱** → TinyMCE
- **轻量评论框、字数很少的输入** → 直接 `<textarea>` 加一层 Markdown 解析，别上编辑器

如果拿不准，默认选 Tiptap。它前期多花的时间，会在你第一次需要"改一下默认行为"的时候收回来。

## 通用坑

**XSS 是必须处理的。** 编辑器输出的 HTML 如果直接 `v-html` 渲染，等于给了所有用户一个注入点。渲染端一定要用 `DOMPurify` 之类的库清洗。服务端存储时也不要信任前端传来的 HTML，同样要过滤。

**图片上传要自己接。** 所有编辑器默认都是转 base64，图片一多 HTML 就膨胀到几 MB，数据库字段直接爆掉。正确做法是配置自定义上传，把图片传到对象存储，编辑器里只存 URL。

**SSR 场景要小心。** 编辑器基本都依赖 `document`，Nuxt 里要用 `<ClientOnly>` 包裹，或者动态导入（`defineAsyncComponent` + `ssr: false`）。Tiptap 还要额外设置 `immediatelyRender: false`。

**受控组件的光标问题。** 编辑器内部维护自己的文档模型，父组件每次更新都把 HTML 重新灌回去会导致光标跳到开头。要双向绑定，一定要在 `watch` 里判断新值和当前 HTML 是否真的不同，不同才调 `setContent()`。

**大文档性能。** 超过几万字后，所有基于 `contenteditable` 的编辑器都会开始卡顿。这时候要考虑分块加载、虚拟滚动，或者换 Lexical 这类性能优先的内核。

## 参考

- [Tiptap 文档](https://tiptap.dev/docs)
- [wangEditor-next 文档](https://wangeditor-next.github.io/docs/guide/index)
- [Quill 官网](https://quilljs.com/)
- [CKEditor 5 文档](https://ckeditor.com/docs/ckeditor5/latest/)
- [TinyMCE 文档](https://www.tiny.cloud/docs/tinymce/latest/)
- [Milkdown 文档](https://milkdown.dev/docs/guide/getting-started)
- [md-editor-v3 文档](https://imzbf.github.io/md-editor-v3/)
