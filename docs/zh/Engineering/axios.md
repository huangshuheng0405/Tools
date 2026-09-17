# Axios

<svg width="160px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#5A29E4" d="M297.8 267v70.5l-7.7 6.2v-58.6h-14.5zm266.5-10.7q9.6 0 18 2.9 7.8 2.7 13.7 6.2l.6.4-8 15.1q-1-.9-3-2l-.8-.4-.8-.5-.9-.4a41 41 0 0 0-8.7-3.4q-5-1.5-10.4-1.5-14.4 0-14.4 8 0 4.9 5.2 6.8l.8.3.8.3 1 .3.9.3 1 .3 1 .3.5.2 1.2.3 1.1.3 1.2.3 1.3.4 1.3.3 2 .5 1.5.4q9 2.2 15.7 5.2 6.4 2.7 10 7.4l.2.4a20 20 0 0 1 3.7 12.6 23 23 0 0 1-4.9 15.3 27 27 0 0 1-12.6 8.3 56 56 0 0 1-16.8 2.4 76 76 0 0 1-38.2-10.4l-.7-.5 8.2-16q2.1 1.9 6.6 4.4a55 55 0 0 0 24.4 5.8q14 0 14-7.5 0-5.1-6.5-7.2l-1-.4-1.2-.4-1.1-.3-1.2-.4-1.3-.4-1.3-.4-.7-.2-1.4-.4-1.5-.4-1.5-.5-1.5-.4-2.5-.6-.8-.3a52 52 0 0 1-19.6-8.5 19 19 0 0 1-6.3-15.4q0-8.8 4.4-14.8 4.7-6 12.3-9 7.8-3.1 17-3.1m-142 .1q9.6 0 17.7 3.6l.6.3a43 43 0 0 1 14.1 10 44 44 0 0 1 12.4 29.8q0 8.4-3.4 16.2a45 45 0 0 1-41.8 26.8q-10.1 0-18.4-3.5a46 46 0 0 1-23.4-23.9 42 42 0 0 1 9-45.6l.6-.5a45 45 0 0 1 32.5-13.2m-369.7.5 37.2 85.6H70.2l-8.6-20H28.3l-8.5 20H0L37.4 257zm109.6 0 23.6 30.3 23.6-30.3h20l-33.8 43.3 32.8 42.3h-20l-22.6-29-22.4 29H143l33-42.3-34-43.2zm149.6-.4v57.3h15l-22.6 18.5v-70.5zM422 273q-8.4 0-14.4 4-5.8 4-8.9 10a28 28 0 0 0 9.2 36q6 3.8 14.3 3.8a25 25 0 0 0 23.1-14.3q3-6.3 3-12.9 0-7-3.2-13a25 25 0 0 0-9.1-9.8 25 25 0 0 0-14-3.8m-377 6.4-12.5 27H57z"/></svg>

[Axios](https://axios.rest/zh/) 是一个基于 Promise 的 HTTP 客户端，可用于浏览器和 Node.js。

本文以 Axios 1.x 为主。Axios 1.x 使用 `AxiosHeaders`、`InternalAxiosRequestConfig` 和请求方法泛型，旧版 Axios 的部分类型写法不兼容。

## 安装

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

## 核心概念

### 创建实例

直接使用全局 `axios` 适合简单脚本；业务项目通常应创建自己的实例：

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})
```

请求级配置会覆盖实例默认值：

```ts
// 只有这个请求使用 30 秒超时
await api.get('/reports/annual', {
  timeout: 30_000,
})
```

不要在大型应用中随意修改 `axios.defaults`，它会影响全局 Axios 行为。优先修改实例默认值，或者只在单个请求中覆盖配置。

### 请求配置

最常用的请求配置如下：

| 配置项 | 作用 | 注意事项 |
| --- | --- | --- |
| `baseURL` | 请求基础地址 | 请求级 `url` 会与实例 `baseURL` 拼接 |
| `url` | 请求路径 | 可以传绝对 URL |
| `method` | HTTP 方法 | 与大小写无关，推荐使用小写 |
| `params` | 查询参数 | 用于 GET 的 `?page=1` |
| `data` | 请求体 | 用于 POST、PUT、PATCH 等 |
| `headers` | 请求头 | Axios 1.x 推荐使用 `config.headers.set()` |
| `timeout` | 超时时间 | 单位是毫秒，`0` 表示不主动超时 |
| `signal` | 取消信号 | 使用标准 `AbortController` |
| `responseType` | 响应类型 | 下载文件常用 `blob` 或 `arraybuffer` |
| `withCredentials` | 是否携带跨域凭证 | 跨域 Cookie 场景需要前后端同时配置 |
| `onUploadProgress` | 上传进度 | 不同适配器和网络环境下不一定可靠 |
| `onDownloadProgress` | 下载进度 | 大文件下载时可用来更新进度 |
| `validateStatus` | 判定哪些状态码算成功 | 默认是 200 到 299 |

### GET 与查询参数

```ts
interface User {
  id: number
  name: string
}

interface UserListParams {
  page: number
  pageSize: number
  keyword?: string
}

const { data } = await api.get<User[]>('/users', {
  params: {
    page: 1,
    pageSize: 20,
    keyword: 'alice',
  } satisfies UserListParams,
})
```

GET 请求的查询参数应放在 `params` 中，不要塞进 `data`。浏览器对 GET 请求体的支持不一致，部分代理和服务器也会直接忽略请求体。

当后端要求特殊的数组格式时，可以使用 `paramsSerializer`：

```ts
await api.get('/users', {
  params: {
    ids: [1, 2, 3],
  },
  paramsSerializer: {
    indexes: null, // ids=1&ids=2&ids=3
  },
})
```

### POST、PUT 与 PATCH

```ts
interface CreateUserBody {
  name: string
}

interface CreateUserResponse {
  id: number
}

const body: CreateUserBody = { name: 'Alice' }

const { data } = await api.post<CreateUserResponse>('/users', body)
```

`POST` 通常用于创建资源，`PUT` 通常用于整体替换，`PATCH` 通常用于局部更新。具体语义仍以后端 API 约定为准。

### AxiosResponse

所有请求方法默认返回 `AxiosResponse`：

```ts
const response = await api.get<User>('/users/1')

response.data // User
response.status // HTTP 状态码，例如 200
response.statusText // HTTP 状态文本
response.headers // 响应头
response.config // 本次请求的最终配置
response.request // 底层请求对象，通常是 XHR、http.ClientRequest 等
```

`axios.get<User>()` 中的 `User` 是 TypeScript 类型参数，Axios 不会在运行时验证响应结构。真正需要运行时安全时，必须使用 Zod、Valibot 等工具校验 `response.data`。

## 拦截器

拦截器可以在请求发出前和响应进入业务代码前统一处理逻辑。

### 执行顺序

- 请求拦截器按注册顺序**逆序**执行，即最后注册的先执行。
- 响应拦截器按注册顺序执行，即最先注册的先执行。

多个拦截器同时修改 Token、刷新登录态或处理错误时，执行顺序会直接影响结果。

### 请求拦截器：统一注入 Token

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})
```

不要在拦截器外部直接使用 `config.headers.Authorization = token`。虽然部分场景仍能工作，但 Axios 1.x 的 `AxiosHeaders.set()` 对普通值、数组和请求头合并的处理更明确。

### 响应拦截器：不要吞掉响应或错误

```ts
api.interceptors.response.use(
  (response) => {
    // 必须返回 response，或者返回你明确约定后的新数据
    return response
  },
  (error) => {
    // 必须继续 reject，否则调用方的 catch 不会执行
    return Promise.reject(error)
  },
)
```

下面这种写法会吞掉错误：

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error)
  },
)
```

错误回调没有返回 rejected Promise，也没有抛出错误，所以请求会从原本的失败状态变成成功状态，调用方会进入 `.then()`，而不是 `.catch()`。

### 响应拦截器：解包 data 会改变返回类型

```ts
api.interceptors.response.use((response) => response.data)
```

这样做以后，请求返回值不再是 `AxiosResponse`，而是 `response.data`。必须同步修改 TypeScript 类型，否则类型承诺和运行时行为会不一致。

生产封装中更推荐保留 `AxiosResponse`，再在统一请求函数中解包，便于保留状态码、响应头和完整配置。

### 移除拦截器

`use()` 会返回拦截器 ID，页面卸载或插件销毁时可以移除：

```ts
const requestInterceptorId = api.interceptors.request.use((config) => config)

api.interceptors.request.eject(requestInterceptorId)
```

## 错误处理

### 默认成功状态码与 validateStatus

Axios 默认使用下面的规则判断请求成功：

```js
const isValidStatus = (status) => status >= 200 && status < 300
```

可以自定义 `validateStatus`：

```ts
await api.get('/user', {
  validateStatus: (status) => status < 500,
})
```

上面的配置会让 4xx 响应也进入成功回调。除非确实需要把 4xx 当普通业务结果处理，否则不推荐全局放宽成功状态码。

### 常见错误分类

| 场景 | 判断方式 | `error.response` |
| --- | --- | --- |
| HTTP 4xx/5xx | 状态码不符合 `validateStatus` | 有值 |
| 网络错误 | 请求没有拿到 HTTP 响应 | `undefined` |
| 超时 | `error.code` 通常是 `ECONNABORTED` 或 `ETIMEDOUT` | 通常为 `undefined` |
| 主动取消 | `axios.isCancel(error)` 为 `true` | `undefined` |
| 业务错误 | 由项目自定义，例如 `ApiError` | 取决于实现 |

```ts
import axios from 'axios'

try {
  await api.get('/users/1')
} catch (error) {
  if (axios.isCancel(error)) {
    // 用户主动取消，通常不需要提示
    return
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data
    const message = error.message
    const code = error.code

    if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
      console.error('请求超时', message)
      return
    }

    console.error('请求失败', { status, data, message })
    return
  }

  // 处理业务代码抛出的普通 Error、类型错误等
  throw error
}
```

`response.data` 的类型不是运行时保证。上传下载、网关错误和代理错误都可能返回字符串、HTML 或 Blob，因此错误处理中应先判断数据类型。

## 取消请求

Axios 1.x 使用标准的 `AbortController`：

```ts
import axios from 'axios'

const controller = new AbortController()
const request = api.get('/users', {
  signal: controller.signal,
})

controller.abort()

try {
  await request
} catch (error) {
  if (axios.isCancel(error)) {
    console.log('请求已取消')
  } else {
    throw error
  }
}
```

常见场景是搜索输入、路由切换或组件卸载时取消旧请求：

```ts
let controller: AbortController | undefined

async function searchUsers(keyword: string) {
  controller?.abort()
  controller = new AbortController()

  try {
    return await api.get('/users', {
      params: { keyword },
      signal: controller.signal,
    })
  } catch (error) {
    if (axios.isCancel(error)) {
      return
    }
    throw error
  }
}
```

取消不会让服务端一定停止处理请求，它只保证客户端不再等待该响应。对于已经开始的写操作，服务端仍可能完成业务逻辑。

## 超时

超时可以通过实例默认值或单个请求配置：

```ts
const api = axios.create({
  timeout: 10_000,
})

await api.get('/slow-report', {
  timeout: 30_000,
})
```

不同 Axios 版本和适配器可能返回 `ECONNABORTED` 或 `ETIMEDOUT`，所以判断超时时建议同时兼容两个错误码：

```ts
if (axios.isAxiosError(error)) {
  const isTimeout =
    error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
}
```

如果需要标准的超时信号，也可以使用 `AbortSignal.timeout()`：

```ts
await api.get('/users', {
  signal: AbortSignal.timeout(5_000),
})
```

`AbortSignal.timeout()` 的兼容性取决于目标运行环境，发布到旧浏览器前需要确认浏览器支持范围。

## 上传与下载

### 上传 FormData

```ts
const form = new FormData()
form.append('file', file)
form.append('name', 'avatar')

const { data } = await api.post('/upload', form, {
  onUploadProgress: (event) => {
    const total = event.total ?? 0
    const percent = total ? Math.round((event.loaded / total) * 100) : 0

    console.log(`上传进度：${percent}%`)
  },
})
```

不要手动设置 `Content-Type: multipart/form-data`。浏览器和 Axios 会自动生成包含 boundary 的请求头；手写后遗漏 boundary 反而会导致后端无法解析文件。

上传和下载进度依赖底层适配器与运行环境，`event.total` 也可能不存在，不能把它当作严格可靠的业务进度。

### 下载文件

```ts
const response = await api.get<Blob>('/files/1', {
  responseType: 'blob',
  onDownloadProgress: (event) => {
    if (event.total) {
      console.log(event.loaded / event.total)
    }
  },
})

const fileUrl = URL.createObjectURL(response.data)
```

使用 Blob URL 后，应在不再需要时调用 `URL.revokeObjectURL(fileUrl)`，避免内存无法及时释放。

## 并发请求

多个请求互不依赖时，可以使用 `Promise.all()`：

```ts
const [userResponse, roleResponse] = await Promise.all([
  api.get<User>('/users/1'),
  api.get<Role[]>('/roles'),
])
```

`Promise.all()` 是快速失败：任意一个请求失败，整个 Promise 就会 reject，但其他已经发出的请求不会自动取消。

如果每个请求都要独立处理成功或失败，可以使用 `Promise.allSettled()`：

```ts
const results = await Promise.allSettled([
  api.get('/users/1'),
  api.get('/roles'),
])
```

## 请求重试

网络中断、502、503、504 和超时等都可能导致临时失败，但并不是所有请求都适合重试。

GET、HEAD、OPTIONS、PUT、DELETE 通常是幂等方法，可以按策略重试。POST、PATCH 可能创建订单、扣款或产生其他副作用，盲目重试可能造成重复提交。写操作如果需要重试，应由后端支持幂等键或请求 ID。

### axios-retry

安装：

::: code-group

```bash [npm]
npm i axios-retry
```

```bash [pnpm]
pnpm add axios-retry
```

:::

基础使用：

```ts
import axios from 'axios'
import axiosRetry from 'axios-retry'

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10_000,
})

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // 只重试网络错误，以及幂等请求上的可重试错误
    return axiosRetry.isNetworkOrIdempotentRequestError(error)
  },
  // false 表示全部重试共享一次 timeout；true 表示每次重试重新计时
  shouldResetTimeout: false,
})
```

`axiosRetry` 的默认重试条件只覆盖网络错误和幂等请求的错误，不会无条件重试所有 5xx。尤其是 POST 返回 500 时，不能仅因为状态码是 5xx 就默认安全重试。

单个请求可以覆盖全局配置：

```ts
const response = await apiClient.get('/users', {
  'axios-retry': {
    retries: 5,
    retryDelay: (retryCount) => {
      const baseDelay = retryCount * 1_000
      const jitter = Math.random() * 300
      return baseDelay + jitter
    },
    retryCondition: (error) => error.response?.status === 503,
  },
})
```

### 使用拦截器实现最小重试

如果不能引入插件，可以只对幂等请求实现有限重试：

```ts
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

const MAX_RETRIES = 2
const RETRYABLE_STATUS = new Set([502, 503, 504])
const retryCounts = new WeakMap<InternalAxiosRequestConfig, number>()
const IDEMPOTENT_METHODS = new Set(['get', 'head', 'options', 'put', 'delete'])

function shouldRetry(error: AxiosError) {
  const config = error.config

  if (!config || axios.isCancel(error)) {
    return false
  }

  const method = config.method?.toLowerCase() ?? 'get'
  const status = error.response?.status
  const isNetworkError = !error.response
  const isRetryableStatus =
    status !== undefined && RETRYABLE_STATUS.has(status)

  return (
    IDEMPOTENT_METHODS.has(method) &&
    (isNetworkError || isRetryableStatus)
  )
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config

  if (!config || !shouldRetry(error)) {
    throw error
  }

  const retryCount = retryCounts.get(config) ?? 0

  if (retryCount >= MAX_RETRIES) {
    throw error
  }

  retryCounts.set(config, retryCount + 1)
  await delay(Math.min(300 * 2 ** retryCount + Math.random() * 200, 3_000))

  return api.request(config)
})
```

生产环境优先使用经过验证的 `axios-retry`，因为自实现还需要处理并发、取消、超时、响应拦截器顺序和重试元数据等边界。

## 生产封装模板

下面的模板包含实例创建、Token 注入、响应结构校验、业务错误处理和请求解包。

```ts [utils/request.ts]
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const TOKEN_KEY = 'token'
const SUCCESS_CODE = 200
const INVALID_RESPONSE_CODE = -1

// 后端统一的响应结构，按实际后端调整
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export class ApiError<T = unknown> extends Error {
  readonly code: number
  readonly data?: T

  constructor(code: number, message: string, data?: T) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

function isApiResponse(value: unknown): value is ApiResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'number' &&
    'message' in value &&
    typeof value.message === 'string' &&
    'data' in value
  )
}

function getAccessToken() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function clearAccessToken() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // 隐私模式或安全策略可能禁止访问 localStorage
  }
}

// 创建 Axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
})

// 请求拦截器：统一注入 Token
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：校验统一响应结构并处理错误，不改变响应类型
instance.interceptors.response.use(
  (response: AxiosResponse<unknown>) => {
    const body = response.data

    if (!isApiResponse(body)) {
      return Promise.reject(
        new ApiError(
          INVALID_RESPONSE_CODE,
          '响应结构不符合 ApiResponse 约定',
        ),
      )
    }

    if (body.code !== SUCCESS_CODE) {
      return Promise.reject(
        new ApiError(body.code, body.message || '请求失败', body.data),
      )
    }

    // 保留 AxiosResponse，由 request<T> 负责解包
    return response
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      clearAccessToken()
    }

    // 登录跳转、消息提示等由业务层统一处理，避免请求层耦合 router
    return Promise.reject(error)
  },
)

// 统一请求方法：调用方拿到的是解包后的业务数据
export async function request<T, D = unknown>(
  config: AxiosRequestConfig<D>,
): Promise<T> {
  const response = await instance.request<
    ApiResponse<T>,
    AxiosResponse<ApiResponse<T>>,
    D
  >(config)

  return response.data.data
}

export default request
```

使用：

```ts [api/index.ts]
import { request } from '@/utils/request'

interface User {
  id: number
  name: string
}

interface CreateUserBody {
  name: string
}

// GET
export const getUser = (id: number) =>
  request<User>({
    url: `/users/${id}`,
    method: 'get',
  })

// POST
export const createUser = (data: CreateUserBody) =>
  request<User>({
    url: '/users',
    method: 'post',
    data,
  })
```

调用时应分别处理传输层错误和业务层错误：

```ts
import axios from 'axios'
import { ApiError } from '@/utils/request'

try {
  await getUser(1)
} catch (error) {
  if (error instanceof ApiError) {
    // 后端返回了统一响应结构，但业务 code 表示失败
    console.error(error.code, error.message, error.data)
  } else if (axios.isAxiosError(error)) {
    // HTTP、网络、超时等 Axios 错误
    console.error(error.response?.status, error.message)
  } else {
    throw error
  }
}
```

说明：

- `request<T>` 的 `T` 是解包后的业务数据类型，不是 `AxiosResponse`。
- API 方法的请求参数已经声明具体类型时，通常只写 `request<T>` 即可；只有直接调用 `request` 且需要约束请求体时，才需要显式传入第二个泛型 `D`。
- `SUCCESS_CODE` 按实际后端调整，有的项目使用 `0`，示例中使用 `200`。
- `ApiError` 表示业务错误，`AxiosError` 表示 HTTP、网络或超时错误，两者不能混为一谈。
- 响应拦截器不会把 `AxiosResponse` 改成业务数据，因此返回类型和运行时行为保持一致。
- 文件下载、`204 No Content`、第三方接口等没有统一响应结构时，应使用独立的 Axios 实例，不要复用这个实例。
- `import.meta.env` 是 Vite 的环境变量写法。其他构建工具需要替换为对应的环境变量读取方式。

## 安全建议

### Token 存储

`localStorage` 使用简单，但任何 XSS 漏洞都可能读取其中的 Token。生产项目应根据安全等级选择：

- 普通低风险场景可以使用内存或 `localStorage` 保存短期 Access Token。
- 高风险场景优先使用 `HttpOnly`、`Secure`、`SameSite` Cookie，并在服务端实现 CSRF 防护。
- Refresh Token 不应长期裸露在 JavaScript 可访问的位置。
- 不要把数据库密码、私钥或第三方密钥放进前端环境变量，它们最终都会进入客户端产物。

### 401 与 Token 刷新

收到 401 后，请求层可以清理 Token，但登录跳转和提示通常交给业务层处理，避免请求模块直接依赖 Router。

如果项目需要 Access Token 自动刷新，必须处理并发请求：多个请求同时收到 401 时，只发起一次刷新请求，其余请求等待刷新结果后重放；刷新失败时统一退出登录。不要在每个 401 拦截器中直接递归请求刷新接口。

### 不要盲目重试写操作

POST、PATCH 和部分 DELETE 操作可能不幂等，自动重试可能产生重复订单、重复扣款或重复消息。写操作的自动重试必须依赖后端幂等键、唯一请求 ID 或状态查询。

## 常见问题

### GET 请求为什么不能正确接收 data

浏览器、代理和服务器对 GET 请求体的支持不一致。查询参数统一使用 `params`。

### 为什么浏览器提示 404 或 Network Error

CORS 预检失败时，浏览器可能只暴露模糊的 `Network Error`，不会把真实的非 2xx 响应交给 JavaScript。此时应检查响应头 `Access-Control-Allow-Origin`、`Access-Control-Allow-Headers`、`Access-Control-Allow-Methods` 和服务端日志。

### 为什么携带 Cookie 的跨域请求没有登录态

前端需要设置 `withCredentials: true`，后端也需要返回 `Access-Control-Allow-Credentials: true`，且不能把 `Access-Control-Allow-Origin` 设置为 `*`。

### 为什么 FormData 接口提示缺少 boundary

不要手写 `Content-Type: multipart/form-data`，让 Axios 和浏览器自动生成完整请求头。

### 为什么 `response.data` 和 TypeScript 类型不一致

泛型只提供编译期提示，不会执行运行时校验。后端字段变更、网关错误或代理错误都可能返回不同类型，需要增加运行时校验。
