# IoC DI

## DI

依赖注入（Dependence Injection），主要有**构造函数注入**，**Setter方法注入**和**接口注入**三种方式

简单来说，DI的核心思想就是：“**不要自己`new`对象，让外界帮你传进来**”

### 构造函数注入

通过类的构造函数将依赖项传进来，这是**官方推荐且最常用**的方式

```java
package com.example.demo.service;

public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### Setter方法注入

通过公开的Setter方法将依赖项注入到类中

```java
public class UserService {
    private UserRepository userRepository;

    // 依赖通过 Setter 方法注入
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### 接口注入

依赖项通过实现特定接口中定义的方法来进行注入。这种方式侵入性太强，现代开发（如 Spring、Guice 等）中已很少使用。

```java
// 1. 定义注入接口
public interface ServiceInjector {
    void injectUserRepository(UserRepository userRepository);
}

// 2. 目标类实现该接口
public class UserService implements ServiceInjector {
    private UserRepository userRepository;

    @Override
    public void injectUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

## @Autowired

在Spring中，`@Autowired`是实现在自动装配的核心注解。它的作用就是告诉Spring容器：“请把对应类型的Bean帮我找出来，并自动注入到这里”

### 字段注入

直接加在成员变量上，简洁方便

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository; // 通过反射直接注入
}
```

### 构造器注入

加在构造函数上（注意：如果类中只有一个构造函数，Spring4.3+起可以省略`@Autowired`）

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired // 只有一个构造函数时可省去此注解
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### Setter方法注入

加载Setter方法上，常用于可选依赖

```java
@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

工作原理：

1. 当Spring遇到`@Autowired`时，会在IoC容器中寻找与声明类型匹配的Bean
2. 恰好找到一个：直接注入成功
3. 找不到：默认抛出`NoSuchBeanDefinitionException`异常（可以设置`@Autowired(required = false)`来允许`null`值）
4. 找到多个（>1）：如果一个接口有多个实现类，Spring会尝试使用**字段名/属性名**作为Bean的名称去匹配。如果还是无法确定唯一Bean，就会抛出`NoSuchUniqueBeanDefinitionException`异常

如何解决多个同类型Bean的冲突

- 配合`@Primary`注解：在实现类上标注`@Primary`注解，声明该Bean为首选注入对象
- 配合`@Qualifier`注解：显示指定注入的Bean的名称，例如`@Qualifier("userserviceImpl")`，Spring会根据这个名称去匹配对应的Bean
- 配合`@Resource`注解：根据Bean的名称或类型去匹配注入，例如`@Resource(name = "userserviceImpl")`
