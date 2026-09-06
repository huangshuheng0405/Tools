# Lombok

如果你用的是`Maven`，在`pom.xml`添加：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

## 常用注解

### @Getter

自动生成getter

### @Setter

自动生成setter

### @NoArgsConstructor

自动生成无参构造函数

### @AllArgsConstructor

自动生成所有字段的构造函数

### @ToString

自动生成`toString()`

调用`System.out.println(user)`，会得到类似：`User(id=1, name=张三)`

### @Data

最常见的一个，包含了`@Getter`、`@Setter`、`@ToString`等注解。

### @Builder

这个也常用

```java
@Builder
public class User {
    private Long id;
    private String username;
}

User user = User.builder()
        .id(1L)
        .username("张三")
        .build();
```

在字段多的时候非常好用

### @Slf4j

```java
@Slf4j
@Service
public class UserService {

    public void test() {
        log.info("查询用户");
    }
}
```

Lombok会自动帮你创建：

```java
private static final Logger log = ...
```
