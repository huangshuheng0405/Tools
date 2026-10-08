# Spring Boot 定时任务

Java 里做定时任务有两条路,选哪条取决于**你的服务部署几个实例**。

| 方案              | 依赖                     | 适合场景                         |
| ----------------- | ------------------------ | -------------------------------- |
| Spring `@Scheduled` | Spring Boot 自带,零依赖 | 单机部署,任务简单               |
| XXL-JOB           | 要额外部署调度中心       | 多实例部署,需要统一管理和可视化  |

判断标准很简单:**部署一个实例用 `@Scheduled`,部署多个实例就得用 XXL-JOB**。原因下面会讲。

## 一、Spring @Scheduled

### 开启

启动类(或任意配置类)上加 `@EnableScheduling`:

```java
@EnableScheduling
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**不加这个注解,`@Scheduled` 完全不会生效** —— 而且不报错,任务就是不跑,是新手最常卡住的地方。

### 四种调度方式

```java
@Component
public class MyTask {

    // 1. 固定频率:从「上一次开始执行」的时间点算起,每 5 秒一次
    @Scheduled(fixedRate = 5000)
    public void byFixedRate() { }

    // 2. 固定延迟:从「上一次执行结束」的时间点算起,隔 5 秒再执行
    @Scheduled(fixedDelay = 5000)
    public void byFixedDelay() { }

    // 3. 首次延迟:应用启动后等 10 秒再开始,配合上面两个用
    @Scheduled(initialDelay = 10000, fixedRate = 5000)
    public void withInitialDelay() { }

    // 4. cron:按表达式触发,最灵活
    @Scheduled(cron = "0 0 2 * * ?")
    public void byCron() { }
}
```

`fixedRate` 和 `fixedDelay` 的区别,任务本身耗时 3 秒、间隔 5 秒时:

```
fixedRate = 5000  (从开始时间算)
0s ─── 执行 ─── 3s         5s ─── 执行 ─── 8s        10s ─── 执行
                             ↑ 间隔 5s(从 0s 算起)

fixedDelay = 5000 (从结束时间算)
0s ─── 执行 ─── 3s        8s ─── 执行 ─── 11s       16s ─── 执行
                            ↑ 间隔 5s(从 3s 算起)
```

**日常用 `fixedDelay`**。`fixedRate` 有个隐患:如果任务执行时间超过了间隔(比如间隔 5 秒但任务跑了 8 秒),下一次会立刻触发,任务堆积甚至并发执行 —— 除非线程池只有一个线程(那样就是纯堆积)。

Spring 6 / Boot 3 之后可以带时间单位,不用自己算毫秒:

```java
@Scheduled(fixedRate = 5, timeUnit = TimeUnit.SECONDS)
```

默认单位是毫秒。

### cron 表达式

**Spring 的 cron 是 6 个字段,不是 Linux crontab 的 5 个。**

```
 ┌───────────── second (0-59)              秒
 │ ┌───────────── minute (0 - 59)          分
 │ │ ┌───────────── hour (0 - 23)          时
 │ │ │ ┌───────────── day of the month (1 - 31)    日
 │ │ │ │ ┌───────────── month (1 - 12) (or JAN-DEC)  月
 │ │ │ │ │ ┌───────────── day of the week (0 - 7)   周
 │ │ │ │ │ │          (0 or 7 is Sunday, or MON-SUN)
 * * * * * *
```

> 从网上抄 crontab 表达式时一定要数一下位数。`0 2 * * *`(凌晨 2 点,Linux 写法)直接放进 `@Scheduled` 会抛 `IllegalArgumentException`,Spring 要写成 `0 0 2 * * ?`。

字段特殊字符:

| 字符 | 含义                                                                 |
| ---- | -------------------------------------------------------------------- |
| `*`  | 任意值                                                               |
| `?`  | 只在「日」和「周」字段可用,等价于 `*`                                |
| `,`  | 列表,如 `6,19` 表示 6 点和 19 点                                     |
| `-`  | 范围(含两端),如 `8-10`                                               |
| `/`  | 步长,如 `0/30` 从 0 开始每 30 一次                                   |
| `L`  | 日字段:当月最后一天(`L-3` 倒数第三天);周字段:最后一个周几(`5L` 最后一个周五) |
| `W`  | 日字段:最接近 n 的工作日(`1W` 当月第一个工作日)                     |
| `#`  | 周字段:第几个周几(`5#2` 当月第二个周五)                             |

官方给的例子,直接当速查表用:

| 表达式                     | 含义                                   |
| -------------------------- | -------------------------------------- |
| `0 0 * * * *`              | 每小时整点                             |
| `*/10 * * * * *`           | 每 10 秒                               |
| `0 0 0 * * *`              | 每天零点                               |
| `0 0 2 * * *`              | 每天凌晨 2 点                          |
| `0 0 8-10 * * *`           | 每天 8、9、10 点整点                   |
| `0 0 6,19 * * *`           | 每天早上 6 点、晚上 7 点               |
| `0 0/30 8-10 * * *`        | 每天 8:00、8:30、9:00、9:30、10:00、10:30 |
| `0 0 9-17 * * MON-FRI`     | 工作日 9 点到 17 点整点                |
| `0 0 0 25 DEC ?`           | 每年圣诞节零点                         |
| `0 0 0 L * *`              | 每月最后一天零点                       |
| `0 0 0 L-3 * *`            | 每月倒数第三天零点                     |
| `0 0 0 * * 5L`             | 每月最后一个周五零点                   |
| `0 0 0 * * THUL`           | 每月最后一个周四零点                   |
| `0 0 0 1W * *`             | 每月第一个工作日零点                   |
| `0 0 0 LW * *`             | 每月最后一个工作日零点                 |
| `0 0 0 ? * 5#2`            | 每月第二个周五零点                     |
| `0 0 0 ? * MON#1`          | 每月第一个周一零点                     |

月份和星期可以用英文缩写(`JAN`-`DEC`、`MON`-`SUN`),大小写都行。

> `@Scheduled` 默认用服务器时区。服务器是 UTC 而你想按北京时间跑,要显式指定:`@Scheduled(cron = "0 0 2 * * ?", zone = "Asia/Shanghai")`。

### 线程池(必配)

**`@Scheduled` 默认只有一个线程**,所有任务串行执行。这是最容易踩的坑:

```java
@Scheduled(cron = "0 * * * * ?")   // 每分钟
public void taskA() {
    Thread.sleep(90_000);          // 假设要跑 90 秒
}

@Scheduled(cron = "0 * * * * ?")
public void taskB() {
    // 因为 taskA 占着唯一的线程,taskB 会被一直拖延
}
```

配置线程池:

```yaml [application.yml]
spring:
  task:
    scheduling:
      thread-name-prefix: scheduling-
      pool:
        size: 10
```

如果开了虚拟线程(Java 21+,Spring Boot 3.2+),会自动换成虚拟线程的调度器,`pool.size` 就不起作用了:

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

需要更细的控制(比如关闭时等待任务跑完)时,自己定义 `TaskScheduler`:

```java
@Configuration
@EnableScheduling
public class ScheduleConfig implements SchedulingConfigurer {

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10);
        scheduler.setThreadNamePrefix("scheduling-");
        // 应用关闭时等在跑的任务执行完
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(30);
        scheduler.initialize();
        taskRegistrar.setTaskScheduler(scheduler);
    }
}
```

### 查看有哪些定时任务

加了 Actuator 之后可以直接看:

```
GET /actuator/scheduledtasks
```

返回当前注册的定时任务、cron 表达式和上次/下次执行时间,排查「任务到底跑没跑」很有用。

## 二、XXL-JOB

### 为什么需要它

`@Scheduled` 有个绕不过去的问题:**任务写在代码里,每个实例都会跑一遍**。

三个实例部署时:

```
实例 A ─┐
实例 B ─┼─→ 同一时刻三个实例都执行 @Scheduled(cron = "0 0 2 * * ?")
实例 C ─┘   → 数据被处理三遍
```

常见的土办法都不太靠谱:

| 解法                       | 问题                                       |
| -------------------------- | ------------------------------------------ |
| 只让一个实例开定时任务      | 那台挂了任务就全停了                       |
| 加 Redis 分布式锁          | 能防重复,但锁超时、任务卡死都要自己处理    |
| 用配置开关控制              | 每次改配置要重启,还容易改漏                |

XXL-JOB 把调度这件事单独抽出来做成一个平台,顺带解决了一堆运维问题:

- 任务统一在 **Web 界面**管理,改 cron、停任务不用重启服务
- **失败重试**、超时告警、执行日志
- **分片广播**:一个大任务拆到多个实例并行处理
- 路由策略(轮询、故障转移、一致性 HASH 等)
- 执行器自动注册,扩容缩容不用改配置

版本:**3.4.2**(2026-06)。

### 架构

```
┌─────────────────────┐        调度(HTTP)
│   xxl-job-admin     │ ──────────────────────┐
│   (调度中心)         │                       ↓
│   Web 界面 + 触发器  │              ┌──────────────────┐
└─────────────────────┘              │  你的业务应用     │
                                     │  (执行器)         │
      ↑ 执行结果、日志                 │  @XxlJob 方法     │
      └──────────────────────────────└──────────────────┘
```

- **调度中心**(`xxl-job-admin`):一个独立的 Web 应用,负责按 cron 触发任务、记录日志。整个公司部署一套就行。
- **执行器**:你的业务应用,引一个 `xxl-job-core` 依赖,启动时自动向调度中心注册。

调度中心只负责「什么时候触发」,真正的业务逻辑还是在你的项目里,所以任务代码还是写在业务项目中,只是触发权交给了调度中心。

### 接入步骤

**第一步:部署调度中心**

官方提供了 Docker Compose,最省事:

```bash
git clone --branch "$(curl -s https://api.github.com/repos/xuxueli/xxl-job/releases/latest | jq -r .tag_name)" https://github.com/xuxueli/xxl-job.git

cd xxl-job
mvn clean package -Dmaven.test.skip=true

cd docker
cp .env .env.local    # 按需改端口、数据库密码
docker compose up -d
```

启动后访问 `http://localhost:8080/xxl-job-admin`,默认账号 `admin / 123456`。

**第二步:业务项目引依赖**

```xml
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
    <version>3.4.2</version>
</dependency>
```

**第三步:配置**

```yaml [application.yml]
xxl:
  job:
    admin:
      addresses: http://127.0.0.1:8080/xxl-job-admin
      accessToken: default_token      # 注意在 admin 下,不是 executor 下
      timeout: 3
    executor:
      enabled: true
      appname: demo-executor          # 执行器名字,调度中心按这个名字找
      port: 9999                      # 执行器端口,同机多实例要错开
      logpath: /data/applogs/xxl-job/jobhandler
      logretentiondays: 30
      excludedpackage:                # 不想被扫成 Job 的包,逗号分隔
```

`appname` 和 `accessToken` 是接入时最容易出错的两个:

- `appname` 要和调度中心「执行器管理」里新建的 AppName 完全一致,否则注册不上。
- `accessToken` 必须和调度中心 `application.properties` 里的 `xxl.job.accessToken` 一致,不一致会报 `The access token is wrong`。

> **配置位置在 3.x 变了。** `accessToken` 现在挂在 `xxl.job.admin` 下,网上 2.x 的教程写的是 `xxl.job.executor.accessToken` 或 `xxl.job.accessToken`,照抄会导致鉴权失败。以官方 3.4.2 的执行器示例(`xxl-job-executor-sample-springboot` 的 `application.properties`)为准。

**第四步:注册执行器 Bean**

```java
@Configuration
public class XxlJobConfig {

    @Value("${xxl.job.admin.addresses}")
    private String adminAddresses;

    @Value("${xxl.job.executor.appname}")
    private String appname;

    @Value("${xxl.job.executor.port}")
    private int port;

    @Value("${xxl.job.executor.logpath}")
    private String logPath;

    @Value("${xxl.job.executor.logretentiondays}")
    private int logRetentionDays;

    @Value("${xxl.job.admin.accessToken:}")
    private String accessToken;

    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        XxlJobSpringExecutor executor = new XxlJobSpringExecutor();
        executor.setAdminAddresses(adminAddresses);
        executor.setAppname(appname);
        executor.setPort(port);
        executor.setLogPath(logPath);
        executor.setLogRetentionDays(logRetentionDays);
        executor.setAccessToken(accessToken);
        return executor;
    }
}
```

**第五步:写任务**

```java
@Component
public class DemoJob {

    private static final Logger log = LoggerFactory.getLogger(DemoJob.class);

    @XxlJob("demoJobHandler")
    public void demoJobHandler() throws Exception {
        XxlJobHelper.log("XXL-JOB, Hello World.");

        // 业务逻辑
        List<Order> orders = orderMapper.selectTimeoutOrders();
        for (Order order : orders) {
            orderService.cancel(order);
        }

        XxlJobHelper.log("处理完成,共 {} 条", orders.size());
    }
}
```

`@XxlJob("demoJobHandler")` 里的名字,就是调度中心新建任务时填的 **JobHandler**。

几个和 `@Scheduled` 不同的地方:

- **方法可以带参数**(从调度中心传任务参数,用 `XxlJobHelper.getJobParam()` 取)。
- **用 `XxlJobHelper.log()` 打日志**,这些日志会回传到调度中心,能在 Web 界面上直接看。用 `log.info()` 打的日志在调度中心看不到。
- **任务的成败由框架判定**,方法正常返回算成功,抛异常算失败(可以在调度中心配失败重试)。也可以用 `XxlJobHelper.handleFail("原因")` 手动标记失败。

**第六步:调度中心建任务**

打开 Web 界面 → 任务管理 → 新增:

| 配置项       | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 执行器       | 选你刚注册的 `demo-executor`                                 |
| 任务描述     | 随便写                                                       |
| 调度类型     | CRON(也可以用固定速度、无调度只手动触发)                     |
| Cron         | 注意这里也是 **6 位**,格式和 Spring 一致                     |
| 运行模式     | BEAN(Java 代码写死那种)、GLUE(在网页上直接写脚本)          |
| JobHandler   | `demoJobHandler`,要和 `@XxlJob` 里的名字一致                 |
| 路由策略     | 多个实例时怎么选一个来跑,常用「第一个」「轮询」「一致性HASH」 |
| 阻塞处理策略 | 上次没跑完这次又来了怎么办,常用「单机串行」                 |
| 失败重试次数 | 失败后自动重试                                               |

建完点「执行一次」测试,没问题再启动。

### 分片广播

一个任务要处理 100 万条数据,单机跑太慢,可以让 3 个实例分摊。路由策略选「分片广播」,然后按分片号取自己的那部分:

```java
@XxlJob("shardingJobHandler")
public void shardingJobHandler() {
    int shardIndex = XxlJobHelper.getShardIndex();  // 当前分片序号,从 0 开始
    int shardTotal = XxlJobHelper.getShardTotal();  // 分片总数 = 实例数

    XxlJobHelper.log("分片 {}/{}", shardIndex, shardTotal);

    // 按 id 取模来分片:每个实例只处理属于自己那一片的数据
    List<Order> orders = orderMapper.selectSharding(shardIndex, shardTotal);
    for (Order order : orders) {
        orderService.process(order);
    }
}
```

对应的 SQL:

```sql
SELECT * FROM `order` WHERE MOD(id, #{shardTotal}) = #{shardIndex}
```

分片广播会让**所有实例同时执行**这个任务,每个实例拿到的 `shardIndex` 不同,各处理一部分。

## 注意事项

### @Scheduled

- **必须加 `@EnableScheduling`**,不加不报错但也不执行。
- **默认单线程**,一个任务卡住会拖垮其他所有任务。上线前一定配 `spring.task.scheduling.pool.size`。
- **cron 是 6 位**,和 Linux crontab 的 5 位不一样,抄表达式时注意。
- 任务方法**不能有参数**,返回值也会被忽略。
- 任务抛异常**不会**导致后续调度停止,Spring 会记日志然后等下一次触发。所以别指望异常能让任务停下来,该告警要自己接。
- 应用启动就会开始算,不想让它在启动瞬间跑就加 `initialDelay`。
- `@Scheduled` 的 cron 是**编译期写死的**,想改只能改代码重新发布。这也是 XXL-JOB 的卖点之一。

### XXL-JOB

- `appname` 和 `accessToken` 必须和调度中心对上,这两个对不上是接入失败的主要原因。
- **用 `XxlJobHelper.log()` 而不是 `log.info()`**,否则调度中心看不到日志。
- 执行器端口 `xxl.job.executor.port` 在同一台机器部署多个实例时要错开,否则端口冲突。
- 执行器默认 30 秒向调度中心发一次心跳,调度中心连续 90 秒收不到就会把该实例摘掉。
- 调度中心挂了任务不会触发,但它本身支持集群部署(多个 admin 连同一个数据库)。

### 混合使用

两者不冲突,可以同时存在。常见做法是:

- 简单的、单机跑的清理任务 → `@Scheduled`
- 重要的、需要监控和手动重跑的、多实例的业务任务 → XXL-JOB

只是要注意 **`@Scheduled` 的任务在多实例部署下依然会重复执行**,别把该走 XXL-JOB 的任务留在 `@Scheduled` 里。
