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
  body
)
```

## Instance（推荐）

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://example.com/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json'
  }
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
  withCredentials: false
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
  }
})
```

## 并发请求

```ts
const [a, b] = await Promise.all([api.get('/a'), api.get('/b')])
```

## result with TypeScript

给axios返回的结果添加泛型接口

1. 假设后端返回的 JSON 数据构例如下：

```json
{
  "code": 1,
  "message": "success",
  "data": { ... }
}
```

2. 可以这样定义泛型接口(根据后端返回的 JSON 结构来定义data的类型)

```ts [/types/api.ts]
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
```

3. 封装`request`函数

```ts [request.ts] (9-11)
import axios, { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000
})

function request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service.request<ApiResponse<T>>(config)
}

export default request
```

4. 使用`request`函数

```ts
const res = await request<User>('/users/1')
console.log(res.data, res.message, res.code)
```
