# CSRF (Cross-Site Request Forgery)

CSRF（跨站请求伪造，也叫「跨站请求伪造」或 XSRF）是一种「借用你的身份发请求」的攻击。

攻击者不需要偷到你的 Cookie，也不需要破解密码。他只要让你在**已经登录**的状态下，访问一个他自己控制的页面，然后由那个页面偷偷向目标站点发一个请求 —— 浏览器会自动带上目标站点的 Cookie，服务器一看 Cookie 有效，就当成是你本人操作了。

一句话概括：**服务器只认 Cookie，而 Cookie 是浏览器自动带的，不问你愿不愿意。**

## 攻击成立的三个前提

同时满足才会被攻击，缺一条就打不成：

1. **用户已登录目标站点**，且 Cookie 还在有效期内
2. **Cookie 会被浏览器自动携带**，也就是没设 `SameSite`，或设成了 `Lax` / `None`
3. **接口的参数攻击者能构造出来**，没有随机 token，也没有二次验证

第 2 条是关键：如果接口压根不靠 Cookie 认证（比如 token 放在 Header 里手动传），CSRF 就无从下手。

## 攻击场景

### GET 型：一个 `<img>` 就够了

```html
<!-- 攻击者页面上的内容，用户访问即触发 -->
<img src="https://bank.com/transfer?to=attacker&amount=10000" />
```

图片能不能加载出来无所谓，**请求已经发出去了**，而且带着 bank.com 的 Cookie。

对应的脆弱接口长这样 —— 用 GET 做了状态变更：

```java
// 危险：GET 请求改数据
@GetMapping("/transfer")
public String transfer(String to, Integer amount) {
    accountService.transfer(to, amount);
    return "ok";
}
```

### POST 型：自动提交的隐藏表单

```html
<form id="f" action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker" />
  <input name="amount" value="10000" />
</form>
<script>
  document.getElementById('f').submit() // 页面加载即提交
</script>
```

用户看到的只是一个"加载有点慢"的页面，实际上已经完成了一次转账。

### 为什么攻击者不需要偷 Cookie

因为根本不偷。他只是借你的浏览器，让浏览器**自己**发这个请求。

所以 `HttpOnly` 挡不住 CSRF —— `HttpOnly` 防的是「JS 读取 Cookie」，而 CSRF 根本不需要读，只需要浏览器自动带上就行。这是最容易被混淆的一点。

## 和 XSS 的区别

两者经常被放一起说，但攻击方向正好相反：

| | XSS | CSRF |
| --- | --- | --- |
| 攻击者拿到什么 | 用户的 Cookie / 页面控制权 | 什么都没拿到，只是借用身份 |
| 利用的是 | 站点**信任**用户输入 | 站点**信任**浏览器发来的 Cookie |
| 前提条件 | 页面能注入脚本 | 用户已登录且 Cookie 自动携带 |
| 是否可读页面内容 | 可以 | 不可以（同源策略挡着） |
| 主要防御 | 输出转义、CSP | CSRF Token、SameSite |

打个比方：XSS 是攻击者混进了你家；CSRF 是攻击者没进你家，但骗你**自己**去银行转了一笔账。

顺带一提，两者会互相影响：一旦 XSS 成功，攻击者能直接读走 token 自己发请求，这时候 CSRF 防护就没意义了。所以 XSS 的优先级更高，见 [XSS 跨站脚本攻击](/zh/Security/xss)。

## 防御措施

### 1. CSRF Token

最经典也最可靠的办法，思路是：**服务端下发一个随机串，请求时必须带上，服务端比对**。

攻击者为什么拿不到这个串？因为同源策略 —— 他能让浏览器**发**请求，但读不到目标站点的**响应内容**，也就拿不到页面里的 token。

以 [Sa-Token](/zh/backend/java/tool/sa-token) 为例，不用引任何额外依赖：

**登录时生成并返回给前端**

```java
@RequestMapping("/login")
public SaResult login() {
    StpUtil.login(10001);
    // 首次访问时生成，之后同一个 Session 复用
    String csrfToken = StpUtil.getSession().get("csrf_token", () -> SaFoxUtil.getRandomString(60));
    return SaResult.ok().set("csrf_token", csrfToken);
}
```

**前端存到 localStorage，每次请求放到 Header 里**

```javascript
localStorage.setItem('csrf_token', csrf_token)
// 之后的请求
fetch(url, { headers: { csrf_token: localStorage.getItem('csrf_token') } })
```

注意：**必须存 localStorage，不能存 Cookie**。存 Cookie 就等于又变成浏览器自动携带了，等于没做。

**服务端校验**

```java
@RequestMapping("/test")
public SaResult test() {
    String csrfToken = SaHolder.getRequest().getHeader("csrf_token");
    if (csrfToken == null || !csrfToken.equals(StpUtil.getSession().get("csrf_token"))) {
        throw new SaTokenException("csrf_token 不匹配");
    }
    // 校验通过再走业务
    return SaResult.ok();
}
```

这段校验通常写进全局拦截器统一处理，不用每个接口抄一遍。

### 2. SameSite Cookie

给 Cookie 加一个 `SameSite` 属性，告诉浏览器「跨站的请求别带这个 Cookie」，从源头上切断攻击。

```
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax
```

| 值 | 跨站请求带不带 Cookie |
| --- | --- |
| `Strict` | 一律不带 |
| `Lax` | 只在**顶级导航 + GET** 时带，其余不带 |
| `None` | 都带，但必须同时有 `Secure` |

Chrome 从 80 版本开始，没写 `SameSite` 的 Cookie 会被**默认当成 `Lax`** 处理。Safari、Firefox 也有类似限制。

`Lax` 挡得住的：`<img>`、`<iframe>`、`<script>`、`fetch`、跨站 POST 表单。
`Lax` 挡不住的：**用户点击链接跳转过来的 GET 请求**。

```html
<!-- Lax 下这个仍然会带上 Cookie -->
<a href="https://bank.com/transfer?to=attacker&amount=10000">点我领 100 元红包</a>
```

所以 `SameSite=Lax` 不是 CSRF 的完整答案 —— 它关掉了最简单的 `<img>` 攻击，但 GET 型接口依然脆弱。这也是为什么「不要用 GET 做状态变更」和 CSRF Token 都不能省。

`Strict` 更安全，但有体验代价：从别的网站点链接跳到你的站点，第一次请求不带 Cookie，用户会看到自己是未登录状态，得刷新一下才正常。所以大多数站点选 `Lax`，再配合 CSRF Token 补上缺口。

### 3. 双提交 Cookie (Double Submit Cookie)

没有 Session 的场景（比如纯 JWT 无状态服务）用不了「服务端存一份再比对」那套，可以用这个变体：

服务端不存 token，只是随机生成一个值，**同时**写进 Cookie 和响应体。前端把响应体里的值存起来，请求时放进 Header。服务端校验「Header 里的值 == Cookie 里的值」。

攻击者能让浏览器自动带上 Cookie（这一步免不了），但**读不到 Cookie 的内容**，也就填不出这个 Header，对不上就拦掉。

Spring Security 的 `CookieCsrfTokenRepository` 就是这个思路。

### 4. 校验 Origin / Referer

浏览器不允许页面自己伪造 `Origin` 头，所以可以直接比对：

```java
String origin = request.getHeader("Origin");
if (!"https://mysite.com".equals(origin)) {
    throw new RuntimeException("非法来源");
}
```

`Origin` 比 `Referer` 可靠（`Referer` 会被某些隐私设置裁掉或省略）。但两者在部分场景下都可能缺失，所以这条只适合**兜底**，不能当唯一防线。

### 5. 其他加固

- **不要用 GET 做状态变更**。转账、删除、改密码一律 POST / DELETE。这挡不住 POST 型攻击，但砍掉了 `<img>` 这类最省事的攻击面，也让语义更干净。
- **关键操作二次验证**。改密码、大额转账前要求重新输入密码或短信验证码 —— 攻击者构造的请求带不上第二步凭证，直接失效。这是兜底中的兜底，也是成本最高但最可靠的一层。
- **要求自定义请求头**。跨站表单提交没法自定义 Header，`fetch` 加自定义头会触发 CORS 预检、攻击者的域名过不了预检。所以服务端可以要求请求必须带某个头：

  ```java
  if (request.getHeader("X-Requested-With") == null) {
      throw new RuntimeException("非法请求");
  }
  ```

  这条只在前端不走 Cookie、或者 CORS 配得够严时才有意义，别当唯一防线。

## 前后端分离还需要防 CSRF 吗

看 token 怎么传，这是唯一的判断标准：

| 传 token 的方式 | 浏览器会自动带吗 | CSRF 风险 |
| --- | --- | --- |
| localStorage + `Authorization` 头 | 不会，要 JS 主动加 | **免疫 CSRF** |
| Cookie | 会，浏览器自动带 | 有风险，需要 SameSite + CSRF Token |

[JWT](/zh/backend/java/springboot/jwt.md) 和 [Sa-Token](/zh/backend/java/tool/sa-token) 默认都是把 token 放在 Header 里传的，所以**默认就免疫 CSRF** —— 这也是它们被推荐用于前后端分离的原因之一。

反过来，一旦把 token 也写进 Cookie，就重新有了 CSRF 风险。Sa-Token 的 `is-read-cookie` 就属于这一类：

```yaml
sa-token:
  # 只认 Header，不从 Cookie 读 token
  is-read-cookie: false
```

顺带提一个坑：`is-read-cookie` 打开时，Sa-Token 会从 Cookie 里读 token，浏览器就会自动带上它 —— 表现出来就是「明明没加 token 也能鉴权通过」。排查这类诡异现象时，先确认这个配置。

## 框架配置：Spring Security

Spring Security **默认就开启 CSRF 防护**，前后端分离时把它配成 Cookie 模式即可：

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()));
        return http.build();
    }
}
```

`CookieCsrfTokenRepository` 会往名为 `XSRF-TOKEN` 的 Cookie 里写 token，并从 `X-XSRF-TOKEN` 请求头（或 `_csrf` 参数）读取。`withHttpOnlyFalse()` 是为了让 JS 能读到它 —— 这正是「双提交 Cookie」的实现方式。

> **最常见的坑**：网上一堆教程上来就 `http.csrf(csrf -> csrf.disable())` 把防护关掉，因为「不关掉 POST 请求一直 403」。这是典型的安全债 —— 关掉之后所有写接口都对 CSRF 敞开。正确做法是配好 token 仓库让前端带上 token，而不是把门拆了。

另外注意 Spring Security 6（Spring Boot 3）的 API 是 lambda 风格，老教程里的 `http.csrf().disable()` 链式写法在 6.x 已经废弃，会编译报错。

## 总结

| 攻击要点 | 说明 |
| --- | --- |
| 利用什么 | 浏览器自动携带 Cookie 的机制 |
| 需要偷 Cookie 吗 | 不需要，只是借用用户身份 |
| 前提 | 用户已登录 + Cookie 自动携带 + 参数可预测 |
| 与 XSS 的关系 | XSS 是注入脚本，CSRF 是伪造请求；XSS 得手后 CSRF 防护失效 |

**防御核心思路：**

1. **CSRF Token** —— 最可靠的一层，攻击者读不到响应就填不出 token
2. **SameSite=Lax** —— 用 `Lax` 而非 `Strict`（兼顾体验），堵掉子资源请求类攻击
3. **双提交 Cookie** —— 无 Session 场景的等效方案，本质仍是 token 比对
4. **不用 GET 做状态变更** —— 堵住 Lax 挡不住的那部分
5. **别关框架的 CSRF 防护** —— Spring Security 默认开着，别为了省事 disable 掉

## 参考

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Spring Security: CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
