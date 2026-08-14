# JWT

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
