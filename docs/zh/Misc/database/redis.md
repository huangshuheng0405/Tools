# Redis

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

- SET key value
- GET key
- DEL key
- EXISTS key

### hash

哈希表，一个key对应多个field-value对，适合存储对象的多个属性，可以单独修改某个字段不影响其他字段

命令

- HSET key field value
- HGET key field
- HDEL key field
- HGETALL key

### list

一个有序的字符串列表，底层是双向链表，支持头插、尾插和弹出元素

命令

- LPUSH key value
- RPUSH key value
- LPOP key
- RPOP key
- LANGE key start end
- LREM key count value
- LSET key index value

### set

一个无序且元素唯一的字符串集合。支持数学上的交集、并集、差集运算

命令

- SADD key value
- SREM key value
- SMEMBERS key
- SCARD key
