# 路由模式

在React RouterV7 中，是拥有不同的路由模式，路由模式的选择将直接影响你的整个项目。React Router 提供了四种核心路由创建函数： `createBrowserRouter`、`createHashRouter`、`createMemoryRouter` 和 `createStaticRouter`

### `createBrowserRouter(推荐)`

核心特点：

- 使用HTML5的history API (pushState, replaceState, popState)
- 浏览器URL比较纯净 (/search, /about, /user/123)
- 需要服务器端支持(nginx, apache,等)否则会刷新404

使用场景：

- 大多数现代浏览器环境
- 需要服务器端支持
- 需要URL美观

------

### `createHashRouter`

核心特点：

- 使用URL的hash部分(#/search, #/about, #/user/123)
- 不需要服务器端支持
- 刷新页面不会丢失

使用场景：

- 静态站点托管例如(github pages, netlify, vercel)
- 不需要服务器端支持

------

### `createMemoryRouter`

核心特点：

- 使用内存中的路由表
- 刷新页面会丢失状态
- 切换页面路由不显示URL

使用场景：

- 非浏览器环境例如(React Native, Electron)
- 单元测试或者组件测试(Jest, Vitest)

------

### `createStaticRouter`

核心特点：

- 专为服务端渲染（SSR）设计
- 在服务器端匹配请求路径，生成静态 HTML
- 需与客户端路由器（如 createBrowserRouter）配合使用

使用场景：

- 服务端渲染应用（如 Next.js 的兼容方案）
- 需要SEO优化的页面

## 解决404问题

当使用`createBrowserRouter`时，如果刷新页面会丢失状态，这是因为浏览器默认会去请求服务器上的资源，如果服务器上没有资源，就会返回404。 要解决这个问题就需要在服务器配置一个回退路由，当请求的资源不存在时，返回`index.html`。

- nginx（推荐）

下载地址：[Nginx](https://nginx.org/en/download.html)

通过`npm run build`把`dist`目录下的文件加入到安装`nginx`安装目录下的`html`目录，接着在`nginx`安装目录下打开`cmd`，输入`nginx`启动即可

```conf [conf/nginx.conf]
location / {
  try_files $uri $uri/ /index.html;
}
```

