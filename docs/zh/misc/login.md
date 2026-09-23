# login

## Session+Cookie

最传统、最稳的方式

流程：

- 用户登录，服务端验证账号密码
- 服务端创建Session，存到内存、Redis、数据库等
- 返回`Set-Cookie: JSESSIONID=xxx; HttpOnly; Secure; SameSite=Lax`
- 浏览器后续请求自动带Cookie
- 服务端用sessionId查Session，找到用户

优点：

- 容易撤销：删掉Session就下线
- 不泄露用户信息
- 浏览器自动管理Cookie

缺点：

- 分布式要共享Session存储，比如Redis
- 有CSRF风险，需要`SameSite`、CSRF Token
- 移动端、跨域场景不如Token方便

适合：传统Web、后台管理系统、单体应用

## Opaque Token

类似Session，但不一定用Cookie

流程：

1. 登录成功后，服务端生成一个随机字符串，比如`uuid`或随机加密数

2. 存Redis：`token->userId，过期时间，权限`

3. 返回给客户端

4. 客户端后续请求带

   ```http
   Authorization: Bearer <token>
   ```

5. 服务端查Redis检验

优点：

- 可随时撤销、续期、封禁
- Token本身无意义，不泄露消息
- 比JWT更可控

缺点：

- 每次请求都要查存储，有状态
- Redis挂了会影响认证

适合：前后端分离、移动端、需要强撤销能力的系统

## JWT

适合：微服务、网关鉴权、短期access token

## OAuth2+OIDC

## SSO