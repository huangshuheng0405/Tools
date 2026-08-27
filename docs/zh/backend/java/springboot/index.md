# Spring Boot

<svg height="200px" viewBox="-2.1 0 514.3 457.8" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m503.5 201.4-100.5-173.9c-8.7-15.1-30.1-27.5-47.6-27.5h-200.8c-17.4 0-38.9 12.4-47.6 27.5l-100.4 173.9c-8.7 15.1-8.7 39.8 0 54.9l100.4 174c8.7 15.1 30.1 27.5 47.6 27.5h200.9c17.4 0 38.8-12.4 47.6-27.5l100.4-174c8.7-15.1 8.7-39.8 0-54.9zm-270.2-105.2c0-11.4 9.3-20.7 20.7-20.7s20.7 9.3 20.7 20.7v123.7c0 11.4-9.3 20.7-20.7 20.7s-20.7-9.3-20.7-20.7zm20.7 264.1c-77.4 0-140.4-63-140.4-140.4.1-44.4 21.1-86.1 56.7-112.7 8.2-6.1 19.7-4.4 25.8 3.8s4.4 19.7-3.8 25.8c-45.9 34.1-55.5 99-21.4 144.9s99 55.5 144.9 21.4c26.3-19.5 41.8-50.4 41.8-83.2-.1-32.9-15.7-63.8-42.2-83.4-8.2-6-9.9-17.6-3.9-25.8s17.6-9.9 25.8-3.9c35.9 26.5 57 68.5 57.1 113.1 0 77.5-63 140.4-140.4 140.4z" fill="#6db33f"/></svg>

## 数据模型

Entity（实体）、DTO（数据传输对象）、VO（视图对象）

> Entity管数据库，DTO管传输、VO管前端展示

### Entity

- 定位：数据库映射层
- 职责：与数据库表结构一一对应（通常用JPA/Hibernate的`@Entity`或Mybatis的resultMap映射）
- 特点：包含数据库字段、关联关系（如`@OneToMany`）和审计字段（如`createTime`，`updateTime`）
- 注意：不要将Entity直接暴露给前端，里面可能包含密码、敏感字段、

```java
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password; // 敏感字段！绝不能传到前端
    private String email;
    private LocalDateTime createTime;
    // getter/setter...
}
```

### DTO

- 定位：业务传输层
- 职责：为了减少网络传输开销和解耦内部实体，它聚会了多个Entity的数据，或者只提取Entity的部分字段
- 扁平化、无业务逻辑、无敏感字段。通常用于接受前端传来的参数（如注册请求）

```java
import javax.validation.constraints.NotBlank;

// 接收前端注册请求的 DTO
public class UserRegisterDTO {
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    private String password; // 注意：接收时可以存在，但返回时必须脱敏
    private String email;
    // getter/setter...
}
```

### VO

- 定位：视图展示层（专门返回给前端页面）
- 职责：根据前端具体的 UI 需求，定制化展示数据。比如前端需要显示 `年龄`，但数据库存的是 `出生日期`，VO 可以把日期计算成年龄再返回。
- 特点：面向 UI 展示，可以额外增加前端专属字段（如 `listIndex`, `totalPages`），**不包含任何业务逻辑**。

