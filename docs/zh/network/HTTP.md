# http

## Cookie

HTTP 是无状态的：服务端处理完一个请求就忘了你是谁。Cookie 就是让浏览器替服务端**存一小段数据、之后每次请求自动带上**的机制，用来把多次请求串成一次「会话」——登录状态、购物车、埋点 ID 都靠它

### 一次完整的往返

服务端通过响应头 `Set-Cookie` 下发，浏览器存下来；之后对**同域**的每个请求，自动把 `Cookie` 请求头带上

```
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Lax
```

```
GET /api/user HTTP/1.1
Cookie: sessionId=abc123
```

注意这个头是浏览器**自动**带的，前端不需要（也没法）在 `fetch` 里手动加

### 属性

`Set-Cookie` 里除了 `name=value`，后面用 `; ` 分隔的都是属性

| 属性                                    | 作用                                | 不写时               |
| --------------------------------------- | ----------------------------------- | -------------------- |
| `Max-Age=3600`                          | 相对有效期，单位秒                  | ——                   |
| `Expires=Wed, 21 Oct 2026 07:28:00 GMT` | 绝对过期时间（GMT 格式）            | ——                   |
| `Domain=example.com`                    | 哪些域能带上                        | 只有当前域，不含子域 |
| `Path=/`                                | 哪些路径能带上                      | 当前路径所在的目录   |
| `Secure`                                | 只在 HTTPS 下发送                   | HTTP 也发            |
| `HttpOnly`                              | 禁止 JS 通过 `document.cookie` 读取 | JS 可读              |
| `SameSite=Lax`                          | 限制跨站携带                        | 见下一节             |

`Max-Age` 和 `Expires` 都写时 **`Max-Age` 优先**；两个都不写就是**会话 Cookie**，存在内存里，浏览器一关就没了

> `Expires` 是按**客户端时钟**判断的，用户机器时间不准就会提前失效或者永不过期，所以现在基本只用 `Max-Age`

> `Domain` 是**后缀匹配**：设成 `example.com` 之后，`a.example.com`、`b.example.com` 都能读到。但不能设置公共后缀（比如 `Domain=com`），浏览器会直接拒绝

### SameSite

用来挡 CSRF，限制的是「**跨站**请求带不带 Cookie」。注意这里的「站」指**可注册域名**（eTLD+1）：`a.example.com` 和 `b.example.com` 算**同一个站**，互相访问不算跨站

| 值       | 行为                                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| `Strict` | 完全禁止跨站携带。从别的站点点链接过来，第一次导航就是「未登录」，进站之后才恢复正常        |
| `Lax`    | 只在**顶级导航 + 安全方法**（GET）时携带。跨站的 POST 表单、iframe、`fetch`、`<img>` 都不带 |
| `None`   | 总是携带，但**必须同时带 `Secure`**，否则浏览器直接丢弃这条 Cookie                          |

`Lax` 是现在的默认值：Chrome 80（2020 年）起，没写 `SameSite` 的 Cookie 一律按 `Lax` 处理

> 所以「跨域接口要带 Cookie」这种场景（前端 `localhost:5173` 调 `api.example.com`），得显式写 `SameSite=None; Secure`，同时前端 `fetch` 加 `credentials: 'include'`、服务端 `Access-Control-Allow-Origin` 不能是 `*`

### 前端怎么读写

浏览器只留了 `document.cookie` 一个口子，它的行为跟普通对象完全不一样

```js
// 读：拿到的是所有「非 HttpOnly」Cookie 拼成的一个字符串
document.cookie
// "a=1; b=2; sessionId=abc123"
// 只有 name=value，不带属性，也没有顺序保证

// 写：是「追加」，不是覆盖
document.cookie = 'theme=dark'
// 同名 + 同 Domain + 同 Path 才会覆盖

// 值里有分号、逗号、空格、中文都会截断或出错，必须编码
document.cookie = `nick=${encodeURIComponent('张三')}; Path=/; Max-Age=86400`
```

> 三个常见的坑：**没有删除 API**，只能把 `Max-Age` 设成 `0`（或把 `Expires` 设成过去的时间）；**删除时必须带上和设置时一模一样的 `Domain` 和 `Path`**，否则删掉的是另一条 Cookie；**`HttpOnly` 的 Cookie 既读不到也覆盖不了**

### 限制

- 单条上限约 **4KB**（名字 + 值 + 属性一起算）
- 每个域下的数量，RFC 只要求至少 50 条，现代浏览器实际给到 150~180 条，超了按 LRU **静默淘汰**，不报错
- Cookie 会**随每个同域请求自动发送**，是在占带宽的。静态资源放独立域名（CDN）不只为并发，也是为了不白带 Cookie
- 隔离只看 **host**：不区分端口（`localhost:3000` 和 `localhost:8080` 共享），不区分 http/https（除非加了 `Secure`）

> Safari 的 ITP 会把**脚本可写**的 Cookie 有效期压到 7 天，所以「用 JS 存一年登录态」在 Safari 上会失效，长期凭证要由服务端下发

### 和 storage 的区别

|                | Cookie            | localStorage     | sessionStorage |
| -------------- | ----------------- | ---------------- | -------------- |
| 容量           | ~4KB              | ~5MB             | ~5MB           |
| 生命周期       | 按属性设置        | 永久，除非手动删 | 标签页关闭即清 |
| 随请求自动发送 | **是**            | 否               | 否             |
| 跨标签页共享   | 是                | 是               | **否**         |
| JS 可读        | `HttpOnly` 时不可 | 可               | 可             |

> 判断标准很简单：**需要服务端读到的**（会话 ID、鉴权凭证）放 Cookie；**纯前端状态**（主题、草稿、接口缓存）放 storage，别塞进 Cookie 白占带宽

### 安全写法

```js
// 服务端下发会话凭证
res.setHeader(
  'Set-Cookie',
  `sessionId=${sid}; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Lax`,
)
```

- `HttpOnly`：XSS 拿到了也偷不走，必加
- `Secure`：防中间人嗅探，线上必加（`localhost` 属于安全上下文，本地不加也能用）
- `SameSite=Lax`：挡掉大部分 CSRF；确实需要跨站携带才用 `None`
- **别把敏感信息直接写进 value**：Cookie 存在用户机器上，Base64 和 JWT 的 payload 都只是编码不是加密，随手就能解开
