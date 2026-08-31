# Spring Data Redis

Spring官方提供的Redis操作框架

在Spring Boot项目引入

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

在`application.yml`里面配置

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password:
```

## RedisTemplate

Spring Data Redis最重要的类

因为Redis不知有一种数据结构

```
String
Hash
List
Set
ZSet
```

对应的

```java
opsForValue()
opsForHash()
opsForList()
opsForSet()
opsForZSet()
```

## 序列化

```java
redisTemplate.opsForValue()
        .set("user", new User(...));
```

Java对象不能直接原样放进Redis，需要先进行序列化

```
Java对象
 ↓
ObjectMapper
 ↓
JSON String
 ↓
Redis
```

### StringRedisTemplate和RedisTemplate

`StringRedisTemplate`是**专门处理String**的`RedisTemplate`

RedisTemplate可以处理`java`对象

```java
RedisTemplate<String, Object> redisTemplate
    
User user = new User();
user.setId(1L);
user.setName("张三");

redisTemplate.opsForValue().set("user", user);
```

|            | StringRedisTemplate   | RedisTemplate         |
| ---------- | --------------------- | --------------------- |
| 类型       | `StringRedisTemplate` | `RedisTemplate<K, V>` |
| Key        | String                | 可以配置              |
| Value      | String                | 各种Java类型          |
| 默认序列化 | String                | JDK序列化，取决于配置 |
| 适合       | 字符串、Hash字段      | Java对象、复杂数据    |
| JSON对象   | 不直接支持            | 可以配置JSON          |

在`service/RedisService`创建

```java
package com.example.demo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.RedisTemplate;
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
     *
     * @param key
     * @param value
     * @param timeout
     * @param unit
     */
    public void set(String key, String value, Long timeout, TimeUnit unit) {
        stringRedisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    /**
     * 保存对象
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
     * 获取对象
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
     * @param key
     */
    public Boolean delete(String key) {
       return stringRedisTemplate.delete(key);
    }

    /**
     * 判断键是否存在
     * @param key
     * @return
     */
    public Boolean hasKey(String key) {
        return stringRedisTemplate.hasKey(key);
    }

    /**
     * 设置过期时间
     * @param key
     * @param timeout
     * @param unit
     * @return
     */
    public Boolean expire(String key, Long timeout, TimeUnit unit) {
        return stringRedisTemplate.expire(key, timeout, unit);
    }

    /**
     * 获取剩余过期时间
     * @param key
     * @return
     */
    public Long getExpire(String key, TimeUnit unit) {
        return stringRedisTemplate.getExpire(key, unit);
    }
}
```

## Hash

在只存一个字段时，不需要`Map`

```java
stringRedisTemplate.opsForHash()
        .put("login:token:" + token, "id", "1");
```

如果想一次存多个字段，用`putAll`要求传`Map`

```java
Map<String, Object> userMap = BeanUtil.beanToMap(userDTO);

stringRedisTemplate.opsForHash()
        .putAll("login:token:" + token, userMap);
```

