# JWT

<svg width='200px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><g clip-path="url(#devicon-jwt-icon-1-a)"><path fill="#fff" d="M345.3 161.4 344.7 0h-90l.6 161.4 45 61.8zm-90 276.6v162h90V438l-45-61.8z"/><path fill="#00F2E6" d="m345.3 438 94.8 130.8 72.6-52.8-94.8-130.8-72.6-23.4zm-90-276.6L159.9 30.6 87.3 83.4l94.8 130.8 73.2 23.4z"/><path fill="#00B9F1" d="M182.1 214.2 28.5 164.4.9 249.6 154.5 300l72.6-24zm190.8 109.2 45 61.8L571.5 435l27.6-85.2L445.5 300z"/><path fill="#D63AFF" d="m445.5 300 153.6-50.4-27.6-85.2-153.6 49.8-45 61.8zm-291 0L.9 349.8 28.5 435l153.6-49.8 45-61.8z"/><path fill="#FB015B" d="M182.1 385.2 87.3 516l72.6 52.8L255.3 438v-76.2zm235.8-171 94.8-130.8-72.6-52.8-94.8 130.8v76.2z"/></g><defs><clipPath id="devicon-jwt-icon-1-a"><path fill="#fff" d="M0 0h600v600H0z"/></clipPath></defs></svg>

JWT（JSON Web Token）实现无状态用户认证/鉴权通常分为以下几个步骤

- 引入依赖（使用官方推荐的`jjwt`库）
- 编写JWT工具类（生成Token、解析Token、验证Token）
- 在登录接口中生成Token返回客户端
- 自定义

```java
package com.example.demo.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

public class JwtUtil {

    private static final String SECRET = "your-256-bit-secret-key-here-make-it-long-enough!!";
    // token过期时间
    private static final long EXPIRATION = 1000 * 60 * 60 * 24; // 24小时

    private static SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    /** 生成 JWT */
    public static String generate(Map<String, Object> claims) {
        return Jwts.builder() // 开始构建JWT
                .claims(claims)
                // 设置过期时间 currentTimeMillis -> 2026-08-14 17:30
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                // 数字签名 Header.Payload.Signature
                .signWith(getKey())
                // 生成jwt
                .compact();
    }

    /** 解析 JWT，失败返回 null */
    public static Claims validate(String token) {
        try {
            return Jwts.parser()
                    // 用密钥验证签名
                    .verifyWith(getKey())
                    // 构建parser
                    .build()
                    // 解析jwt
                    .parseSignedClaims(token)
                    // 得到Claims
                    .getPayload();
        } catch (Exception e) {
            return null;
        }
    }
}

```

在登录业务里，

```java
@PostMapping("/login")
public String login(LoginDTO dto) {

    // 1. 查询用户
    User user = userService.login(dto);

    // 2. 准备 JWT 数据
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", user.getId());
    claims.put("username", user.getUsername());

    // 3. 生成 Token
    return JwtUtil.generate(claims);
}
```

前端就会得到，`eyJhbGciOiJIUzI1NiJ9...`

以后请求都带上

```http
GET /user/info
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

后端解析Token，得到Claims，从而获取用户信息

```java
String token = ...;

Claims claims = JwtUtil.validate(token);

if (claims == null) {
    // 未登录 / Token 无效
}

// 然后就能获取信息
Long userId = claims.get("userId", Long.class);
```

## 注意

```
Header.Payload.Signature
```

其中`Payload`通常只是base64编码，不是加密，所以不要往jwt里面放敏感信息，密码，银行卡号，身份证号等

## 登录流程

1. 先看拦截器，`WebConfig.java`：

```java
registry.addInterceptor(jwtInterceptor)
        .addPathPatterns("/api/**")             // 所有 /api 开头的接口都要先登录
        .excludePathPatterns("/api/auth/**");   // 注册和登录本身当然不能要求先登录
```

登录和注册接口必须排除在外

2. 参数绑定和校验。在`AuthController.java `的`login`方法，`@RequestBody` 让 Jackson 把 JSON 变成 LoginRequest.java 对象，`@Valid` 触发 `@NotBlank` 校验。

3. 查数据库。

   ```java
   User user = userMapper.selectOne(
           Wrappers.<User>lambdaQuery().eq(User::getUsername, request.username()));
   ```

4. 对比密码。

   ```java
   if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
       throw new BusinessException(401, "用户名或密码错误");
   }
   ```

5. 签发token。

   ```java
   String token = jwtUtil.generate(user.getId(), user.getUsername());
   ```

   JwtUtil.java 里把用户 id 塞进 `sub`，加了签发时间和过期时间，然后用密钥签名。产出的字符串是三段：

   ```java
   eyJhbGciOiJIUzM4NCJ9 . eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhbGljZSIsImlhdCI6MTc5MDA5MDIyMSwiZXhwIjoxNzkwMDk3NDIxfQ . DYrwr04nHmkLBYx2DqHX6b6K9psaqBskWDIemhc-YSXSAeb52s0snMuN8t1HNGWo
         header                            payload（Base64 编码，谁都能解开看）                              signature
   ```

   **把中间那段拿去 Base64 解码，你会直接看到 `{"sub":"1","username":"alice","iat":...,"exp":...}`** —— 你可以自己复制到 jwt.io 试。它不是加密，是编码。所以 token 里绝对不能放密码、手机号这类东西。它的安全性全来自第三段签名：客户端改了 payload，签名就对不上。

6. 返回token。

## 请求

1. 拦截器不放行。

   ```java
   String header = request.getHeader(HttpHeaders.AUTHORIZATION);   // "Bearer eyJhbGci..."
   if (header == null || !header.startsWith(BEARER_PREFIX)) {
       writeUnauthorized(response, "缺少登录凭证");
       return false;
   }
   String token = header.substring(BEARER_PREFIX.length());        // 切掉 "Bearer " 前缀
   ```

   没带请求头 → 直接写回 401 并 `return false`。**注意 `return false` 的含义是"就此打住"**，Controller 根本不会被调用，方法栈直接结束。

2. 验证token。

   ```java
   Claims claims = jwtUtil.parse(token);
   ```

   `Jwts.parser().verifyWith(key)` 做了三件事：用同一个密钥把 header.payload 重新算一遍 HMAC，和 token 第三段比对，顺便检查 `exp` 过期没有。任何一项不过关就抛 `JwtException`，被 catch 住后同样走 401。

   这就是为什么我测试时**改签名、删签名、改 payload 全部返回 401**——服务端的密钥在前端拿不到，算不出正确的签名。

3. 把身份挂到当前线程

   ```java
   UserContext.setUserId(Long.valueOf(claims.getSubject()));   // sub = "1" → 1L
   return true;   // 放行
   ```

   UserContext.java 是个 ThreadLocal。为什么要它？因为接下来 Controller 的方法签名是固定的 `me()`，**没有 userId 参数**。总不能让拦截器把 id "传"给 Controller——ThreadLocal 相当于给当前线程挂了个随身便签，同一次请求里的任何代码都能读到。

4. Controller取身份

   ```java
   @GetMapping("/me")
   public Result<UserVO> me() {
       User user = userService.getById(UserContext.getUserId());
       return Result.ok(UserVO.from(user));
   }
   ```

   **这个方法的签名里没有任何"用户 id"参数，这是整段流程里最重要的设计。** 用户身份只能由服务端从 token 解出来，客户端无法通过传参伪装成别人。如果你把接口写成 `GET /api/user/me?userId=1`，那谁也拦不住别人把 1 改成 2 去看别人的资料——这是新手项目里最高频的越权漏洞。

   返回时用 UserVO.java 而不是直接返回 `User` 实体，因为实体上带着 `password` 字段（哪怕是哈希）。**永远不要把实体直接抛给前端。**

5. 请求结束，必须清理。

   ```java
   @Override
   public void afterCompletion(...) {
       UserContext.clear();
   }
   ```

   **这一步千万不能省。** Tomcat 用线程池，一个线程会依次处理成千上万个请求。如果不清，下一个请求调用 `UserContext.getUserId()` 时会读出**上一个用户的 id**——这是最隐蔽也最严重的一类 bug，因为它在开发环境（请求少、线程不复用）几乎测不出来，一上线就出事。

   





