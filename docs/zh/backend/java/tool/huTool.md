# Hutool

一个Java工具类

```
Hutool
├── Bean 操作
├── 字符串处理
├── 集合处理
├── 日期时间
├── JSON
├── 加密
├── HTTP
├── 文件
├── 随机数
├── JWT
└── ...
```

## 引入依赖

Hutool **没有 Spring Boot Starter**，它就是一个普通的工具 jar。加完依赖直接调静态方法 —— 不用 `@Configuration`、不用 `@EnableXxx`、不用写任何配置项。

### 一把梭：hutool-all

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.47</version>
</dependency>
```

上面列的那些功能，全都打在这一个包里。

**版本号必须自己写。** `cn.hutool` 不在 `spring-boot-dependencies` 的管理范围内，不像 `spring-boot-starter-web` 那样能省掉 `<version>` —— 漏了直接编译报错。

### Gradle

```groovy
implementation 'cn.hutool:hutool-all:5.8.47'
```

### 按需引入单模块

嫌 `hutool-all` 一整个包太重，可以只引要用的模块。命名规律是 `cn.hutool:hutool-<模块名>`：

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-core</artifactId>
    <version>5.8.47</version>
</dependency>

<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-json</artifactId>
    <version>5.8.47</version>
</dependency>
```

`hutool-core` 是基础包，`BeanUtil`、`StrUtil`、`DateUtil` 这些日常最常用的都在里面。只想做 Bean 拷贝的话，引这一个就够，不用上 `hutool-all`。

注意**模块的划分和上面那张功能图不是一回事** —— 那张图是按功能分的，字符串、集合、日期这几类其实全挤在 `hutool-core` 里，不各占一个模块。找对应模块时以 `hutool-` 开头的实际 artifactId 为准。

### 两个坑

**不需要注入。** Hutool 全是静态方法，下面这么写是错的：

```java
@Autowired
private BeanUtil beanUtil;   // 注入不了，BeanUtil 根本不是 Bean
```

直接在 Service 里 `BeanUtil.copyProperties(user, UserDTO.class)` 就行。

**外部类库要自己引。** Hutool 里封装第三方的模块，那些依赖大多是 `provided` / `optional` 声明的，不会传递过来。比如 `hutool-extra` 依赖的 servlet-api 就是 `provided` + `optional`，得由容器自己提供 —— Spring Boot 项目里 `spring-boot-starter-web` 已经带了，所以通常不用管；但换成别的类库（比如 POI）就要留意。

## BeanUtil

### copyProperties

它会按照**属性名**自动复制

```java
UserDTO dto = BeanUtil.copyProperties(user, UserDTO.class);

User
 ↓
id        → id
nickName  → nickName
icon      → icon
 ↓
UserDTO
```

### beanToMap

把Java Bean转成Map

```java
Map<String, Object> map = BeanUtil.beanToMap(userDTO);
```

## MapUtil

专门处理Map的工具

```java
MapUtil.getStr(map, "name");

// 相当于
Object value = map.get("name");

String name = value == null ? null : value.toString();
```

