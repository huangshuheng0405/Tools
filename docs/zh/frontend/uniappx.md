# uniapp x

## 项目结构

## 蒸汽模式

|          | VDOM                  | vapor                                            |
| -------- | --------------------- | ------------------------------------------------ |
| 业务语言 | uts编译成Kotlin/Swift | js/ts跑在JS引擎                                  |
| 渲染     | 虚拟DOM+diff          | 无DOM，直接生成原生渲染指令                      |
| 开启     | 默认                  | `manifest.json`->`"uni-app-x": { "vapor": true}` |

蒸汽模式不是不能用uts，而是不再依赖uts的原生编译能力

- uvue里写uts依然合法，只是经`uts2js`转成JS执行
- uts的新定位：专门写uts原生插件（`utssdk`目录），只有那里保留uts->Kotlin/Swift

### 硬性约束

- 只支持**组合式API**，必须`<script setup>`，不支持选项式、`mixin`
- Android的uvue页面**不能调原生API**，`utsAndroid`不可用，挪进uts插件
- 不能混写`uvue`和`vue`页面
- 条件编译只有`// #ifdef VUE3-VAPOR`
- 编译到web/小程序目前仍然按VDOM运行（性能不是蒸汽模式）

### CSS

APP端默认值和web完全不同

#### 选择器限制

- 只允许class选择器，tag、`#id`、`[attr]`、伪类、为元素都不支持
- 蒸汽模式下不支持关系选择器，`.card .title`失效，改用`.card__title`
- 样式不继承，字号、颜色必须写在`<text>` 上。`<view>`里的裸文字会被包一层`<text>`父级color传递不下去
- 非web平台不支持`<scope>`
- 可用单位，`px`、`rpx`、`%`（`em`仅line-hight），不支持`rem`

#### 布局

- 只有两种：flex+绝对定位
- 布局只有column/row两种，z-index只在同级兄弟间生效
- 同一个元素多个class，后写的覆盖先写的（与web相反）
- `flex-shrink`默认0，不支持`rem`

### 路由与页面

注册`pages.json`

```json
{
  "path": "pages/detail/index",
  "style": { "navigationBarTitleText": "详情" }
}
```

- `pages`数组第一项是启动页
- 未注册的页面直接`navigateTo`直接失败
- JSON不能有尾随逗号

#### 跳转

```ts
uni.navigateTo({
  url:
    '/pages/detail/index?id=' +
    item.id +
    '&title=' +
    encodeURIComponent(item.title),
})
uni.navigateBack()
```

路径规则：`pages.json`写`pages/detail/index`，url要带前导斜杠

| API          | 行为               | 场景                 |
| ------------ | ------------------ | -------------------- |
| `navigateTo` | 压栈，带返回       | 例如列表跳转详情     |
| `redirectTo` | 替换当前页，回不去 | 例如登录成功跳到首页 |
| `reLaunch`   | 关闭所有页面重开   | 退出登录             |
| `switchBar`  | 只能跳转tabBar页   | 底部导航             |

接受参数

```ts
onLoad((options: OnLoadOptions) => {
  const idRaw = options['id'] // 必须下标访问，不要 options.id
  if (idRaw != null) {
    // 类型是 string?，先判空
    itemId.value = idRaw as string // 再 as 断言
  }
  const titleRaw = options['title']
  if (titleRaw != null) {
    itemTitle.value = decodeURIComponent(titleRaw as string) // 与 encode 配对
  }
})
```

中文参数必须`encodeURLComponent`/`decodeURLComponent`，否则中文乱码或参数被`&`、`=`截断

传对象：`encodeURLComponent(JSON.stringify(item))`

### 页面生命周期

```ts
onLoad(() => {}) // 只执行一次，接参数、发初始请求
onPageShow(() => {}) // 每次显示都触发，刷新数据放这里
onReady(() => {}) // 首次渲染完成，可拿节点
```

### tabBar

```json
"tabBar": {
  "color": "#8A8F99",
  "selectedColor": "#2F6BFF",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/msg/index",
      "text": "消息",
      "iconPath": "static/tabbar/msg.png",
      "selectedIconPath": "static/tabbar/msg-active.png"
    }
  ]
}
```

- `pagePath`不带前导斜杠
- `iconPath` 可选；**81×81 px、≤40KB**、透明背景、必须本地图片。

- 想用字体图标：顶层 `"iconfontSrc": "static/iconfont.ttf"`，每项 `iconfont: { "text": "\ue102", "selectedText": "\ue103" }`，优先级高于 `iconPath`。

- 修改 tabBar 配置后**要停止并重新运行**，热更新有时刷不出。

`switchTab`不能传参，url拼`?id`会被丢弃。共享数据用`uni.setStorage`或全局store

### 请求

`uni.request`，App端不支持Promise

```ts
// ❌ App 端拿不到 Promise，await 会崩
const res = await uni.request({ url: '...' })

// ✅ 回调
uni.request({
  url: 'https://your.api/messages',
  success: (res) => {
    /* res.data 默认是 UTSJSONObject，要类型化用泛型 */
  },
  fail: (err) => {},
})
```

- `res.data` 不是普通 JS 对象，App 端默认 `UTSJSONObject`

- **Android release 默认禁止明文 HTTP** → 接口必须 HTTPS（debug 能跑，打包报 `CLEARTEXT communication not permitted`）

- 响应头 key 在 Android/iOS 上**是小写**（`content-type`）

### 分页

```ts
onLoad(() => {
  fetchPage(1, false)
}) // 首次，只跑一次

onPullDownRefresh(() => {
  fetchPage(1, true)
}) // 下拉刷新

onReachBottom(() => {
  // 滚到底
  if (!hasMore.value || loadingMore.value || firstLoading.value) return
  loadingMore.value = true
  fetchPage(page.value + 1, false)
})
```

`pages.json`要开启

```json
"style": {
  "enablePullDownRefresh": true,
  "backgroundTextStyle": "dark",
  "onReachBottomDistance": 50
}
```

- `onPullDownRefresh`结尾必须`uni.stopPullDownRefresh()`（成功和失败都要调），否则动画一直转
- 第一页内容不足一屏时页面滚不动，`onReachBottom`永远不触发

## 组件

easycom，不用import，不用注册

```
components/
└── x-card/
    └── x-card.uvue      ← 目录名和文件名必须完全一致
```

约定满足后，任何页面直接写`<x-card>`就能用。也可以在显示在`pages.json`开启

```json
"easycom": { "autoscan": true }
```

#### props

运行时声明，默认值一起写

```vue
defineProps({ title: { type: String, default: '' }, strred: { type: Boolean,
default: false // 布尔值必须给 default，否则不传就是undefined，而不是false },
showStar: { type: Boolean, default: false } })
```

- 模板里直接用 `title`、`starred`，不用 `props.title`

- 父组件传 `:show-star="true"`（kebab-case）

- **props 是单向的**，子组件不能改，要改就 emit 出去让父组件改

#### emit

必须声明，否则父组件监听不到

```vue
const emit = defineEmits(['select', 'toggle']) const onTap = () => {
emit('select') }
```

```vue
<x-item @sellect="goDetail(item)" @toggle="onStar(item.id)" />
```

## 条件编译

| 指令      | 含义                             |
| --------- | -------------------------------- |
| `#ifdef`  | if defined，只在某平台存在       |
| `#ifndef` | if not defined，除了某平台都存在 |
| `#endif`  | 结束，必须有                     |

在不同文件，写法也不同

| 位置                     | 写法                                         |
| :----------------------- | :------------------------------------------- |
| `.uvue` 模板             | `<!-- #ifdef WEB -->` … `<!-- #endif -->`    |
| `.uts`、`.js`、`.ts`     | `// #ifdef WEB` … `// #endif`                |
| `.css`、`.scss`、`.less` | `/* #ifdef WEB */` … `/* #endif */`          |
| `pages.json`             | `// #ifdef WEB` … `// #endif`（json 里允许） |

常用标识

| 标识               | 范围                           |
| ------------------ | ------------------------------ |
| `APP`              | 所有APP（Android+IOS+Harmony） |
| `APP-ANDROID`      | 仅Android                      |
| `APP-IOS`          | 仅IOS                          |
| `APP-HARMONY`      | HarmonyOS Next                 |
| `WEB`              | web端                          |
| `MP-WEIXIN`        | 仅微信小程序                   |
| `UNI-APP-X`        | 是否 uni-app x 项目            |
| `VUE3-VAPOR`       | 是否蒸汽模式（HBuilderX 5.0+） |
| `uniVersion > 3.9` | 按编译器版本判断               |

支持条件编译的文件

`.uvue` / `.vue` / `.nvue`、`.uts` / `.js` / `.ts`、`.css` / `.scss` / `.less` / `.styl`、`pages.json`、`manifest.json`。

组合条件

```
// #ifdef APP && VUE3-VAPOR        App 且蒸汽模式
// #ifdef APP && !VUE3-VAPOR        App 且非蒸汽
// #ifdef WEB || MP-WEIXIN          web 或微信小程序
```

static目录也能条件编译

```
static/
├─ web/        只有 web 端编译进去
├─ app/        只有 App 端
├─ mp-weixin/  只有微信小程序
└─ logo.png    所有平台
```

