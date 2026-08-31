# Mybatis

[Mybatis](https://mybatis.org/)

![mybatis-logo](/Java/SpringBoot/mybatis-logo.png)

首先添加依赖，如果你使用的是`Maven`：

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>4.0.0</version>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

版本要和你的Spring Boot版本匹配

| mybatis-spring-boot-starter | Spring Boot | Java |
| --- | --- | --- |
| 4.0.x | 4.0+ | 17+ |
| 3.0.x | 3.2 ~ 3.5 | 17+ |
| 2.3.x | 2.7 | 8+ |

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

MyBatis 的增删改查分别对应 `<insert>`、`<delete>`、`<update>`、`<select>` 四种标签。

## #{}和${}

这两个都是用于占位符

但是推荐使用`#{}`，Mybatis会使用预编译参数，比较安全

```xml
SELECT * FROM user WHERE id = #{id}
```

而`${}`是**字符串直接拼接**，可能产生SQL注入

```xml
SELECT * FROM user ORDER BY ${column}
```

`${}`一般只用于一些无法使用`#{}`的场景，例如动态排序字段、动态表名，但必须自己做白名单限制

## 动态SQL

对于一些字段可以有，也可以没有，那么SQL就需要动态变化

### `<if>`

最基本的条件判断，条件成立才拼接这段SQL

```xml
<select id="select" resultType="User">
    SELECT * FROM user
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

### `<where>`

`where`标签主要用于动态生成查询语句的`WHERE`子句

它会自动帮你处理`WHERE`关键字和多余的`AND`/`OR`。比如你直接

```xml
SELECT *
FROM user

<if test="username != null">
    AND username = #{username}
</if>
```

可能出现

```sql
SELECT * FROM user AND username = '张三'
```

这是错误的，但是Mybatis会帮你处理`<where>`和多余的`AND`

### `<set>`

`set`标签主要用于动态生成更新语句的`SET`子句

当内部有条件成立时，在SQL中插入`SET`关键字，并自动去除多余的逗号

```xml
<update id="updateUser">
    UPDATE users
    <set>
        <if test="username != null and username != ''">
            username = #{username},
        </if>
        <if test="email != null">
            email = #{email},
        </if>
        <if test="age != null">
            age = #{age}
        </if>
    </set>
    WHERE id = #{id}
</update>
```

> 注意：`<set>`内容不能为空，如果所有的内部条件都不满足，那么就不会生成`SET`关键字，会报错（如`UPDATE users  WHERE id = #{id}`）

### `<choose>`

类似Java的`switch`，多个条件中**只会执行第一个成立**的，都不成立走`<otherwise>`

```xml
<select id="select" resultType="User">
    SELECT * FROM user
    <where>
        <choose>
            <when test="id != null">
                AND id = #{id}
            </when>
            <when test="username != null">
                AND username = #{username}
            </when>
            <otherwise>
                AND age > 18
            </otherwise>
        </choose>
    </where>
</select>
```

### `<foreach>`

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

这里`collection="ids"`对应`@Param("ids")`

- `collection`：要遍历的集合名
- `item`：每次遍历的当前元素
- `open` / `close`：拼接的开始/结束符号
- `separator`：元素之间的分隔符

## 注解方式

除了XML，也可以直接在Mapper接口上用注解，适合简单的SQL

```java
public interface UserMapper {

    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(Long id);

    @Insert("INSERT INTO user(name, age) VALUES(#{name}, #{age})")
    int insert(User user);

    @Update("UPDATE user SET name = #{name} WHERE id = #{id}")
    int updateById(User user);

    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(Long id);
}
```

简单查询用注解很方便，但复杂的动态SQL还是推荐用XML

## 结果映射

假设数据库`user_name`，Java的字段是`userName`

这叫**下划线转驼峰**

可以配置

```yml
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

这样`user_name` &rightarrow; `userName`，Mybatis就能自动映射

### resultMap

如果字段完全不一样，那么就需要手动映射了，假设数据库字段`user_name`，Java字段`name`

```xml
<resultMap id="UserMap" type="com.example.entity.User">
    <id property="id" column="id"/>
    <result property="name" column="user_name"/>
    <result property="phone" column="phone"/>
</resultMap>
```

然后在`select`中通过`resultMap`引用

```xml
<select id="selectById" resultMap="UserMap">
    SELECT id, user_name, phone FROM user WHERE id = #{id}
</select>
```

这里的`property`代表Java属性，而`column`代表数据库字段

### `<association>`一对一

一个用户对应一个地址，把`Address`作为`User`的属性

```xml
<resultMap id="UserAddressMap" type="User">
    <id property="id" column="user_id"/>
    <result property="name" column="name"/>
    <association property="address" javaType="Address">
        <id property="id" column="address_id"/>
        <result property="city" column="city"/>
    </association>
</resultMap>
```

### `<collection>`一对多

一个用户有多个订单

```xml
<resultMap id="UserOrdersMap" type="User">
    <id property="id" column="user_id"/>
    <collection property="orders" ofType="Order">
        <id property="id" column="order_id"/>
        <result property="orderNo" column="order_no"/>
    </collection>
</resultMap>
```

`javaType`用于单个对象，`ofType`用于集合中的元素类型

## 插入返回主键

插入后经常需要拿到自增主键，用`useGeneratedKeys`

```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user(name, age) VALUES(#{name}, #{age})
</insert>
```

插入后，主键值会自动回填到`user`对象的`id`字段

```java
userMapper.insert(user);
Long id = user.getId();   // 已经有值了
```
