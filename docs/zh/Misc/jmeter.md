# JMeter

Apache JMeter 是一个开源的**性能/压力测试**工具，用 Java 编写，可以模拟大量并发请求来测试接口或系统的吞吐量和稳定性。

常用于：

- 压测 HTTP 接口（如 REST API）

- 模拟高并发场景（如缓存击穿、秒杀）

- 测试数据库、消息队列等其他协议

## 安装

需要先装好 JDK（8 及以上）

1. 到 [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi) 下载二进制包（zip）
2. 解压后进入 `bin` 目录
3. Windows 双击 `jmeter.bat` 启动（会弹出 GUI 界面）

> macOS / Linux 用 `jmeter` 命令启动

## 界面组成

```
测试计划 (Test Plan)
 └── 线程组 (Thread Group)          # 模拟一批并发用户
      └── 取样器 (Sampler)          # 发什么请求，如 HTTP 请求
      └── 监听器 (Listener)         # 怎么查看结果，如聚合报告
```

## 基本使用流程

### 1. 创建测试计划

启动后默认有一个 "Test Plan"，右键 → `Add > Threads > Thread Group` 添加线程组

### 2. 配置线程组（模拟并发）

线程组就是模拟一群用户同时发请求，参数含义：

| 参数                          | 含义                             |
| --------------------------- | ------------------------------ |
| Number of Threads (users)   | 线程数，即模拟多少个并发用户                 |
| Ramp-up period (seconds)    | 在多少秒内把线程全部启动完，0 表示瞬间全部启动       |
| Loop Count                  | 每个线程循环执行多少次，勾选 Infinite 表示无限循环 |
| Same user on each iteration | 每个线程循环时是否使用同一个用户               |

```
线程数 = 50，Ramp-up = 0，Loop Count = 100
=> 瞬间 50 个用户同时开始，每人连续请求 100 次
```

### 3. 添加 HTTP 请求

右键线程组 → `Add > Sampler > HTTP Request`

| 参数                | 含义                   |
| ----------------- | -------------------- |
| Protocol          | `http`               |
| Server Name or IP | 主机地址，如 `localhost`   |
| Port Number       | 端口，如 `8080`          |
| Method            | `GET` / `POST` 等     |
| Path              | 请求路径，如 `/query?id=1` |
| Body Data         | POST 请求体             |

### 4. 添加监听器查看结果

右键线程组 → `Add > Listener`，常用的：

- **View Results Tree（查看结果树）**：看每个请求的响应详情，方便调试

- **Summary Report（聚合报告）**：统计吞吐量、平均响应时间等，压测主要看它

- **Graph Results（图形结果）**：响应时间的折线图

聚合报告重点看这几列：

| 指标         | 含义                 |
| ---------- | ------------------ |
| Samples    | 总请求数               |
| Average    | 平均响应时间（ms）         |
| Error %    | 错误率                |
| Throughput | 吞吐量（每秒处理的请求数），越大越好 |

## 常用技巧

### 断言（检查响应是否正确）

右键 HTTP 请求 → `Add > Assertions > Response Assertion`

配置 `Response Text` 包含某个关键字，比如接口返回的 `"success"`，响应不对就标记为失败，方便统计错误率

### 多个不同参数（CSV）

请求参数固定时所有线程发的都是一样的请求，想模拟不同用户就用 CSV 数据文件：

1. 准备一个 `users.csv`，第一行是变量名：`id`
2. 右键 HTTP 请求 → `Add > Config Element > CSV Data Set Config`
3. Filename 填 csv 路径，Variable Names 填 `id`
4. 请求路径里写 `${id}` 即可引用

### 设置 Header（带 Token 的接口）

右键 HTTP 请求 → `Add > Config Element > HTTP Header Manager`

比如需要认证的接口加 `Authorization: Bearer <token>`

### 定时器（控制请求间隔）

右键线程组 → `Add > Timer > Constant Throughput Timer`

可以限制每秒请求数，避免把本地服务直接打挂

## 实战：压测缓存击穿（逻辑过期）

场景：一个热点 key 缓存过期瞬间，大量并发请求同时打到接口，验证**逻辑过期**方案下数据库是否扛得住。

### 步骤

1. 起一个 Spring Boot 服务，接口里实现逻辑过期查询（缓存不设物理过期时间，过期时间存在 value 里，过期后异步重建缓存）
2. JMeter 建线程组模拟高并发，比如：

```
Number of Threads = 200
Ramp-up = 0        # 瞬间并发，模拟热点 key 过期的瞬间
Loop Count = 10
```

1. HTTP 请求指向热点接口，如 `GET /hot/{id}`
2. 先手动触发一次缓存过期（或等逻辑过期时间到），再点运行，观察：

   - **聚合报告**：看 Error % 是否为 0、平均响应时间是否稳定

   - **服务端日志**：看数据库查询次数是否只出现一两次（逻辑过期应该只有很少的请求打到数据库，其余走缓存）

### 对比验证

同样用上面的线程组，改成**没有**逻辑过期保护的接口再压一遍，对比数据库被打的请求数，就能直观看出逻辑过期的作用。

> 压测时注意控制 Ramp-up 和定时器，本地开发机性能有限，并发拉太高可能把服务或数据库直接压崩。

