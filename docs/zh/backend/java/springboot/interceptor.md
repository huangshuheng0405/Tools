# Interceptor

`HandlerInterceptor` 是 Spring MVC 提供用于拦截 HTTP 请求的接口，主要包含 3 个回调方法。

## 三个回调方法

### preHandle

```java
boolean preHandle(request, response, handler)
```

- 触发时机：请求到达 Controller 方法之前
- 返回值：`boolean`
  - `true`：继续向下执行（交给下一个拦截器或 Controller 处理）
  - `false`：中断请求，不再调用 Controller（通常用于权限不通过时直接返回响应）

### postHandle

```java
void postHandle(request, response, handler, modelAndView)
```

- 触发时机：Controller 方法执行完毕后、视图渲染之前（前后端分离项目中在返回响应数据前）
- 注意：如果 `preHandle` 返回 `false` 或抛出异常，则不会执行

### afterCompletion

```java
void afterCompletion(request, response, handler, ex)
```

- 触发时机：整个请求处理完成（包括视图渲染或数据响应完毕）之后
- 主要用途：清理资源、性能监控、清除 `ThreadLocal` 变量

## 执行顺序

```
请求
 ↓
preHandle          ← 返回 false 则直接中断
 ↓ true
Controller 方法
 ↓
postHandle
 ↓
视图渲染 / 返回响应
 ↓
afterCompletion    ← 无论前面是否异常，最终都会执行
 ↓
响应
```

存在多个拦截器时，`preHandle` 按**注册顺序**执行，而 `postHandle` 和 `afterCompletion` 按**注册的逆序**执行。

## 实现拦截器

```java
package com.example.demo.interceptor;

import com.example.demo.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 登录拦截器
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {

    // 目标方法执行前运行，返回 true 放行，false 拦截
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("token");

        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"未登录\"}");
            return false;
        }

        Claims claims = JwtUtil.validate(token);

        // token 校验失败
        if (claims == null) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"token无效或已过期\"}");
            return false;
        }

        request.setAttribute("userId", claims.get("id", Integer.class));
        request.setAttribute("username", claims.get("username", String.class));
        return true;
    }
}
```

## 注册拦截器

实现后还要通过 `WebMvcConfigurer` 注册才会生效

```java
package com.example.demo.config;

import com.example.demo.interceptor.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 配置类
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")        // 拦截路径
                .excludePathPatterns("/login"); // 排除路径
    }
}
```

## 应用场景

1. 身份认证与鉴权（Token 校验）
2. 日志记录（记录请求 IP、请求 URL、执行耗时等）
3. 接口限流 / 防刷（结合 Redis 检验访问频次）
4. 上下文信息绑定（解析 Token 后将用户信息存入 `ThreadLocal`，并在 `afterCompletion` 中调用 `remove()` 清理）
