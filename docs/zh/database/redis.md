# Redis

<svg width="180px"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#FF4438" d="M490.6 250.3c5.7-10 15-20.9 18.4-24.3 15.5 6.5 30 19.7 27.9 23-6 9.9-15 21-18.4 24.4-15.5-6.5-30-19.4-27.9-23M600 294.8a35 35 0 0 1-17.3 20.2c-4-8.3-8.3-13.2-12.4-13.2-5.2 0-5.5 3.6-5.5 8.3 0 8.3 6 26.4 6 45.2 0 20.7-14.5 36-36.7 36-20.4 0-31.7-13.4-36.7-34.7-13.3 23.9-32.7 34.7-47.7 34.7-23.3 0-28.8-17.2-28.2-34.7-9.4 16.5-27.4 34.7-44.7 34.7-17.6 0-23.9-15.4-22.4-33.3-10.6 19.7-29.8 33.3-48.2 33.3-20 0-30-15.9-26.7-35.6-13.5 16.5-38.5 35.6-64.6 35.6-29.7 0-42.6-16-44.2-36.1-14.3 23-33.6 36.9-56.6 36.9-33.3 0-45.2-29.6-46.9-53.8A783 783 0 0 1 24.1 391q-2.7 2.8-5.2 2.9c-6 0-18.1-26.4-18.9-36.2C6.9 347 63.2 286.2 86.7 260 71 264.8 54.5 274.3 34 289c-3.6 2.6-13.7-21-13.5-39 23.8-17.6 60-28.7 89.3-28.7 40.8 0 64.4 22.7 64.4 54.3C174 302 152 331 120 332a34 34 0 0 1-32.8-20.5c.6 17.9 10 39.9 34.9 39.9 29 0 41.9-18.7 63.6-45.8 16.5-20.4 35.7-38.5 63.6-38.5 17 0 28.7 10.6 28.7 26.6 0 19.4-22.7 46.3-54.6 46.3q-8.2 0-14.5-2.1l-.2 2.3c0 9.1 3.4 14.5 18.1 14.5 21.7 0 42.2-12.9 67-43.2 24.3-29.7 42.7-42.6 62-42.6 13.2 0 23 7 27.5 19 26-37.5 48-64.1 66.7-81.9 18.4 7.8 31.6 23 28 26.1-13.8 12.5-59.6 62.4-77.7 92.1-4.6 7.8-9 16.3-9 20.4s2.3 5.2 5 5.2c17 0 57.6-55.3 80.6-79.6 14.5 6 29.2 18.6 25.6 23-19.1 22.7-33.6 41.4-33.6 52 0 2.8 1 4.6 4.9 4.6 7.2 0 14-6.5 25-20.2 2.4-2.8 5.3-2.8 7 1.6 5 11.9 12.2 18.4 18 18.4 6.6 0 10-6 10-15 0-11-2.3-24.9-2.3-31 0-21 15.5-33.2 34.9-33.2 14.5 0 27.4 7 33.6 24.3M122 257l-25.1 38.7c4.5 2.5 10 4.5 17.4 4.5 13.7 0 28.7-7.5 28.7-22.8 0-9.3-5.7-17.8-21-20.4m90.8 69.5q4.2 1.6 9.4 1.6c18.3 0 30.7-14 30.7-23.3 0-4.1-2.6-7-6.7-7-10.4 0-26 14.6-33.4 28.7m154-19.4c0-5.1-3-8.2-7.6-8.2-15.2 0-38.3 29-38.3 43.4 0 4.7 2.6 7.8 8 7.8 16.9 0 37.8-30.5 37.8-43"/></svg>

<img src="/Misc/redis.svg" alt="redis" width="180px">

## 数据类型

Redis是一个键值对（key-value）数据库，它的value支持多种结构

### string

最基础的类型，一个key对应一个value（可以是文本、数字、甚至是图片的二进制数据）

- `SET key value`：设置key的值

- `GET key`：获取key的值

- `MSET KEY VALUE \[KEY VALUE...]`：批量添加多个String类型的value

- `MGET KEY \[KEY ...]`：根据多个key获取多个String类型的value

- `INCR KEY`：让一个整型的key自增1

- `INCRBYFLOAT`：让一个浮点类型的数字自增并指定步长

- `INCRBY KEY number`：让一个整形的key增加number

- `DEL key`：删除key

- `EXISTS key`：判断key是否存在

- `SETNX`：添加一个String类型的键值对，如果这个key不存在才执行

- `SETEX`：添加一个String类型的键值对，并且指定有效期

### hash

哈希表，一个key对应多个field-value对，适合存储对象的多个属性，可以单独修改某个字段不影响其他字段

- `HSET key field value`：设置哈希表字段的值

- `HGET key field`：获取哈希表字段的值

- `HDEL key field`：删除哈希表字段

- `HGETALL key`：返回哈希表中的所有字段值对

- `HMSET key field value \[field value ...]`：批量设置多个字段（Redis 4.0 起`HSET`本身就支持一次传多组 field-value，`HMSET`已废弃）

- `HMGET key field \[field ...]`：批量获取多个字段的值

- `HKEYS key`：返回所有字段名

- `HVALS key`：返回所有字段值

- `HLEN key`：返回字段数量

- `HEXISTS key field`：判断字段是否存在

- `HINCRBY key field increment`：让整型字段自增指定步长

- `HSETNX key field value`：字段不存在时才设置

> 为什么用 hash 存对象：把整个对象序列化成 JSON 塞进一个 string，改其中一个字段也得整体读出来再整体写回去；用 hash 可以`HSET`改单个字段，也可以单独`HGET`某个字段。代价是不能嵌套——字段值只能是字符串，对象里带数组或子对象时还得自己再序列化一层

> 字段少、值小时，Redis 用紧凑编码（`listpack`）存，内存比真正的哈希表小很多；超过`hash-max-listpack-entries`（默认 128）或`hash-max-listpack-value`（默认 64 字节）就转成`hashtable`，**转过去之后不会再转回来**。Redis 7.0 之前这两个配置叫`hash-max-ziplist-entries`/`hash-max-ziplist-value`。用`OBJECT ENCODING key`能看到当前编码

### list

一个有序的字符串列表，底层是双向链表，支持头插、尾插和弹出元素

命令

- `LPUSH key value`：头插元素到列表中

- `RPUSH key value`：尾插元素到列表中

- `LPOP key`：弹出列表头元素并返回

- `RPOP key`：弹出列表尾元素并返回

- `LRANGE key start end`：返回列表中指定范围的元素

- `LREM key count value`：删除列表中指定值的元素

- `LSET key index value`：设置列表中指定索引的元素

### set

一个无序且元素唯一的字符串集合。支持数学上的交集、并集、差集等运算

命令

- `SADD key value`：添加元素到集合中

- `SREM key value`：删除集合中的元素

- `SMEMBERS key`：返回集合中的所有元素

- `SCARD key`：返回集合中元素的数量

- `SISMEMBER key member`：判断一个元素是否存在于set中

- `SINTER key1 key2 ...`：返回多个集合的交集

- `SUNION key1 key2 ...`：返回多个集合的并集

- `SDIFF key1 key2 ...`：返回多个集合的差集

### sorted set

一个有序的字符串集合，每个元素都有一个关联的分数。支持按分数排序和范围查询

- `ZADD key score member`：添加元素到有序集合中

- `ZREM key member`：删除有序集合中的元素

- `ZSCORE key member`：获取有序集合中指定元素的score值

- `ZRANK key member`：获取有序集合中指定元素的排名

- `ZCOUNT key min max`：统计score值在范围内的元素个数

- `ZRANGE key start end`：返回有序集合中指定排名范围的元素

- `ZRANGEBYSCORE key min max`：返回有序集合中指定分数范围的元素

- `ZCARD key`：返回有序集合中元素的数量

> 所以排名默认是升序，降序则在命令的Z后面添加`REV`即可

#### 滚动分页

把`score`当作**游标**来翻页，而不是用排名偏移量。典型场景是朋友圈/Feed流：score存发布时间戳，按时间倒序往下拉。

**为什么不用偏移量分页**

`ZRANGE key start end`是按排名取元素的，翻页期间只要有人发了新动态，排名就会整体后移：

```
第一页拿到：[A, B, C]
期间有人发了新动态D，D插到了最前面
第二页 start=3：拿到的是C、D...，C被重复读取了
```

**滚动分页的做法**

每次用上一页最后一条的`score`作为下一页的查询边界。这里的坑是**score会重复**（同一毫秒发布的多条动态分数相同），所以除了`minTime`还要带一个`offset`，用来跳过上一页里分数等于`minTime`的那几条

```
第一页：ZREVRANGEBYSCORE feed:1 +inf 0 WITHSCORES LIMIT 0 3
        返回 score：1000、999、999
        最后一条 score = 999，其中等于 999 的有 2 条 → minTime=999，offset=2

第二页：ZREVRANGEBYSCORE feed:1 999 0 WITHSCORES LIMIT 2 3
        offset=2 跳过已经拿过的那两条 999
```

`max`是闭区间（包含等于`minTime`的元素），所以必须靠`offset`去重；只有当score确定不会重复时，才能改用开区间`(999`并配合`offset=0`

**对应到 Spring Data Redis 的 API**

`ZSetOperations`里的方法签名：

```java
Set<ZSetOperations.TypedTuple<String>> reverseRangeByScoreWithScores(
        K key, double min, double max, long offset, long count)
```

它包装的就是`ZREVRANGEBYSCORE key max min WITHSCORES LIMIT offset count`，五个参数一一对应：`min`/`max`是score的上下界（闭区间），`offset`跳过匹配到的前几条，`count`是页大小。所以`reverseRangeByScoreWithScores(key, 0, max, offset, 2)`就是“score在0~max之间、按score倒序、跳过前offset条、最多取2条，并且带上score”

- `min`写`0`是因为score是时间戳，远大于0，相当于不设下界
- `max`就是游标`minTime`，首次请求传当前时间戳
- `offset`就是上一页算出来的`os`，首次传`0`

返回的`Set<TypedTuple<String>>`里每个元素是一个成员：`getValue()`拿member（blogId），`getScore()`拿分数（`Double`）。方法名里的`WithScores`就是把score一起返回，没有它就拿不到下一页的游标（只返回member的`reverseRangeByScore`做不了滚动分页）

> 注意**参数顺序是反的**：原生命令先写`max`再写`min`（因为是倒序），Spring的方法签名是`min`在前、`max`在后。传反了结果直接为空

> 返回类型名义上是`Set`，但Spring内部用的是`LinkedHashSet`保序，遍历顺序就是score从高到低。下面的循环依赖这个顺序，别把结果收集进`HashSet`

Java里算出下一页游标的逻辑：

```java
public ScrollResult scroll(Long max, Integer offset) {
    String key = "feed:" + userId;
    // 按 score 倒序取，max 为上一页最后一条的 score（首次请求传当前时间戳），offset 首次传 0
    Set<ZSetOperations.TypedTuple<String>> tuples = stringRedisTemplate.opsForZSet()
            .reverseRangeByScoreWithScores(key, 0, max, offset, 3);

    if (tuples == null || tuples.isEmpty()) {
        return new ScrollResult();   // 没有更多数据，说明到底了
    }

    List<Long> ids = new ArrayList<>(tuples.size());
    long minTime = 0;
    int os = 1;   // 下一页要跳过的数量

    for (ZSetOperations.TypedTuple<String> tuple : tuples) {
        ids.add(Long.valueOf(tuple.getValue()));
        long time = tuple.getScore().longValue();
        if (time == minTime) {
            os++;              // 和上一条分数相同，跳过量 +1
        } else {
            minTime = time;    // 分数变了，从这一条重新计数
            os = 1;
        }
    }
    // 把 minTime 和 os 返回给前端，作为下一页的 max 和 offset
    return new ScrollResult(ids, minTime, os);
}
```

前端拿到`minTime`和`offset`后原样回传，就能一直往下滚

> 对比：`ZRANGE key start end`是偏移量分页，数据一变动就错位；滚动分页用score定位，只要没有比`minTime`更新的数据插入，翻页就稳定。代价是**不支持跳页**，只能“下一页/滚动加载”

> Redis 6.2+ 也可以用统一命令写：`ZRANGE key max min BYSCORE REV WITHSCORES LIMIT offset count`，等价于`ZREVRANGEBYSCORE`

### stream

Redis 5.0 新增的类型，是一个**持久化、只能追加的消息日志**，可以把它理解成一个消息队列。每条消息有唯一的 ID（格式为`时间戳-序号`，如`1526919030474-55`），写入后不可修改

特点

- **可回溯**：消息持久化保存，可以从任意位置重新读取
- **多消费者**：同一条消息可以被多个消费者组分别读取（区别于 list 的“取走就没了”）
- **阻塞读**：没有新消息时可以阻塞等待，而不是空轮询
- **消费者组 + ACK**：支持`XACK`确认，未确认的消息可以通过`XPENDING`找回并重新投递

命令

- `XADD key * field value ...`：添加一条消息，`*`表示由 Redis 自动生成 ID，也可以写成`XADD key 1-1 field value`手动指定 ID

- `XLEN key`：返回 Stream 中的消息数量

- `XRANGE key start end [COUNT count]`：按 ID 范围读取消息，`-`表示最小 ID，`+`表示最大 ID

- `XREVRANGE key end start`：倒序读取消息

- `XDEL key id ...`：删除指定 ID 的消息

- `XTRIM key MAXLEN count`：裁剪 Stream，只保留最新的若干条消息（也可以在写入时裁剪：`XADD key MAXLEN ~ 1000 * field value`）

- `XREAD [COUNT count] [BLOCK ms] STREAMS key ... id`：从指定 ID 之后读取消息，`BLOCK 0`表示永久阻塞直到有新消息，`$`表示只读取最新消息

- `XGROUP CREATE key group id [MKSTREAM]`：创建消费者组，`MKSTREAM`表示 Stream 不存在时自动创建；ID 为`$`表示从最新消息开始消费，`0`表示从头开始

- `XREADGROUP GROUP group consumer [COUNT count] [BLOCK ms] STREAMS key ... id`：以消费者组成员的身份读取消息，`>`表示读取从未投递给该组的新消息

- `XACK key group id ...`：确认消息已处理完成

- `XPENDING key group`：查看已投递但还没确认的消息（PEL，Pending Entries List）

- `XCLAIM key group consumer min-idle-time id ...`：把闲置超过指定时间的消息转交给其他消费者处理

- `XAUTOCLAIM key group consumer min-idle-time start`：`XCLAIM`的自动版，一次扫描并认领多条闲置消息

- `XINFO STREAM key`：查看 Stream 的详细信息

- `XINFO GROUPS key`：查看所有消费者组的信息

> 与 list 做消息队列的区别：list 用`LPUSH`+`BRPOP`只能做到“一条消息一个消费者”，弹出后就没了；Stream 支持消费者组和 ACK 确认，同一条消息可以分发给多个组，消费失败还能重新投递

### geo

Redis 3.2 新增，用来存经纬度并做「附近的人」「附近的店」这类范围查询。它**没有自己的底层结构**——member 是地点名或用户 ID，score 是经纬度经 geohash 编码后的 52 位整数，所以本质就是一个 sorted set，`ZREM`、`ZCARD`、`ZRANGE` 都能直接作用在 geo key 上

- `GEOADD key longitude latitude member [longitude latitude member ...]`：添加一个或多个坐标点。**经度在前、纬度在后**，写反了纬度多半会超出 85.05 而报错，凑巧两个值都在合法范围内则会静默存错——这类 bug 只有等查询结果不对才会发现

- `GEOPOS key member [member ...]`：返回成员的经纬度

- `GEODIST key member1 member2 [M|KM|FT|MI]`：计算两个成员之间的距离，不指定单位默认是米

- `GEOHASH key member [member ...]`：返回标准的 11 位 geohash 字符串，可以拿去和其他 geohash 工具对接

- `GEOSEARCH key <FROMMEMBER member | FROMLONLAT longitude latitude> <BYRADIUS radius unit | BYBOX width height unit> [ASC|DESC] [COUNT count [ANY]] [WITHCOORD] [WITHDIST] [WITHHASH]`：范围查询。`FROM*` 指定中心点（按成员或按坐标），`BY*` 指定是圆形还是矩形范围，后面三个 `WITH*` 决定要不要把坐标、距离、geohash 一并返回

- `GEOSEARCHSTORE destination source <...>`：参数和`GEOSEARCH`一样，但把结果写进另一个 key；加`STOREDIST`可以把距离当作 score 存下来，方便后续再排序

- `ZREM key member`：删除一个点（没有专门的`GEODEL`命令）

> Redis 6.2 之前用的是`GEORADIUS key longitude latitude radius unit`和`GEORADIUSBYMEMBER key member radius unit`，这俩把「按坐标」和「按成员」拆成了两个命令，6.2 起已废弃，新代码直接用`GEOSEARCH`

> 三个容易踩的点：**纬度范围是`-85.05112878 ~ 85.05112878`**（Web 墨卡托的边界），不是`-90 ~ 90`，超出会报错；**`GEODIST`返回的是字符串**，要参与数值计算得先转 double；距离按**球面（Haversine）**算，地球被当成正球体，长距离下和真实值有零点几个百分点的偏差

> `GEOSEARCH`的`COUNT`只表示「取最近的 n 个」，**没有 offset 参数**，所以做不到跳页；要翻页只能把`COUNT`放大再自己裁，或者用`GEOSEARCHSTORE`把结果落到另一个 key 里再查

### bitmap

位图，本质还是 string，只是把 value 当成一个 bit 数组来看：每个 bit 只有 0 和 1，用偏移量（offset）当下标。「某个用户今天有没有签到」这种布尔值只占 1 bit，比存一个`"1"`省 8 倍以上

- `SETBIT key offset value`：把第 offset 位设为 0 或 1。key 不存在会新建，offset 超出当前长度会自动补 0

- `GETBIT key offset`：取第 offset 位，越界或 key 不存在都返回 0

- `BITCOUNT key \[start end \[BYTE | BIT]]`：统计值为 1 的位数，不传范围就是整个 key，`BYTE`/`BIT`决定 start/end 是按字节还是按位

- `BITPOS key bit \[start \[end \[BYTE | BIT]]]`：找第一个等于 bit（0 或 1）的位，返回它的下标

- `BITOP AND|OR|XOR|NOT destkey key \[key ...]`：对多个 bitmap 做位运算，结果写进 destkey（`NOT`只接一个 key）

- `BITFIELD key \[GET encoding offset] \[SET encoding offset value] \[INCRBY encoding offset increment] \[OVERFLOW WRAP|SAT|FAIL]`：把字符串当成一组定长整数来读写，一条命令可以带多个操作

记录某个用户这个月的签到：

```
SETBIT sign:1001:202609 20 1     # 20 号签到（下标从 0 开始）
SETBIT sign:1001:202609 21 1
BITCOUNT sign:1001:202609        # 返回 2，本月签到 2 天
```

> 最大 offset 是`2^32 - 1`（约 42.9 亿），因为 Redis 的 value 上限是 512MB，512MB × 8 正好是 2^32 位

> offset 是**按最大偏移量分配内存**的：只写`SETBIT key 10000000 1`，Redis 也立刻分配 10000000 ÷ 8 ≈ 1.25MB。所以稀疏场景（1 万个用户里只有 3 个签到）用 bitmap 反而不省内存，这种情况用 set 或者 HyperLogLog 更合适

> `BITCOUNT`的 start/end 默认按**字节**索引，想按位必须显式加`BIT`；而`BITFIELD`的 offset 默认就按**位**算，想按整个字段跳（第 n 个字段而不是第 n 位）要加`#`前缀，如`BITFIELD key GET u8 #0`

> `BITFIELD`的`OVERFLOW`决定越界行为：`WRAP`回绕（默认）、`SAT`饱和到最大/最小值、`FAIL`直接返回 nil。它只影响后面的`SET`和`INCRBY`，对`GET`无效

> 因为底层就是 string，`TYPE`返回的类型是`string`而不是`bitmap`，`GET`出来的也是二进制字符串

常见场景：签到打卡、日活/月活统计、用户布尔标签（性别、是否会员）、布隆过滤器的底层存储

### HyperLogLog

用来做**基数统计**（一个集合里有多少个不重复元素）的概率型结构。它不保存元素本身，只维护内部寄存器，所以结果是**估算值**，标准误差 0.81%

- `PFADD key \[element ...]`：添加一个或多个元素，返回 1 表示基数估算值变了，返回 0 表示没变

- `PFCOUNT key \[key ...]`：返回估算出的基数；传多个 key 时返回它们的**并集**基数

- `PFMERGE destkey \[sourcekey ...]`：把多个 HyperLogLog 合并进 destkey

```
PFADD uv:2026-09-20 user:1 user:2 user:3
PFADD uv:2026-09-21 user:2 user:3 user:4
PFCOUNT uv:2026-09-20                     # ≈3
PFMERGE uv:total uv:2026-09-20 uv:2026-09-21
PFCOUNT uv:total                          # ≈4，两天去重后的 UV
```

> 内存是固定的：最坏情况 12KB（16384 个 6-bit 桶），跟元素数量无关。起步用**稀疏编码**（sparse）省内存，超过`hll-sparse-max-bytes`（默认 3000 字节）才转成**稠密编码**（dense），此时固定占用 12KB

> 不能做的事：**判断某个元素是否存在**（没有类似`SISMEMBER`的命令）、把元素取回来、删除单个元素（要删只能删整个 key）。它的定位就是「只关心去重后的总数」

> 结果是估算值，别拿它当账单或者库存的计数。它是给「UV 这种差一点无所谓、但量大到 set 存不下」的场景用的

> `PFCOUNT`传多个 key 时会把它们临时合并再估算，复杂度从 O(1) 变成 O(N)；需要反复算同一个并集，用`PFMERGE`先落一个 key 更划算

> 和 bitmap 一样，`TYPE`返回的也是`string`

与 set 对比（统计 1 亿个不重复用户）：

| 结构        | 是否存元素 | 内存占用  | 能否判断元素是否存在 | 误差  |
| ----------- | ---------- | --------- | -------------------- | ----- |
| set         | 存         | GB 级     | 能                   | 无    |
| HyperLogLog | 不存       | 固定 12KB | 不能                 | 0.81% |

## 通用命令

对所有数据类型都适用的命令，主要分为键操作、过期时间和数据库/统计三类

### 键操作

- `DEL key \[key ...]`：删除key，返回实际删除的数量

- `UNLINK key \[key ...]`：异步删除，只把key从键空间摘除，内存回收交给后台线程。删除大key时用它，避免阻塞主线程

- `EXISTS key \[key ...]`：判断key是否存在，返回存在的数量（可以一次传多个key）

- `TYPE key`：返回key的类型（`string`/`hash`/`list`/`set`/`zset`/`stream`），key不存在时返回`none`

- `KEYS pattern`：按模式匹配查找key，如`KEYS user:*`。**生产环境禁用**，它是全量扫描，key多的时候会阻塞Redis

- `SCAN cursor \[MATCH pattern] \[COUNT count]`：渐进式遍历，每次返回一小批key和一个新的cursor，cursor为`0`表示遍历结束，是`KEYS`的生产替代方案

- `RENAME key newkey`：重命名key

- `RANDOMKEY`：随机返回一个key

- `COPY source destination \[DB destination-db]`：复制key到目标key（或目标库）

### 过期时间

- `EXPIRE key seconds`：给key设置过期时间（秒）

- `PEXPIRE key milliseconds`：毫秒级设置过期时间

- `EXPIREAT key timestamp`：指定到期的时间戳（秒），`PEXPIREAT`为毫秒版

- `TTL key`：返回剩余存活时间（秒）。`-1`表示没设置过期时间，`-2`表示key不存在

- `PTTL key`：毫秒版`TTL`

- `PERSIST key`：移除过期时间，让key永久有效

> 用`SET`覆盖value时，过期时间会被一起清掉；而`INCR`、`LPUSH`、`HSET`这类只修改value的命令不会清除过期时间（Redis 2.6+）

### 数据库与统计

- `SELECT index`：切换数据库，默认有0~15共16个库（集群模式下不可用）

- `DBSIZE`：返回当前库的key数量，O(1)，不会遍历所有key

- `FLUSHDB \[ASYNC]`：清空当前库

- `FLUSHALL \[ASYNC]`：清空所有库

- `INFO \[section]`：查看服务运行信息（内存、连接数、命中率等）

- `OBJECT ENCODING key`：查看key底层的编码（如`int`、`ziplist`、`hashtable`、`intset`），排查内存占用时很有用

- `HELP command`：查看命令的帮助和用法

> 加`ASYNC`可以让`DEL`/`FLUSHDB`/`FLUSHALL`在后台线程完成内存回收。`FLUSHALL`、`KEYS *`这类命令不要在生产环境随手执行

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

| 问题     | 场景                           | 解决方案                             |
| -------- | ------------------------------ | ------------------------------------ |
| 缓存穿透 | 查询缓存和数据库都不存在的数据 | 缓存空值 / 布隆过滤器 / 参数校验     |
| 缓存击穿 | 热点 key 过期瞬间的高并发      | 互斥锁 / 逻辑过期                    |
| 缓存雪崩 | 大量 key 同时过期或 Redis 宕机 | 过期时间加随机值 / 多级缓存 / 高可用 |

## In Spring Boot

在 Spring Boot 项目中的使用方式，请参考 [Spring Data Redis](./../../backend/java/spring/springDataRedis.md)

## 分布式锁

### 背景

假设两个线程同时给同一个商品下单

```
线程A：查询库存 → 库存还有1 → 扣库存
线程B：查询库存 → 库存还有1 → 扣库存
```

结果可能两个都成功了，库存就出问题了

在单机Java程序里，可以用`synchorized`、`ReentrantLock`，但是服务部署了多台服务器，就锁不住了

```
                Nginx
                  │
          ┌───────┴───────┐
          ↓               ↓
      服务器A            服务器B
      Java程序            Java程序
          │               │
      synchronized     synchronized
```

A和B时两个JVM，锁只能锁住当前JVM内的线程

这时候，必须靠一个**大家都能访问到的第三方**来协调，比如Redis、Zookeeper、etcd或数据库

### 定义

多个进程、多台服务器上的代码再访问同一个共享资源时，同一时间只允许一个持有者操作 ，其他进程只能等待或者失败

**单机**里用`synchronized`、`mutex`、`ReentrantLock`就能保证互斥，因为它们靠同一台机器上的共享内存工作。但是再分布式系统里，同一套服务器通常会部署多个实例：

- 定时任务被多个实例同时触发，造成重复执行
- 多个实例同时处理同一个订单、扣同一笔库存
- 多实例同时写同一份共享数据，产生覆盖或重复

#### 典型特征

一个好的分布式锁一般满足：

- **互斥性**：任意时刻最多一个持有者
- **可容错**：持有者崩溃后，锁能自动释放，不会锁死
- **可续期/防误删**：业务时间超过锁超时时间时，要么自动续期，要么判断锁是不是自己的
- **高性能、高可用**：获取和释放要快，协调服务本身不能成为单点

### 实现

假设两个服务器同时抢锁：

```
服务器A → SET lock:order:1001 owner-A NX
服务器B → SET lock:order:1001 owner-B NX
```

Redis是单线程执行命令，并且`SET NX`是原子操作，只能有一个成功

代码大致如下：

```java
String lockKey = "lock:order:" + orderId;
String value = UUID.randomUUID().toString();

Boolean success = stringRedisTemplate.opsForValue()
        .setIfAbsent(lockKey, value, 30, TimeUnit.SECONDS);

if (Boolean.TRUE.equals(success)) {
    try {
        // 执行业务
        createOrder();
    } finally {
        // 释放锁
        stringRedisTemplate.delete(lockKey);
    }
}
```

一定要设置**过期时间**，如果服务器A拿到了锁，突然宕机了，那么别的服务器拿不到这个锁，就永远处理不了这个订单了

#### 不能直接删除锁

假设服务器A获得了锁，但是由于执行业务太久了，导致锁过期了，这时候服务器B获得了锁，这时候服务器A刚好又执行完业务，准备删除锁，但是这时候删除的是服务器B的锁，所以需要在删除锁的时候加个判断

### Lua

Lua脚本可以把`GET`和判断和`DEL`放进一个Lua脚本，保证原子性

```lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
end
return 0
```

`Java`调用

```java
redisTemplate.execute(
    script,
    Collections.singletonList("lock:order:1001"),
    "owner-A"
);
```

### 可重入锁

同一个线程已经拿到锁后，可以再次拿到这把锁，而不会死锁

#### 场景

```java
public void methodA() {
    lock.lock();

    methodB();

    lock.unlock();
}

public void methodB() {
    lock.lock();

    // 做事情

    lock.unlock();
}
```

如果A和B用的是同一把锁，**不可重入**

```
线程 A：我想拿锁
        ↓
发现锁已经被线程 A 自己占着
        ↓
等待……
        ↓
但是锁必须等 methodA() 执行完才释放
        ↓
methodA() 又在等 methodB()
        ↓
💀 死锁
```

可重入的话

```
线程 A
 ↓
第一次 lock()
 ↓
锁持有次数 = 1
 ↓
methodB()
 ↓
第二次 lock()
 ↓
发现：还是我自己
 ↓
锁持有次数 = 2
 ↓
执行
 ↓
unlock()
 ↓
锁持有次数 = 1
 ↓
unlock()
 ↓
锁真正释放
```

## 分布式缓存

### 持久化

#### RDB

**RDB**（Redis Database）是把某一时刻的**全量数据**写成一个紧凑的二进制文件，默认文件名`dump.rdb`。它"时间点快照"的语义来自`fork`：子进程看到的是 fork 那一瞬间的完整内存副本，之后主进程怎么改都不影响它，所以落盘出来的是一个自洽的切片，而不是"边写边变"的拼凑数据

##### 命令

- `SAVE`：**同步**保存，在主线程里把数据写完，期间整个 Redis 阻塞，一条命令都处理不了。只用于`fork`失败的极端情况，生产环境不要用

- `BGSAVE \[SCHEDULE]`：**异步**保存，fork 一个子进程去写文件，主线程立刻返回`Background saving started`。加`SCHEDULE`表示已有子进程在跑时不报错，等它结束后再补一次

- `LASTSAVE`：返回上次成功保存的 Unix 时间戳，脚本里常用来确认备份是否真的成功

> `BGSAVE`执行期间再发一次不带`SCHEDULE`的`BGSAVE`，会直接返回`Background save already in progress`错误；而`save`配置自动触发的保存遇到这种情况是**静默跳过**的，不会报错也不会排队

##### 什么时候会触发

1. **配置文件里的 save 点**：`save <seconds> <changes>`，意思是"在 seconds 秒内如果至少有 changes 个 key 发生变化，就触发一次 BGSAVE"。默认三组：

```
save 3600 1 300 100 60 10000
```

Redis 内部用一个`dirty`计数器记录"上次保存以来改了多少个 key"，每次事件循环都会拿它和所有 save 点比对。**任意一组满足就触发**，所以实际保存频率取决于最宽松的那条

2. **`BGSAVE`/`SAVE`手动调用**

3. **正常关闭**：收到`SHUTDOWN`命令或`SIGTERM`信号时，如果配置了 save 点，会先执行一次同步的`SAVE`再退出；`SHUTDOWN NOSAVE`可以跳过

4. **主从全量同步**：从节点第一次连上来、或者复制积压缓冲区被覆盖需要全量同步时，主节点会`BGSAVE`生成 RDB 发给从节点。**这是生产环境里 RDB 最常见的触发来源**，很多人"没配 save 点却看到在生成 RDB"，就是复制导致的

5. **`FLUSHALL`/`FLUSHDB`**：删除大量 key 会让`dirty`暴涨，紧接着就满足 save 点触发一次保存

> `kill -9`（`SIGKILL`）无法被捕获，什么都不会保存，这是"用 RDB 会丢数据"最直接的场景。`DEBUG RELOAD`则是"保存后立刻重新加载"，用来验证 RDB 文件能否正常恢复，也是排查数据问题的常用手段

##### fork 与写时复制

`BGSAVE`不阻塞主线程的关键在于`fork`出来的子进程不复制物理内存，而是和父进程**共享同一批物理页**，只复制一份页表。这些共享页会被标记为只读，父进程一旦要改某一页，内核先给这一页复制一份新内存再让父进程写，子进程继续读原来的旧页——这就是**写时复制**（Copy-On-Write）

```
BGSAVE
  │
  ├─ fork()  ← 这一步会阻塞主线程（页表越大越久）
  │     │
  │     ├─ 子进程：看到 fork 那一刻的完整数据，慢慢写 dump.rdb
  │     └─ 主进程：继续处理读写命令
  │
  └─ 主进程修改某页 → 触发 COW → 该页复制一份 → 子进程仍读旧页
```

由此推出三个结论：

- **快照是一致的**：子进程只可能看到 fork 那一刻的视图，后续写入的修改它完全感知不到
- **额外内存取决于写入量**：fork 之后主进程被改动的页越多，COW 复制的内存越多。极端情况（全量写入）会接近**内存翻倍**，这才是 RDB 真正的内存风险，而不是`fork`本身
- **fork 本身是阻塞的**：内存越大、页表越长，`fork`耗时越久，可能出现几十毫秒到秒级的卡顿。这个开销无法用"异步"消掉

> 两个和 COW 相关的系统参数：`vm.overcommit_memory`建议设为`1`，因为`fork`会申请与父进程同等大小的虚拟内存，严格的内存核算会让`fork`直接失败并报`Can't save in background: fork: Cannot allocate memory`；透明大页（THP）会放大 COW 的复制粒度，建议关闭（`echo never > /sys/kernel/mm/transparent_hugepage/enabled`）

##### 常用配置

| 配置项                          | 默认值                     | 作用                                        |
| ------------------------------- | -------------------------- | ------------------------------------------- |
| `save <seconds> <changes>`      | `3600 1 300 100 60 10000`  | 自动保存的触发条件，可以写多组              |
| `save ""`                       | —                          | 关闭所有自动保存，但手动`BGSAVE`仍可用      |
| `dbfilename`                    | `dump.rdb`                 | 文件名                                      |
| `dir`                           | `./`                       | 数据目录，RDB 和 AOF 都落在这里             |
| `rdbcompression`                | `yes`                      | 用 LZF 压缩字符串对象，关掉省 CPU 但文件暴涨 |
| `rdbchecksum`                   | `yes`                      | 文件尾部写入 CRC64 校验和，关掉加载快约 10% |
| `stop-writes-on-bgsave-error`   | `yes`                      | 上次 BGSAVE 失败后拒绝所有写命令            |
| `rdb-del-sync-files`            | `no`                       | 未开 AOF 时，主从同步用完的 RDB 是否删除    |

> `stop-writes-on-bgsave-error`是把双刃剑：开着能避免"以为有持久化其实早写不进去了"（磁盘满时只读不报错的静默故障最致命），但代价是磁盘满会直接升级成"Redis 拒绝所有写入"的服务不可用。线上要监控`rdb_last_bgsave_status`，或者显式关掉它并接受"持久化可能已经悄悄失效"

##### 相关 INFO 字段

```
rdb_changes_since_last_save     距上次保存改了多少个 key
rdb_bgsave_in_progress          是否有 BGSAVE 在跑（0/1）
rdb_last_save_time              上次成功保存的时间戳
rdb_last_bgsave_status          ok / err
rdb_last_bgsave_time_sec        上次保存耗时（秒）
rdb_current_bgsave_time_sec     正在进行的保存已耗时
rdb_last_cow_size               上次 BGSAVE 期间 COW 占用的字节数
rdb_saves                       本次启动以来保存了多少次
```

##### 加载

Redis 启动时，如果 AOF 没开启（或 AOF 文件不存在），就会去`dir`目录下找`dbfilename`指定的文件加载，加载是**阻塞**的，大实例的启动时间基本就等于加载 RDB 的时间。如果 RDB 文件损坏，Redis 会因为校验和不匹配而拒绝启动，这时可以用`redis-check-rdb dump.rdb`检查

> RDB 文件开头是`REDIS`魔术字符串加版本号。**高版本写的 RDB 不能给低版本读**，所以降级 Redis 之前要先确认。反向（低版本写、高版本读）是兼容的

##### 优缺点

**优点**

- 文件紧凑：二进制 + LZF 压缩，同样数据量下比 AOF 小得多
- 恢复快：直接按结构加载，不需要逐条回放命令，重启和主从全量同步都受益
- 对主进程性能影响最小：常态下只付出一次`fork`，子进程干重活
- 天然适合做备份：一个文件就是某个时间点的完整数据集，直接拷走就行

**缺点**

- **会丢数据**：宕机时丢掉的是"上次快照之后"的全部写入，取决于 save 点，通常是几分钟
- **fork 有阻塞**：内存越大停顿越明显
- **COW 有内存开销**：BGSAVE 期间写入量大时可能接近内存翻倍
- **无法增量**：每次都要全量落盘，数据量大时单次保存耗时很长

##### 与 AOF 的关系

| 维度     | RDB                                | AOF                          |
| -------- | ---------------------------------- | ---------------------------- |
| 记录内容 | 某个时间点的全量数据               | 每条写命令                   |
| 数据安全 | 差，宕机丢几分钟                   | 好，最多丢 1 秒（`everysec`） |
| 文件体积 | 小                                 | 大，需要定期重写压缩         |
| 恢复速度 | 快                                 | 慢，要逐条回放               |
| 主要用途 | 备份、灾难恢复、主从全量同步       | 尽量不丢数据                 |

两者可以同时开启，**恢复时优先用 AOF**，因为它理论上更完整。Redis 4.0 起支持混合持久化，`aof-use-rdb-preamble yes`会让 AOF 文件的前半段是 RDB 格式、后半段才是增量命令，兼顾恢复速度和数据完整性

> 反过来看，即使主要用 AOF，官方也建议**保留 RDB**：一是做备份，二是重启更快，三是万一 AOF 引擎有 bug，RDB 还能兜底。反过来"只用 AOF"是官方明确不推荐的

> 官方对"该用哪个"的说法很直接：能接受灾难时丢几分钟数据，RDB 单独用就够了；想要接近 PostgreSQL 级别的数据安全，就两个都开；纯粹当缓存用，可以完全关掉持久化

#### AOF

**AOF**（Append Only File）记的不是数据本身，而是**每一条改变数据集的写命令**。启动时把这些命令按顺序重放一遍，就把数据集重建出来了。定位和 RDB 正好互补：RDB 存的是"结果"（快照），AOF 存的是"过程"（操作日志），所以 AOF 更新得更频繁，丢的数据更少

##### 开启与文件结构

配置里打开`appendonly yes`（默认是`no`），之后每个写命令都会追加进 AOF。**这个开关可以在运行时改**：

```
CONFIG SET appendonly yes
```

运行中开启会立刻在后台生成一份完整的 AOF（等于触发一次重写），否则新开的 AOF 里只有"开启之后"的命令，靠它恢复不出完整数据

AOF 文件就是 [RESP 协议](https://redis.io/docs/latest/develop/reference/protocol-spec/)的原文，纯文本，可以直接看：

```
*2\r\n$6\r\nSELECT\r\n$1\r\n0\r\n*3\r\n$3\r\nSET\r\n$7\r\nuser:10\r\n$5\r\ntom\r\n*2\r\n$6\r\nEXPIRE\r\n$7\r\nuser:10\r\n$2\r\n60\r\n
```

`*n`表示"接下来是一个 n 元素的数组"（即一条命令的 n 个参数），`$n`表示"接下来是一个长度为 n 的字符串"。上面这段依次是`SELECT 0`、`SET user:10 tom`、`EXPIRE user:10 60`。用`sed 's/\r//'`把`\r`去掉后就一行一条命令，排查问题时能直接看出最后写进来的是什么

> Redis 7.0 起 AOF 变成了**多部分**结构，不再是单个文件：原来的一个大文件被拆成**一个 base 文件**（重写时刻的数据集快照，RDB 或 AOF 格式）+ **若干个 incr 文件**（base 之后追加的增量命令），全部放在`appenddirname`指定的目录里，由一份 manifest 清单统一管理

```
appendonlydir/
├── appendonly.aof.manifest        清单：当前有哪些文件正在生效
├── appendonly.aof.1.base.rdb      base：重写时刻的全量数据集
└── appendonly.aof.1.incr.aof      incr：base 之后的新增写命令
```

> 拆分的好处是**重写和追加可以彻底解耦**。Redis 7 之前是单文件，重写期间产生的新命令没地方写，只能先缓存在内存里的`aof_rewrite_buf`，等子进程写完新文件再补进去——写入量大的时候这块 buffer 会吃掉不少内存，切换那一刻的实现也复杂。多部分 AOF 下，父进程**直接开一个新的 incr 文件继续写**，子进程同时生成新 base，最后用临时 manifest 做一次原子替换，内存里不用囤任何东西

##### 命令

- `BGREWRITEAOF`：后台重写 AOF，`fork`子进程按当前数据集生成最短的命令序列。返回值只表示"已受理"或"已排期"，不代表重写完成

- `CONFIG SET appendonly yes`：运行时开启 AOF（会触发一次重写生成初始文件）

> AOF 没有 RDB 那样的`SAVE`命令，因为它不是"某个时刻保存一次"，而是每时每刻都在追加。想强制落盘应该调`appendfsync`或用`BGREWRITEAOF`

> 如果发起`BGREWRITEAOF`时正好有`BGSAVE`在跑，Redis 会返回 OK 但把重写**排期**到快照结束后。反过来也一样——两个后台进程不会同时做重 I/O

##### appendfsync：决定到底能丢多少数据

AOF 只是把命令写进了用户态的缓冲区，真正落盘要靠`fsync`。这个配置就是控制多久`fsync`一次，也是 AOF 唯一需要权衡的地方：

| 取值       | 行为                                         | 最多丢多少   | 性能           |
| ---------- | -------------------------------------------- | ------------ | -------------- |
| `always`   | 每批命令都`fsync`，完成之后才回复客户端      | 几乎不丢     | 极慢，必须配 SSD |
| `everysec` | 后台线程每秒`fsync`一次                      | 1 秒         | 默认档，兼顾   |
| `no`       | 完全不`fsync`，交给操作系统                  | 通常 30 秒   | 最快           |

> `always`的名义是"每条命令都刷盘"，实际上 Redis 会把同一时刻到达的多个命令合并成一次`write`+一次`fsync`（组提交），并且**在把回复发给客户端之前**完成。所以它保证的是"客户端收到 OK 就意味着已经落盘"——代价是吞吐量断崖式下跌，而且极度依赖磁盘的`fsync`延迟，机械盘上基本不可用

> `everysec`是默认档，但它有一个不明显的延迟毛刺来源：`fsync`是后台线程做的，如果某次`fsync`卡住了，而主线程又要往**同一个文件**写，Linux 上对正在`fsync`的文件调用`write(2)`会阻塞。Redis 的做法是用缓冲区把`write`最多推迟 2 秒，2 秒后即使`fsync`还没完成也要硬写——这时主线程就被拖住了。**所以磁盘 I/O 抖动会直接变成 Redis 的延迟尖峰**，这也是`no-appendfsync-on-rewrite`存在的理由

> `no`最快但最不可控：Linux 默认`dirty_expire_centisecs`是 30 秒，正常情况最多丢 30 秒，但内核在内存压力下会乱序刷盘，实际丢多少说不准。一般只在"数据丢了也能从别处重建"时才用

##### 重写（Rewrite）

AOF 只追加不修改，所以只会越来越大。对同一个计数器`INCR`一万次，AOF 里就有一万条命令，而重放它们**只是为了得到最后那个数字**，前 9999 条毫无意义。重写就是按当前数据集生成"最短的等价命令序列"，把文件压回真实数据量

RDB 里讲的`fork`+写时复制在这里完全一样，开销和风险也完全一样（`fork`阻塞、写入量大时内存接近翻倍），所以不再重复

```
触发重写
  │
  ├─ 父进程：新建 incr(2) 继续追加新命令 ──────┐
  │                                          │
  └─ 子进程：按 fork 那一刻的数据集           │  两个进程并行，
             生成新的 base ──────────────────┤  互不干扰
                                             │
  两边都就绪 → 用临时 manifest 原子替换 ──────┘
  → 删掉旧 base 和 incr(1)
```

自动重写需要**同时**满足两个条件：

- `auto-aof-rewrite-percentage 100`：当前 AOF 大小比"上次重写之后的大小"增长了 100%（即翻倍）
- `auto-aof-rewrite-min-size 64mb`：AOF 本身至少要有这么大

> 第一个条件是**相对增长率**而不是绝对值，这解释了一个常见困惑："AOF 明明还很小，怎么一直在重写？"——刚启动时 AOF 可能只有几 KB，随便写点数据就翻倍了。所以必须靠`auto-aof-rewrite-min-size`兜底。把它设成`0`则关闭自动重写，只能手动`BGREWRITEAOF`

> 反复失败的重写会被**限流**：Redis 7 引入了退避机制，重试间隔越来越长，避免重写一直失败时疯狂生成新的 incr 文件把目录撑爆

##### 常用配置

| 配置项                          | 默认值          | 作用                                       |
| ------------------------------- | --------------- | ------------------------------------------ |
| `appendonly`                    | `no`            | 是否开启 AOF                               |
| `appendfilename`                | `appendonly.aof`| 文件名（Redis 7 起实际会加上序号和后缀）   |
| `appenddirname`                 | `appendonlydir` | 存放多部分 AOF 的目录                      |
| `appendfsync`                   | `everysec`      | 刷盘策略，见上文                           |
| `auto-aof-rewrite-percentage`   | `100`           | 增长多少比例触发重写，`0` 表示关闭         |
| `auto-aof-rewrite-min-size`     | `64mb`          | 触发重写的最小文件大小                     |
| `no-appendfsync-on-rewrite`     | `no`            | 重写期间暂停`fsync`，避免 I/O 争抢         |
| `aof-use-rdb-preamble`          | `yes`           | base 文件用 RDB 格式，见下文               |
| `aof-load-truncated`            | `yes`           | 文件末尾截断时仍然照常启动                 |
| `aof-rewrite-incremental-fsync` | `yes`           | 重写时每写入 32MB 就刷一次盘               |
| `aof-timestamp-enabled`         | `no`            | 在 AOF 里插入时间戳注释，便于按时间点恢复  |

> `no-appendfsync-on-rewrite`是把双刃剑：开着能避免主进程的`fsync`和重写子进程的写盘互相抢 I/O 造成延迟尖峰，代价是这段时间内**相当于`appendfsync no`**，宕机可能丢 30 秒数据。用不用取决于你更怕延迟还是更怕丢数据

> `aof-rewrite-incremental-fsync`同理，它把重写过程中的刷盘从"最后一次性刷一大块"改成"每 32MB 刷一次"，避免重写末尾出现一次巨大的 I/O 尖峰

##### 相关 INFO 字段

```
aof_enabled                   是否开启了 AOF（0/1）
aof_rewrite_in_progress       是否有重写在跑（0/1）
aof_rewrite_scheduled         是否有重写被排期等待（0/1）
aof_last_rewrite_time_sec     上次重写耗时（秒）
aof_current_rewrite_time_sec  正在进行的重写已耗时
aof_last_bgrewrite_status     上次重写结果：ok / err
aof_last_write_status         上次写 AOF 的结果，err 说明磁盘可能满了
aof_last_cow_size             上次重写期间 COW 占用的字节数
aof_rewrites                  本次启动以来重写了多少次
```

> `aof_rewrite_scheduled`是`1`说明"重写被请求了但一直没真正开始"——它要等当前的 RDB 保存或其他重写结束。如果长时间都是 1，多半是有个卡住的后台任务，值得排查

> `aof_last_write_status`变成`err`是最需要告警的一条：它意味着命令写不进 AOF 了（通常是磁盘满），此时 Redis 还在正常对外服务，**但持久化已经悄悄失效**

##### 加载与损坏修复

**只要 AOF 开着，重启时就只加载 AOF，不加载 RDB**（AOF 理论上更完整）。加载过程是按 manifest 找到 base 和所有 incr，先加载 base，再依次回放 incr，全程阻塞，数据集大时比加载 RDB 慢得多

进程如果在追加过程中被`kill -9`，AOF 末尾可能出现**只写了一半的命令**（截断），这时有两个选择：

- `aof-load-truncated yes`（默认）：丢掉不完整的那一小段，加载其余部分并正常启动，日志里会打警告并给出截断的偏移量
- `aof-load-truncated no`：直接启动失败。适合"宁可服务起不来也不能静默丢数据"的场景

修复工具：

```
redis-check-aof --fix appendonlydir/appendonly.aof.1.incr.aof
```

会检查文件并**直接截断掉损坏的部分**，所以跑之前务必备份原文件

> 用多部分 AOF 时，日志里通常会指出具体是哪个文件出问题，要修的是那一个 incr 文件而不是整个目录。另外`--fix`是"丢掉损坏的尾部"，不是"把坏数据修好"——它接受的是可控的数据损失

##### 非确定性命令会被改写

AOF 存的是命令，但有些命令**在不同时刻重放会得到不同结果**。如果原样写进 AOF，重放出来的数据集就可能和原实例不一致。所以 Redis 在写入 AOF（以及发给从节点）之前，会先把这类命令改写成确定性形式：

| 你发出的命令                        | 写进 AOF 的形式                  | 为什么                                               |
| ----------------------------------- | -------------------------------- | ---------------------------------------------------- |
| `EXPIRE key 60`、`SET key v EX 60`  | `PEXPIREAT key <绝对毫秒时间戳>` | 相对时间会漂移，"60 秒后"在重放那一刻早就过去了      |
| `SPOP key`                          | `SREM key <实际弹出的成员>`      | 弹出哪个成员是随机的，重放时必须指定具体是哪一个     |
| `INCRBYFLOAT key 0.1`               | `SET key <计算后的结果>`         | 浮点实现差异可能导致末位不同                         |
| `HINCRBYFLOAT key field 0.1`        | `HSET key field <结果>`          | 同上                                                 |
| `XADD key * field value`            | `XADD key <实际生成的 ID> ...`   | 自动生成的 ID 和当前时间有关，重放时必须固定下来     |

> 这是**传播层面**的改写，你发出去的命令和执行结果都不变，只是落进 AOF 的东西换了形式。理解这一点就能想通"AOF 重放为什么一定能得到和原实例完全一致的数据集"

##### 优缺点

**优点**

- **丢得少**：`everysec`最多丢 1 秒，`always`几乎不丢，这是 RDB 给不了的
- **纯文本、可审计**：出问题可以直接看文件内容，甚至手工裁剪命令做部分恢复；RDB 是二进制，做不到
- **追加写不需要 seek**：纯顺序 I/O，在机械盘上也能跑得很好
- **损坏影响可控**：末尾截断只丢最后一点，不像 RDB 需要整个文件通过校验

**缺点**

- **文件大**：存的是操作流而不是数据集，同样数据量下比 RDB 大得多，重建同一个 list 可能要用几百条`RPUSH`
- **恢复慢**：重启要逐条回放，大数据集下可能比 RDB 慢一个数量级
- **写入侧有持续开销**：`always`在高吞吐场景基本不可用，`everysec`也会带来延迟毛刺
- **重写代价和 RDB 一样**：同样是`fork`+COW，同样有阻塞和内存翻倍的风险

##### 混合持久化

`aof-use-rdb-preamble yes`（Redis 4.0 起，默认开启）让重写生成的 **base 文件用 RDB 格式**写，而不是 AOF 格式：前半段是紧凑的 RDB 二进制快照，后半段才是 base 生成之后追加的命令

```
appendonly.aof.1.base.rdb     ← RDB 格式，直接按结构加载，快
appendonly.aof.1.incr.aof     ← AOF 格式，逐条回放，只有一小段
```

这么做的收益很直接：恢复时不用回放全部历史命令，绝大部分数据靠加载 RDB 一次性完成，只回放 base 之后的那一小段增量——**兼顾了 RDB 的恢复速度和 AOF 的低丢失率**，文件也小很多。代价是 base 部分不再是人类可读的文本

> 关掉它（`aof-use-rdb-preamble no`）后 base 文件名会变成`.base.aof`，整个文件都是可读的 AOF 格式。只有在真的需要"纯文本可审计"时才值得关

> 到这一步可以把两种持久化的关系收成一句话：**RDB 负责"快点恢复、方便备份"，AOF 负责"尽量不丢"**。生产环境的常规做法是两个都开——用 AOF 保证数据安全，用 RDB 保证重启速度和备份能力，再配合混合持久化把两者的恢复路径合并成一条
