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

### 实现示例（Spring Boot）

以一个最简单的 Spring Boot 项目为例，完整流程拆成三块：**登录建会话**、**拦截器鉴权**、**登出销毁**。

接口一览：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/auth/login` | POST | 登录，成功后把用户写进 Session |
| `/api/v1/auth/register` | POST | 注册，成功后同样建立会话 |
| `/api/v1/auth/me` | GET | 读 Session，返回当前登录用户 |
| `/api/v1/auth/logout` | POST | 销毁 Session |

登录接口的核心逻辑：

```java
@PostMapping("/login")
public Result<LoginResponse> login(@Valid @RequestBody LoginRequest req, HttpServletRequest request) {
    User user = userMapper.selectOne(new QueryWrapper<User>().eq("username", req.username()));

    // 1. 校验账号密码（BCrypt 比对）
    if (user == null || !passwordEncoder.matches(req.password(), user.getPassword())) {
        return Result.fail(401, "Invalid username or password");
    }

    // 2. 防 Session 固定攻击：先销毁旧会话
    HttpSession oldSession = request.getSession(false);
    if (oldSession != null) {
        oldSession.invalidate();
    }

    // 3. 创建新会话，把用户 id 存进去
    HttpSession session = request.getSession(true);
    session.setAttribute("user", user.getId());

    return Result.ok(new LoginResponse(user.getId(), user.getUsername(), user.getNickname()));
}
```

读当前用户（`/me`）：

```java
@GetMapping("/me")
public Result<LoginResponse> me(HttpSession session) {
    Long userId = (Long) session.getAttribute("user");
    if (userId == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未登录");
    }
    User user = userMapper.selectById(userId);
    return Result.ok(new LoginResponse(user.getId(), user.getUsername(), user.getNickname()));
}
```

登出（`/logout`）：

```java
@PostMapping("/logout")
public ResponseEntity<Void> logout(HttpServletRequest request) {
    HttpSession session = request.getSession(false);
    if (session != null) {
        session.invalidate();
    }
    return ResponseEntity.noContent().build();
}
```

鉴权不写在每个接口里，而是用一个拦截器统一处理：

```java
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        // 放行预检请求（CORS 的 OPTIONS）
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // getSession(false)：有就返回，没有就返回 null，绝不新建（避免无谓地产生会话）
        HttpSession session = request.getSession(false);
        Object userId = session == null ? null : session.getAttribute("user");

        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("""
                    {"code":401,"message":"未登录"}
                    """);
            return false;
        }
        return true;
    }
}
```

再把拦截器挂到路由上，只放行登录和注册：

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/api/v1/**")
                .excludePathPatterns("/api/v1/auth/login", "/api/v1/auth/register");
    }
}
```

Session 相关配置（超时时间、Cookie 属性）：

```yaml
server:
  servlet:
    session:
      timeout: 30m    # 会话 30 分钟无操作即失效
      cookie:
        http-only: true    # 禁止 JS 读取，防 XSS 窃取
        secure: false      # 生产环境配 HTTPS 时改为 true
        same-site: lax     # 缓解 CSRF
```

要点小结：

- **会话标识**：成功后 `session.setAttribute("user", userId)`，之后浏览器靠 `JSESSIONID` Cookie 自动带回来，服务端据此认人。
- **统一鉴权**：用拦截器而非在每个接口里手写判断，登录/注册放行，其余全部拦截。
- **防会话固定**：登录前先 `invalidate` 旧会话再建新的，避免攻击者预置的 sessionId 被复用。
- **`getSession(false)`**：读登录态时用 `false`，不会给未登录的请求凭空创建会话。

### Cookie

Tomcat背后做了：

1. 创建一个Session对象，生成一个随机ID

2. 把`userId`存到这个session里

3. 在响应头自动加上

   ```http
   Set-Cookie: MYSESSIONID=A1B2C3D4E5; Path=/; HttpOnly; SameSite=Lax
   ```

4. 浏览器收到后，自动保存这个Cookie

5. 下次请求时，浏览器自动带上

   ```http
   Cookie: MYSESSIONID=A1B2C3D4E5
   ```

6. Tomcat受到请求后，根据这个ID找到服务端对应的Session，`request.getSession(false)`就能拿到

```yaml
server:
  servlet:
    session:
      timeout: 30m
      cookie:
        name: MYSESSIONID 
        http-only: true
        secure: false
        same-site: lax
```

- name：生成的Cookie名字，默认是`JESSIONID`
- http-only：JS读不到，防XSS
- secure：不加`Secure`，本地HTTP也能用，生产改`true`
- same-site：加`SameSite=Lax`，防一部分CSRF

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