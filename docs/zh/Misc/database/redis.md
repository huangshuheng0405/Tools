# Redis

<svg width="180px"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#FF4438" d="M490.6 250.3c5.7-10 15-20.9 18.4-24.3 15.5 6.5 30 19.7 27.9 23-6 9.9-15 21-18.4 24.4-15.5-6.5-30-19.4-27.9-23M600 294.8a35 35 0 0 1-17.3 20.2c-4-8.3-8.3-13.2-12.4-13.2-5.2 0-5.5 3.6-5.5 8.3 0 8.3 6 26.4 6 45.2 0 20.7-14.5 36-36.7 36-20.4 0-31.7-13.4-36.7-34.7-13.3 23.9-32.7 34.7-47.7 34.7-23.3 0-28.8-17.2-28.2-34.7-9.4 16.5-27.4 34.7-44.7 34.7-17.6 0-23.9-15.4-22.4-33.3-10.6 19.7-29.8 33.3-48.2 33.3-20 0-30-15.9-26.7-35.6-13.5 16.5-38.5 35.6-64.6 35.6-29.7 0-42.6-16-44.2-36.1-14.3 23-33.6 36.9-56.6 36.9-33.3 0-45.2-29.6-46.9-53.8A783 783 0 0 1 24.1 391q-2.7 2.8-5.2 2.9c-6 0-18.1-26.4-18.9-36.2C6.9 347 63.2 286.2 86.7 260 71 264.8 54.5 274.3 34 289c-3.6 2.6-13.7-21-13.5-39 23.8-17.6 60-28.7 89.3-28.7 40.8 0 64.4 22.7 64.4 54.3C174 302 152 331 120 332a34 34 0 0 1-32.8-20.5c.6 17.9 10 39.9 34.9 39.9 29 0 41.9-18.7 63.6-45.8 16.5-20.4 35.7-38.5 63.6-38.5 17 0 28.7 10.6 28.7 26.6 0 19.4-22.7 46.3-54.6 46.3q-8.2 0-14.5-2.1l-.2 2.3c0 9.1 3.4 14.5 18.1 14.5 21.7 0 42.2-12.9 67-43.2 24.3-29.7 42.7-42.6 62-42.6 13.2 0 23 7 27.5 19 26-37.5 48-64.1 66.7-81.9 18.4 7.8 31.6 23 28 26.1-13.8 12.5-59.6 62.4-77.7 92.1-4.6 7.8-9 16.3-9 20.4s2.3 5.2 5 5.2c17 0 57.6-55.3 80.6-79.6 14.5 6 29.2 18.6 25.6 23-19.1 22.7-33.6 41.4-33.6 52 0 2.8 1 4.6 4.9 4.6 7.2 0 14-6.5 25-20.2 2.4-2.8 5.3-2.8 7 1.6 5 11.9 12.2 18.4 18 18.4 6.6 0 10-6 10-15 0-11-2.3-24.9-2.3-31 0-21 15.5-33.2 34.9-33.2 14.5 0 27.4 7 33.6 24.3M122 257l-25.1 38.7c4.5 2.5 10 4.5 17.4 4.5 13.7 0 28.7-7.5 28.7-22.8 0-9.3-5.7-17.8-21-20.4m90.8 69.5q4.2 1.6 9.4 1.6c18.3 0 30.7-14 30.7-23.3 0-4.1-2.6-7-6.7-7-10.4 0-26 14.6-33.4 28.7m154-19.4c0-5.1-3-8.2-7.6-8.2-15.2 0-38.3 29-38.3 43.4 0 4.7 2.6 7.8 8 7.8 16.9 0 37.8-30.5 37.8-43"/></svg>

<img src="/Misc/redis.svg" alt="redis" width="180px">

## 数据类型

Redis是一个键值对（key-value）数据库，它的value支持多种结构

### string

最基础的类型，一个key对应一个value（可以是文本、数字、甚至是图片的二进制数据）

- SET key value：设置key的值

- GET key：获取key的值

- MSET KEY VALUE \[KEY VALUE...]：批量添加多个String类型的value

- MGET KEY \[KEY ...]：根据多个key获取多个String类型的value

- INCR KEY：让一个整型的key自增1

- INCRBYFLOAT：让一个浮点类型的数字自增并指定步长

- INCRBY KEY number：让一个整形的key增加number

- DEL key：删除key

- EXISTS key：判断key是否存在

- SETNX：添加一个String类型的键值对，如果这个key不存在才执行

- SETEX：添加一个String类型的键值对，并且指定有效期

### hash

哈希表，一个key对应多个field-value对，适合存储对象的多个属性，可以单独修改某个字段不影响其他字段

- HSET key field value：设置哈希表字段的值

- HGET key field：获取哈希表字段的值

- HDEL key field：删除哈希表字段

- HGETALL key：返回哈希表中的所有字段值对

- <br />

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

一个无序且元素唯一的字符串集合。支持数学上的交集、并集、差集等运算

命令

- SADD key value：添加元素到集合中

- SREM key value：删除集合中的元素

- SMEMBERS key：返回集合中的所有元素

- SCARD key：返回集合中元素的数量

- HISMEMBER key member：判断一个元素是否存在于set中

- SINTER key1 key2 ...：返回多个集合的交集

- SUNION key1 key2 ...：返回多个集合的并集

- SDIFF key1 key2 ...：返回多个集合的差集

### sorted set

一个有序的字符串集合，每个元素都有一个关联的分数。支持按分数排序和范围查询

- ZADD key score member：添加元素到有序集合中

- ZREM key member：删除有序集合中的元素

- ZSCORE key member：获取有序集合中指定元素的score值

- ZRANK key：获取有序集合中指定元素的排名

- ZCOUNT key min max：统计score值在范围内的元素个数

- ZRANGE key start end：返回有序集合中指定排名范围的元素

- ZRANGEBYSCORE key min max：返回有序集合中指定分数范围的元素

- ZCARD key：返回有序集合中元素的数量

> 所以排名默认是升序，降序则在命令的Z后面添加`REV`即可

## 通用命令

- DEL key：删除key

- EXISTS key：判断key是否存在

- TYPE key：返回key的类型

- <br />

## 缓存三大问题

### 缓存穿透

**概念**：查询一个**缓存和数据库中都不存在**的数据。每次请求都直接打到数据库，导致数据库压力过大，甚至被打垮

**产生原因**：恶意攻击者故意请求不存在的数据（如不存在的 id），或业务逻辑查询了不存在的记录

**解决方案**：

1. **缓存空值**：查询数据库结果为空时，也把空值写入缓存，设置一个较短的过期时间

```java
Object value = redisTemplate.opsForValue().get("user:" + id);
if (value == null) {
    // 缓存中没有，查询数据库
    User user = userMapper.selectById(id);
    if (user == null) {
        // 数据库也没有，缓存空值，过期时间设置短一些
        redisTemplate.opsForValue().set("user:" + id, "", 5, TimeUnit.MINUTES);
        return null;
    }
    // 写入缓存
    redisTemplate.opsForValue().set("user:" + id, user, 30, TimeUnit.MINUTES);
    return user;
}
```

1. **布隆过滤器**：在缓存之前加一层布隆过滤器，用一组哈希函数快速判断 key 是否存在，不存在则直接拦截

2. **参数校验**：对非法参数（如 id <= 0）直接拒绝，不做查询

### 缓存击穿

**概念**：一个**热点 key 在缓存过期的那一瞬间**，大量并发请求同时打向数据库，导致数据库压力骤增

**与穿透的区别**：穿透查的是不存在的 key，击穿查的是**存在但缓存刚好过期**的热点 key

**解决方案**：

- 互斥锁

当缓存过期时，只有一个线程去查询数据库并重建缓存，其他线程等待

```
查缓存
 ├─ 命中（有效数据）→ 直接返回
 ├─ 命中（空字符串）→ 返回 null（穿透的空值）
 └─ 未命中 → 抢互斥锁
       ├─ 抢到 → 查库 → 写缓存 → 释放锁 → 返回
       └─ 没抢到 → 睡 50ms → 重试整个流程
```

```java
// 解决缓存穿透 + 使用互斥锁解决缓存击穿（优化版：while + double-check + UUID/Lua 校验）
public Shop queryWithMutex(Long id) {
    String key = "shop:" + id;

    // 1. 第一次查缓存
    String shopJson = stringRedisTemplate.opsForValue().get(key);
    if (StrUtil.isNotBlank(shopJson)) {
        // 缓存命中有效数据，直接返回
        return JSONUtil.toBean(shopJson, Shop.class);
    }
    if (shopJson != null) {
        // 缓存命中空字符串（穿透兜底），返回 null
        return null;
    }

    // 锁的 value 存唯一标识，释放时校验归属，防止误删别人的锁
    String lockValue = UUID.randomUUID().toString();
    Shop shop = null;
    int retry = 0;
    int maxRetry = 5;   // 重试上限，防止死循环

    while (retry++ < maxRetry) {
        try {
            // 2. 尝试获取锁（SET NX EX 原子操作，3 秒自动过期防死锁）
            boolean lock = stringRedisTemplate
                    .opsForValue()
                    .setIfAbsent("lock:shop:" + id, lockValue, 3, TimeUnit.SECONDS);

            if (!lock) {
                Thread.sleep(50);   // 没抢到，等持有者重建完
                continue;           // 循环重试，而不是递归（防栈溢出）
            }

            // 3. double-check：拿到锁后二次查缓存，可能上一个线程已重建完，就不用再查库
            shopJson = stringRedisTemplate.opsForValue().get(key);
            if (StrUtil.isNotBlank(shopJson)) {
                return JSONUtil.toBean(shopJson, Shop.class);
            }

            // 4. 查库重建
            shop = getById(id);
            Thread.sleep(200);   // 模拟重建延时（演示用，生产删除）
            if (shop == null) {
                // 穿透兜底，缓存空串（10 分钟）
                stringRedisTemplate.opsForValue().set(key, "", 10, TimeUnit.MINUTES);
                return null;
            }
            stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(shop), 30, TimeUnit.MINUTES);
            return shop;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();   // 恢复中断标志，别吞掉
            throw new RuntimeException(e);
        } finally {
            // 5. 释放锁前校验 value 是否是自己（防止误删别人的锁）
            unLock("lock:shop:" + id, lockValue);
        }
    }
    return shop;   // 重试耗尽，返回 null 或抛异常
}
```

配套的 `unLock`（Lua 保证"比对 + 删除"原子性）：

```java
// 用 Lua 脚本保证"比对 + 删除"原子性，防止删锁瞬间锁刚好过期被别人抢走
public void unLock(String lockKey, String lockValue) {
    String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                    "return redis.call('del', KEYS[1]) else return 0 end";
    stringRedisTemplate.execute(
            new DefaultRedisScript<>(script, Long.class),
            List.of(lockKey),
            lockValue
    );
}
```

> 注：原来的 `tryLock(lockKey)` / `unLock(lockKey)` 是无校验的单参数版本，用优化版时需要同步改成带过期时间和 UUID 校验的实现

- **逻辑过期**

key不设物理过期时间，而是把过期时间存在value里，发现过期后不阻塞等待，先返回数据，再异步重建缓存

```java
  /**
     * 根据 id 查询缓存：命中未过期直接返回；已过期则返回旧数据并异步重建；
     * 缓存不存在时查库写入（逻辑过期方案 key 常驻，首次访问也要有数据）
     * @param keyPrefix 缓存键前缀
     * @param id        缓存键的ID部分
     * @param type      缓存值的类型
     * @param dbFallback 缓存不存在时的数据库查询方法
     * @param time      缓存的过期时间
     * @param unit      时间单位
     * @param <R>
     * @param <ID>
     */
    public <R, ID> R queryWithLogicalExpire(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
        String key = keyPrefix + id;
        // 从redis中读取缓存
        String shopJson = stringRedisTemplate.opsForValue().get(key);

        // 首次访问：缓存不存在 → 查库并写入，而不是直接返回 null
        if (StrUtil.isBlank(shopJson)) {
            R first = dbFallback.apply(id);
            if (first != null) {
                this.setWithLogicalExpire(key, first, time, unit);
            }
            return first;
        }

        // 命中：反序列化并判断是否逻辑过期
        RedisData redisData = JSONUtil.toBean(shopJson, RedisData.class);
        R r = JSONUtil.toBean(redisData.getData(), type);
        LocalDateTime expireTime = redisData.getExpireTime();

        if (expireTime.isAfter(LocalDateTime.now())) {
            // 未过期，直接返回
            return r;
        }

        // 已过期：需要缓存重建（锁 key 跟 keyPrefix 走，避免通用方法下锁粒度错乱）
        String lockKey = "lock:" + keyPrefix + id;
        boolean isLock = tryLock(lockKey);
        if (isLock) {
            try {
                // double-check：可能抢锁前其他线程已重建完
                String json = stringRedisTemplate.opsForValue().get(key);
                if (StrUtil.isNotBlank(json)) {
                    RedisData rd = JSONUtil.toBean(json, RedisData.class);
                    if (rd.getExpireTime().isAfter(LocalDateTime.now())) {
                        return JSONUtil.toBean(rd.getData(), type);
                    }
                }
                // 开启独立线程异步重建
                CACHE_REBUILD_EXECUTOR.submit(() -> {
                    try {
                        R r1 = dbFallback.apply(id);
                        this.setWithLogicalExpire(key, r1, time, unit);
                    } catch (Exception e) {
                        log.error("缓存重建失败, key={}", key, e); // 需要 @Slf4j
                    } finally {
                        unLock(lockKey);
                    }
                });
            } catch (Exception e) {
                // submit 抛异常（如线程池拒绝）也要释放锁，防止锁永远不释放
                unLock(lockKey);
                throw e;
            }
        }
        // 已过期：先返回旧数据
        return r;
    }
```

代价/注意点

- 数据短暂不一致：过期后一段时间拿到的是旧数据，直到异步查询重建完成，对时效性要求高的不适合（如库存、价格）

- 额外线程：需要线程池来异步重建，重建失败要有重试、补偿机制，否则永远是旧数据

- 重建要快：异步重建期间所有请求都会命中旧数据，如果重建很慢，那么旧数据就会顶很久

- 逻辑过期时间要设置合理：如果设10分钟，那么意味着最多有10分钟的数据延迟窗口

### 缓存雪崩

**概念**：**大量 key 在同一时间段内集中过期**，或者 Redis 服务宕机，导致大量请求直接打到数据库，数据库扛不住压力崩溃

**产生原因**：设置的过期时间相同（如都设置为凌晨 0 点过期）、Redis 集群节点宕机

**解决方案**：

1. **过期时间加随机值**：让 key 的过期时间分散开，避免同一时间集中过期

```java
// 过期时间 = 基础时间 + 随机数，避免同一时间大量 key 同时过期
long baseTime = 30;
long randomTime = ThreadLocalRandom.current().nextLong(1, 10);
redisTemplate.opsForValue().set("key:" + i, value, baseTime + randomTime, TimeUnit.MINUTES);
```

1. **多级缓存**：Redis 之前再加一层本地缓存（如 Caffeine、本地 Map），部分请求直接在本地缓存命中

2. **Redis 高可用**：搭建主从复制 + 哨兵集群，保证 Redis 不宕机

3. **服务限流降级**：数据库层加限流（如 Sentinel、Hystrix），超出承受能力直接降级返回

> **总结对比**：

| 问题   | 场景                    | 解决方案                  |
| ---- | --------------------- | --------------------- |
| 缓存穿透 | 查询缓存和数据库都不存在的数据       | 缓存空值 / 布隆过滤器 / 参数校验   |
| 缓存击穿 | 热点 key 过期瞬间的高并发       | 互斥锁 / 逻辑过期            |
| 缓存雪崩 | 大量 key 同时过期或 Redis 宕机 | 过期时间加随机值 / 多级缓存 / 高可用 |

## In Spring Boot

在 Spring Boot 项目中的使用方式，请参考 [Spring Data Redis](./../../backend/java/spring/springDataRedis.md)
