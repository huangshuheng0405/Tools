# Configuration 配置类

配置类是用来**集中管理 Bean 和配置**的类，替代传统的 XML 配置。

## @Configuration

告诉 Spring 这是一个配置类，里面可以用 `@Bean` 定义交给 Spring 容器管理的对象

```java
@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyService();
    }
}
```

配置类本质上也是一个 Bean，启动时会被 Spring 扫描、增强（CGLIB 代理）

## proxyBeanMethods（Full 与 Lite 模式）

`@Configuration` 有个 `proxyBeanMethods` 属性，默认 `true`

```java
@Configuration(proxyBeanMethods = true)   // Full 模式（默认）
@Configuration(proxyBeanMethods = false)  // Lite 模式
```

- **Full 模式（true）**：配置类被 CGLIB 代理，`@Bean` 方法之间互相调用时，保证返回的是容器里的同一个单例
- **Lite 模式（false）**：不代理，`@Bean` 方法之间互相调用会创建新对象，但启动更快、更轻量

```java
@Configuration(proxyBeanMethods = false)
public class AppConfig {

    @Bean
    public A a() {
        return new A(b());   // Lite 模式下这里会 new 一个新的 B，不是容器里的单例
    }

    @Bean
    public B b() {
        return new B();
    }
}
```

> Spring Boot 官方推荐：**没有 Bean 之间互相调用需求时，用 `proxyBeanMethods = false`**（自动配置类基本都这么写），能加快启动、减少代理开销

## @ConfigurationProperties 类型安全配置

把 `application.yml` 里的一组配置，绑定到一个 Java 对象上，避免到处写 `@Value`

### 基本用法

`application.yml`

```yaml
app:
  name: my-app
  version: 1.0.0
  timeout: 5000
```

配置类

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private Integer timeout;
    // getter / setter
}
```

### 让配置类生效

三种方式任选其一

```java
// 方式1：在配置类上用 @EnableConfigurationProperties 注册
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {
}

// 方式2：配置类自己加 @Component（会被组件扫描到）
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
}

// 方式3：启动类加 @ConfigurationPropertiesScan 扫描指定包
@SpringBootApplication
@ConfigurationPropertiesScan("com.example.config")
public class Application {
}
```

### 构造器绑定（Constructor Binding）

用 `final` 字段 + 构造器，配置对象**不可变**，更安全

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final String name;
    private final Integer timeout;

    // 单个有参构造器，Spring Boot 3+ 自动走构造器绑定，不用加 @ConstructorBinding
    public AppProperties(String name, Integer timeout) {
        this.name = name;
        this.timeout = timeout;
    }
}
```

> Spring Boot 3.0 起：类只有一个有参构造器时，默认就用构造器绑定；有多个构造器才需要 `@ConstructorBinding` 指定

### 松散绑定（Relaxed Binding）

yml 里的写法和 Java 字段名可以不完全一致，以下都能绑到 `maxSize`

```yaml
app:
  max-size: 10     # 推荐（kebab-case）
  maxSize: 10      # 驼峰
  max_size: 10     # 下划线
```

## @Value 注入单个值

只想取配置里的某一个值时，用 `@Value` 更方便

```java
@Component
public class MyService {

    @Value("${app.name}")
    private String appName;

    @Value("${app.timeout:3000}")   // 冒号后面是默认值
    private Integer timeout;
}
```

## @ConfigurationProperties vs @Value

| | @ConfigurationProperties | @Value |
| --- | --- | --- |
| 绑定 | 一组配置（批量） | 单个值 |
| 松散绑定 | 支持 | 不支持 |
| 复杂类型 | 支持 List / Map / 嵌套对象 | 支持 SpEL，但不适合复杂结构 |
| 构造器绑定 | 支持 | 不支持 |
| 校验 | 支持 `@Validated` + JSR-303 | 不支持 |
| 适用场景 | 配置多、结构化 | 零散取一两个值 |

## 实践：结合前面的笔记

前面几篇里其实都写到了配置类，可以对上号

- 拦截器注册 → `WebConfig implements WebMvcConfigurer`（interceptor.md）
- Redis 序列化器 → `RedisConfig` 里 `@Bean RedisTemplate`（springDataRedis.md）
- MyBatis-Plus 分页插件 → `MybatisPlusConfig` 里 `@Bean MybatisPlusInterceptor`（mybatisPlus.md）

它们的共同套路

```
@Configuration 标记配置类
        ↓
@Bean 定义第三方 / 框架对象（不能改源码加 @Component 的）
        ↓
交给 Spring 容器
        ↓
需要时 @Resource / @Autowired 注入
```

## TODO 待补充

- [ ] `@Import` 导入其他配置类 / 配置
- [ ] 多环境配置 `application-{profile}.yml`
- [ ] 配置类上做参数校验 `@Validated`
