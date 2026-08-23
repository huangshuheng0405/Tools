# Redis

<svg width="180px"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#FF4438" d="M490.6 250.3c5.7-10 15-20.9 18.4-24.3 15.5 6.5 30 19.7 27.9 23-6 9.9-15 21-18.4 24.4-15.5-6.5-30-19.4-27.9-23M600 294.8a35 35 0 0 1-17.3 20.2c-4-8.3-8.3-13.2-12.4-13.2-5.2 0-5.5 3.6-5.5 8.3 0 8.3 6 26.4 6 45.2 0 20.7-14.5 36-36.7 36-20.4 0-31.7-13.4-36.7-34.7-13.3 23.9-32.7 34.7-47.7 34.7-23.3 0-28.8-17.2-28.2-34.7-9.4 16.5-27.4 34.7-44.7 34.7-17.6 0-23.9-15.4-22.4-33.3-10.6 19.7-29.8 33.3-48.2 33.3-20 0-30-15.9-26.7-35.6-13.5 16.5-38.5 35.6-64.6 35.6-29.7 0-42.6-16-44.2-36.1-14.3 23-33.6 36.9-56.6 36.9-33.3 0-45.2-29.6-46.9-53.8A783 783 0 0 1 24.1 391q-2.7 2.8-5.2 2.9c-6 0-18.1-26.4-18.9-36.2C6.9 347 63.2 286.2 86.7 260 71 264.8 54.5 274.3 34 289c-3.6 2.6-13.7-21-13.5-39 23.8-17.6 60-28.7 89.3-28.7 40.8 0 64.4 22.7 64.4 54.3C174 302 152 331 120 332a34 34 0 0 1-32.8-20.5c.6 17.9 10 39.9 34.9 39.9 29 0 41.9-18.7 63.6-45.8 16.5-20.4 35.7-38.5 63.6-38.5 17 0 28.7 10.6 28.7 26.6 0 19.4-22.7 46.3-54.6 46.3q-8.2 0-14.5-2.1l-.2 2.3c0 9.1 3.4 14.5 18.1 14.5 21.7 0 42.2-12.9 67-43.2 24.3-29.7 42.7-42.6 62-42.6 13.2 0 23 7 27.5 19 26-37.5 48-64.1 66.7-81.9 18.4 7.8 31.6 23 28 26.1-13.8 12.5-59.6 62.4-77.7 92.1-4.6 7.8-9 16.3-9 20.4s2.3 5.2 5 5.2c17 0 57.6-55.3 80.6-79.6 14.5 6 29.2 18.6 25.6 23-19.1 22.7-33.6 41.4-33.6 52 0 2.8 1 4.6 4.9 4.6 7.2 0 14-6.5 25-20.2 2.4-2.8 5.3-2.8 7 1.6 5 11.9 12.2 18.4 18 18.4 6.6 0 10-6 10-15 0-11-2.3-24.9-2.3-31 0-21 15.5-33.2 34.9-33.2 14.5 0 27.4 7 33.6 24.3M122 257l-25.1 38.7c4.5 2.5 10 4.5 17.4 4.5 13.7 0 28.7-7.5 28.7-22.8 0-9.3-5.7-17.8-21-20.4m90.8 69.5q4.2 1.6 9.4 1.6c18.3 0 30.7-14 30.7-23.3 0-4.1-2.6-7-6.7-7-10.4 0-26 14.6-33.4 28.7m154-19.4c0-5.1-3-8.2-7.6-8.2-15.2 0-38.3 29-38.3 43.4 0 4.7 2.6 7.8 8 7.8 16.9 0 37.8-30.5 37.8-43"/></svg>

## with Docker

先拉取镜像

```bash
docker pull redis
```

用命令启动

```bash
docker run -d --name my-redis -p 6379:6379 redis --requirepass mypassword
```

## 数据类型

Redis是一个键值对（key-value）数据库，它的value支持多种结构

### string

最基础的类型，一个key对应一个value（可以是文本、数字、甚至是图片的二进制数据）

命令

- SET key value：设置key的值
- GET key：获取key的值
- DEL key：删除key
- EXISTS key：判断key是否存在

### hash

哈希表，一个key对应多个field-value对，适合存储对象的多个属性，可以单独修改某个字段不影响其他字段

命令

- HSET key field value：设置哈希表字段的值
- HGET key field：获取哈希表字段的值
- HDEL key field：删除哈希表字段
- HGETALL key：返回哈希表中的所有字段值对

### list

一个有序的字符串列表，底层是双向链表，支持头插、尾插和弹出元素

命令

- LPUSH key value：头插元素到列表中
- RPUSH key value：尾插元素到列表中
- LPOP key：弹出列表头元素并返回
- RPOP key：弹出列表尾元素并返回
- LANGE key start end：返回列表中指定范围的元素
- LREM key count value：删除列表中指定值的元素
- LSET key index value：设置列表中指定索引的元素

### set

一个无序且元素唯一的字符串集合。支持数学上的交集、并集、差集运算

命令

- SADD key value：添加元素到集合中
- SREM key value：删除集合中的元素
- SMEMBERS key：返回集合中的所有元素
- SCARD key：返回集合中元素的数量
- SINTER key1 key2 ...：返回多个集合的交集
- SUNION key1 key2 ...：返回多个集合的并集
- SDIFF key1 key2 ...：返回多个集合的差集

### sorted set

一个有序的字符串集合，每个元素都有一个关联的分数。支持按分数排序和范围查询

命令

- ZADD key score member：添加元素到有序集合中
- ZREM key member：删除有序集合中的元素
- ZRANGE key start end：返回有序集合中指定范围的元素
- ZRANGEBYSCORE key min max：返回有序集合中指定分数范围的元素
- ZCARD key：返回有序集合中元素的数量

## 通用命令

- DEL key：删除key
- EXISTS key：判断key是否存在
- TYPE key：返回key的类型
-

## with SpringBoot

#### 添加依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

#### 配置

```xml [application.yml]
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: 123456
      database: 0
```

```java [config/RedisConfig.java]
package com.sky.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@Slf4j
public class RedisConfig {

    @Bean
    public RedisTemplate redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        log.info("初始化RedisTemplate");
        RedisTemplate redisTemplate = new RedisTemplate();
        // 设置redis的连接工厂对象
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        // 设置redis的key序列化器
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}

```

然后就可以注入使用了

## String

```java
redisTemplate.opsForValue().set("name", "张三"); //存储
Object name = redisTemplate.opsForValue().get("name"); // 读取
String name = (String) redisTemplate.opsForValue().get("name"); // 可以直接转换
redisTemplate.delete("name"); // 删除
Boolean exists = redisTemplate.hasKey("name"); // 判断
```

设置过期时间

```java
redisTemplate.opsForValue().set(
        "code:13800138000",
        "123456",
        5,
        TimeUnit.MINUTES
);
```

5分钟后自动删除

## Hash

比如用户：

```
user:1
    username -> zhangsan
    age      -> 20
    phone    -> 138xxxx
```

```java
redisTemplate.opsForHash().put("user:1", "username", "zhangsan");

redisTemplate.opsForHash().put("user:1", "age", 20);

redisTemplate.opsForHash().put("user:1", "phone", "13800138000");
```

```java
Object username = redisTemplate
        .opsForHash()
        .get("user:1", "username"); // 读取
redisTemplate.opsForHash().delete("user:1", "age"); // 删除
```

## List

类似Java的`List`

```java
redisTemplate.opsForList().leftPush("users", "张三"); // 左边添加
redisTemplate.opsForList().rightPush("users", "李四"); // 右边添加
List<Object> users = redisTemplate
        .opsForList()
        .range("users", 0, -1); // 读取
```

## Set

不允许重复

```java
redisTemplate.opsForSet().add(
        "roles",
        "admin",
        "user",
        "vip"
); // 添加
Boolean member = redisTemplate
        .opsForSet()
        .isMember("roles", "admin"); // 判断
redisTemplate.opsForSet().remove("roles", "vip"); // 删除
```

## ZSet

成员+分数，非常适合做排行榜

```java
redisTemplate.opsForZSet()
        .add("rank", "张三", 100); // 添加
```
