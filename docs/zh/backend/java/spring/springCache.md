# Spring Cache

## 开启缓存

给启动类加一个注解

```java
@SpringBootApplication
@EnableCaching   // 新增这一行
public class RedisDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(RedisDemoApplication.class, args);
    }
}
```

## 配置类

新建`RedisConfig.java`（`config`包），配置缓存用JSON + 过期时间

```java
package com.demo.redisdemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                // key 用字符串，避免乱码
                .serializeKeysWith(SerializationPair.fromSerializer(new StringRedisSerializer()))
                // value 用 JSON
                .serializeValuesWith(SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                // 默认过期 10 分钟
                .entryTtl(Duration.ofMinutes(10));

        return RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
    }
}
```



用注解很方便地给方法加缓存

最常见地实现是**Redis**

最核心地几个注解

| 注解           | 作用                           |
| -------------- | ------------------------------ |
| `@Cacheable`   | 查询时先存缓存，没有才执行方法 |
| `@CachePut`    | 执行方法，并把返回值更新到缓存 |
| `@CacheEvict`  | 删除缓存                       |
| `@Caching`     | 组合多个缓存操作               |
| `@CacheConfig` | 统一配置缓存名称               |

## 新增

给业务方法加注解

```java
package com.demo.redisdemo.service;

import com.demo.redisdemo.entity.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    // value = 缓存名；key = 用什么做缓存 key，这里用参数 id
    @Cacheable(value = "user", key = "#id")
    public User getUserById(Long id) {
        System.out.println("没有命中缓存，正在查数据库，id = " + id);
        // 模拟从数据库查询
        return new User(id, "用户" + id, 20);
    }
}
```

测试

```java
package com.demo.redisdemo;

import com.demo.redisdemo.entity.User;
import com.demo.redisdemo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SpringCacheTest {

    @Autowired
    private UserService userService;

    @Test
    void cacheableTest() {
        // 第一次：没缓存，会打印"查数据库"
        User u1 = userService.getUserById(1L);
        System.out.println("第一次 = " + u1);

        // 第二次：命中缓存，不会再打印"查数据库"
        User u2 = userService.getUserById(1L);
        System.out.println("第二次 = " + u2);
    }
}
```

- `@EnableCaching`是总开关，不写注解不生效
- `key = #id`是SpEL表达式，`#id`指方法的参数名
- 缓存key在redis里实际存的是`user::1`（缓存名 + `::` + key）

## 更新 + 删除

新增两个方法

```java
package com.demo.redisdemo.service;

import com.demo.redisdemo.entity.User;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Cacheable(value = "user", key = "#id")
    public User getUserById(Long id) {
        System.out.println("没有命中缓存，正在查数据库，id = " + id);
        return new User(id, "用户" + id, 20);
    }

    // 每次都执行，并把返回值写回缓存（key 要和查询的 key 对齐）
    @CachePut(value = "user", key = "#user.id")
    public User updateUser(User user) {
        System.out.println("更新数据库，id = " + user.getId());
        // 模拟更新数据库后返回最新数据
        return user;
    }

    // 删除指定 key 的缓存
    @CacheEvict(value = "user", key = "#id")
    public void deleteUser(Long id) {
        System.out.println("删除数据库，id = " + id);
    }
}
```

测试

```java
    // 测试 @CachePut：更新后缓存也跟着变
    @Test
    void updateTest() {
        User u1 = userService.getUserById(1L);
        System.out.println("第一次 = " + u1);

        userService.updateUser(new User(1L, "新名字", 30));

        // 再查：命中缓存，拿到的是更新后的"新名字"
        User u2 = userService.getUserById(1L);
        System.out.println("更新后 = " + u2);
    }

    // 测试 @CacheEvict：删除后缓存失效，下次重新查库
    @Test
    void evictTest() {
        userService.getUserById(2L);
        userService.deleteUser(2L);

        // 再查：缓存被删了，会重新打印"查数据库"
        userService.getUserById(2L);
    }
```

- `@CachePut`的`key`必须和`@Cacheable`的`key`一致，才能更新到同一条缓存，这里一个是`#id`，一个是`#user.id`，最终都是`1`
- `@CacheEvict`默认在方法执行后删除缓存，也可以`beforeInvocation = true`改为执行前删除
- `@CacheEvict(allEntries = true)`可以一次清空整个缓存名
