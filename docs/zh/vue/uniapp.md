# uniapp

## 简介

uni-app 是 DCloud 出品的跨端框架，基于 Vue.js，一套代码可以编译到多个平台：

- iOS / Android（App）
- H5
- 微信小程序、支付宝小程序、百度小程序、字节小程序、快手小程序等
- 快应用

## 创建项目

有两种方式：可视化工具 **HBuilderX** 和 **CLI** 命令行。

### HBuilderX

1. 下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 文件 → 新建 → 项目 → uni-app → 选择模板

### CLI

基于 Vite + Vue3：

::: code-group

```bash [npm]
npx degit dcloudio/uni-preset-vue#vite my-project
```

```bash [pnpm]
pnpm dlx degit dcloudio/uni-preset-vue#vite my-project
```

:::

```bash
cd my-project

npm install
```

运行到不同平台：

```bash
# 微信小程序
npm run dev:mp-weixin

# H5
npm run dev:h5

# App（需要配合 HBuilderX）
npm run dev:app
```

## 目录结构

```
my-project
├── pages/             // 页面目录
│   ├── index/
│   │   └── index.vue
│   └── ...
├── static/            // 静态资源
├── pages.json         // 页面路由、窗口样式、tabBar 配置
├── manifest.json      // 应用配置（名称、appid、各平台设置）
├── App.vue            // 应用入口，处理应用生命周期
├── main.js            // 入口文件，注册 Vue 应用
└── uni.scss           // 全局样式变量
```

## 页面与路由

页面路由统一在 `pages.json` 中配置，`pages` 数组第一项是首页：

```json [pages.json]
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": { "navigationBarTitleText": "首页" }
    },
    {
      "path": "pages/list/list",
      "style": { "navigationBarTitleText": "列表" }
    }
  ]
}
```

新增页面后需要在这里注册，否则无法跳转。

## 生命周期

### 应用生命周期（App.vue）

```vue [App.vue]
<script>
export default {
  onLaunch() {
    // 应用初始化时触发，全局只触发一次
    console.log('App Launch')
  },
  onShow() {
    // 应用从后台进入前台时触发
  },
  onHide() {
    // 应用进入后台时触发
  },
}
</script>
```

### 页面生命周期

```vue [pages/index/index.vue]
<script>
export default {
  onLoad(options) {
    // 页面加载，接收路由参数
    console.log(options)
  },
  onShow() {
    // 页面显示，每次进入页面都触发
  },
  onReady() {
    // 页面初次渲染完成
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面卸载
  },
}
</script>
```

## 页面跳转

```js
// 保留当前页面，跳转到新页面（返回上一页）
uni.navigateTo({
  url: '/pages/list/list?id=1',
})

// 关闭当前页面，跳转（不能返回）
uni.redirectTo({
  url: '/pages/list/list',
})

// 关闭所有页面，打开某个页面
uni.reLaunch({
  url: '/pages/index/index',
})

// 跳转到 tabBar 页面，并关闭其他非 tabBar 页面
uni.switchTab({
  url: '/pages/index/index',
})

// 返回上一页
uni.navigateBack({
  delta: 1,
})
```

目标页面通过 `onLoad` 接收参数：

```js
onLoad(options) {
  console.log(options.id) // 1
}
```

## 条件编译

同一份代码，针对不同平台执行不同逻辑：

```vue
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <view>只在微信小程序显示</view>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <view>只在 H5 显示</view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  onLoad() {
    // #ifdef MP-WEIXIN
    console.log('微信小程序环境')
    // #endif

    // #ifndef H5
    console.log('非 H5 环境')
    // #endif
  },
}
</script>
```

常见平台标识：`APP-PLUS`（App）、`H5`、`MP-WEIXIN`（微信小程序）、`MP-ALIPAY`、`MP-BAIDU`、`MP-TOUTIAO`。

## 数据请求

封装一个通用的 request：

```js [utils/request.js]
const BASE_URL = 'https://localhost:8080'

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const { method = 'GET', data = {}, showLoading = false } = options

    if (showLoading) {
      uni.showLoading({
        title: '加载中',
        mask: true,
      })
    }

    const token = uni.getStorageSync('token')

    uni.request({
      url: BASE_URL + url,
      method,
      data,

      header: {
        'Content-Type': 'application/json',
        token,
      },

      success(res) {
        if (showLoading) {
          uni.hideLoading()
        }

        if (res.statusCode === 200) {
          const result = res.data

          if (result.code === 200) {
            resolve(result)
          } else {
            uni.showToast({
              title: result.msg || '请求失败',
              icon: 'none',
            })
            reject(result)
          }

          return
        }

        uni.showToast({
          title: '请求失败',
          icon: 'none',
        })
        reject(res)
      },

      fail(err) {
        if (showLoading) {
          uni.hideLoading()
        }

        uni.showToast({
          title: '网络连接失败',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

export default request
```

## 本地存储

```js
// 同步存储（推荐，简单场景直接使用）
uni.setStorageSync('token', 'xxx')
const token = uni.getStorageSync('token')
uni.removeStorageSync('token')

// 异步存储
uni.setStorage({
  key: 'token',
  data: 'xxx',
})
```

## 常用 API

```js
// 提示
uni.showToast({ title: '成功', icon: 'success' })

// 加载中
uni.showLoading({ title: '加载中' })
uni.hideLoading()

// 确认弹窗
uni.showModal({
  title: '提示',
  content: '确定要删除吗？',
  success(res) {
    if (res.confirm) {
      // 点击确定
    }
  },
})
```

## 单位 rpx

uni-app 默认使用 `rpx` 作为响应式单位，设计稿一般以 750px 为基准：

- `750rpx` = 屏幕宽度
- 例如设计稿宽度 375px，则 `1px = 2rpx`

```vue
<style>
.box {
  width: 750rpx;
  height: 200rpx;
}
</style>
```
