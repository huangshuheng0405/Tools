# Sa-Token

一个轻量的 Java 权限认证框架，把登录、鉴权、会话、单点登录这些事封装成了几个静态方法。文档见 [sa-token.com](https://sa-token.com)

对比 [JWT](/zh/backend/java/springboot/jwt.md) 里手写 `JwtUtil` + 拦截器 + `UserContext` 的那套流程，Sa-Token 把这些都内置了：

```
手写 JWT                             Sa-Token
────────────────────────────────────────────────
JwtUtil.generate()                   StpUtil.login(10001)
写拦截器解析 Header                  注册 SaInterceptor
手写 if 判断权限                      @SaCheckPermission("user:add")
无法撤销                              StpUtil.kickout(10001)
无法续期                              StpUtil.renewTimeout(3600)
```

## 依赖

```xml
<!-- Spring Boot 2.x -->
<dependency>
    <groupId>cn.dev33</groupId>
    <artifactId>sa-token-spring-boot-starter</artifactId>
    <version>1.46.0</version>
</dependency>

<!-- Spring Boot 3.x 换成这个，artifactId 不一样 -->
<dependency>
    <groupId>cn.dev33</groupId>
    <artifactId>sa-token-spring-boot3-starter</artifactId>
    <version>1.46.0</version>
</dependency>
```

Spring Boot 4.x 用 `sa-token-spring-boot4-starter`。**Spring Boot 3 一定要换成 `spring-boot3` 那个 starter**，用错会启动报错。

## 配置

可以不配，零配置就能跑。常用配置：

```yaml
sa-token:
  # token 名称（同时也是 cookie 名称），决定前端传 token 时的参数名
  token-name: satoken
  # token 有效期，单位秒，默认 30 天，-1 代表永久有效
  timeout: 2592000
  # 最低活跃频率，超过这个时间没访问就冻结，-1 不限制
  active-timeout: -1
  # 是否允许同一账号多地同时登录（false = 新登录挤掉旧登录）
  is-concurrent: true
  # 多人登录同一账号时是否共用一个 token
  is-share: false
  # token 风格：uuid、simple-uuid、random-32、random-64、random-128、tik
  token-style: uuid
  # 是否输出操作日志
  is-log: true
```

## 登录认证

核心就是 `StpUtil` 这个工具类，全是静态方法。

```java
@RestController
public class LoginController {

    // 登录 ---- http://localhost:8081/login?name=zhang&pwd=123456
    @RequestMapping("login")
    public SaResult login(String name, String pwd) {
        // 真实项目里换成查库比对密码
        if ("zhang".equals(name) && "123456".equals(pwd)) {
            // 参数就是账号 id
            StpUtil.login(10001);
            return SaResult.ok("登录成功");
        }
        return SaResult.error("登录失败");
    }

    // 查询登录状态
    @RequestMapping("isLogin")
    public SaResult isLogin() {
        return SaResult.ok("是否登录：" + StpUtil.isLogin());
    }

    // 注销
    @RequestMapping("logout")
    public SaResult logout() {
        StpUtil.logout();
        return SaResult.ok();
    }
}
```

`login()` 内部做的是：生成 token → 存到 SaTokenDao → 把 token 写到响应（cookie/header 由框架处理）。

### 登录后拿信息

```java
StpUtil.getLoginId();              // 当前账号 id，未登录抛异常
StpUtil.getLoginIdAsLong();        // 转成 Long，省得自己 cast
StpUtil.getLoginIdDefaultNull();   // 未登录返回 null，不抛异常

StpUtil.getTokenValue();           // 当前请求带的 token 值
StpUtil.getTokenName();            // token 名称，前后端约定用（默认 satoken）
StpUtil.getTokenTimeout();         // 剩余有效期，秒，-1 永久
StpUtil.getTokenInfo();            // 上面这些的打包对象
```

### 登录时定制参数

```java
StpUtil.login(10001, new SaLoginModel()
        .setDevice("PC")           // 设备标识，方便按设备踢人
        .setTimeout(60 * 60 * 24 * 7));   // 这个 token 单独 7 天
```

### 前端怎么把 token 传回来

框架默认从三个地方读取，**读取顺序是 Query 参数 → Header 头 → Cookie**：

| 途径 | 示例 |
| --- | --- |
| Query 参数 | `/user/getInfo?satoken=xxxx-xxxx` |
| Header 头 | `satoken: xxxx-xxxx` |
| Cookie | 浏览器自动带 |

注意 Header 名默认是 **`satoken`**，不是 `Authorization`，也不是 `token`。想换成 `Authorization` 就改配置里的 `token-name`。

前后端分离时，登录接口返回 `StpUtil.getTokenInfo()`，前端把 `tokenName` 和 `tokenValue` 两个字段存下来，之后每个请求按 `tokenName` 当 header key 带上。

```java
@RequestMapping("doLogin")
public SaResult doLogin() {
    StpUtil.login(10001);
    return SaResult.data(StpUtil.getTokenInfo());
}
```

## StpUtil 常用方法

`StpUtil` 的静态方法有几百个，但记住一条命名规律就不用背了：

- `isXxx()` —— 返回 boolean，**不抛异常**
- `checkXxx()` —— 不满足直接**抛异常**，用来做拦截
- `getXxx()` —— 拿不到会抛异常，另有 `getXxxDefaultNull()` / `getXxx(默认值)` 这种安全变体

判断逻辑用 `isXxx`，守卫拦截用 `checkXxx`。下面按用途分类，本文其他地方已经出现过的（登录、注销、拿账号 id、续期、踢人、封禁）不在这里重复。

### 登录状态判断

```java
StpUtil.isLogin();                 // 当前请求是否已登录
StpUtil.isLogin(10001);            // 指定账号是否已登录
StpUtil.checkLogin();              // 未登录抛 NotLoginException

StpUtil.getLoginId();              // 未登录抛异常
StpUtil.getLoginId("默认值");       // 未登录返回默认值
StpUtil.getLoginIdDefaultNull();   // 未登录返回 null
StpUtil.getLoginIdAsLong();        // 转成 long，省得自己 cast

StpUtil.getLoginIdByToken(token);  // 反查：这个 token 属于哪个账号（无效 / 被踢 / 被冻结返回 null）
```

`isLogin(10001)` 这类「查别人」的重载，做后台的「该用户是否在线」时很好用。

### 角色与权限（代码方式）

注解只能标在方法上、权限码写死。要在方法**内部**按业务逻辑动态判断，就得用这些：

```java
// 角色
StpUtil.hasRole("admin");               // boolean
StpUtil.hasRoleAnd("admin", "vip");     // 必须全部拥有
StpUtil.hasRoleOr("admin", "vip");      // 拥有任意一个即可
StpUtil.checkRole("admin");             // 没有则抛 NotRoleException
StpUtil.checkRoleAnd("admin", "vip");
StpUtil.checkRoleOr("admin", "vip");
StpUtil.getRoleList();                  // 当前账号的角色集合
StpUtil.getRoleList(10001);             // 指定账号的角色集合

// 权限，方法名和上面完全对应
StpUtil.hasPermission("user:add");
StpUtil.hasPermissionAnd("user:add", "user:delete");
StpUtil.hasPermissionOr("user:add", "user:delete");
StpUtil.checkPermission("user:add");
StpUtil.checkPermissionAnd("user:add", "user:delete");
StpUtil.checkPermissionOr("user:add", "user:delete");
StpUtil.getPermissionList();
StpUtil.getPermissionList(10001);
```

带 `loginId` 的重载都支持查别人，做「权限分配预览」界面时用得上。注意这些方法底层还是走 `StpInterface`，所以**没实现 `StpInterface` 的话它们一律返回 false**。

### 多端 / 设备管理

`login` 时的 `setDevice("PC")` 就是给这一节用的。设备标识默认是 `default-device`：

```java
StpUtil.getLoginDevice();                                 // 当前请求来自哪个设备

StpUtil.getTokenValueByLoginId(10001);                    // 该账号某个端的 token
StpUtil.getTokenValueByLoginId(10001, "PC");              // 指定端的 token
StpUtil.getTokenValueListByLoginId(10001);                // 所有端的 token 列表
StpUtil.getTokenValueListByLoginId(10001, "PC");          // 只看 PC 端

// 「谁在线」列表：拿到每个终端的设备、token、登录时间
List<SaTerminalInfo> list = StpUtil.getTerminalListByLoginId(10001);

// 踢人 / 注销，都能精确到设备
StpUtil.kickout(10001, "PC");        // 把该账号的 PC 端踢下线，手机端不受影响
StpUtil.logout(10001, "PC");         // 强制指定账号指定端注销
StpUtil.kickoutByTokenValue(token);  // 按 token 踢
StpUtil.replaced(10001, "PC");       // 「顶人下线」，区别于踢人
```

踢人（`kickout`）、注销（`logout`）、顶人（`replaced`）这三个的效果都是让对方 token 失效，**区别只在对方下次访问时抛出的异常类型** —— 用来区分「管理员把你踢了」和「你在别处登录了」这两种提示。三者都是 `SaLogoutParameter` 可传可不传。

### Session

```java
StpUtil.getSession();                       // 当前账号的 Account-Session
StpUtil.getSession(true);                   // 第二个参数：不存在时是否新建
StpUtil.getSessionByLoginId(10001);         // 指定账号的
StpUtil.getSessionBySessionId(sessionId);   // 按 sessionId 拿，不存在返回 null

StpUtil.getTokenSession();                  // 当前 token 的 Token-Session
StpUtil.getTokenSessionByToken(token);      // 指定 token 的
StpUtil.getAnonTokenSession();              // 未登录也能用的匿名 Token-Session
```

`getSessionBySessionId()` 在后台管理里有实际用处 —— 从在线会话列表点进去，看某个会话里到底存了什么。`getAnonTokenSession()` 适合给未登录用户存购物车、验证码之类的临时数据。

### 多账号体系

一个系统里前台用户和后台管理员各登录各的、互不干扰，靠 `loginType` 区分：

```java
StpUtil.getLoginType();   // 当前 StpLogic 的类型标识，默认 "login"
StpUtil.getStpLogic();    // 拿到 StpLogic 对象，可以调它的全部方法
```

`StpUtil` 本质就是 `StpUtil.getStpLogic().xxx()` 的语法糖 —— 所有静态方法在 `StpLogic` 上都有一份。要再加一套账号体系，就 new 一个 `StpLogic("user")` 自己包一层工具类，官方文档的「多账号体系」章节有完整写法。

### 关于 SaLoginModel / SaLoginParameter

前面几节用的 `new SaLoginModel()` 是**旧名字**。1.41.0 起这个类改叫 `SaLoginParameter`，看到教程里两种写法别以为是两个类，它们是同一个东西。

```java
StpUtil.login(10001, new SaLoginParameter()
        .setDevice("PC")                 // 设备类型
        .setIsLastingCookie(true)        // 持久 Cookie，关掉浏览器再打开还在
        .setTimeout(60 * 60 * 24 * 7));  // 这次登录 7 天
```

新版本往这个类里加了不少原来只能配在全局的项，比如 `setIsConcurrent`、`setIsShare`、`setMaxLoginCount`（同账号最大登录数，超出的客户端自动注销）。想做「同端互斥登录」这类精细控制，优先在这里配，别改全局。

## 路由拦截鉴权

按路由模块区分权限，第一步注册 `SaInterceptor`：

```java
@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 最简单：所有接口都要登录，除了 /user/doLogin
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
                .addPathPatterns("/**")
                .excludePathPatterns("/user/doLogin");
    }
}
```

再复杂点，用 `SaRouter.match` 分模块：

```java
registry.addInterceptor(new SaInterceptor(handle -> {
    SaRouter.match("/user/**", r -> StpUtil.checkPermission("user"));
    SaRouter.match("/admin/**", r -> StpUtil.checkPermission("admin"));
    SaRouter.match("/orders/**", r -> StpUtil.checkPermission("orders"));
})).addPathPatterns("/**");
```

## 注解鉴权

```java
@SaCheckLogin                      // 必须登录
@SaCheckRole("admin")              // 必须拥有 admin 角色
@SaCheckPermission("user:add")     // 必须拥有 user:add 权限
@SaIgnore                          // 忽略上面所有校验
```

```java
@RestController
@RequestMapping("/at-check/")
public class AtCheckController {

    @SaCheckPermission("user:add")
    @RequestMapping("checkPermission")
    public SaResult checkPermission() {
        return SaResult.ok();
    }

    @SaCheckRole("super-admin")
    @RequestMapping("checkRole")
    public SaResult checkRole() {
        return SaResult.ok();
    }

    // @SaIgnore 优先级最高，写了它上面的校验全部不生效
    @SaIgnore
    @SaCheckLogin
    @RequestMapping("ignoreCheck")
    public SaResult ignoreCheck() {
        return SaResult.ok();
    }
}
```

**注解能生效的前提是注册了 `SaInterceptor`**（老版本叫 `SaAnnotationInterceptor`，已废弃）。只加依赖不注册拦截器，注解形同虚设，一定要检查这一条。

## 权限数据从哪来

框架自己不知道谁有什么权限，要你实现 `StpInterface` 告诉它：

```java
@Component
public class StpInterfaceImpl implements StpInterface {

    // 返回一个账号所拥有的权限码集合
    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        // 真实项目：按角色查库，或从 Redis / RPC 拿
        return Arrays.asList("user:add", "user:delete", "user:get");
    }

    // 返回一个账号所拥有的角色标识集合
    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        return Arrays.asList("admin", "super-admin");
    }
}
```

**没有实现这个接口（或返回空集合）时，`@SaCheckPermission` / `@SaCheckRole` 会全部不通过**，因为查不到任何权限码。这是最常见的“明明登录了还是 403”的原因。

这两个方法每次鉴权都会被调用，通常要在里面加缓存：

```java
List<String> roleList = (List<String>) SaManager.getSaTokenDao()
        .getObject("satoken:loginId-find-role:" + loginId);
if (roleList == null) {
    roleList = ...;   // 查库
    SaManager.getSaTokenDao().setObject("satoken:loginId-find-role:" + loginId, roleList, 60 * 60 * 24 * 30);
}
```

## 全局异常处理

不处理的话，未登录访问受保护接口会直接抛异常返回 500，前端拿不到有意义的提示：

```java
@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(NotLoginException.class)
    public SaResult handlerException(NotLoginException e) {
        return SaResult.error("未登录");
    }

    @ExceptionHandler(NotRoleException.class)
    public SaResult handlerException(NotRoleException e) {
        return SaResult.error("缺少角色：" + e.getRole());
    }

    @ExceptionHandler(NotPermissionException.class)
    public SaResult handlerException(NotPermissionException e) {
        return SaResult.error("缺少权限：" + e.getPermission());
    }
}
```

## 会话

Sa-Token 的 Session 和原生 `HttpSession` 不是一回事，它有两种：

```java
// Account-Session：一个账号一个，该账号所有设备的登录共享
StpUtil.getSession().set("nickname", "张三");
StpUtil.getSession().get("nickname");

// Token-Session：一个 token 一个，只在当前设备有效
StpUtil.getTokenSession().set("cart", cartList);
```

要在 Session 里存东西，框架得能记住它，所以**默认存在内存里**——重启就没了，多台机器也不共享。见下面的[持久化](#持久化)。

## 常用功能

```java
// 踢人下线：强制某个账号的所有会话失效
StpUtil.kickout(10001);

// 账号封禁：封禁 86400 秒，-1 永久
StpUtil.disable(10001, 86400);
StpUtil.isDisable(10001);      // 是否被封禁
StpUtil.checkDisable(10001);   // 已封禁则抛异常
StpUtil.getDisableTime(10001); // 剩余封禁秒数，未被封禁返回 -2
StpUtil.untieDisable(10001);   // 解除封禁

// 精简：封禁不会让已登录的会话立刻失效，要先踢下线再封
StpUtil.kickout(10001);
StpUtil.disable(10001, 86400);

// 续期
StpUtil.renewTimeout(3600);

// 二级认证：敏感操作前再验一次密码/手势，有效期 600 秒
StpUtil.openSafe("client", 600);   // 校验通过后开启
StpUtil.checkSafe("client");       // 未通过则抛异常
```

## 过期时间

### 两个容易混的概念

Sa-Token 有**两个独立的计时器**，配错了会出现「明明没过期却登不上」这种怪事：

| | `timeout` | `active-timeout` |
| --- | --- | --- |
| 含义 | token 的总有效期 | 最低活跃频率 |
| 从哪天算 | 登录那一刻 | 最后一次访问 |
| 超时后果 | token 直接失效，要重新登录 | token 被**冻结**，再访问也进不去 |
| 默认值 | 2592000（30 天） | -1（不限制） |

`active-timeout` 的典型用法是「30 分钟不操作就自动退出」，也就是 `timeout: 2592000` + `active-timeout: 1800` 组合：总有效期给足，但只要 30 分钟没动作就冻结。

冻结和失效的区别在恢复上：**冻结的 token 续签一下就能解冻继续用**，失效的只能重新登录。

```java
StpUtil.checkActiveTimeout();      // 检查是否被冻结，冻结了抛异常
StpUtil.getTokenActiveTimeout();   // 距离被冻结还剩多少秒
StpUtil.getTokenLastActiveTime();  // 最后一次活跃的时间戳
StpUtil.updateLastActiveToNow();   // 把活跃时间刷新为现在（解冻）
```

### 三种设置方式

**全局改，所有登录都用这个值**

```yaml
sa-token:
  timeout: 2592000        # 30 天
  active-timeout: 1800    # 半小时不动就冻结
```

**单次登录单独指定**，比如勾了「记住我」给 7 天，没勾给 2 小时：

```java
// 记住我
StpUtil.login(10001, new SaLoginModel().setTimeout(60 * 60 * 24 * 7));

// 不记住
StpUtil.login(10001, new SaLoginModel().setTimeout(60 * 60 * 2));
```

`SaLoginModel` 还能一起设 `setActiveTimeout()` 和 `setDevice()`，这几个值只对这一次登录生效，不影响全局配置。

**给已经存在的 token 改**：

```java
StpUtil.renewTimeout(3600);            // 当前 token 续期 1 小时
StpUtil.renewTimeout(token, 3600);     // 指定 token 续期
```

注意 `renewTimeout` 是**把剩余有效期重置为参数值**，不是「在原有基础上加」。传 3600 之后剩余时间永远是 1 小时，不是「原来剩 100 秒变成 3700 秒」。

### 值写成 -1 和 0 分别是什么意思

- `-1`：永久有效，永不过期
- `0`：不存储，等于这次设置没生效（少见）

`getTokenTimeout()` 的返回值要多认两个负数：

```java
StpUtil.getTokenTimeout();   // 剩余秒数；-1 = 永久有效；-2 = 这个 token 根本不存在
```

如果它返回 -2，说明请求里的 token 是无效的（伪造的、或者已经被踢下线了）。

### 自动续签

默认情况下每次访问都会检查，快到期时自动把有效期续满，所以只要用户一直在用就不会掉线。

关掉它：

```yaml
sa-token:
  auto-renew: false
```

关了之后框架不再自动续签，什么时候续、续多久完全由你调 `StpUtil.renewTimeout()` 决定。**无状态 JWT 模式下这个配置格外重要**——每次请求都去刷一遍存储，等于把 JWT 不用查存储的优势抵消掉了。

### Session 的过期时间

上面说的都是 token。Session 有自己独立的过期时间，创建时默认跟全局 `timeout` 一致，之后可以单独改：

```java
StpUtil.getSession().timeout();            // 剩余秒数
StpUtil.getSession().updateTimeout(3600);  // 改成 1 小时
StpUtil.getTokenSession().updateTimeout(3600);   // Token-Session 同理
```

`updateMinTimeout()` 和 `updateMaxTimeout()` 更有意思，它们只在当前过期时间**低于 / 高于**阈值时才动手，适合用来保证某类 Session 至少活多久、或最多活多久：

```java
// Session 剩余时间不足 1 小时才续，已经够长就不动它
StpUtil.getSession().updateMinTimeout(3600);
```

## 整合 JWT

Sa-Token 默认是「token 只是个随机串，数据存在服务端」，本质上还是 Session 那一套。想变成无状态 JWT，加插件：

```xml
<dependency>
    <groupId>cn.dev33</groupId>
    <artifactId>sa-token-jwt</artifactId>
    <version>1.46.0</version>
</dependency>
```

```yaml
sa-token:
  # jwt 秘钥，别直接用示例里的字符串，自己生成一段随机字符
  jwt-secret-key: asdasdasifhueuiwyurfafbfjsdjk123
```

业务代码完全不用改，还是 `StpUtil.login(10001)`，只是生成的 token 变成了 JWT 样式：

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiMTAwMDEiLCJybiI6IjZYYzgy...
```

这时要注意，JWT 无状态的代价是一样的：

- 踢人、封禁、续期这些功能需要额外配置（如黑名单）才能立刻生效
- payload 是 Base64 可读的，别往里面放敏感信息

**没有分布式 / 无状态需求就别开这个插件**，默认的 Session 模式功能更全，踢人封禁都是实时的。

## 持久化

登录状态、Session、权限缓存、封禁名单这些需要落地的数据，Sa-Token 全部抽象进了 `SaTokenDao` 接口——换存储就是换它的实现类，业务代码一行不用动。

默认实现 `SaTokenDaoDefaultImpl` 存在内存 Map 里，两个后果：

- **重启即丢**，服务一重启所有人掉线
- **多实例各存各的**，A 机登录的状态 B 机不认

单机开发够用，只要涉及上线或多实例部署就得换掉。

### 选哪个实现

| 方案 | 依赖 | 说明 |
| --- | --- | --- |
| 内存 | 无（`sa-token-core` 自带） | 默认，重启丢数据 |
| RedisTemplate | `sa-token-redis-template` | 推荐，Session 存成 JSON 可读 |
| Redis + JDK 序列化 | `sa-token-redis` | 老方案，存进去是乱码，排查不方便 |
| Redisson | `sa-token-redisson-spring-boot-starter` | 项目已经在用 Redisson 时选它 |
| Caffeine / Hutool | `sa-token-caffeine`、`sa-token-hutool-timed-cache` | 只是本地缓存，**解决不了集群共享** |
| 自定义 | 自己实现 `SaTokenDao` | 存 MySQL、MongoDB 等 |

### 接 Redis

三步，一行业务代码都不用改。

**第一步：加依赖**

```xml
<!-- Sa-Token 整合 RedisTemplate -->
<dependency>
    <groupId>cn.dev33</groupId>
    <artifactId>sa-token-redis-template</artifactId>
    <version>1.46.0</version>
</dependency>

<!-- 提供 Redis 连接池 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

**第二步：配连接**

```yaml
spring:
  data:
    redis:
      host: 127.0.0.1
      port: 6379
```

Spring Boot 2.x 这个 key 是 `spring.redis.host`，没有中间的 `data`，换了 Boot 3 记得改。

**第三步：验证**

这个包通过 Spring Boot 的自动装配注册 `SaTokenDao`，不需要写任何 `@Configuration`。启动后登录一次，去 Redis 里查：

```bash
redis-cli keys "sa-token*"
```

能看到 `satoken:login:token:xxx` 这类 key 就是生效了。**看不到 key 说明自动装配没进来**，先检查依赖是不是加错了 artifactId、或者自己是不是又注册了一个 `SaTokenDao` Bean 把它顶掉了。

### 序列化注意

Session 里存的对象要能被序列化，否则写入时不报错、读出来是 null 或者直接抛反序列化异常：

- `sa-token-redis-template` 用 Jackson，类要有无参构造 + getter/setter
- `sa-token-redis` 用 JDK 序列化，类必须 `implements Serializable`

Redis 里的值看着正常但 `StpUtil.getSession().get("xxx")` 拿到 null，基本都是这个原因。

### 自定义 SaTokenDao

只能用 MySQL / MongoDB，或者公司有自己的缓存中间件时，实现 `SaTokenDao` 再注册成 Bean 就行：

```java
@Component
public class MySaTokenDao implements SaTokenDao {
    // String 读写、Object 读写、Session 读写、searchData，一共 20 多个方法
}
```

其中 Session 那一层是纯转发（`setSession` 直接调 `setObject`），框架提供了桥接接口省掉这部分样板，只实现 Object 层即可：

```java
public interface SaTokenDaoBySessionFollowObject extends SaTokenDao { ... }
// 同理还有 SaTokenDaoByObjectFollowString、SaTokenDaoByStringFollowObject
```

官方的 MongoDB 实现是现成的参考，`sa-token-doc/up/integ-spring-mongod` 照抄结构就行。

几个容易写错、错了又特别难查的约定：

- 写入前先判断：`timeout == 0 || timeout <= SaTokenDao.NOT_VALUE_EXPIRE` 直接 return，别存
- `SaTokenDao.NEVER_EXPIRE`（-1）是**永久有效**，不是"1 秒后过期"
- 查不到 key 统一返回 `SaTokenDao.NOT_VALUE_EXPIRE`（-2），不要返回 0
- 过期数据要自己清（Redis 有 TTL 自动清，自定义实现得在读取时判断并删除）

### 开发用内存、生产用 Redis

框架没有内置开关，自己按环境决定注册哪个实现：

```java
@Configuration
public class SaTokenDaoConfig {

    @Value("${sa-token.use-redis:false}")
    private boolean useRedis;

    @Bean
    @Primary
    public SaTokenDao saTokenDao() {
        return useRedis ? new SaTokenDaoForRedisTemplate() : new SaTokenDaoDefaultImpl();
    }
}
```

配合 `application-dev.yml` / `application-prod.yml` 里配不同的 `sa-token.use-redis`，本地不装 Redis 也能跑。

## 和手写 JWT 怎么选

| | 手写 JWT | Sa-Token |
| --- | --- | --- |
| 代码量 | 工具类 + 拦截器 + ThreadLocal | 一个 starter 加几行配置 |
| 撤销登录 | 做不到，得自己搞黑名单 | `StpUtil.kickout()` |
| 多端登录控制 | 自己实现 | 配置项 `is-concurrent` |
| 权限模型 | 自己设计 | 角色 + 权限码，注解直接用 |
| 依赖服务端存储 | 不需要 | 默认需要（Redis） |

学习阶段手写一遍 JWT 是值得的，能搞明白签名、拦截器、ThreadLocal 这些都在干什么。实际项目直接用 Sa-Token，少写几百行不用维护的代码。

## 踢人

1. DTO/VO

   ```java
   // dto/KickoutDTO.java
   public record KickoutDTO(
           @NotNull(message = "用户id不能为空") Long userId
   ) {
   }
   ```

   ```java
   // vo/OnlineUserVO.java
   public record OnlineUserVO(
           Long userId,   // 登录标识
           String token   // 当前 token(需要的话返回前端做精确踢)
   ) {
   }
   ```

2. service

   ```java
   @Override
       public List<OnlineUserVO> onlinelist() {
           ArrayList<OnlineUserVO> list = new ArrayList<>();
           List<String> keys = StpUtil.searchTokenValue("", 0, 100, true);
           for (String key : keys) {
               if (!key.startsWith(TOKEN_KEY_PREFIX)) {
                   continue; // 跳过非 token 前缀的 key(如 token-device)
               }
               String token = key.substring(TOKEN_KEY_PREFIX.length()); // 截掉前缀,得到纯 token
               Object loginId = StpUtil.getLoginIdByToken(token); // 返回的是object
               if (loginId == null) {
                   continue; // 已过期/失效的 token 不展示
               }
               list.add(new OnlineUserVO(Long.valueOf(loginId.toString()), token));
           }
           return list;
       }
   
       @Override
       public void kickout(Long userId) {
           StpUtil.kickout(userId);
       }
   ```

   - `StpUtil.searchTokenValue`，关键字，开始处索引，获取数量，排序类型（true为正序），返回token数组，返回的是**带前缀的**
   - `StpUtil.getLoginIdByToken`，不能带前缀

3. controller

   ```java
   @GetMapping("/user/online")
   @SaCheckRole("admin")
   public Result<List<OnlineUserVO>> online() {
       return Result.success(userService.onlineList());
   }
   
   @PostMapping("/user/kickout")
   @SaCheckRole("admin")
   public Result<Void> kickout(@RequestBody @Valid KickoutDTO dto) {
       userService.kickout(dto.userId());
       return Result.success();
   }
   ```

## 多端管理

| 概念     | 意思                                                     |
| -------- | -------------------------------------------------------- |
| 单端登录 | 一个账号同时只允许一台设备在线，新登录把旧设备顶下线     |
| 多段登录 | 一个账号允许手机/电脑同时在线（比如微信 PC 端 + 手机端） |
| 多端管理 | 能看到每台设备，且能 精确踢掉某一台 ，不影响其他设备     |

`application.yaml`里面

```yaml
sa-token:
  is-share: true         # 多端是否共用一个 token
  is-concurrent: true    # 同一账号多地同时登录
```

登录接口里面改一下

```java
		String deviceName = StrUtil.isNotBlank(loginDTO.getDeviceName()) ?
                loginDTO.getDeviceName() :
                SaHolder.getRequest().getHeader("User-Agent");

        // 设备类型
        String deviceType = parseDeviceType(deviceName);

        boolean rememberMe = Boolean.TRUE.equals(loginDTO.getRememberMe());
        // 登录成功 把用户id写入 sa-token 会话
        StpUtil.login(user.getId(), SaLoginParameter.create()
                .setTimeout(rememberMe ? 86400 : 1800)
                .setDeviceId(deviceName)
                .setDeviceType(deviceType));
        // 返回token给前端
```

解析前端设备类型的工具类

```java
	/**
     * 从 User-Agent 解析"平台-浏览器"设备类型
     */
    private String parseDeviceType(String ua) {
        // 设备平台
        String platform;
        if (ua.contains("Android")) {
            platform = "android";
        } else if (ua.contains("iPhone") || ua.contains("iPad") || ua.contains("iPod")) 		{
            platform = "ios";
        } else if (ua.contains("Windows")) {
            platform = "windows";
        } else if (ua.contains("Macintosh") || ua.contains("Mac OS")) {
            platform = "macos";
        } else if (ua.contains("Linux")) {
            platform = "linux";
        } else {
            platform = "other";
        }

        // 浏览器类别(注意判断顺序:Edge/OI 的 UA 里也含 Chrome,要先判)
        String browser;
        if (ua.contains("Edg")) {
            browser = "edge";
        } else if (ua.contains("OPR") || ua.contains("Opera")) {
            browser = "opera";
        } else if (ua.contains("Chrome")) {
            browser = "chrome";
        } else if (ua.contains("Firefox")) {
            browser = "firefox";
        } else if (ua.contains("Safari")) {
            browser = "safari";
        } else if (ua.contains("Trident") || ua.contains("MSIE")) {
            browser = "ie";
        } else {
            browser = "other";
        }

        return platform + "-" + browser; // 例:android-chrome、windows-edge、macos-safari
   		}
```

在展示的接口加上类型就行了

踢人的时候加上类型

```java
	@Override
    public void kickout(Long userId, String deviceType) {
        if (StrUtil.isBlank(deviceType)) {
            StpUtil.kickout(userId); // 踢全部
        } else {
            StpUtil.kickout(userId, deviceType); // 踢指定设备
        }
    }
```

