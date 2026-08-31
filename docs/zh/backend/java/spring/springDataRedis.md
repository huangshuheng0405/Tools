# Spring Data Redis

Spring 官方提供的 Redis 操作框架，让你不用手写 Redis 命令，直接用 Java 代码操作 Redis。

## 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## 配置

`application.yml`

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password:
      database: 0
```

## RedisTemplate

Spring Data Redis 最核心的类，通过它操作 Redis 各种数据结构。

因为 Redis 不止有一种数据结构，所以 `RedisTemplate` 提供了多个 `opsForXxx()` 分别对应

| 数据结构 | 操作方法 |
| --- | --- |
| String | `opsForValue()` |
| Hash | `opsForHash()` |
| List | `opsForList()` |
| Set | `opsForSet()` |
| ZSet | `opsForZSet()` |

## 序列化

```java
redisTemplate.opsForValue().set("user", new User(...));
```

Java 对象不能直接原样放进 Redis，需要先进行序列化

```
Java对象
 ↓
ObjectMapper
 ↓
JSON String
 ↓
Redis
```

### StringRedisTemplate 和 RedisTemplate

`StringRedisTemplate` 是**专门处理 String** 的 `RedisTemplate`，key 和 value 都是字符串

| | StringRedisTemplate | RedisTemplate |
| --- | --- | --- |
| 类型 | `StringRedisTemplate` | `RedisTemplate<K, V>` |
| Key | String | 可以配置 |
| Value | String | 各种 Java 类型 |
| 默认序列化 | String | JDK 序列化，取决于配置 |
| 适合 | 字符串、Hash 字段 | Java 对象、复杂数据 |
| JSON 对象 | 不直接支持 | 可以配置 JSON |

实际开发中存对象有两种思路

- 用 `StringRedisTemplate` + `ObjectMapper` 手动转 JSON（下面封装示例用的就是这种）
- 用 `RedisTemplate` + JSON 序列化器（配置好后自动序列化）

### 配置 JSON 序列化器

`RedisTemplate` 默认用 JDK 序列化，存进去的 key 会带前缀、不可读，一般要手动配置成 String key + JSON value

Spring Boot 4（Spring Data Redis 4.x）使用 Jackson 3，序列化器是 `GenericJacksonJsonRedisSerializer`

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // key 用 String 序列化，方便阅读
        StringRedisSerializer keySerializer = new StringRedisSerializer();
        template.setKeySerializer(keySerializer);
        template.setHashKeySerializer(keySerializer);

        // value 用 JSON 序列化（Jackson 3）
        GenericJacksonJsonRedisSerializer valueSerializer = new GenericJacksonJsonRedisSerializer();
        template.setValueSerializer(valueSerializer);
        template.setHashValueSerializer(valueSerializer);

        return template;
    }
}
```

> Spring Boot 3（Spring Data Redis 3.x）用的是 Jackson 2，序列化器是 `GenericJackson2JsonRedisSerializer`，其余配置方式一样

## 各数据结构操作

### String

```java
redisTemplate.opsForValue().set("name", "张三");           // 存
Object name = redisTemplate.opsForValue().get("name");     // 取
redisTemplate.delete("name");                              // 删
Boolean exists = redisTemplate.hasKey("name");             // 判断存在

// 自增，常用于计数
Long count = redisTemplate.opsForValue().increment("view:1");
```

### Hash

存一个字段时不需要 `Map`

```java
stringRedisTemplate.opsForHash().put("login:token:" + token, "id", "1");
```

一次存多个字段用 `putAll`，要求传 `Map`

```java
Map<String, Object> userMap = BeanUtil.beanToMap(userDTO);
stringRedisTemplate.opsForHash().putAll("login:token:" + token, userMap);

// 读取
Object value = stringRedisTemplate.opsForHash().get("login:token:" + token, "id");
```

### List

底层是双向链表，适合做队列、消息列表

```java
redisTemplate.opsForList().leftPush("msg", "消息1");       // 头插
redisTemplate.opsForList().rightPush("msg", "消息2");      // 尾插
List<Object> list = redisTemplate.opsForList().range("msg", 0, -1); // 取全部
```

### Set

无序且元素唯一，适合标签、共同好友

```java
redisTemplate.opsForSet().add("tags", "java", "redis", "spring");
Boolean has = redisTemplate.opsForSet().isMember("tags", "redis");
redisTemplate.opsForSet().remove("tags", "spring");
```

### ZSet

成员 + 分数，适合排行榜

```java
redisTemplate.opsForZSet().add("rank", "张三", 100);
redisTemplate.opsForZSet().add("rank", "李四", 90);

// 升序取前 10，降序用 reverseRange
Set<Object> top10 = redisTemplate.opsForZSet().reverseRange("rank", 0, 9);
```

## 过期时间

```java
// 存的时候就带过期时间
redisTemplate.opsForValue().set("code:13800138000", "123456", 5, TimeUnit.MINUTES);

// 给已有的 key 设置过期时间
redisTemplate.expire("name", 10, TimeUnit.MINUTES);

// 获取剩余过期时间（秒）
Long ttl = redisTemplate.getExpire("name");
```

## 封装示例

在 `service/RedisService` 里封装，用 `StringRedisTemplate` + `ObjectMapper` 手动转 JSON

```java
package com.example.demo.service;

import jakarta.annotation.Resource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private ObjectMapper objectMapper;

    /**
     * 保存字符串
     */
    public void set(String key, String value) {
        stringRedisTemplate.opsForValue().set(key, value);
    }

    /**
     * 保存字符串 并设置过期时间
     */
    public void set(String key, String value, Long timeout, TimeUnit unit) {
        stringRedisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    /**
     * 保存对象（序列化为 JSON）
     */
    public void set(String key, Object value) {
        try {
            String json = objectMapper.writeValueAsString(value);
            stringRedisTemplate.opsForValue().set(key, json);
        } catch (Exception e) {
            throw new RuntimeException("Redis 序列化失败", e);
        }
    }

    /**
     * 保存对象 并设置过期时间
     */
    public void set(String key, Object value, Long timeout, TimeUnit unit) {
        try {
            String json = objectMapper.writeValueAsString(value);
            stringRedisTemplate.opsForValue().set(key, json, timeout, unit);
        } catch (Exception e) {
            throw new RuntimeException("Redis 序列化失败", e);
        }
    }

    /**
     * 获取字符串
     */
    public String get(String key) {
        return stringRedisTemplate.opsForValue().get(key);
    }

    /**
     * 获取对象（反序列化）
     */
    public <T> T get(String key, Class<T> clazz) {
        try {
            String json = stringRedisTemplate.opsForValue().get(key);
            if (json == null) {
                return null;
            }
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Redis 反序列化失败", e);
        }
    }

    /**
     * 删除
     */
    public Boolean delete(String key) {
        return stringRedisTemplate.delete(key);
    }

    /**
     * 判断键是否存在
     */
    public Boolean hasKey(String key) {
        return stringRedisTemplate.hasKey(key);
    }

    /**
     * 设置过期时间
     */
    public Boolean expire(String key, Long timeout, TimeUnit unit) {
        return stringRedisTemplate.expire(key, timeout, unit);
    }

    /**
     * 获取剩余过期时间
     */
    public Long getExpire(String key, TimeUnit unit) {
        return stringRedisTemplate.getExpire(key, unit);
    }
}
```

> 注意：这里用的是 `tools.jackson.databind.ObjectMapper`（Jackson 3），对应 Spring Boot 4。如果你用的是 Spring Boot 3，包名是 `com.fasterxml.jackson.databind.ObjectMapper`
