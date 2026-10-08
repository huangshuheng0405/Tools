# Spring Data Redis

Spring 官方提供的 Redis 操作框架，让你不用手写 Redis 命令，直接用 Java 代码操作 Redis。

前置知识[redis](../../../database/redis.md)

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

| 数据结构 | 操作方法        |
| -------- | --------------- |
| String   | `opsForValue()` |
| Hash     | `opsForHash()`  |
| List     | `opsForList()`  |
| Set      | `opsForSet()`   |
| ZSet     | `opsForZSet()`  |

## 序列化

redis存的都是二进制字节。存对象时，必须把对象转为字节（**序列化**）；取的时候把字节转为对象（反序列化）

两种常见的序列化：

- JDK序列化（`RedisTemplate`默认）：key会带`\xAC\xED\x00\x05`之类的乱码前缀，不可读，而且对象必须实现`Serializable`。一般不推荐
- JSON序列化：存为可读的JSON字符串，主流方案

SpringBoot引入了`spring-boot-starter-web`，已经自动带上了Jackson（一个JSON工具类），容器里直接有一个配置好的`ObjectMapper`可用

```java
    private final ObjectMapper objectMapper;

    // 存对象：对象 -> json 字符串 -> 存入 redis
    @Test
    public void save() throws JsonProcessingException {
        User user = new User(1L, "hsh", 18);
        String json = objectMapper.writeValueAsString(user);
        stringRedisTemplate.opsForValue().set("user:1", json); // {"id":1,"name":"hsh","age":18}
        System.out.println(json);
    }

    // 取对象：从 Redis 取出 json -> 转回对象
    @Test
    void getObject() {
        String json = stringRedisTemplate.opsForValue().get("user:1");
        try {
            User user = objectMapper.readValue(json, User.class);
            System.out.println(user); // User(id=1, name=hsh, age=18)
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
```



### StringRedisTemplate 和 RedisTemplate

`StringRedisTemplate` 是**专门处理 String** 的 `RedisTemplate`，key 和 value 都是字符串

|            | StringRedisTemplate   | RedisTemplate          |
| ---------- | --------------------- | ---------------------- |
| 类型       | `StringRedisTemplate` | `RedisTemplate<K, V>`  |
| Key        | String                | 可以配置               |
| Value      | String                | 各种 Java 类型         |
| 默认序列化 | String                | JDK 序列化，取决于配置 |
| 适合       | 字符串、Hash 字段     | Java 对象、复杂数据    |
| JSON 对象  | 不直接支持            | 可以配置 JSON          |

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
redisTemplate.opsForValue().set("name", "123", Duration.ofSeconds(10)); // 设置过期时间 10s

// 自增，常用于计数
Long count = redisTemplate.opsForValue().increment("view:1");
```

### Hash

```java
    @Test
    public void putAll() {
        Map<String, String> map = new HashMap<>();
        map.put("name", "hsh");
        map.put("age", "18");
        map.put("city", "chengdu");
        stringRedisTemplate.opsForHash().putAll("user:001", map); // 一次存多个字段

        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries("user:001"); // 取全部字段
        entries.forEach((k, v) -> {
            System.out.println(k + " = "  + v);
        });
    }

    @Test
    public void hssKeyAndDelete() {
        stringRedisTemplate.opsForHash().put("user:2", "name", "hsh");
        System.out.println(stringRedisTemplate.opsForHash().hasKey("user:2", "name")); // true
        stringRedisTemplate.opsForHash().delete("user:2", "name");
        System.out.println(stringRedisTemplate.opsForHash().hasKey("user:2", "name")); // false
    }
```

### List

底层是双向链表，适合做队列、消息列表

```java
    @Test
    public void push() {
        stringRedisTemplate.opsForList().rightPush("list:todo", "task");
        stringRedisTemplate.opsForList().rightPush("list:todo", "task2");
        stringRedisTemplate.opsForList().leftPush("list:todo", "task3");

        // 0 到 -1 表示取全部
        List<String> list = stringRedisTemplate.opsForList().range("list:todo", 0, -1);
        System.out.println(list); // [task3, task, task2]
    }

    @Test
    public void pop() {
        stringRedisTemplate.opsForList().rightPush("list:queue", "a");
        stringRedisTemplate.opsForList().rightPush("list:queue", "b");

        // 从左边弹出 先进先出
        String s = stringRedisTemplate.opsForList().leftPop("list:queue");
        System.out.println(s); // a
    }

    // 长度 + 取单个
    @Test
    public void sizeAndIndex() {
        stringRedisTemplate.opsForList().rightPush("list:num", "10");
        stringRedisTemplate.opsForList().rightPush("list:num", "20");
        stringRedisTemplate.opsForList().rightPush("list:num", "30");

        System.out.println(stringRedisTemplate.opsForList().size("list:num")); // 3
        System.out.println(stringRedisTemplate.opsForList().index("list:num", 0)); // 10
    }
```

### Set

**无序且元素唯一**，最大特点是支持交集/并集/差集，适合去重、标签、共同好友

```java
    // 添加 + 取全部 自动去重
    @Test
    public void addAndMembers() {
        stringRedisTemplate.opsForSet().add("set:tags", "java", "redis", "java");
        Set<String> members = stringRedisTemplate.opsForSet().members("set:tags");
        System.out.println(members);
    }

    // 判断是否存在 + 删除 + 数量
    @Test
    public void isMemberAndDeleteAndSize() {
        stringRedisTemplate.opsForSet().add("set:tags", "java", "redis", "java");
        System.out.println(stringRedisTemplate.opsForSet().isMember("set:tags", "java")); // true
        stringRedisTemplate.opsForSet().remove("set:tags", "java");
        System.out.println(stringRedisTemplate.opsForSet().size("set:tags")); // 1
    }

    // 交集/并集/差集
    @Test
    public void intersectAndUnionAndDifference() {
        stringRedisTemplate.opsForSet().add("set:tags1", "java", "redis", "spring");
        stringRedisTemplate.opsForSet().add("set:tags2", "java", "python", "go");

        Set<String> intersect = stringRedisTemplate.opsForSet().intersect("set:tags1", "set:tags2");
        System.out.println(intersect); // [java]

        Set<String> union = stringRedisTemplate.opsForSet().union("set:tags1", "set:tags2");
        System.out.println(union); // [java, redis, spring, python, go]

        // 差集 tag1 有的 tag2 没有的
        Set<String> difference = stringRedisTemplate.opsForSet().difference("set:tags1", "set:tags2");
        System.out.println(difference); // [redis, spring]
    }
```

### ZSet

有序且不重复的集合，每个元素带一个**分数（score）**，按分数排序，专为排行榜设计

```java
    // 添加成员带分数 + 按分数升序取
    @Test
    public void addAndRange() {
        stringRedisTemplate.opsForZSet().add("zset:score", "hsh", 90);
        stringRedisTemplate.opsForZSet().add("zset:score", "hsh2", 85);
        stringRedisTemplate.opsForZSet().add("zset:score", "hsh3", 70);

        Set<String> range = stringRedisTemplate.opsForZSet().range("zset:score", 0, -1);
        System.out.println(range); // [hsh3, hsh2, hsh]
    }

    // 降序 （排行榜 分数高的在前面）
    @Test
    public void reverseRang() {
        stringRedisTemplate.opsForZSet().add("zset:rank", "小明", 90);
        stringRedisTemplate.opsForZSet().add("zset:rank", "小红", 85);
        stringRedisTemplate.opsForZSet().add("zset:rank", "小张", 80);

        Set<String> reversed = stringRedisTemplate.opsForZSet().reverseRange("zset:rank", 0, -1);
        System.out.println(reversed); // [小明, 小红, 小张]
    }

    // 加分 + 查分数 查名次
    @Test
    public void scoreAndRank() {
        stringRedisTemplate.opsForZSet().add("zset:rank", "小明", 90);
        stringRedisTemplate.opsForZSet().add("zset:rank", "小红", 88);

        // 给小红加 20 分
        stringRedisTemplate.opsForZSet().incrementScore("zset:rank", "小红", 20);

        Double score = stringRedisTemplate.opsForZSet().score("zset:rank", "小红");
        Long reversedRank = stringRedisTemplate.opsForZSet().reverseRank("zset:rank", "小红");

        System.out.println(score); // 108.0 // 分数
        System.out.println(reversedRank); // 0 名次
    }
```

> `reverseRank`返回的是从0开始的名次

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
