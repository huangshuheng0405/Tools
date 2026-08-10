# Interceptor

`HandlerInterceptor`是Spring MVC提供用于拦截HTTP请求的接口，主要包含3个回调方法

`preHandle(request, response, handler)`

- 触发时机：请求到达Controller方法之前
- 返回值：`boolean`
  - `true`：继续向下执行（交给下一个拦截器或Controller处理）
  - `false`：中断请求，不再调用Controller（通常用于权限不通过时直接返回响应）

`postHandler(request, response, handler, modelAndView)`

- 触发时机：Controller方法执行完毕后、视图渲染之前（前后端分离项目中在返回响应数据前）
- 注意：如果`preHandler`返回`false`或抛出异常，则不会执行

`afterCompletion(request, response, handler, ex)`

- 触发时机：整个请求处理完成（包括视图渲染或数据响应完毕）之后
- 主要用途：清理资源、性能监控、清除`ThreadLocal`变量

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

    // 目标访问之前运行 返回值 true 运行 false 不运行
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

注册拦截器（`WebMvcConfigurer`）

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
                .addPathPatterns("/**") // 拦截路径
                .excludePathPatterns("/login"); // 排除路径
    }
}

```

## 场景

1. 身份认证与鉴权（Token校验）
2. 日志记录（记录请求IP、请求URL、执行耗时等）
3. 接口限流/防刷（结合Redis检验访问频次）
4. 上下文信息绑定（解析Token后将用户信息存入`ThreadLocal`，并在`afterCompetion`中计时`remoove()`）

