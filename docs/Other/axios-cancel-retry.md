# Axios 请求中断与重试

在前端开发中，处理网络请求的中断（Cancellation）和重试（Retry）是优化用户体验和增强应用健壮性的重要手段。

## 请求中断 (Cancellation)

从 `v0.22.0` 开始，Axios 支持使用标准的 `AbortController` API 来取消请求（推荐方式）。旧版本的 `CancelToken` 方式已被弃用。

### 为什么需要中断请求？

1.  **竞态问题**：用户快速切换 Tab 或输入搜索关键词时，如果旧的请求比新的请求晚返回，会导致页面显示旧的数据。
2.  **资源浪费**：组件卸载后，仍在进行的请求应该被取消，避免占用网络带宽和后续的无用状态更新。

### 使用 AbortController

配合[后端代码](#后端代码)一起使用

```vue [App.vue]
<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const progress = ref(0) // 进度条百分比
let controller: AbortController // 中止控制器

// 中止下载
const abortDownload = () => {
  if (controller) {
    controller.abort() // 使用 abort 方法中止下载
    console.log('中止下载')
  }
}

// 下载视频
const fetchVideo = () => {
  controller = new AbortController() // 创建 AbortController
  axios({
    // 将中止控制器传递给 axios 的 get 方法
    method: 'GET',
    url: 'http://localhost:3000/video',
    // 中断控制器标识
    signal: controller.signal,
    // 响应类型
    responseType: 'arraybuffer',
    // 下载进度
    onDownloadProgress: (progressEvent) => {
      // 计算进度百分比
      progress.value = Math.round(
        (progressEvent.loaded / progressEvent.total!) * 100
      )
    }
  })
    .then((response) => {
      console.log('下载完成', response)
      // ✅ 保存下载的文件
      const { buffer } = new Uint8Array(response.data)
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const link = document.createElement('a') // 创建链接元素
      link.href = URL.createObjectURL(blob) // 将 Blob 对象转换为 URL
      link.download = 'video.mp4' // 设置文件名
      link.click() // 模拟点击链接元素
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log('下载被取消')
      } else if (err.name === 'AbortError') {
        console.log('下载被中止')
      } else {
        console.error(`下载错误：${err.message}`)
      }
    })
}
</script>

<template>
  <div>
    <button class="download" @click="fetchVideo">下载视频</button>
    <button class="abort" @click="abortDownload">中止下载</button>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
      {{ progress }}%
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  height: 20px;
  background-color: #eee;
  margin-top: 10px;
}
.progress {
  width: 0%;
  height: 100%;
  background-color: #4caf50;
  transition: width 0.2s linear;
}
</style>
```

## 请求重试 (Retry)

当网络不稳定或服务器暂时不可用（如 503 错误）时，自动重试请求可以提高成功率。

### 使用 axios-retry 插件 (推荐)

最简单的方式是使用 `axios-retry` 库。

参考地址：[axios-retry](https://github.com/softonic/axios-retry)

安装：

```bash
npm install axios-retry
```

配置：

```javascript {8-18}
import axios from 'axios'
import axiosRetry from 'axios-retry'

// 配置 axios 实例
const client = axios.create()

axiosRetry(client, {
  retries: 3, // 重试次数
  retryDelay: axiosRetry.exponentialDelay, // 重试延迟策略（指数退避）
  retryCondition: (error) => {
    // 仅在网络错误或 5xx 错误时重试
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status >= 500
    )
  }
})

client.get('/test').then((result) => {
  result.data
})
```

### 手动实现拦截器重试

如果你不想引入额外的库，可以通过 Axios 的拦截器手动实现。

```javascript {1,26-28}
axios.interceptors.response.use(null, (error) => {
  const config = error.config

  // 如果没有配置重试或重试次数已用完，直接返回错误
  if (!config || !config.retry) return Promise.reject(error)

  // 设置重试计数
  config.__retryCount = config.__retryCount || 0

  // 检查是否超过最大重试次数
  if (config.__retryCount >= config.retry) {
    return Promise.reject(error)
  }

  // 增加重试计数
  config.__retryCount += 1

  // 创建新的 Promise 来处理延迟
  const backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1000)
  })

  // 返回 Promise，Axios 会重新发起请求
  return backoff.then(function () {
    return axios(config)
  })
})

// 使用
axios.get('/api/test', {
  retry: 3,
  retryDelay: 1000
})
```

## 总结

- **中断**：使用 `AbortController`，在组件卸载或重复操作时及时取消无用请求。
- **重试**：推荐使用 `axios-retry` 库，针对网络波动和临时服务端错误配置合理的重试策略（如指数退避）。

## 后端代码

- `npm i express cors`
- 启动项目`node server`server是文件名

```js [server.js]
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(cors())

// 主机，端口
const host = 'http://localhost'
const port = 3000

app.get('/video', (req, res) => {
  // 获取文件路径
  const filePath = path.join(__dirname, 'files', 'video.mp4')
  // 获取文件信息
  const stat = fs.statSync(filePath)
  // 获取文件大小
  const fileSize = stat.size
  // 设置响应头
  res.setHeader('Content-Length', fileSize)
  res.setHeader('Content-Type', 'video/mp4')
  // 创建可读流并将其管道传输到响应流中
  fs.createReadStream(filePath).pipe(res)
})

// 启动服务器
app.listen(port, () => {
  console.log(`服务器启动成功 ${host}:${port}`)
})
```
