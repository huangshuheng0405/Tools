# 三层架构

如果把数据库操作、业务逻辑、页面跳转都写在一个类里

```java
// 反例：所有东西写在一起
@WebServlet("/user/register")
public class RegisterServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        // 接收参数
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        // 校验逻辑
        if (username == null || username.length() < 3) {
            resp.getWriter().write("用户名至少3位");
            return;
        }

        // 直接拼 SQL
        String sql = "INSERT INTO user (username, password) VALUES ('"
                   + username + "', '" + password + "')";

        // 执行 SQL
        Connection conn = DriverManager.getConnection("jdbc:mysql://...");
        Statement stmt = conn.createStatement();
        stmt.executeUpdate(sql);

        // 返回结果
        resp.getWriter().write("注册成功");
    }
}
```

有很多问题

- 如果数据库从`MySQL`换成`PostfreSQL`，需要改每一处地方
- 代码没法复用
- 不好测试

## 哪三层

```
┌──────────────────────────────────────┐
│         表示层（Controller）           │  接收 HTTP 请求，返回响应
│         职责：接待客人                  │  不写业务逻辑，不写 SQL
└──────────────────┬───────────────────┘
                   │ 调用
                   ▼
┌──────────────────────────────────────┐
│        业务逻辑层（Service）            │  处理业务规则、校验数据
│        职责：管事、做决策               │  不写 SQL，不处理 HTTP
│         通俗：干活的                    │
└──────────────────┬───────────────────┘
                   │ 调用
                   ▼
┌──────────────────────────────────────┐
│        数据访问层（DAO / Mapper）       │  读写数据库
│        职责：只跟数据库打交道            │  不写业务逻辑，不处理 HTTP
└──────────────────────────────────────┘
```

## Controller

- 对应代码包：`controller`
- 核心职责：负责与外界（前端、移动端、或其他微服务）进行数据交互
- 具体工作
  - 接受用户的HTTP请求（通过`@RestController`，`@RequestMapping`等注解）
  - 做基础的参数校验（比如手机号格式对不对、密码是否为空，常用 `@Valid`）
  - 调用Service层核心业务
  - 将结果组成统一的格式（如 JSON 对象的 `Result<T>`）返回给前端。

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;  // 注入 Service

    @PostMapping("/register")
    public Result register(@RequestBody RegisterDTO dto) {
        // 1. 接参数（Spring 自动把 JSON 转成 RegisterDTO 对象）
        // 2. 调 Service
        userService.register(dto);
        // 3. 返回结果
        return Result.success("注册成功");
    }
}
```

不要干的事：

- 写`if (xxx)`判断业务规则$\rightarrow$这是 Service 的事
- 拼  SQL/调数据库 $\rightarrow$这是 DOA 的事
- 做复杂的计算$\rightarrow$这是 Service 的事

## Service

- 对应代码包：`service`
- 核心职责：整个系统的“大脑”，负责所有核心的业务规则、计算和逻辑编排。
- 具体工作：
  - 通常采用“接口+实现类”的结构（如`UserService`接口和`UserServiceImpl`实现类），方便解耦和后续做单元测试
  - 控制数据库的**事务（Transaction）**。当一个业务需要操作多张表时（例如：下订单 = 扣库存 + 扣余额 + 生成订单），这一层会加上 `@Transactional` 注解，确保要么全成功，要么全失败。
  - 进行复杂的计算、权限验证、第三方接口调用等。

```java
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;  // 注入 Mapper

    @Override
    public void register(RegisterDTO dto) {
        // 1. 校验：用户名不能重复
        User exist = userMapper.findByUsername(dto.getUsername());
        if (exist != null) {
            throw new BusinessException("用户名已存在");
        }

        // 2. 校验：密码长度
        if (dto.getPassword().length() < 6) {
            throw new BusinessException("密码至少6位");
        }

        // 3. 处理：密码加密
        String encryptedPassword = encrypt(dto.getPassword());

        // 4. 交给 DAO 存库
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(encryptedPassword);
        userMapper.insert(user);

        // 5. 发邮件（假设有这个功能）
        // emailService.sendWelcomeEmail(user);
    }

    private String encrypt(String raw) {
        // 加密逻辑
        return BCrypt.hashpw(raw, BCrypt.gensalt());
    }
}
```

Service不要干的事：

- 接受 HTTP 请求/写`@PostMapping`$\rightarrow$这是 Controller 的事
- 拼 SQL $\rightarrow$这是 Mapping 的事
- 直接`return "register success"`这种前端交互文字$\rightarrow$这是 Controller 的事

## DAO/Mapper

- 对应代码包：`dao`、`mapper`或`repository`
- 核心职责：只负责和数据库进行增删改查（CRUD），它不知道业务是什么，只盲目地执行命令。
- 具体工作：
  - 在 MyBatis/MyBatis-Plus 中，通常叫 `Mapper` 接口（配合 XML 里的 SQL）。
  - 在 Spring Data JPA / Hibernate 中，通常叫 `Repository` 接口。
  - 这一层**纯粹由底层技术驱动**，输入是参数，输出是数据库里的实体对象（Entity/POJO）。

只做一件事：跟数据库对话

如果用 Mybatis，这层就是一个接口 + XML映射文件：

```java
@Mapper
public interface UserMapper {

    // 插入用户
    int insert(User user);

    // 根据用户名查询
    User findByUsername(String username);

    // 根据 ID 查询
    User findById(Long id);
}
```

```xml
<!-- UserMapper.xml -->
<mapper namespace="com.example.mapper.UserMapper">

    <insert id="insert" parameterType="com.example.entity.User">
        INSERT INTO user (username, password) VALUES (#{username}, #{password})
    </insert>

    <select id="findByUsername" resultType="com.example.entity.User">
        SELECT * FROM user WHERE username = #{username}
    </select>

</mapper>
```



## 注解分析

### @RestController

它是`@Controller`和`@ResponseBody`的组合体。声明这个类是一个控制器，且所有返回接口返回的数据都会自动转换为JSON格式返回给前端

### @RequestMapping

用于映射URL路径。通常写在**类名上**作为该模块的路由前缀（例如`@RequsetMapping("/api/user")`）

接受请求动词的注解，写在方法上

### @PostMapping

接受HTTP POST请求（常用于新增、创建）

### @GetMapping

接受HTTP GET请求（常用于查询）

### @PutMapping

接受HTTP PUT请求（常用于修改、更新）

### @DeleteMapping

接受HTTP DELETE请求（常用于删除）

### @RequestBody

位置：在Controller方法或类上

作用：将方法返回值直接响应给浏览器，如果返回值是**实体对象/集合**，将会转换为`JSON`格式后在响应给浏览器

但是在我们写的Controller中，只给类加上了`@RestController`注解、方法添加了`@RequestMapping`注解，并没有使用`@ResponseBody`注解，怎么响应给浏览器响应呢

这是因为，我们在类上加了`@RestController`注解，而这个注解是两个注解组合起来，分别是：`@Controller`、`@ResponseBody`。那也意味着，所以已经添加了上了，而一旦在类上加了`@ResponseBody`，就相当于该类中的所有方法都已经添加了`@ResponseBody`注解

:::tip

在前后端分离的项目，一般直接在请求处理类上加`@RestController`注解，就无需在方法上加`@ResponseBody`注解了

:::

### @RequestParam

接受URL后拼接参数（如`?name=abc`）或表单数据

### @PathVariable

接受URL路径中的动态常量（如`/api/user/{id}`）

### @Valid

开启参数校验，配合实体类上的`@NotNull`、`@Size`等使用

### @Service

**最核心的类注解**：写在业务逻辑的实现类上（如`UserServiceImpl`），告诉Sping这是一个Service组件，将其注入到Spring容器中

### @Transactional

**事务控制注解**：写在方法或类上。当该方法内包含多个数据库增删改操作时，如果中间任何一步出错抛出异常，Spring 会自动将之前所有的操作回滚（Rollback），确保数据一致性。