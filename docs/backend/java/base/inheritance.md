# 继承

在java中使用`extends`关键字来实现继承

示例：

```java
public class Main {
    public static void main() {
        Dog mydog = new Dog();
        mydog.name = "husky";

        mydog.eat(); // 调用 父类的方法
        mydog.bark(); // 调用自己的方法
    }
}

class Animal {
    String name;

    public void eat() {
        System.out.println(name + "is eating");
    }
}

class Dog extends Animal {
    public void bark() {
        System.out.println(name + "is wang");
    }
}
```

## 规则

### 单继承

Java只支持单继承，不支持多继承。一个类只能有一个直接父类

```java
class A {}
class B {}
class C extends A, B {} // 错误
```

原因：如果A和B都有一个同名函数`hello()`，子类C调用`hello()`时不知道调用谁

### super

`super`代表父类的引用，主要有两个用途：

1. **调用父类的构造方法**：子类的构造方法中，默认会隐式调用的**无参构造方法**，如果父类没有无参构造函数，子类必须手动显式调用`super(参数)`
2. **区分同名成员**：如果子类和父类有同名的变量和方法，可以用`super.变量名`或`super.方法名()`来强制指定调用父类的

### Override

子类如果觉得父类的方法不好用，可以把这个方法“覆盖”掉，写一个一摸一样的方法名和参数列表，但内容不同的方法

```java
public class Main {
    public static void main() {
        Dog mydog = new Dog();
        mydog.name = "husky";

        mydog.eat(); // Dog is eating
    }
}

class Animal {
    String name;

    public void eat() {
        System.out.println(name + "is eating");
    }
}

class Dog extends Animal {
    public void bark() {
        System.out.println(name + "is wang");
    }

    public void eat() {
        System.out.println("Dog is eating");
    }
}
```

### 什么不能被继承

1. `private`成员：父类私有的属性和方法，子类无法直接访问（但可以通过父类提供的`public`getter/setter方法间接访问）
2. 构造方法：只能被子类用`super()`调用
3. `final`修饰的类：`public final class String`，任何类都不能直接继承它

## 优缺点

优点

- 代码复用
- 易于扩展

缺点

- 高耦合性
- 打破了封装性