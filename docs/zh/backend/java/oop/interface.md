# 接口

在Java中，接口使用`interface`关键字声明，类使用`implements`来实现接口

## 声明

在接口里，通常**只声明方法**，不写具体实现，但从Java8开始，接口开始也支持`default`方法和`static`方法

```java
public interface Connection {
    // 接口中的变量默认都是：public static final（全局常量），写不写这三个词都一样
    String TYPE = "Type-C";

    // 接口中的方法默认都是：public abstract（抽象方法），不能有方法体
    void connect();
    void transferData();
}
```

## 实现

一个类如果实现了某个接口，就必须实现（重写）该接口中定义的所有抽象方法，否则这个类就必须声明为抽象类

```java
// 键盘类实现了 Connection 接口
public class Keyboard implements Connection {
    @Override
    public void connect() {
        System.out.println("键盘已连接");
    }

    @Override
    public void transferData() {
        System.out.println("正在传输数据");
    }
}
```

## 为什么要用接口

有了继承，为什么还要接口

1. 弥补了Java单继承的缺陷

比如：`Dog`继承了`Animal`，它就不能再继承`Robot`（机器人）了

但是，**一个类可以实现多个接口**

```java
// 电子狗既是动物（继承），又具有电子设备和宠物属性（多接口实现）
public class RoboticDog extends Animal implements Electronic, Pet {
    // 完美融合！
}
```

2. 彻底的解耦

接口把规范和具体实现彻底分开了

比如，你写了一个电脑类`Computer`，它需要连接设备

```java
public class Computer {
    // 电脑只认 Connection 接口，不认具体的设备
    public void plugin(Connection device) {
        System.out.println("发现新设备...");
        device.connect();
        device.transferData();
    }
}
```

有了接口，无论以后市场上出现什么奇形怪状的 USB 设备（比如 USB 加湿器、USB 暖手宝），你的 Computer 类一行代码都不需要改！只要新设备实现了 Connection 接口，电脑就能直接用。

## 默认方法

接口提供一个默认实现。子类可以直接继承使用，不用强制重写

```java
public interface Connection {
    void connect();

    // 新增一个默认方法，带花括号和具体实现
    default void charge() {
        System.out.println("正在通过接口进行慢速充电（默认 5V 1A）...");
    }
}
```

## 静态方法

接口也可以写静态方法，直接用`接口名.方法名()`调用，通常用于提供工具类性质的辅助方法

```java
public interface Connection {
    static boolean isValidType(String type) {
        return "Type-C".equalsIgnoreCase(type) || "Micro-USB".equalsIgnoreCase(type);
    }
}
```
