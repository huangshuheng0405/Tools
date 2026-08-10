# Filter

Spring Boot中的`Filter`（过滤器）是基于`Java Servlet`规范（`Servlet API`）组件，主要作用是在请求到达`Controller`之前以及需要给客户端之前，对请求和响应进行拦截与处理

## 使用场景

- 检查 JWT Token、Session是否有效，检验权限
- 记录HTTP请求路径、IP地址、耗时统计
- 跨域处理（CORS）、请求参数解密、响应加密、数据压缩

## 注解方式

`@WebFilter`+`@ServletComponentScan`

1. 创建`Filter`类

```java
package com.example.demo.filter;

import com.example.demo.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
@WebFilter(urlPatterns = "/*") // 指定过滤路径
public class AuthController implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        // 获取请求路径
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String path = httpRequest.getRequestURI();

        // 判断是否是登录请求 如果是登录操作 则放行
        if (path.equals("/login")) {
            log.info("登录请求，放行");
            chain.doFilter(request, response);
            return;
        }

        // 获取请求头的 token
        String token = httpRequest.getHeader("token");

        if (token == null || token.isEmpty()) {
            log.info("token 为空");
            httpResponse.setStatus(401);
            httpResponse.setContentType("application/json;charset=UTF-8");
            httpResponse.getWriter().write("{\"code\":401,\"msg\":\"未登录\"}");
            return;
        }

        try {
            // 验证 token
            Claims claims = JwtUtil.validate(token);
            if (claims == null) {
                log.info("token 验证失败");
                httpResponse.setStatus(401);
                httpResponse.setContentType("application/json;charset=UTF-8");
                httpResponse.getWriter().write("{\"code\":401,\"msg\":\"未登录\"}");
                return;
            }
        } catch (Exception e) {
            log.info("token 验证失败");
            httpResponse.setStatus(401);
            httpResponse.setContentType("application/json;charset=UTF-8");
            httpResponse.getWriter().write("{\"code\":401,\"msg\":\"未登录\"}");
        }

        log.info("token 验证通过");
        chain.doFilter(request, response);
    }
}

```

2. 在启动类开启Servlet组件扫描

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan // 开启对 @WebFilter 等注解的扫描
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

