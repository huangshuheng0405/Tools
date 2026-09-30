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

| 接口                    | 方法 | 说明                           |
| ----------------------- | ---- | ------------------------------ |
| `/api/v1/auth/login`    | POST | 登录，成功后把用户写进 Session |
| `/api/v1/auth/register` | POST | 注册，成功后同样建立会话       |
| `/api/v1/auth/me`       | GET  | 读 Session，返回当前登录用户   |
| `/api/v1/auth/logout`   | POST | 销毁 Session                   |

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
      timeout: 30m # 会话 30 分钟无操作即失效
      cookie:
        http-only: true # 禁止 JS 读取，防 XSS 窃取
        secure: false # 生产环境配 HTTPS 时改为 true
        same-site: lax # 缓解 CSRF
```

要点小结：

- **会话标识**：成功后 `session.setAttribute("user", userId)`，之后浏览器靠 `JSESSIONID` Cookie 自动带回来，服务端据此认人。
- **统一鉴权**：用拦截器而非在每个接口里手写判断，登录/注册放行，其余全部拦截。
- **防会话固定**：登录前先 `invalidate` 旧会话再建新的，避免攻击者预置的 sessionId 被复用。
- **`getSession(false)`**：读登录态时用 `false`，不会给未登录的请求凭空创建会话。

### BCrypt

Spring Security的配置类

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

BCrypt的特点：

1. 单向哈希：不能解密，只能加密后比对

2. 自带随即盐：同一个密码每次`encode`出来的结果不一样

3. 故意慢：防止暴力破解。默认强度是10

4. 验证密码用`matches`，不是解密

   ```java
   boolean ok = passwordEncoder.matches("明文密码", "数据库里的密文");
   ```

典型用法

```java
@Autowired
private PasswordEncoder passwordEncoder;

// 注册时
String encoded = passwordEncoder.encode("123456");
// 存 encoded 到数据库

// 登录时
boolean ok = passwordEncoder.matches("123456", encoded);
```

### CSRF

跨站请求伪造（Cross-Site Request Forgery）

攻击过程举例

假设你已登录银行网站，浏览器里保存这银行的会话Cookie

攻击者做一个恶意页面，里面放

```html
<img src="http://bank.com/transfer?to=attacker&amount=10000" />
```

你一打开这个页面，浏览器就会自动向 `bank.com` 发请求，并且**自动带上你的银行 Cookie**。
银行服务器一看 Cookie 有效，就以为是你在转账，于是把钱转走。

问题根源：**浏览器会自动携带目标站点的 Cookie，而第三方页面可以诱导浏览器发请求。**

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

无状态 Token：登录态不存服务端，靠签名自证

流程：

- 登录成功后，服务端签发一个 JWT（`Header.Payload.Signature` 三段）
- 客户端保存 token，后续每个请求带 `Authorization: Bearer <token>`
- 服务端每个请求验签名，从 Payload 里读用户身份，不用查存储

优点：

- 无状态：任意实例都能验签，天然支持水平扩容
- 多端通用：Web、App、小程序都只是"多带一个请求头"
- 不依赖 Cookie：没有 CSRF、跨域问题小

缺点：

- 无法主动撤销：token 没过期就"踢不掉"，强制下线要加黑名单/Redis 白名单
- token 泄露等于账号泄露：过期时间要短、密钥要保密
- Payload 是 Base64 明文：不要放手机号、身份证等敏感信息

适合：前后端分离、移动端、微服务、开放 API

### 实现示例（Spring Boot + Spring Security）

和 Session 版相比，只有"登录态载体"变了：不建 Session，而是登录时签发 token、请求时用过滤器验 token。骨架（认证、鉴权、异常处理）仍由 Spring Security 提供。

接口一览：

| 接口                    | 方法 | 说明                                 |
| ----------------------- | ---- | ------------------------------------ |
| `/api/v1/auth/login`    | POST | 登录，成功后签发 JWT                 |
| `/api/v1/auth/register` | POST | 注册，成功后同样签发 token           |
| `/api/v1/auth/me`       | GET  | 从请求头解析 token，返回当前登录用户 |
| `/api/v1/auth/logout`   | POST | 无状态登出，前端丢弃 token 即可      |

登录接口的核心逻辑（认证 + 签发，不建会话）：

```java
@PostMapping("/login")
public ResponseEntity<Result<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
    // 1. 认证：账号密码交给 AuthenticationManager（内部走 BCrypt 比对）
    try {
        authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(req.username(), req.password()));
    } catch (AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Result.fail(401, "用户名或密码错误"));
    }

    // 2. 签发 token 给客户端，客户端保存并在后续请求带上
    User user = findByUsername(req.username());
    String token = jwtService.generateToken(user.getId(), user.getUsername());
    return ResponseEntity.ok(
            Result.ok(new LoginResponse(user.getId(), user.getUsername(), user.getNickname(), token)));
}
```

签发 token 的工具类（JwtService），subject 放用户名、uid 放用户 id：

```java
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-ms}") long expirationMs) {
        // HS256 要求密钥至少 32 字节
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(Long userId, String username) {
        Date now = new Date();
        return Jwts.builder()
                .subject(username)
                .claim("uid", userId)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public String parseUsername(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }
}
```

鉴权不写进接口，用一个过滤器在每次请求时统一验 token（替代 Session 版的拦截器）：

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            try {
                // 1. 验签，拿到用户名
                String username = jwtService.parseUsername(header.substring(7));
                // 2. 按用户名加载用户，构造认证信息
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                // 3. 放进 SecurityContextHolder，后面 @AuthenticationPrincipal 和鉴权都能读到
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException | UsernameNotFoundException e) {
                // token 无效/过期：清空上下文，交给后面的 AuthenticationEntryPoint 返回 401
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}
```

SecurityConfig：关掉表单登录和 Session，改成无状态 + 挂 JWT 过滤器：

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/v1/auth/login", "/api/v1/auth/register").permitAll()
                    .anyRequest().authenticated())
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((request, response, e) -> { /* 返回 JSON 401 */ }))
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            // JWT 无状态：不创建也不依赖服务端 Session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 先解析 Bearer token，再走后面的授权判断
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

密钥与过期时间配置：

```yaml
app:
  jwt:
    secret: change-me-to-a-long-random-secret-at-least-32-chars
    expiration-ms: 7200000 # 2 小时
```

要点小结：

- **登录态载体**：登录成功签发 token，客户端自行保存；后续请求带 `Authorization: Bearer <token>`。
- **统一鉴权**：用 `OncePerRequestFilter` 过滤器解析并验签，验证通过塞进 `SecurityContextHolder`；登录/注册放行，其余全部要求已认证。
- **无状态**：`sessionCreationPolicy(STATELESS)`，服务端不建 Session，多实例部署不需要共享存储。
- **登出**：无状态下服务端无法销毁，前端丢 token 即"登出"；要强制下线得加黑名单或 Redis 白名单。

### Session vs JWT

| 维度        | Session + Cookie         | JWT                    |
| ----------- | ------------------------ | ---------------------- |
| 登录态存哪  | 服务端 Session           | 客户端 token           |
| 撤销/踢下线 | 删 Session 即可          | 难，等过期或加黑名单   |
| 水平扩容    | 要共享 Session（Redis）  | 天然支持，任意实例验签 |
| CSRF        | 有风险，要防护           | 无（token 走请求头）   |
| 多端/跨域   | Cookie 不友好            | 一个头搞定             |
| 安全注意    | Cookie HttpOnly/SameSite | 密钥保密、过期时间短   |

## OAuth2+OIDC

**OAuth2 是授权协议**：让第三方应用在用户授权后，代替用户访问资源。**OIDC（OpenID Connect）在 OAuth2 之上加了身份认证层**，多一个 `id_token`（JWT），告诉应用"这个用户是谁"。

参与角色：

- 资源所有者（用户）
- 客户端（你的应用）
- 授权服务器（认证中心）
- 资源服务器（提供用户资源的服务）

经典流程（授权码模式）：

1. 用户点"微信登录" → 应用把用户重定向到微信授权页
2. 用户在微信确认授权 → 微信回跳应用，带一个一次性 `code`
3. 应用用 `code` + 自己的密钥，向后端换 `access_token`（+ `id_token`）
4. 之后应用拿 `access_token` 调微信接口，读用户信息

优点：用户密码不经过第三方应用、授权可撤销、业界标准、三方登录（微信/QQ/GitHub）都是它

缺点：协议复杂、需要应用提前注册（client_id/client_secret）

适合：三方登录、开放平台授权、多系统统一授权

## SSO

单点登录（Single Sign-On）：**一个系统登录，全平台互通**

流程：

1. 访问系统 A，未登录 → 跳转到认证中心登录
2. 登录成功后，认证中心回跳 A，并带上登录票据（ticket/token）
3. A 验票据后放行；再访问系统 B，B 向认证中心验证同一票据，不再要求登录

实现方式：

- **共享会话**：多个系统共享同一套 Session 存储（如同一域名下共享 Cookie、或用 Redis）
- **CAS**：传统 SSO 协议，票据（ticket）校验
- **OAuth2/OIDC**：现代做法，认证中心统一发 token，各系统验签/换用户信息
- **开源方案**：Keycloak、Sa-Token（SSO 模块）

优点：用户体验好（只登一次）、账号集中管理、审计方便

缺点：认证中心成为单点（挂了全进不去，要保证高可用）、接入成本高

适合：企业内部多个系统、SaaS 平台
