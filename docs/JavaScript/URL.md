# URL

`JavaScript`中用于**解析、构造和操作URL**的标准API，在浏览器和`Node.js`中都可用。

## 基本用法

```js
const url = new URL(
  'https://example.com:8080/path/to/page?name=John&age=30#section'
)

// 协议
console.log(url.protocol) // "https:"
// 域名
console.log(url.hostname) // "example.com"
// 端口号
console.log(url.port) // "8080"
// 路径
console.log(url.pathname) // "/path/to/page"
// 查询字符串
console.log(url.search) // "?name=John&age=30"
// 锚点
console.log(url.hash) // "#section"
```

<br>

---

`URL`对象的属性是可写的，修改会自动更新整个URL字符串

```js
const url = new URL('https://example.com/api')

url.pathname = '/v2/users'
url.searchParams.set('limit', '10')
console.log(url.toString()) // https://example.com/v2/users?limit=10
```

<br>

---

将相对路径转换为绝对URL，常用于页面内链接拼接

```js
const base = 'https://site.com/docs/'
const relative = './images/logo.png'
const full = new URL(relative, base)
console.log('🚀 ~ full:', full)
console.log(full.href) // "https://site.com/docs/images/logo.png"
```

在`Node.js`中，读取文件或浏览器解析`a.href`时常用
<br>
<br>

---

`url.searchParams`返回`URLSearchParams`对象，可以方便增删改查

```js
const url = new URL('https://api.com/search')
url.searchParams.set('q', 'javascript')
url.searchParams.append('page', '2')
console.log(url.href) // "https://api.com/search?q=javascript&page=2"

// 迭代参数
for (const [key, value] of url.searchParams) {
  console.log(key, value)
}
```

<br>

---

`new URL()`会传入非法URL时抛出错误，用于快速检验

```js
try {
  const url = new URL(userInput)
  console.log('有效 URL')
} catch (e) {
  console.log('无效 URL')
}
```

<br>

---

动态构造请求URL（如分页、筛选）

```js
function buildUrl(base, params) {
  const url = new URL(base)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return url.toString()
}

console.log(
  buildUrl('https://shop.com/product', { category: 'books', sort: 'price' })
  // https://shop.com/product?category=books&sort=price
)
```
