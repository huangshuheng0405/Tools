# Redisson

## 为什么用它写分布式锁

回顾我们手写的分布式锁，有两个缺点：

- 锁会提前释放：给锁设定了固定TTL，如果业务执行超过了TTL，锁就会自动失效，别人就会再进来，从而引发并发问题
- 不可重入：同一线程内如果还想再那一次锁，会自己锁死自己

有很多细节要自己维护：

| 要处理的问题       | 手写 Redis             | Redisson                    |
| ------------------ | ---------------------- | --------------------------- |
| 加锁要原子         | `SET key value NX EX`  | `lock()` / `tryLock()`      |
| 防止删别人的锁     | 自己写 Lua             | `unlock()` 内部已经处理     |
| 持有者宕机         | 自己设过期时间         | 默认有过期时间 + 看门狗续期 |
| 其他线程等待       | 自己写 `while + sleep` | 内部通过 Pub/Sub 通知       |
| 同一个线程重复加锁 | 自己维护计数           | 默认可重入                  |
| 业务时间超过锁时间 | 只能自己续期或加长超时 | 不传 `leaseTime` 时自动续期 |

Redisson 底层也是靠 Redis 的原子命令 + Lua 实现的，只是把这些细节封装好了。

## 引入

`redisson-spring-boot-starter` 与 `spring-boot-starter-data-redis` 同时存在时，可能引发 `StackOverflowError`。原因是 Redisson 的自动配置会覆盖 Spring Data Redis 的 `ConnectionFactory`，导致 `DefaultedRedisConnection.pExpire()` 方法无限递归调用。

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
    <version>4.7.0</version>
</dependency>
```



### 推荐方案

如果你只需要Redission的分布式锁和分布式对象功能，普通缓存操作仍想用`StringRedisTemplate`，值引入纯`redission`依赖即可，手动创建`RedissionClient`Bean，并显示指定`RedisConnectFactory`使用Letture

只引入核心包：

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>4.7.0</version>
</dependency>
```

需要自己精确控制配置时，可以手写一个 `RedissonClient` Bean，和 starter 自动配置二选一：

```java [RedisConfig.java]
    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() {
        Config config = new Config();

        config.setPassword("password"); // 推荐在config层级设置密码

        config.useSingleServer()
                .setAddress("redis://127.0.0.1:6379");

        return Redisson.create(config);
    }
```

`RedissonClient` 是线程安全的，项目里注入同一个实例即可。

## RLock 

先根据业务 key 拿到锁对象：

```java
RLock lock = redissonClient.getLock("lock:order:" + orderId);
```

只要所有服务实例都用同一个锁名，它们拿到的就是同一把分布式锁。

### 常用方法

| 方法                               | 行为                                            |
| ---------------------------------- | ----------------------------------------------- |
| `lock()`                           | 一直阻塞等待，直到拿到锁；开启看门狗            |
| `lock(10, TimeUnit.SECONDS)`       | 一直等待；拿到后 10 秒自动释放，不开启看门狗    |
| `tryLock()`                        | 只尝试一次，立刻返回 `true / false`；开启看门狗 |
| `tryLock(3, TimeUnit.SECONDS)`     | 最多等 3 秒，拿不到返回 `false`；开启看门狗     |
| `tryLock(3, 10, TimeUnit.SECONDS)` | 最多等 3 秒；拿到后 10 秒自动释放，不开启看门狗 |
| `unlock()`                         | 释放锁，必须由持锁线程调用                      |

### 阻塞式写法

```java
RLock lock = redissonClient.getLock("lock:order:" + orderId);

lock.lock();
try {
    // 同一时间只有一个线程能进来
    createOrder(orderId);
} finally {
    lock.unlock();
}
```

### 带等待时间的写法

```java
RLock lock = redissonClient.getLock("lock:order:" + orderId);
boolean locked = false;

try {
    // 最多等 3 秒，拿不到就不继续执行业务
    locked = lock.tryLock(3, TimeUnit.SECONDS);
    if (!locked) {
        throw new RuntimeException("系统繁忙，请稍后重试");
    }

    createOrder(orderId);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new RuntimeException("请求被中断", e);
} finally {
    if (locked) {
        lock.unlock();
    }
}
```

必须把 `unlock()` 放在 `finally` 里，否则业务抛异常后锁可能不会释放。

## 看门狗

> 锁快过期了，Redission自动续期，防止业务没执行玩，锁提前失效

### 背景

假如你使用分布式锁，锁30s后自动过期

```bash
SET lock:order:1001 owner-abc NX PX 30000
```

但是你的业务执行了40s，这时候另一个线程可能拿到这把锁，两个线程可能**执行本来互斥**的业务

所以引入看门狗

### 用法

Redisson 的默认看门狗时间是 30 秒，底层仍然是“给锁设置一个过期时间”。

关键点是：

- 没传 `leaseTime` 时，Redisson 每隔 30 / 3 = 10 秒自动续期一次
- 业务没执行完，锁不会因为 30 秒到了就被释放
- 业务执行完调用 `unlock()`，或者持有锁的 Redisson 实例宕机，续期就会停止
- 实例宕机后，Redis 里的锁最多再过 30 秒自动过期，不会永远锁死

可以自己调整看门狗时间：

```java
config.setLockWatchdogTimeout(30_000);
```

如果调用时传了 `leaseTime`，Redisson 就**按固定时间释放，不再自动续期：**

```java
// 10 秒后自动释放，业务不能超过 10 秒
lock.lock(10, TimeUnit.SECONDS);
```

> 看门狗只是续期，不是绝对安全。如果线程长时间 GC 暂停或网络分区超过 30 秒，锁仍可能被其他实例抢到。保护外部系统写入时，需要能校验令牌（fencing token）的方案。

如果直接设置一个很长的过期时间，一旦服务奔溃，就会导致死锁/长时间锁死

## 可重入锁

可重入：同一个线程可以反复拿到同一把锁，不会锁死

实现：用hash结果记录线程id+加锁次数，每`lock`一次，次数加一，每`unlock`一次，次数减一，减到0才真正释放

场景：方法A调用方法B，两个方法都要拿同一把锁，如果锁不可重入，就卡死自己了

## 其他分布式对象

```java
// 分布式缓存 Map，带过期时间
RMapCache<String, User> cache = redissonClient.getMapCache("user:cache");
cache.put("1001", user, 10, TimeUnit.MINUTES);
User cached = cache.get("1001");

// 分布式原子计数器
RAtomicLong viewCount = redissonClient.getAtomicLong("view:article:1");
viewCount.incrementAndGet();

// 布隆过滤器：适合判断“一定不存在”的场景
RBloomFilter<String> bloom = redissonClient.getBloomFilter("user:bloom");
bloom.tryInit(100_000L, 0.03);
bloom.add("1001");
boolean maybeExists = bloom.contains("1001");
```

锁之外的常见选择：

| 需求         | API                  |
| ------------ | -------------------- |
| 读多写少     | `getReadWriteLock()` |
| 控制并发数量 | `getSemaphore()`     |
| 抢购、限流   | `getRateLimiter()`   |
| 先来先服务   | `getFairLock()`      |
| 发布订阅     | `getTopic()`         |

## 注意事项

- 锁名粒度要合适：用业务 ID，不要全局只用一个锁，否则所有订单串行
- 锁内只放需要互斥的业务，不要在锁里做慢查询或远程调用，否则会拖慢所有争锁线程
- 普通业务用 `RLock` 即可；老资料里的 RedLock 争议较大，Redisson 4.x 已把 RedLock 标记为过时，不再作为推荐方案

## 与 Lettuce 的共存策略

| 客户端                      | 适合场景                                                     |
| --------------------------- | ------------------------------------------------------------ |
| Letture/StringRedisTemplate | 普通缓存读写、简单KV操作、String类型命令                     |
| Redission                   | 分布式锁（RLock）、分布式集合（RMap/RList）、限流器、分布式原子类 |

Redission虽然功能强大，但**对String类型命令的支持较弱**，不支持排序、事务、管道、分区等特性。如果你的业务大量使用String类型操作，仍然需要保留Letture