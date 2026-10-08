# uview-plus

uview-plus 是 uni-app 生态的 UI 组件库,60+ 组件 + 一堆工具函数,fork 自 **uView 2.0**。原来的 uView 2.0 只支持 Vue2,uview-plus 把它移植到了 **Vue3 + Vite**,并且全面兼容 nvue(原生渲染)。

| 项目     | 说明                                       |
| -------- | ------------------------------------------ |
| 版本     | 3.8.126(2026-09)                           |
| 组件前缀 | `up-`( `u-` 作为兼容别名保留 )             |
| 支持平台 | App / H5 / 微信小程序 / 支付宝 / 头条等     |
| 官方文档 | https://uview-plus.jiangruyi.com/          |

> 和 uView 2.0 的关系:uview-plus 是它的 Vue3 版本。网上 uView 2.0 的教程(Vue2 写法)大部分还能用,但要注意三点:组件前缀从 `u-` 改成 `up-`、`main.js` 的注册方式不同、部分 API 有调整。

## 安装

### 方式一:uni_modules(推荐)

在插件市场搜 [uview-plus](https://ext.dcloud.net.cn/plugin?name=uview-plus),点「下载插件并导入 uni_modules」。

装完项目里会多出 `uni_modules/uview-plus/` 目录,所有配置里的路径都指向它。

### 方式二:npm

```bash
npm install uview-plus
```

`package.json` 里没有 `dependencies` 字段的话,先跑 `npm init -y`。

> 两种方式只在 easycom 的路径上不一样,下面的配置里会分别标出。

## 配置

三步,缺一不可。

### 1. pages.json 配置 easycom

easycom 是 uni-app 的自动按需引入机制。配好之后,页面里**直接写 `<up-button>` 就能用,不用 import**。

```json [pages.json]
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u--(.*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue",
      "^up-(.*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue",
      "^u-([^-].*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue"
    }
  },
  "pages": [
    // ...原有的 pages 配置
  ]
}
```

npm 安装的话,把三条规则里的 `@/uni_modules/uview-plus/` 换成 `uview-plus/`。

几个必须注意的点:

- **必须写在 `custom` 里**,写在 `easycom` 下同级无效。
- **`pages.json` 里只能有一个 `easycom` 字段**,重复写会导致规则失效。
- **三条规则一条都不能少**。`^u--(.*)` 对应 `u--form` 这种双横线写法,`^up-(.*)` 对应 `up-button`,`^u-([^-].*)` 对应 `u-button` 老写法。
- 改完规则要**重启 HBuilderX 或重新编译**,否则不生效。

> 官方文档某些页面里写的 `"^u-().*)"` 是笔误(括号位置错了),会直接导致规则解析失败。以官网 demo 的 `^u-([^-].*)` 为准。

### 2. main.js 注册

```js [main.js]
import uviewPlus from '@/uni_modules/uview-plus'

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  return { app }
}
// #endif
```

### 3. uni.scss 引入主题

```scss [uni.scss]
@import '@/uni_modules/uview-plus/theme.scss';
```

**千万不要往 `uni.scss` 里引入完整的样式文件**(比如 `uview-plus/index.scss`),它会被注入到每个页面,包体积直接爆炸。`uni.scss` 里只放变量和 `theme.scss`。

> 没有 `uni.scss` 就新建一个空的。

## 组件速查

配置好后所有组件都能直接用。常用的按分类列一下:

| 分类       | 组件                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------- |
| 基础       | `up-button` `up-icon` `up-text` `up-image` `up-cell` `up-cell-group` `up-divider` `up-gap`     |
| 布局       | `up-row` `up-col` `up-grid` `up-grid-item` `up-card` `up-box` `up-line` `up-sticky` `up-flex` |
| 表单       | `up-form` `up-input` `up-textarea` `up-radio` `up-checkbox` `up-switch` `up-slider` `up-rate` `up-number-box` `up-code-input` |
| 选择器     | `up-picker` `up-datetime-picker` `up-calendar` `up-select` `up-cascader` `up-subsection`      |
| 数据展示   | `up-list` `up-table` `up-tag` `up-badge` `up-avatar` `up-album` `up-count-to` `up-count-down` `up-waterfall` `up-virtual-list` `up-tree` |
| 进度       | `up-line-progress` `up-circle-progress`                                                       |
| 反馈       | `up-toast` `up-modal` `up-popup` `up-notify` `up-alert` `up-loading-page` `up-skeleton` `up-loadmore` `up-empty` `up-overlay` |
| 导航       | `up-navbar` `up-tabs` `up-steps` `up-dropdown` `up-index-list` `up-back-top` `up-tabbar` `up-swiper` `up-scroll-list` |
| 上传/媒体  | `up-upload` `up-cropper` `up-signature` `up-qrcode` `up-barcode` `up-poster` `up-parse`        |
| 交互       | `up-swipe-action` `up-collapse` `up-action-sheet` `up-search` `up-pull-refresh` `up-tooltip`   |

文档地址规律:`https://uview-plus.jiangruyi.com/components/组件名.html`,比如 `form.html`、`upload.html`。完整列表见 [components 目录](https://github.com/ijry/uview-plus/tree/3.x/src/uni_modules/uview-plus/components),共 140+ 个。

## 常用组件

### 按钮

```vue
<template>
  <up-button type="primary" text="主要按钮"></up-button>
  <up-button type="success" text="成功" size="small"></up-button>
  <up-button type="error" :plain="true" text="朴素按钮"></up-button>
  <up-button text="加载中" :loading="true"></up-button>
  <up-button text="禁用" :disabled="true"></up-button>
</template>
```

`type` 可用值:`primary` / `success` / `error` / `warning` / `info`。

### 表单 + 校验

最常用的组件,也是最容易踩坑的。

```vue
<template>
  <up-form :model="form" :rules="rules" ref="formRef" labelPosition="left">
    <up-form-item label="用户名" prop="username" :borderBottom="true">
      <up-input v-model="form.username" border="none" placeholder="请输入用户名" />
    </up-form-item>

    <up-form-item label="手机号" prop="mobile" :borderBottom="true">
      <up-input v-model="form.mobile" border="none" placeholder="请输入手机号" />
    </up-form-item>

    <up-form-item label="性别" prop="sex" :borderBottom="true" @click="showSex = true">
      <up-input v-model="form.sex" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
      <template #right>
        <up-icon name="arrow-right"></up-icon>
      </template>
    </up-form-item>
  </up-form>

  <up-button type="primary" text="提交" @click="submit"></up-button>

  <up-action-sheet
    :show="showSex"
    :actions="sexActions"
    title="请选择性别"
    @close="showSex = false"
    @select="sexSelect"
  ></up-action-sheet>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onReady } from '@dcloudio/uni-app'

// 注意:ref 名不要叫 form,和 :model 的变量名撞了会出问题
const formRef = ref()
const showSex = ref(false)

const form = reactive({
  username: '',
  mobile: '',
  sex: '',
})

const sexActions = [
  { name: '男' },
  { name: '女' },
]

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur', 'change'] },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
    {
      validator: (rule, value, callback) => callback(uni.$u.test.mobile(value)),
      message: '手机号格式不正确',
      trigger: ['blur', 'change'],
    },
  ],
  sex: [{ required: true, message: '请选择性别', trigger: ['change'] }],
}

// 微信小程序端必须用 setRules 设置规则,直接传 :rules 可能不生效
onReady(() => {
  formRef.value.setRules(rules)
})

const sexSelect = (item) => {
  form.sex = item.name
  showSex.value = false
}

const submit = async () => {
  try {
    await formRef.value.validate()
    console.log('校验通过', form)
  } catch (e) {
    console.log('校验失败')
  }
}
</script>
```

关键点:

- `up-form-item` 的 `prop` 必须和 `:model` 里的字段路径对上(支持 `user.name` 这种嵌套路径)。
- 页面里的 `ref` **不要命名为 `form`**,避免和 `:model` 绑定冲突。
- **微信小程序端用 `setRules()` 设置规则**,写在 `onReady` 里。直接 `:rules` 在小程序上可能不生效。
- `validate()` 返回 Promise,校验失败会 reject,所以用 `try/catch` 而不是判断返回值。
- 只校验单个字段用 `validateField('mobile')`,重置用 `resetFields()`。

### 上传

`up-upload` **只负责选图、预览、删除,不会真的上传**。真正的上传要自己在 `afterRead` 里调接口。

```vue
<template>
  <up-upload
    v-model:fileList="fileList"
    :maxCount="3"
    accept="image"
    :previewFullImage="true"
    @afterRead="afterRead"
    @delete="onDelete"
  ></up-upload>
</template>

<script setup>
import { ref } from 'vue'

const fileList = ref([])

const afterRead = async (event) => {
  // event.file 是选中的文件,url 是本地临时路径
  const file = event.file

  try {
    const res = await uni.uploadFile({
      url: 'https://your-api.com/upload',
      filePath: file.url,
      name: 'file',
      header: { token: uni.getStorageSync('token') },
    })
    // uploadFile 返回的是字符串,要自己 JSON.parse
    const data = JSON.parse(res.data)
    // 把服务器返回的地址塞回去,否则显示的还是本地临时路径
    fileList.value.push({ url: data.url })
  } catch (e) {
    // 上传失败要把这张图从列表里去掉
    fileList.value.pop()
  }
}

const onDelete = (event) => {
  fileList.value.splice(event.index, 1)
}
```

坑点:

- `uni.uploadFile` 返回的 `res.data` 是**字符串**,不是对象,必须 `JSON.parse`。
- 上传成功后要把服务器地址写回 `fileList`,不然预览显示的永远是本地临时路径。
- `fileList` 里每项必须要有 `url` 字段。

### 列表 + 上拉加载

```vue
<template>
  <up-list @scroll-to-lower="loadMore">
    <up-list-item v-for="(item, index) in list" :key="index">
      <up-cell :title="item.title" :isLink="true"></up-cell>
    </up-list-item>
  </up-list>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([])

const loadMore = () => {
  // 请求下一页数据, push 到 list 里
}
</script>
```

`up-list` 处理了滚动到底部的判断,不用自己算距离。外层页面记得在 `pages.json` 里给页面加 `"bounce": "none"`,否则 iOS 上会有弹性回弹干扰。

### 弹出层和提示

```vue
<template>
  <up-popup :show="show" mode="bottom" :round="10" @close="show = false">
    <view style="padding: 30rpx;">内容</view>
  </up-popup>
</template>
```

`mode` 可选 `top` / `bottom` / `center` / `left` / `right`。

提示消息:

```js
// 新版推荐,需要开启 Root 注入
uni.$u.rootToast('保存成功')
uni.$u.rootToast({ message: '操作完成', type: 'success', duration: 2000 })

// 传统写法,一直可用
uni.$u.toast('保存成功')
```

> `rootToast` 在 Root 挂载前调用会自动降级成 `uni.showToast`,所以不用担心时序问题。

## 工具函数 uni.$u

从 1.7.9 起,uview-plus 把 `$u` 挂到了 `uni` 上,所以**在任何地方**(包括普通 js 文件)都能用 `uni.$u.xxx`。

### 校验 `uni.$u.test`

| 方法                    | 说明           |
| ----------------------- | -------------- |
| `uni.$u.test.mobile(v)` | 手机号         |
| `uni.$u.test.email(v)`  | 邮箱           |
| `uni.$u.test.url(v)`    | URL            |
| `uni.$u.test.isEmpty(v)`| 是否为空       |
| `uni.$u.test.jsonString(v)` | 是否 JSON 字符串 |

`test` 里的方法可以直接当成表单的 `validator` 用(见上面的表单示例)。

### 常用方法

| 方法                              | 说明                                     |
| --------------------------------- | ---------------------------------------- |
| `uni.$u.random(min, max)`         | 随机整数                                 |
| `uni.$u.guid(len)`                | 生成唯一 id                              |
| `uni.$u.deepClone(obj)`           | 深拷贝                                   |
| `uni.$u.deepMerge(target, source)`| 深合并                                   |
| `uni.$u.trim(str)`                | 去空格                                   |
| `uni.$u.timeFormat(time, fmt)`    | 时间格式化,如 `timeFormat(Date.now(), 'yyyy-mm-dd')` |
| `uni.$u.timeFrom(time)`           | 相对时间,如「3 分钟前」                  |
| `uni.$u.priceFormat(price)`       | 金额格式化,保留两位小数                  |
| `uni.$u.addUnit(value, unit)`     | 自动补单位,如 `addUnit(20)` → `20rpx`    |
| `uni.$u.queryParams(obj)`         | 对象转 URL 参数字符串                    |
| `uni.$u.getPx(value)`             | rpx 转 px                                |
| `uni.$u.rpx2px(value)`            | rpx 转 px                                |
| `uni.$u.sleep(ms)`                | 延时,配合 `async/await`                  |
| `uni.$u.os()`                     | 当前系统(ios / android / devtools)       |
| `uni.$u.sys()`                    | 系统信息                                 |
| `uni.$u.getProperty(obj, 'a.b.c')`| 按路径取值                               |
| `uni.$u.setProperty(obj, 'a.b.c', v)` | 按路径赋值                            |
| `uni.$u.page()`                   | 当前页面实例                             |
| `uni.$u.toast(msg)`               | 提示消息                                 |

### 防抖和节流

这两个**不在 `uni.$u` 上**,要从包里直接 import:

```js
import { debounce, throttle } from '@/uni_modules/uview-plus'

// 模板里直接用:注意要写成 debounce(fn, wait) 的调用形式
// <view @tap="debounce(btnClick, 500)">点我</view>

const submit = () => {
  console.log('只会在停止点击 500ms 后执行一次')
}

// 在 js 中调用
const debouncedSubmit = debounce(submit, 500)
```

签名是 `debounce(func, wait = 500, immediate = false)`。

## 请求封装

uview-plus 内置了一个基于 luch-request 的 `http`,比裸 `uni.request` 好用。

### 初始化

3.4.0 以上通过 `app.use` 的第二个参数注册:

```js [main.js]
import uviewPlus from '@/uni_modules/uview-plus'
import { initRequest } from './util/request/index'

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)

  app.use(uviewPlus, () => ({
    httpIns: initRequest,
  }))

  return { app }
}
// #endif
```

```js [util/request/index.js]
import { http } from '@/uni_modules/uview-plus'

const initRequest = (http) => {
  http.setConfig((config) => {
    config.baseURL = 'https://your-api.com'
    return config
  })
}
export { initRequest }
```

> 3.3.74 以下的版本没有 `httpIns`,直接 `import { http } from '@/uni_modules/uview-plus'` 然后 `http.setConfig(...)` 就行。

### 请求和响应拦截

```js [util/request/interceptors.js]
import { http } from '@/uni_modules/uview-plus'

export const requestInterceptors = () => {
  http.interceptors.request.use(
    (config) => {
      config.data = config.data || {}
      // 统一带 token
      const token = uni.getStorageSync('token')
      if (token) {
        config.header = { ...config.header, token }
      }
      return config
    },
    (config) => Promise.reject(config),
  )
}

export const responseInterceptors = () => {
  http.interceptors.response.use((response) => {
    const data = response.data

    if (data.code !== 200) {
      // custom.toast 为 false 时不弹提示,交给调用方处理
      if (response.config?.custom?.toast !== false) {
        uni.$u.toast(data.message || '请求失败')
      }
      return Promise.reject(data)
    }

    return data
  })
}
```

`custom` 是自定义参数的容器,可以透传到拦截器里:

```js
// 这个请求出错时不弹 toast,自己处理
uni.$u.http.post('/api/login', params, { custom: { toast: false } })
```

### 调用

```js
import { http } from '@/uni_modules/uview-plus'

// 注册到 $u 上之后也可以用 uni.$u.http
http.get('/api/user/list', { params: { page: 1 } })

// 注意:post 的第二个参数是 body,第三个才是配置项
http.post('/api/user/login', { username: 'name', password: '123456' }, {
  custom: { toast: false },
  timeout: 60000,
})

http.put('/api/user/1', { name: 'new' })
http.delete('/api/user/1')
http.upload('/api/upload', { filePath: '...', name: 'file' })
```

### 全局配置项

```js
{
  baseURL: '',          // 根域名
  header: {},           // 全局请求头
  method: 'GET',
  dataType: 'json',
  custom: {},           // 自定义参数,供拦截器使用
  timeout: 60000,       // H5 / App / 微信小程序 / 支付宝小程序
  sslVerify: true,      // 仅 App-Android
  withCredentials: false, // 仅 H5
  firstIpv4: false,     // 仅 App-Android
  validateStatus: (statusCode) => {}, // 自定义状态码校验
}
```

## 主题定制

uview-plus 3.8+ 用 **CSS 变量 `--up-*`**,老项目的 `$u-*` SCSS 变量仍然兼容。

### 改主题色(推荐,响应式)

在 `App.vue` 里引入完整样式后覆盖:

```vue
<style lang="scss">
@import 'uview-plus/index.scss';

:root,
page,
body,
[data-up-theme='light'] {
  --up-primary: #1abc9c;
  --up-light-primary: #1abc9c;
  --up-navbar-bg-color: #1abc9c;
}
</style>
```

### 老写法:`uni.scss` 覆盖 SCSS 变量

```scss [uni.scss]
$u-primary: #3b82f6;
$u-main-color: #1f2937;
$u-border-color: #d0d5dd;

/* 覆盖必须写在 import 之前 */
@import 'uview-plus/theme.scss';
```

> `$u-*` 变量只能定义浅色主题,不会自动生成暗色。新项目直接用 `--up-*`。

### nvue 里改色

nvue 不支持 CSS 变量,只能用运行时配置:

```js
import { setConfig } from 'uview-plus'

setConfig({
  color: {
    primary: '#1abc9c',
    success: '#18b566',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#909399',
  },
})
```

### 运行时配置

```js
uni.$u.setConfig({
  config: {
    // 默认单位改成 rpx,这样 size="20" 等同于 size="20rpx"
    unit: 'rpx',
  },
  zIndex: {
    popup: 100,
    dialog: 101,
    tooltip: 105,
  },
  // 改组件属性的默认值
  props: {
    alert: { type: 'error' },
  },
})
```

## 暗黑模式

3.8+ 支持用 `setTheme` / `setThemePreference` 切换,组件内部用的是 `--up-*` CSS 变量。

```js
import { setThemePreference } from 'uview-plus'

setThemePreference('dark') // 切到暗色
setThemePreference('light')
```

页面里想跟着主题变,用 mixin 提供的 `upThemeIsDark` / `upThemeVar`:

- `.vue` / `.uvue` 页面:直接用 `--up-*` CSS 变量
- `.nvue` 页面:用 `upThemeVar(varName, fallback)`,因为 nvue 不支持 CSS 变量

> 完全自定义一套暗色主题需要单独覆盖 CSS 变量,内置的 `$u-*` → `--up-*` 桥接只负责浅色。

## 注意事项

- **组件前缀是 `up-` 不是 `u-`**。`u-button` 虽然还能用,但 `u--form` 这种双横线是给 nvue 用的写法(因为 `u-form` 在 nvue 里是 uni-app 的保留名)。新代码统一写 `up-`。
- **easycom 规则改了要重启**。HBuilderX 里改 `pages.json` 的 easycom 后不重启不生效,这是最常见的「组件用不了」原因。
- **`up-form` 的 ref 别叫 `form`**。
- **小程序端表单规则用 `setRules()`**,别直接传 `:rules`。
- **`up-upload` 不上传**,只做选图和展示。
- **`uni.scss` 里别 import 完整样式文件**,只 import `theme.scss`。
- **`up-list` 外层页面**记得配 `"bounce": "none"`。
- 组件的事件很多是 `v-model:xxx` 形式(如 `v-model:fileList`),不是 `:fileList` + `@change`,这是 Vue3 版本的写法,抄 Vue2 教程时会遇到。
