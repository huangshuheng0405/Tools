# AOP

引入依赖，SpringBoot默认集成了Spring AOP，只需引入Web启动器或AOP Starter

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

## AOP 注解

Spring AOP 采用 AspectJ 的注解风格，核心注解可分为**切面声明**、**切入点**与**通知**三类。

### 切面与切入点

- `@Aspect`：声明切面类，需配合 `@Component`（或 `@Bean`）交给 Spring 容器管理
- `@Pointcut`：定义切入点，将可复用的切入点表达式抽取为一个空方法，方法名即切入点标识，供各类通知引用

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class MyAspect {

    // 抽取切入点，方法体为空，方法名 point() 即为切入点标识
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void point() {}

    @Before("point()")
    public void before() {
        System.out.println("前置通知");
    }
}
```

### 通知（Advice）

| 注解 | 名称 | 触发时机 |
| --- | --- | --- |
| `@Before` | 前置通知 | 目标方法执行**之前** |
| `@After` | 后置通知（最终通知） | 目标方法执行**之后**，无论正常返回还是抛出异常（类似 `finally`） |
| `@AfterReturning` | 返回通知 | 目标方法**正常返回**之后，可获取返回值 |
| `@AfterThrowing` | 异常通知 | 目标方法**抛出异常**之后，可获取异常对象 |
| `@Around` | 环绕通知 | **包裹**目标方法，功能最强，可决定是否执行、修改入参与返回值 |

```java
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class MyAspect {

    @Pointcut("execution(* com.example.service.UserService.*(..))")
    public void point() {}

    @Before("point()")
    public void before(JoinPoint joinPoint) {
        System.out.println("前置通知：" + joinPoint.getSignature().getName());
    }

    // returning 指定用于接收返回值的方法参数名
    @AfterReturning(pointcut = "point()", returning = "result")
    public void afterReturning(Object result) {
        System.out.println("返回通知，返回值：" + result);
    }

    // throwing 指定用于接收异常对象的方法参数名
    @AfterThrowing(pointcut = "point()", throwing = "ex")
    public void afterThrowing(Throwable ex) {
        System.out.println("异常通知：" + ex.getMessage());
    }

    @After("point()")
    public void after() {
        System.out.println("后置通知（最终通知）");
    }

    @Around("point()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕通知 —— 目标方法执行前");
        Object result = joinPoint.proceed(); // 执行目标方法
        System.out.println("环绕通知 —— 目标方法执行后");
        return result;
    }
}
```

::: tip 通知执行顺序
同一个切面内，Spring 5.2.7（SpringBoot 2.2）及以后版本的通知优先级由高到低为：`@Around` → `@Before` → `@After` → `@AfterReturning` → `@AfterThrowing`。

- 正常返回：`@Around`(前) → `@Before` → 目标方法 → `@AfterReturning` → `@After` → `@Around`(后)
- 抛出异常：`@Around`(前) → `@Before` → 目标方法(抛异常) → `@AfterThrowing` → `@After` → `@Around`(catch)

多个切面作用于同一方法时，可用 `@Order(值)` 指定顺序，**值越小优先级越高**（越先执行前置、越后执行后置）。
:::

## 自定义注解

编写注解

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
}
```

编写切面类

实现切面逻辑，统计标有`@LogExecutionTime`注解的方法的执行时间

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    // 作用于所有标注了 @LogExecutionTime 的方法
    @Around("@annotation(LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        // 执行实际的目标方法
        Object proceed = joinPoint.proceed();

        long executionTime = System.currentTimeMillis() - start;
        System.out.println(joinPoint.getSignature() + " 执行耗时: " + executionTime + "ms");

        return proceed;
    }
}
```

在业务逻辑上使用

直接在Service方法上标记自定义注解即可

```java
@Service
public class UserService {

    @LogExecutionTime
    public void fetchUserData() throws InterruptedException {
        Thread.sleep(500); // 模拟耗时操作
    }
}
```

## 切入点表达式

除了注解匹配，还可以基于包名、类目或方法名匹配：

匹配特定方法：`execution(* com.example.service.UserService.getUser*(..))`

匹配包下所有类的所有方法：`execution(* com.example.service.*.*(..))`

匹配标注指定注解的方法：`@annotation(com.example.annotation.LogExecutionTime)`

## 底层实现

JDK动态代理，
