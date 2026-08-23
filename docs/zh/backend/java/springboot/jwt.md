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
