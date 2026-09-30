# 后端项目实战（巩固练习 · 完整代码版）

> 目标：刚学完后端基础，用一个**小而完整的项目**把"建项目 → 连数据库 → 写接口 → 登录鉴权 → 加缓存 → 测试"这条主线走一遍。
> 技术栈：**Spring Boot + MySQL + MyBatis-Plus + Redis + Sa-Token + JWT**

## 项目主题

一个最简单的「用户登录 + 商品 CRUD」管理系统：

- 用户注册 / 登录（拿 token）
- 登录后才能访问受保护接口
- 按角色控制权限（管理员能增删改，普通用户只能查）
- 商品查询用 Redis 缓存（引出缓存穿透 / 击穿 / 雪崩）

> 功能不用多，重点是**把后端一套完整流程跑通**。

## 前置准备

- JDK 17+（Spring Boot 3.x / 4.x 都要求）
- Maven
- IDEA
- 本地 MySQL、Redis 已启动

> **版本说明（重要）**：下文代码基于 **Spring Boot 3.x**，这是当前生态最稳、保证能跑通的组合。若你想用 Spring Boot 4，只需把 `pom.xml` 里 `spring-boot-starter-parent` 的版本号换成 4.x，其余代码**完全一样**；但要注意 MyBatis-Plus、Sa-Token 对 SB4 的 starter 兼容情况（以官方文档为准）。如果换 4.x 后起不来，退回 3.x 即可——**学的是流程，不是版本号**。

## 最终包结构

```
com.example.demo
├── DemoApplication.java          # 启动类（加 @MapperScan）
├── common
│   ├── Result.java               # 统一返回结果
│   ├── BusinessException.java    # 业务异常
│   └── GlobalExceptionHandler.java  # 全局异常处理（含 Sa-Token 异常）
├── config
│   ├── PasswordConfig.java       # BCrypt 密码加密 Bean
│   └── SaTokenConfig.java        # 注册 Sa-Token 拦截器
├── dto
│   ├── LoginDTO.java
│   └── RegisterDTO.java
├── entity
│   ├── User.java
│   └── Goods.java
├── mapper
│   ├── UserMapper.java
│   └── GoodsMapper.java
├── service
│   ├── UserService.java
│   ├── GoodsService.java
│   └── impl
│       ├── UserServiceImpl.java
│       └── GoodsServiceImpl.java
└── controller
    ├── UserController.java
    └── GoodsController.java
```

---

## 阶段一：初始化项目 + 依赖

### 1. 完整 `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.4</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>后端巩固练习项目</description>

    <properties>
        <java.version>17</java.version>
        <mybatis-plus.version>3.5.7</mybatis-plus.version>
        <sa-token.version>1.39.0</sa-token.version>
    </properties>

    <dependencies>
        <!-- Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 参数校验 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MyBatis-Plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>

        <!-- MySQL 驱动 -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- Sa-Token 核心 -->
        <dependency>
            <groupId>cn.dev33</groupId>
            <artifactId>sa-token-spring-boot-starter</artifactId>
            <version>${sa-token.version}</version>
        </dependency>

        <!-- Sa-Token 集成 Redis（登录态存 Redis） -->
        <dependency>
            <groupId>cn.dev33</groupId>
            <artifactId>sa-token-redis-jackson</artifactId>
            <version>${sa-token.version}</version>
        </dependency>

        <!-- Sa-Token JWT 插件（阶段八用，可选） -->
        <dependency>
            <groupId>cn.dev33</groupId>
            <artifactId>sa-token-jwt</artifactId>
            <version>${sa-token.version}</version>
        </dependency>

        <!-- BCrypt 密码加密 -->
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-crypto</artifactId>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- 测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2. 启动类 `DemoApplication.java`

```java
package com.example.demo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.demo.mapper")   // 扫描 Mapper 接口
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## 阶段二：写 `application.yml`

```yaml
server:
  port: 8080

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: 你的密码
  data:
    redis:
      host: localhost
      port: 6379
      password: 你的redis密码   # 没设密码就删掉这行

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true                    # 下划线转驼峰
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl # 打印 SQL，学习期可开
  global-config:
    db-config:
      id-type: auto

sa-token:
  token-name: satoken        # token 名称（前端放 header 的 key）
  timeout: 2592000           # 30 天，单位秒
  is-concurrent: true        # 允许同一账号多处登录
  is-share: true             # 共用一个 token
  token-style: uuid          # token 风格（阶段八 JWT 模式改成 jwt）
  is-log: true               # 打印日志
```

## 阶段三：建表

```sql
CREATE DATABASE IF NOT EXISTS demo DEFAULT CHARACTER SET utf8mb4;
USE demo;

CREATE TABLE t_user (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(100) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'user',  -- admin / user
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE t_goods (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    stock       INT NOT NULL DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 阶段四：通用层（统一返回 + 全局异常）

### 1. `common/Result.java`

```java
package com.example.demo.common;

import lombok.Data;

/**
 * 统一返回结果
 */
@Data
public class Result<T> {
    private Integer code;    // 状态码：200 成功，400 参数错误，401 未登录，403 无权限，500 失败
    private String message;  // 提示信息
    private T data;          // 返回数据

    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.setCode(200);
        r.setMessage("success");
        r.setData(data);
        return r;
    }

    public static <T> Result<T> fail(String message) {
        return fail(500, message);
    }

    public static <T> Result<T> fail(Integer code, String message) {
        Result<T> r = new Result<>();
        r.setCode(code);
        r.setMessage(message);
        return r;
    }
}
```

### 2. `common/BusinessException.java`

```java
package com.example.demo.common;

import lombok.Getter;

/**
 * 业务异常，Service 里业务不满足时抛出
 */
@Getter
public class BusinessException extends RuntimeException {
    private final Integer code;

    public BusinessException(String message) {
        this(500, message);
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
}
```

### 3. `common/GlobalExceptionHandler.java`

```java
package com.example.demo.common;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import cn.dev33.satoken.exception.NotRoleException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理：把各种异常统一转成 Result 返回
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 业务异常
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        return Result.fail(e.getCode(), e.getMessage());
    }

    // 参数校验异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String msg = fieldError != null ? fieldError.getDefaultMessage() : "参数校验失败";
        return Result.fail(400, msg);
    }

    // Sa-Token：未登录
    @ExceptionHandler(NotLoginException.class)
    public Result<Void> handleNotLogin(NotLoginException e) {
        return Result.fail(401, "未登录，请先登录");
    }

    // Sa-Token：无角色
    @ExceptionHandler(NotRoleException.class)
    public Result<Void> handleNotRole(NotRoleException e) {
        return Result.fail(403, "无角色：" + e.getRole());
    }

    // Sa-Token：无权限
    @ExceptionHandler(NotPermissionException.class)
    public Result<Void> handleNotPermission(NotPermissionException e) {
        return Result.fail(403, "无权限：" + e.getPermission());
    }

    // 兜底异常
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        return Result.fail(500, "系统异常：" + e.getMessage());
    }
}
```

---

## 阶段五：实体 → Mapper → Service → Controller（CRUD）

### 1. 实体类

**`entity/User.java`**

```java
package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("t_user")   // 对应表名
public class User {
    @TableId(type = IdType.AUTO)   // 主键自增
    private Long id;
    private String username;
    private String password;
    private String role;
    private LocalDateTime createTime;
}
```

**`entity/Goods.java`**

```java
package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_goods")
public class Goods {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
```

### 2. Mapper 接口

**`mapper/UserMapper.java`**

```java
package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.User;

// 继承 BaseMapper 后，单表增删改查不用写 SQL
public interface UserMapper extends BaseMapper<User> {
}
```

**`mapper/GoodsMapper.java`**

```java
package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Goods;

public interface GoodsMapper extends BaseMapper<Goods> {
}
```

### 3. DTO（接口入参）

**`dto/LoginDTO.java`**

```java
package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank(message = "用户名不能为空")
    private String username;

    @NotBlank(message = "密码不能为空")
    private String password;
}
```

**`dto/RegisterDTO.java`**

```java
package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDTO {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度需在 3-20 之间")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度需在 6-20 之间")
    private String password;
}
```

### 4. Service 接口与实现

**`service/UserService.java`**

```java
package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.RegisterDTO;
import com.example.demo.entity.User;

public interface UserService extends IService<User> {
    void register(RegisterDTO dto);
    String login(LoginDTO dto);
}
```

**`service/impl/UserServiceImpl.java`**

```java
package com.example.demo.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.common.BusinessException;
import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.RegisterDTO;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final BCryptPasswordEncoder passwordEncoder;

    // 构造器注入（比 @Autowired 字段注入更好）
    public UserServiceImpl(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void register(RegisterDTO dto) {
        // 判断用户名是否已存在
        long count = count(new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername()));
        if (count > 0) {
            throw new BusinessException("用户名已存在");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // 密码加密存储
        user.setRole("user");   // 默认普通用户，管理员手动改库或注册后改
        save(user);
    }

    @Override
    public String login(LoginDTO dto) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername()));
        // 先判断用户是否存在，再用 matches 比对密码（不能明文 == 比较）
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }
        // 登录成功：把用户 id 写入 Sa-Token 会话
        StpUtil.login(user.getId());
        // 返回 token 给前端
        return StpUtil.getTokenValue();
    }
}
```

### 5. Controller

**`controller/UserController.java`**

```java
package com.example.demo.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.example.demo.common.Result;
import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.RegisterDTO;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 注册
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterDTO dto) {
        userService.register(dto);
        return Result.success();
    }

    // 登录，返回 token
    @PostMapping("/login")
    public Result<String> login(@Valid @RequestBody LoginDTO dto) {
        String token = userService.login(dto);
        return Result.success(token);
    }

    // 退出登录
    @PostMapping("/logout")
    public Result<Void> logout() {
        StpUtil.logout();
        return Result.success();
    }

    // 获取当前登录用户信息
    @GetMapping("/info")
    public Result<User> info() {
        Long userId = StpUtil.getLoginIdAsLong();  // 从会话里取当前登录用户 id
        User user = userService.getById(userId);
        user.setPassword(null);   // 永远不要返回密码
        return Result.success(user);
    }
}
```

> 到这里，User 的「注册 + 登录 + 退出 + 查当前用户」已经能跑。商品（Goods）的普通增删改查结构同上，后面阶段九再给「带缓存的完整版」。

---

## 阶段六：Sa-Token 登录与鉴权

关键 API / 注解记住这些：

| 方式 | 作用 |
| --- | --- |
| `StpUtil.login(id)` | 登录（把 id 存进会话） |
| `StpUtil.getTokenValue()` | 获取当前 token |
| `StpUtil.isLogin()` | 是否已登录 |
| `StpUtil.checkLogin()` | 未登录抛异常（拦截器里用） |
| `StpUtil.getLoginIdAsLong()` | 取当前登录用户 id |
| `StpUtil.logout()` | 退出登录 |
| `@SaCheckLogin` | 方法/类：登录才能访问 |
| `@SaCheckRole("admin")` | 方法/类：需某角色 |
| `@SaCheckPermission("goods:add")` | 方法/类：需某权限 |

> 前面的 `login()` 已经用到了 `StpUtil.login`，阶段七注册拦截器后，鉴权就生效了。

## 阶段七：Sa-Token 配置 + 拦截器

### 1. `config/PasswordConfig.java`

```java
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class PasswordConfig {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 2. `config/SaTokenConfig.java`

```java
package com.example.demo.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SaTokenConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
                .addPathPatterns("/**")                 // 拦截所有接口
                .excludePathPatterns(                   // 放行登录/注册
                        "/user/login",
                        "/user/register",
                        "/error"
                );
    }
}
```

> 说明：`SaInterceptor` 里调用 `StpUtil.checkLogin()`，未登录会抛 `NotLoginException`，被前面的全局异常处理器转成 `401` 返回。

---

## 阶段八：JWT 与 Redis 的关系（进阶）

技术栈里 **JWT + Redis + Sa-Token** 三个同时出现，最容易懵，理顺：

- **Sa-Token 默认模式**：token 是一串 UUID，**登录态存 Redis**（所以必须装 Redis，`keys satoken:*` 能看到）。
- **JWT 模式**：token 是一个 JWT（自带信息、无状态、服务端不存）。引入 `sa-token-jwt`（pom 里已加）后，把 yml 里 `token-style` 改成 `jwt` 即可。

**切换步骤**：

1. `pom.xml` 确认加了 `sa-token-jwt` 依赖（阶段一已加）
2. `application.yml` 里改：

```yaml
sa-token:
  token-style: jwt   # uuid 改成 jwt
```

3. 重启，重新登录，观察返回的 token 变成三段式（`xxx.yyy.zzz`）的 JWT

> 具体到 JWT 的签名密钥等细节（如 `jwt-secret-key`）以 Sa-Token 官方文档为准，不同版本配置键略有差异。核心结论：**Sa-Token 本身就能切这两种 token 风格**，不是"另外再手写一套 JWT + Redis"。

---

## 阶段九：Redis 缓存商品（完整版，衔接三大问题）

### 1. `service/GoodsService.java`

```java
package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.Goods;

public interface GoodsService extends IService<Goods> {
    // 带缓存的查询
    Goods getGoodsById(Long id);
    // 新增
    void addGoods(Goods goods);
    // 更新
    void updateGoods(Goods goods);
    // 删除
    void deleteGoods(Long id);
}
```

### 2. `service/impl/GoodsServiceImpl.java`

```java
package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.common.BusinessException;
import com.example.demo.entity.Goods;
import com.example.demo.mapper.GoodsMapper;
import com.example.demo.service.GoodsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Service
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper, Goods> implements GoodsService {

    private static final String CACHE_PREFIX = "cache:goods:";   // 缓存 key 前缀
    private static final String LOCK_PREFIX = "lock:goods:";     // 锁 key 前缀

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public GoodsServiceImpl(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public Goods getGoodsById(Long id) {
        String key = CACHE_PREFIX + id;

        // 1. 先查缓存
        String json = stringRedisTemplate.opsForValue().get(key);
        if (json != null) {
            // "" 是穿透兜底的空值，!= "" 是有效数据
            return "".equals(json) ? null : deserialize(json);
        }

        // 2. 未命中：抢互斥锁，防缓存击穿
        String lockKey = LOCK_PREFIX + id;
        String lockValue = UUID.randomUUID().toString();
        int maxRetry = 5;   // 重试上限，防死循环

        while (maxRetry-- > 0) {
            boolean locked = stringRedisTemplate.opsForValue()
                    .setIfAbsent(lockKey, lockValue, 3, TimeUnit.SECONDS);  // SET NX EX 原子
            if (!locked) {
                // 没抢到，等持有者重建完再重试
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new BusinessException("系统繁忙，请重试");
                }
                continue;
            }

            try {
                // double-check：可能上一个线程已重建完，避免重复查库
                json = stringRedisTemplate.opsForValue().get(key);
                if (json != null) {
                    return "".equals(json) ? null : deserialize(json);
                }

                // 查数据库重建
                Goods goods = getById(id);
                if (goods == null) {
                    // 缓存穿透兜底：缓存空值，短过期
                    stringRedisTemplate.opsForValue()
                            .set(key, "", randomExpire(10, 5), TimeUnit.MINUTES);
                    return null;
                }
                // 写缓存（随机过期防雪崩）
                stringRedisTemplate.opsForValue()
                        .set(key, serialize(goods), randomExpire(30, 10), TimeUnit.MINUTES);
                return goods;
            } finally {
                unlockWithLua(lockKey, lockValue);   // 校验归属后释放锁
            }
        }

        // 3. 重试耗尽：兜底直接查库一次，保证有数据返回
        Goods goods = getById(id);
        if (goods != null) {
            stringRedisTemplate.opsForValue()
                    .set(key, serialize(goods), randomExpire(30, 10), TimeUnit.MINUTES);
        }
        return goods;
    }

    @Override
    public void addGoods(Goods goods) {
        save(goods);   // 新增不写缓存，等查询时再回填
    }

    @Override
    public void updateGoods(Goods goods) {
        updateById(goods);
        stringRedisTemplate.delete(CACHE_PREFIX + goods.getId());  // 删缓存，保证一致性
    }

    @Override
    public void deleteGoods(Long id) {
        removeById(id);
        stringRedisTemplate.delete(CACHE_PREFIX + id);  // 删缓存
    }

    // 商品列表（可选，简单分页这里省略，只返回全部）
    public List<Goods> listGoods() {
        return list(new LambdaQueryWrapper<>());
    }

    // ---------- 工具方法 ----------

    // 过期时间 = 基础时间 + 随机，错开集中过期（防雪崩）
    private long randomExpire(long base, long range) {
        return base + ThreadLocalRandom.current().nextLong(range);
    }

    // 用 Lua 保证「比对 + 删除」原子，防止误删别人的锁
    private void unlockWithLua(String lockKey, String lockValue) {
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
        stringRedisTemplate.execute(
                new DefaultRedisScript<>(script, Long.class),
                Collections.singletonList(lockKey),
                lockValue
        );
    }

    private String serialize(Goods goods) {
        try {
            return objectMapper.writeValueAsString(goods);
        } catch (Exception e) {
            throw new BusinessException("序列化失败");
        }
    }

    private Goods deserialize(String json) {
        try {
            return objectMapper.readValue(json, Goods.class);
        } catch (Exception e) {
            throw new BusinessException("反序列化失败");
        }
    }
}
```

> 这段代码对应你之前学的：**穿透 → 缓存空值；击穿 → 互斥锁 + double-check + UUID/Lua；雪崩 → 随机过期时间**。`listGoods` 方法在下面 Controller 里用。

### 3. `controller/GoodsController.java`

```java
package com.example.demo.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.annotation.SaCheckRole;
import com.example.demo.common.Result;
import com.example.demo.entity.Goods;
import com.example.demo.service.GoodsService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/goods")
@SaCheckLogin   // 类级别：所有接口都要登录
public class GoodsController {

    private final GoodsService goodsService;

    public GoodsController(GoodsService goodsService) {
        this.goodsService = goodsService;
    }

    // 查询单个（带缓存）——普通用户也能访问
    @GetMapping("/{id}")
    public Result<Goods> getById(@PathVariable Long id) {
        return Result.success(goodsService.getGoodsById(id));
    }

    // 查询列表
    @GetMapping("/list")
    public Result<List<Goods>> list() {
        return Result.success(goodsService.list());
    }

    // 新增——只有 admin 能操作
    @PostMapping
    @SaCheckRole("admin")
    public Result<Void> add(@RequestBody Goods goods) {
        goodsService.addGoods(goods);
        return Result.success();
    }

    // 更新
    @PutMapping
    @SaCheckRole("admin")
    public Result<Void> update(@RequestBody Goods goods) {
        goodsService.updateGoods(goods);
        return Result.success();
    }

    // 删除
    @DeleteMapping("/{id}")
    @SaCheckRole("admin")
    public Result<Void> delete(@PathVariable Long id) {
        goodsService.deleteGoods(id);
        return Result.success();
    }
}
```

---

## 阶段十：接口测试

用 **Apifox / Postman** 按顺序测：

1. `POST /user/register` —— 注册一个账号
   ```json
   { "username": "tom", "password": "123456" }
   ```
2. `POST /user/login` —— 登录，返回 token，记下来
3. `GET /user/info` —— 带上 header `satoken: 你的token` → 返回用户信息
4. 不带 token 调 `GET /goods/1` → 返回 401「未登录」
5. 用普通用户 token 调 `POST /goods`（需要 admin）→ 返回 403「无角色」
6. 手动把数据库里该用户 `role` 改成 `admin`，重新登录，再调 `POST /goods` → 成功

> 要用管理员：注册后去数据库把 `t_user` 里对应行的 `role` 改成 `admin` 即可（本项目未做权限分配界面）。

---

## 验收标准（做完对照）

- [ ] 项目能启动，不报错
- [ ] `/user/register`、`/user/login` 正常工作
- [ ] 登录后能带 token 访问受保护接口，未登录返回 401
- [ ] `@SaCheckRole("admin")` 权限生效，普通用户返回 403
- [ ] Redis 里能看到 `satoken:*`（登录态）和 `cache:goods:*`（商品缓存）
- [ ] 把 `token-style` 改成 `jwt` 后能跑通，token 变成三段式
- [ ] 能说清每个包/文件是干嘛的

## 常见坑（先预防）

| 坑 | 原因 / 解法 |
| --- | --- |
| Mapper 注入失败 | 忘了 `@MapperScan` 或 `@Mapper` |
| 查出来字段是 null | `map-underscore-to-camel-case` 没开，或表名列名不一致 |
| 登录接口也被拦 401 | `excludePathPatterns` 没放行 `/user/login` |
| token 一直校验不过 | 前端传的 header 名要和 `token-name` 一致 |
| 密码登录永远失败 | 用了明文 `==`，应该用 `passwordEncoder.matches` |
| Redis 连不上 | 密码写错 / 没启动 / 配置不对 |
| LocalDateTime 序列化报错 | 确认注入的是 Spring 自动配置的 `ObjectMapper`（自带 JS310） |
| Lombok 不生效 | IDEA 没装 Lombok 插件 / 没开注解处理 |
| SB4 启动报错 | MyBatis-Plus / Sa-Token 的 starter 兼容问题，退回 SB3.x |