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
    private static final long EXPIRATION = 1000 * 60 * 60 * 24; // 24小时

    private static SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    /** 生成 JWT */
    public static String generate(Map<String, Object> claims) {
        return Jwts.builder()
                .claims(claims)
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey())
                .compact();
    }

    /** 解析 JWT，失败返回 null */
    public static Claims validate(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return null;
        }
    }
}

```

