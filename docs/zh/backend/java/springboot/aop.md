# AOP

引入依赖，SpringBoot默认集成了Spring AOP，只需引入Web启动器或AOP Starter

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

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
