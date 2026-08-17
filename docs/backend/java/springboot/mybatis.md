# Mybatis

[Mybatis](https://mybatis.org/)

![mybatis-logo](/Java/SpringBoot/mybatis-logo.png)

首先添加依赖，如果你使用的是`Maven`：

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

版本要和你的Spring Boot版本匹配

配置数据库

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/你的数据库名字
    username: root
    password: 密码
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.entity
```

这里的`mapper-locations: classpath:mapper/*.xml`表示

> 去 `resources/mapper` 目录找 MyBatis 的 XML 文件。

所以我们项目一般这样组织

```
src
├── main
│   ├── java
│   │   └── com.example
│   │       ├── controller
│   │       ├── service
│   │       ├── mapper
│   │       └── entity
│   │
│   └── resources
│       ├── mapper
│       │   └── UserMapper.xml
│       └── application.yml
```

## XML映射

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.UserMapper">

    <select id="selectById"
            resultType="com.example.entity.User">

        SELECT *
        FROM user
        WHERE id = #{id}

    </select>

</mapper>
```

这里`namespace="com.example.mapper.UserMapper"`对应

```java
package com.example.mapper;

public interface UserMapper {
}
```

这里`id="selectById"`对应

```java
User selectById(Long id);
```

## #{}和${}

这两个都是用于字符串拼接

但是推荐使用`#{}`Mybatis会使用预编译参数，比较安全

而`${}`是**字符串直接拼接**，可能产生SQL注入

`${}`一般只用于一些无法使用`#{}`的场景，例如动态排序字段，但必须自己做白名单限制

## 动态SQL

对于一些字段可以有，也可以没有，那么SQL就需要动态变化

```xml
<select id="select" resultType="User">

    SELECT *
    FROM user

    <where>

        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>

        <if test="phone != null and phone != ''">
            AND phone = #{phone}
        </if>

    </where>

</select>
```

`<Where>`很重要，比如你直接

```xml
SELECT *
FROM user

<if test="username != null">
    AND username = #{username}
</if>
```

可能出现

```xml
SELECT *
FROM user
AND username = '张三'
```

这是错误的，但是Mybatis会帮你处理`<where>`和多余的`AND`

## `<foreach>`批量查询

例如要查询很多个数据

```sql
SELECT *
FROM user
WHERE id IN (1, 3, 5, 7)
```

Mapper

```java
List<User> selectByIds(@Param("ids") List<Long> ids);
```

XML

```xml
<select id="selectByIds" resultType="User">

    SELECT *
    FROM user
    WHERE id IN

    <foreach collection="ids"
             item="id"
             open="("
             separator=","
             close=")">

        #{id}

    </foreach>

</select>
```

这里`collection="ids"`对于`@Params("ids")`

## Mybatis结果映射

假设数据库`user_name`，Java的字段是`userName`

这叫**下划线转驼峰**

可以配置

```yml
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

这样`user_name`$\rightarrow$`userName`，Mybatis就能自动映射

如果字段完全不一样，那么就需要手动映射了，假设数据库字段`user_name`，Java字段`name`

```xml
<resultMap id="UserMap"
           type="com.example.entity.User">

    <id property="id" column="id"/>

    <result property="name" column="user_name"/>

    <result property="phone" column="phone"/>

</resultMap>
```

然后

```xml
<resultMap id="UserMap"
           type="com.example.entity.User">

    <id property="id" column="id"/>

    <result property="name" column="user_name"/>

    <result property="phone" column="phone"/>

</resultMap>
```

这里的`property`代表Java属性，而`column`代表数据库字段
