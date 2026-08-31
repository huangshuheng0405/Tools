# MyBatis-Plus

[MyBatis-Plus](https://baomidou.com/)

MyBatis-Plus 是 MyBatis 的**增强工具**，不改变 MyBatis，只做增强，核心目标是不写 SQL 也能完成单表 CRUD。

## 依赖

Spring Boot 4 使用 `spring-boot4-starter`，从 3.5.13 开始支持，最新版本 3.5.17

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot4-starter</artifactId>
    <version>3.5.17</version>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

> 注意：版本要和 Spring Boot 版本匹配，Spring Boot 3 用 `mybatis-plus-spring-boot3-starter`，Spring Boot 2 用 `mybatis-plus-boot-starter`

## 配置

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/你的数据库
    username: root
    password: 密码
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true   # 下划线转驼峰，默认开启
  global-config:
    db-config:
      id-type: auto                       # 主键策略：数据库自增
      logic-delete-field: deleted         # 逻辑删除字段名
      logic-delete-value: 1
      logic-not-delete-value: 0
```

## 实体类

```java
@Data
@TableName("user")                        // 类名和表名不一致时指定
public class User {

    @TableId(type = IdType.AUTO)          // 主键
    private Long id;

    private String name;
    private Integer age;
    private String email;

    @TableField("phone_num")              // 字段名和属性名不一致时指定
    private String phoneNum;

    @TableField(fill = FieldFill.INSERT)  // 插入时自动填充
    private LocalDateTime createTime;

    @TableLogic                           // 逻辑删除标记
    private Integer deleted;
}
```

常用注解

| 注解 | 作用 |
|---|---|
| `@TableName` | 指定表名 |
| `@TableId` | 指定主键，`type` 指定生成策略 |
| `@TableField` | 指定列名、排除字段、自动填充 |
| `@TableLogic` | 逻辑删除字段 |
| `@Version` | 乐观锁版本字段 |

`IdType` 常见取值

- `AUTO`：数据库自增
- `ASSIGN_ID`：雪花算法（默认），生成全局唯一 ID
- `INPUT`：手动赋值

## Mapper

继承 `BaseMapper` 就有了全套 CRUD，不用写任何方法

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
```

## Service

Service 层是 `BaseMapper` 的封装，提供批量操作和链式查询

```java
public interface UserService extends IService<User> {
}

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}
```

`IService` 和 `BaseMapper` 的关系

- `insert` → `save`
- `deleteById` → `removeById`
- `updateById` → `updateById`
- `selectById` → `getById`
- `selectList` → `list`

## 增删改查

```java
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 增 */
    @PostMapping
    public User create(@RequestBody User user) {
        userService.save(user);
        return user;                  // id 已回填
    }

    /** 删 */
    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Long id) {
        return userService.removeById(id);
    }

    /** 改：只更新非 null 字段 */
    @PutMapping("/{id}")
    public boolean update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.updateById(user);
    }

    /** 查：按 id */
    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    /** 查：条件列表 */
    @GetMapping
    public List<User> list(@RequestParam(required = false) String name) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(name), User::getName, name);
        return userService.list(wrapper);
    }
}
```

### 批量操作

```java
userService.saveBatch(list);            // 批量插入
userService.updateBatchById(list);      // 批量更新
userService.removeByIds(idList);        // 批量删除
```

### updateById 注意点

`updateById` 只更新**非 null** 字段，如果想把字段清空（设为 null），需要用 `UpdateWrapper`

```java
UpdateWrapper<User> wrapper = new UpdateWrapper<>();
wrapper.eq("id", 1).set("email", null);
userService.update(null, wrapper);
```

## 条件构造器

比 XML 动态 SQL 好用，推荐用 `LambdaQueryWrapper`（方法引用，避免字段名写错）

```java
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.like(User::getName, "王")
       .gt(User::getAge, 18)
       .orderByDesc(User::getId);
List<User> users = userMapper.selectList(wrapper);
```

常用方法

| 方法 | 对应 SQL |
|---|---|
| `eq` / `ne` | `=` / `!=` |
| `gt` / `ge` / `lt` / `le` | `>` / `>=` / `<` / `<=` |
| `like` / `likeLeft` / `likeRight` | `LIKE '%x%'` / `LIKE '%x'` / `LIKE 'x%'` |
| `between` | `BETWEEN a AND b` |
| `in` | `IN (...)` |
| `isNull` / `isNotNull` | `IS NULL` / `IS NOT NULL` |
| `and` / `or` | 连接条件 |
| `orderByAsc` / `orderByDesc` | 排序 |
| `groupBy` / `having` | 分组 / 过滤 |
| `select` | 指定查询列 |
| `last` | 追加 SQL 片段，如 `.last("limit 1")` |

条件方法第一个参数都是 `boolean`，为 `false` 时跳过该条件，适合动态拼接

```java
wrapper.like(StringUtils.hasText(name), User::getName, name);
```

## 分页插件

v3.5.9 之后分页插件需要单独引入 `mybatis-plus-jsqlparser`

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-jsqlparser</artifactId>
    <version>3.5.17</version>
</dependency>
```

配置拦截器

```java
@Configuration
public class MybatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

使用

```java
Page<User> page = new Page<>(1, 10);                    // 第 1 页，每页 10 条
Page<User> result = userMapper.selectPage(page, wrapper);
result.getRecords();      // 当前页数据
result.getTotal();        // 总条数
result.getPages();        // 总页数
```

## 逻辑删除

实体字段加 `@TableLogic` 后，删除变成更新 `deleted` 字段，查询自动过滤

```sql
-- 执行 removeById(1) 实际生成
UPDATE user SET deleted = 1 WHERE id = 1 AND deleted = 0
```

需要在配置里指定逻辑删除的值

```yml
mybatis-plus:
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
```

## 自动填充

常用于自动填充 `createTime`、`updateTime`

实体字段加 `fill`

```java
@TableField(fill = FieldFill.INSERT)
private LocalDateTime createTime;

@TableField(fill = FieldFill.INSERT_UPDATE)
private LocalDateTime updateTime;
```

实现 `MetaObjectHandler`

```java
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime::now, LocalDateTime.class);
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime::now, LocalDateTime.class);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime::now, LocalDateTime.class);
    }
}
```

## 乐观锁

实体字段加 `@Version`，配合 `OptimisticLockerInnerInterceptor` 插件

```java
@Version
private Integer version;
```

配置插件

```java
interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
```

更新时自动带上版本条件

```sql
UPDATE user SET name = 'x', version = version + 1 WHERE id = 1 AND version = 0
```

## 代码生成器

一键生成 entity / mapper / service / controller

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.17</version>
</dependency>
```

```java
FastAutoGenerator.create("jdbc:mysql://localhost:3306/db", "root", "密码")
    .globalConfig(builder -> builder
        .author("huangshuheng")
        .outputDir(System.getProperty("user.dir") + "/src/main/java"))
    .packageConfig(builder -> builder
        .parent("com.example")
        .entity("entity")
        .mapper("mapper")
        .service("service")
        .controller("controller"))
    .strategyConfig(builder -> builder
        .addInclude("user"))          // 指定表
    .execute();
```

## 增删改查常用操作

### 增（Insert）

| 操作 | 方法 | 说明 |
|---|---|---|
| 插入单条 | `insert(entity)` / `save(entity)` | id 自动回填 |
| 批量插入 | `saveBatch(list)` | 默认分批 1000 条执行 |
| 存在则更新，否则插入 | `saveOrUpdate(entity)` | 按主键判断 |

### 删（Delete）

| 操作 | 方法 | 说明 |
|---|---|---|
| 按 id 删 | `deleteById(id)` / `removeById(id)` | |
| 按 id 集合删 | `deleteByIds(ids)` / `removeByIds(ids)` | 对应 `IN (...)` |
| 按条件删 | `delete(wrapper)` / `remove(wrapper)` | 用条件构造器指定 |
| 逻辑删除 | 加 `@TableLogic` 后所有删除自动变 `UPDATE` | 不真删数据 |

### 改（Update）

| 操作 | 方法 | 说明 |
|---|---|---|
| 按 id 更新 | `updateById(entity)` | **只更新非 null 字段** |
| 按条件更新 | `update(entity, wrapper)` | wrapper 指定更新范围 |
| 按条件直接 set | `update(null, wrapper)` | 用 `UpdateWrapper.set("email", null)` 可清空字段 |
| 批量更新 | `updateBatchById(list)` | 每条按各自 id |
| 增量操作 | `setSql("age = age + 1")` | 数值加减，避免并发覆盖 |

### 查（Select / Get / List）

| 操作 | 方法 | 说明 |
|---|---|---|
| 按 id 查 | `selectById(id)` / `getById(id)` | 查不到返回 null |
| 查全部 | `selectList(null)` / `list()` | |
| 按条件查列表 | `selectList(wrapper)` / `list(wrapper)` | 最常用 |
| 查一条 | `selectOne(wrapper)` / `getOne(wrapper)` | 结果多于一条会报错 |
| 查计数 | `selectCount(wrapper)` / `count(wrapper)` | 返回 `long` |
| 分页查 | `selectPage(page, wrapper)` / `page(page, wrapper)` | 需要分页插件 |
| 按 id 批量查 | `selectBatchIds(ids)` / `listByIds(ids)` | 对应 `IN` |
| 只查指定列 | `wrapper.select(User::getId, User::getName)` | 减少传输量 |
| 链式查询 | `lambdaQuery().eq(...).list()` | 不用 new wrapper |

```java
// 链式查询示例
userService.lambdaQuery()
    .like(User::getName, "王")
    .gt(User::getAge, 18)
    .orderByDesc(User::getId)
    .page(new Page<>(1, 10));
```

### 对应关系

| BaseMapper | IService |
|---|---|
| `insert` | `save` |
| `deleteById` | `removeById` |
| `updateById` | `updateById` |
| `selectById` | `getById` |
| `selectList` | `list` |
| `selectPage` | `page` |

日常开发几乎只用 Service 层，`save` / `removeById` / `updateById` / `list(wrapper)` / `page(page, wrapper)` 就能覆盖大部分场景
