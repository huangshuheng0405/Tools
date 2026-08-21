# Axios

[axios](https://www.npmjs.com/package/axios) 是一个基于 Promise 的 HTTP 客户端，可用于浏览器和 Node.js。

## Installation

::: code-group

```bash [npm]
npm i axios
```

```bash [yarn]
yarn add axios
```

```bash [pnpm]
pnpm add axios
```

```bash [bun]
bun add axios
```

:::

## Quick Start

### GET

```ts
import axios from 'axios'

type User = { id: number; name: string }

const { data } = await axios.get<User>('https://example.com/api/users/1')
```

### POST

```ts
import axios from 'axios'

type CreateUserBody = { name: string }
type CreateUserResp = { id: number }

const body: CreateUserBody = { name: 'Alice' }
const { data } = await axios.post<CreateUserResp>(
  'https://example.com/api/users',
  body,
)
```

## Instance（推荐）

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://example.com/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 常用 defaults

```ts
api.defaults.baseURL = 'https://example.com/api'
api.defaults.timeout = 10_000
api.defaults.headers.common.Authorization = 'Bearer token'
```

## Request Config 速查

```ts
await api.request({
  url: '/users',
  method: 'GET',
  params: { page: 1, pageSize: 20 },
  headers: { 'X-Trace-Id': 'xxx' },
  timeout: 10_000,
  responseType: 'json',
  withCredentials: false,
})
```

## Response 结构

```ts
import type { AxiosResponse } from 'axios'

type User = { id: number; name: string }

const res: AxiosResponse<User> = await api.get<User>('/users/1')
const user: User = res.data
```

## Interceptors

### 请求拦截：统一加 Token

```ts
import axios from 'axios'

const requestInterceptorId = api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') ?? ''
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.request.eject(requestInterceptorId)
```

### 响应拦截：统一取 data

```ts
api.interceptors.response.use((response) => response.data)
```

如果你做了 “response.data 解包”，那么后续返回值不再是 `AxiosResponse`，而是你的业务数据类型。

## 错误处理

```ts
import axios from 'axios'

try {
  await api.get('/users/1')
} catch (err) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const data = err.response?.data
    const message = err.message
  } else {
    throw err
  }
}
```

## 取消请求（AbortController）

```ts
const controller = new AbortController()

const p = api.get('/users', { signal: controller.signal })

controller.abort()
await p
```

## 上传文件（FormData）

```ts
const form = new FormData()
form.append('file', file)
form.append('name', 'avatar')

await api.post('/upload', form, {
  onUploadProgress: (e) => {
    const total = e.total ?? 0
    const percent = total ? Math.round((e.loaded / total) * 100) : 0
  },
})
```

## 并发请求

```ts
const [a, b] = await Promise.all([api.get('/a'), api.get('/b')])
```

## 请求重试

网络请求可能因为以下原因失败：

- 网络中断
- 服务器临时故障（503、504等）
- 请求超时
- 连接断开

### 插件

[axios-retry](https://github.com/softonic/axios-retry)

基础使用

```js
import axios from 'axios'
import axiosRetry from 'axios-retry'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
})

// 配置重试
axiosRetry(apiClient, {
  retries: 3, // 重试次数
  retryDelay: axiosRetry.exponentialDelay, // 指数退避延迟
  retryCondition: (error) => {
    // 默认只对网络错误和 5xx 状态码重试
    return axiosRetry.isNetworkOrIdempotentRequestError(error)
  },
  shouldResetTimeout: false, // 重试时是否重置超时计时器
})

export default apiClient
```

在请求中使用

```js
import apiClient from './api'

// 自动重试（默认配置）
const response = await apiClient.get('/users')

// 单个请求自定义重试配置
const response2 = await apiClient.get('/users', {
  'axios-retry': {
    retries: 5, // 覆盖全局配置
    retryDelay: (count) => count * 2000,
    retryCondition: (error) => error.response?.status === 503,
  },
})
```

### 拦截器

不引入依赖，用拦截器自己实现

## use

首先，了解一下响应拦截器中返回的`response`，它是一个`AxiosResponse`对象，包含了响应相关的全部元数据

```ts
interface AxiosResponse<T = any> {
  data: T // 服务器返回的实际数据（JSON 解析后的对象）
  status: number // HTTP 状态码，如 200, 404, 500
  statusText: string // HTTP 状态文本，如 "OK", "Not Found"
  headers: any // 响应头（对象）
  config: AxiosRequestConfig // 本次请求的配置
  request: XMLHttpRequest // 或 浏览器请求对象（在 Node.js 中可能是 http.ClientRequest）
}
```

注意后端返回的数据在`response.data`中，而不是`response`本身，这对后面对`request`做二次提取很重要

#### 封装好的`request`函数，放在`/utils/request.ts`中

```ts [request.ts]
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'

// 1. 根据后端约定的标准返回结构定义接口
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 2. 自定义请求扩展配置（支持控制是否显示默认报错、跳过 Token 等）
export interface RequestConfig<D = any> extends AxiosRequestConfig<D> {
  showError?: boolean // 是否自动弹出错误提示，默认 true
  skipToken?: boolean // 是否跳过自动携带 Token，默认 false
}

// 3. 定义控制取消请求的 Map 容器
const pendingMap = new Map<string, AbortController>()

/**
 * 生成请求的唯一 key
 */
function getPendingKey(config: AxiosRequestConfig): string {
  return [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&')
}

/**
 * 添加重复请求控制
 */
function addPending(config: InternalAxiosRequestConfig) {
  removePending(config)
  const key = getPendingKey(config)
  const controller = new AbortController()
  config.signal = config.signal || controller.signal
  pendingMap.set(key, controller)
}

/**
 * 移除并取消重复请求
 */
function removePending(config: AxiosRequestConfig) {
  const key = getPendingKey(config)
  if (pendingMap.has(key)) {
    const controller = pendingMap.get(key)
    controller?.abort()
    pendingMap.delete(key)
  }
}

// 4. 创建 Axios 实例
const service: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 5. 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig & RequestConfig) => {
    // 移除上一次尚未完成的重复请求
    removePending(config)
    // 注册当前请求
    addPending(config)

    // 自动注入 Token（可根据实际情况替换 storage/pinia 获取逻辑）
    if (!config.skipToken) {
      const token = localStorage.getItem('ACCESS_TOKEN')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 6. 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { config } = response
    // 请求成功，从 pendingMap 中移除
    removePending(config)

    const res = response.data

    // 假设 200 或 0 代表业务成功（根据项目后端约定调整）
    if (res.code === 200 || res.code === 0) {
      return response
    }

    // --- 业务层面错误处理 (code !== 200) ---
    const customConfig = config as RequestConfig
    if (customConfig.showError !== false) {
      // TODO: 替换为你项目UI组件库的 Message / Toast 提示组件
      console.error(`[API Error]: ${res.msg || '系统异常'}`)
    }

    // 特定业务 Code 拦截（如 Token 过期/无效）
    if (res.code === 401) {
      // 触发登出或跳转登录页
      localStorage.removeItem('ACCESS_TOKEN')
      window.location.href = '/login'
    }

    return Promise.reject(new Error(res.msg || 'Error'))
  },
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      console.log('重复请求已取消:', error.message)
      return Promise.reject(error)
    }

    // 移除失败请求
    if (error.config) {
      removePending(error.config)
    }

    // HTTP 状态码非 2xx 的情况
    let message = '网络异常，请稍后再试'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `连接错误 ${error.response.status}`
      }
    } else if (error.message.includes('timeout')) {
      message = '网络请求超时'
    }

    console.error(`[HTTP Error]: ${message}`)
    return Promise.reject(error)
  },
)

/**
 * 7. 核心通用请求函数封装（利用泛型重写返回类型）
 */
export const request = <T = any>(config: RequestConfig): Promise<T> => {
  return service.request<ApiResponse<T>>(config).then((res) => res.data.data)
}

export default request
```
