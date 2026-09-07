# Axios

<svg width="200px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#5A29E4" d="M297.8 267v70.5l-7.7 6.2v-58.6h-14.5zm266.5-10.7q9.6 0 18 2.9 7.8 2.7 13.7 6.2l.6.4-8 15.1q-1-.9-3-2l-.8-.4-.8-.5-.9-.4a41 41 0 0 0-8.7-3.4q-5-1.5-10.4-1.5-14.4 0-14.4 8 0 4.9 5.2 6.8l.8.3.8.3 1 .3.9.3 1 .3 1 .3.5.2 1.2.3 1.1.3 1.2.3 1.3.4 1.3.3 2 .5 1.5.4q9 2.2 15.7 5.2 6.4 2.7 10 7.4l.2.4a20 20 0 0 1 3.7 12.6 23 23 0 0 1-4.9 15.3 27 27 0 0 1-12.6 8.3 56 56 0 0 1-16.8 2.4 76 76 0 0 1-38.2-10.4l-.7-.5 8.2-16q2.1 1.9 6.6 4.4a55 55 0 0 0 24.4 5.8q14 0 14-7.5 0-5.1-6.5-7.2l-1-.4-1.2-.4-1.1-.3-1.2-.4-1.3-.4-1.3-.4-.7-.2-1.4-.4-1.5-.4-1.5-.5-1.5-.4-2.5-.6-.8-.3a52 52 0 0 1-19.6-8.5 19 19 0 0 1-6.3-15.4q0-8.8 4.4-14.8 4.7-6 12.3-9 7.8-3.1 17-3.1m-142 .1q9.6 0 17.7 3.6l.6.3a43 43 0 0 1 14.1 10 44 44 0 0 1 12.4 29.8q0 8.4-3.4 16.2a45 45 0 0 1-41.8 26.8q-10.1 0-18.4-3.5a46 46 0 0 1-23.4-23.9 42 42 0 0 1 9-45.6l.6-.5a45 45 0 0 1 32.5-13.2m-369.7.5 37.2 85.6H70.2l-8.6-20H28.3l-8.5 20H0L37.4 257zm109.6 0 23.6 30.3 23.6-30.3h20l-33.8 43.3 32.8 42.3h-20l-22.6-29-22.4 29H143l33-42.3-34-43.2zm149.6-.4v57.3h15l-22.6 18.5v-70.5zM422 273q-8.4 0-14.4 4-5.8 4-8.9 10a28 28 0 0 0 9.2 36q6 3.8 14.3 3.8a25 25 0 0 0 23.1-14.3q3-6.3 3-12.9 0-7-3.2-13a25 25 0 0 0-9.1-9.8 25 25 0 0 0-14-3.8m-377 6.4-12.5 27H57z"/></svg>

[axios](https://axios.rest/zh/) 是一个基于 Promise 的 HTTP 客户端，可用于浏览器和 Node.js。

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

## response

`response`参数是一个标准的`AxiosResponse`对象，包含以下核心属性

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

### 响应拦截器

```js
axios.interceptors.response.use(
  response => {
    // 成功
  },
  error => {
    // 失败
  }
)
```

进入`error`最常见的3种情况：

1. 状态码不是2xx
2. 网络请求根本没成功，后端没启动、网络断开、请求超时
3. `validateStatus`改变了判断规则

axios默认是

```js·
status <= 200 && status < 300
```

进入`error`

但是可以自己修改

```js
axios.get('/user', {
    validateStatus: status => status < 500
})
```

另外在`error`的时候

```js
axios.interceptors.response.use(
  response => response,
  error => {
    console.log(error)
      return Promise.reject(error)
  }
)
```

把错误往下继续传，否则在应用的地方就不会被`catch`捕获

```js
axios.get('/user')
  .then(res => {
    console.log('then')
  })
  .catch(err => {
    console.log('catch')
  })
```

这里就会进入`then`，而不是进入`catch`

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

## template

一个标准的 axios 封装模板，包含实例创建、Token 注入、统一解包、错误处理。

```ts [utils/request.ts]
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

// 后端统一的响应结构，按实际后端调整
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
})

// 请求拦截器：统一注入 Token
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一解包 data + 错误处理
instance.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse

    // 业务成功，直接返回 data
    if (res.code === 200) {
      return res.data
    }

    // 业务失败
    console.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status

    switch (status) {
      case 401:
        // Token 过期，清除并跳转登录
        localStorage.removeItem('token')
        break
      case 403:
        console.error('没有权限')
        break
      case 404:
        console.error('请求地址不存在')
        break
      case 500:
        console.error('服务器错误')
        break
      default:
        console.error(error.message || '网络错误')
    }

    return Promise.reject(error)
  },
)

// 统一的请求方法，返回解包后的业务数据类型
function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return instance.request(config) as Promise<T>
}

export default request
```

使用：

```ts [api/index.ts]
import request from '@/utils/request'

interface User {
  id: number
  name: string
}

// GET
export const getUser = (id: number) =>
  request<User>({ url: `/users/${id}` })

// POST
export const createUser = (data: { name: string }) =>
  request<User>({ url: '/users', method: 'POST', data })
```

注意：因为响应拦截器里已经 `return res.data` 解包了，所以 `request<T>` 的 `T` 就是业务数据类型，不再是 `AxiosResponse`。`code` 的约定值按实际后端调整（有的项目是 `0`，这里是 `200`）。
