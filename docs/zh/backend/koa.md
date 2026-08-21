# Koa

[koa](https://www.npmjs.com/package/koa) 是一个轻量、基于中间件的 Node.js Web 框架，核心特点是洋葱模型（`async (ctx, next)`）与极简内核（路由、body 解析等通常依赖社区中间件）。

## Installation

::: code-group

```bash [npm]
npm i koa
```

```bash [yarn]
yarn add koa
```

```bash [pnpm]
pnpm add koa
```

```bash [bun]
bun add koa
```

:::

常用中间件（按需安装）：

- `@koa/router`：路由
- `koa-bodyparser`：解析 JSON / 表单
- `koa-static`：静态资源
- `@koa/cors`：CORS
- `koa-session`：Session
- `koa-logger`：请求日志

## Hello World

```js
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx) => {
  ctx.status = 200
  ctx.body = { ok: true, message: 'hello koa' }
})

app.listen(3000)
```

## Middleware（洋葱模型）

中间件签名：`async (ctx, next) => { await next() }`

```js
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', String(ms))
})

app.use(async (ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = 'ok'
    return
  }
  await next()
})
```

## ctx 速查

```
Node原生:
req + res

Koa:
ctx = request + response 的封装
```

### Request 相关

- `ctx.method`：获取请求的方法：`GET`，`POST`
- `ctx.url`：完整请求路径，`/user?id=1&name=zs`，输出`/ user?id=1&name=zs`
- `ctx.path`：只有路径不含query参数，`/user?id=1&name=zs`，输出`/user`
- `ctx.query`：query参数对象，`/user?id=1&name=zs`，`ctx.query`输出`{id: '1', name: 'zs'}`
- `ctx.querystring`：query 参数字符串，输出`id=1&name=zs`，返回的是字符串
- `ctx.headers`：请求头对象，输出`{host: 'localhost:3000',connection: 'keep-alive','user-agent': 'Chrome'}`
- `ctx.get(name)`：专门获取某个请求头，`ctx.get('user-agent')`，输出`Mozilla/5.0 ...`，虽然等价于`ctx.headers['user-agent']`，但Koa推荐`ctx.get()`
- `ctx.request`：更底层的 request 对象（比如 `ctx.request.body`）

### Response 相关

- `ctx.status`：状态码
- `ctx.body`：获取POST请求体
- `ctx.type`：设置响应类型，`ctx.type = 'application/json'`
- `ctx.set(name, value)`：设置响应头，`ctx.set('token', '123456')`
- `ctx.redirect(url)`：重定向，`ctx.redirect('/login')`，可以用于未登录跳到登录页

### 状态共享

- `ctx.state`：建议放“当前请求上下文状态”，例如用户信息、traceId

## Router（@koa/router）

路由

::: code-group

```bash [npm]
npm i @koa/router
```

```bash [yarn]
yarn add @koa/router
```

```bash [pnpm]
pnpm add @koa/router
```

```bash [bun]
bun add @koa/router
```

:::

```js
import Koa from 'koa'
import Router from '@koa/router'

const app = new Koa()

// 给每个路由加个前缀
const router = new Router({ prefix: '/api' })

router.get('/users', (ctx) => {
  const page = Number(ctx.query.page ?? 1)
  ctx.body = { page, list: [] }
})

router.get('/users/:id', (ctx) => {
  ctx.body = { id: ctx.params.id }
})

router.post('/users', (ctx) => {
  ctx.body = { ok: true }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
```

## Body Parser（koa-bodyparser）

Koa默认不解析body，直接访问`ctx.request.body`是`undefined`

::: code-group

```bash [npm]
npm i koa-bodyparser
```

```bash [yarn]
yarn add koa-bodyparser
```

```bash [pnpm]
pnpm add koa-bodyparser
```

```bash [bun]
bun add koa-bodyparser
```

:::

```js
import bodyParser from 'koa-bodyparser'

app.use(bodyParser())

app.use(async (ctx) => {
  if (ctx.method === 'POST' && ctx.path === '/api/echo') {
    ctx.body = { received: ctx.request.body }
    return
  }
})
```

## 错误处理

### try/catch 捕获链路异常

```js
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    const status = err?.status ?? 500
    ctx.status = status
    ctx.body = {
      message: status === 500 ? 'Internal Server Error' : err.message
    }
    ctx.app.emit('error', err, ctx)
  }
})

app.on('error', () => {})
```

### ctx.throw

```js
router.get('/forbidden', (ctx) => {
  ctx.throw(403, 'Forbidden')
})
```

## 静态资源（koa-static）

::: code-group

```bash [npm]
npm i koa-static
```

```bash [yarn]
yarn add koa-static
```

```bash [pnpm]
pnpm add koa-static
```

```bash [bun]
bun add koa-static
```

:::

```js
import serve from 'koa-static'

app.use(serve('public'))
```

## CORS（@koa/cors）

处理跨域

::: code-group

```bash [npm]
npm i @koa/cors
```

```bash [yarn]
yarn add @koa/cors
```

```bash [pnpm]
pnpm add @koa/cors
```

```bash [bun]
bun add @koa/cors
```

:::

```js
import cors from '@koa/cors'

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
```

## Cookies / Session（koa-session）

::: code-group

```bash [npm]
npm i koa-session
```

```bash [yarn]
yarn add koa-session
```

```bash [pnpm]
pnpm add koa-session
```

```bash [bun]
bun add koa-session
```

:::

```js
import session from 'koa-session'

app.keys = ['replace-with-a-secure-secret']

app.use(
  session(
    {
      key: 'sid',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax'
    },
    app
  )
)

router.get('/login', (ctx) => {
  ctx.session.userId = '1'
  ctx.body = { ok: true }
})

router.get('/me', (ctx) => {
  ctx.body = { userId: ctx.session.userId ?? null }
})
```

## JWT 鉴权（一个常见写法）

::: code-group

```bash [npm]
npm i jsonwebtoken
```

```bash [yarn]
yarn add jsonwebtoken
```

```bash [pnpm]
pnpm add jsonwebtoken
```

```bash [bun]
bun add jsonwebtoken
```

:::

```js
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'replace-with-a-secure-secret'

const auth = async (ctx, next) => {
  const header = ctx.get('authorization')
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) ctx.throw(401, 'Unauthorized')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    ctx.state.user = payload
  } catch {
    ctx.throw(401, 'Unauthorized')
  }
  await next()
}

router.get('/private', auth, (ctx) => {
  ctx.body = { user: ctx.state.user }
})
```

## 上传文件（一个常见选择：koa-body）

::: code-group

```bash [npm]
npm i koa-body
```

```bash [yarn]
yarn add koa-body
```

```bash [pnpm]
pnpm add koa-body
```

```bash [bun]
bun add koa-body
```

:::

```js
import { koaBody } from 'koa-body'

app.use(
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true
    }
  })
)

router.post('/upload', (ctx) => {
  ctx.body = { files: ctx.request.files ?? null }
})
```

## 日志（koa-logger）

::: code-group

```bash [npm]
npm i koa-logger
```

```bash [yarn]
yarn add koa-logger
```

```bash [pnpm]
pnpm add koa-logger
```

```bash [bun]
bun add koa-logger
```

:::

```js
import logger from 'koa-logger'

app.use(logger())
```

## 常用组织方式（备忘）

- 按层拆分：`routes/`（路由定义）→ `controllers/`（参数/响应）→ `services/`（业务）→ `repos/`（数据访问）
- 统一响应结构：成功 `{ code, data }`，失败 `{ code, message }`（配合全局错误中间件）
- 统一注入：在最前面生成 `traceId` 放到 `ctx.state`，并写入响应头便于排查
