# 抽象类

使用`abstract`关键字声明一个类为抽象类，抽象类不能被实例化，只能被继承

```java
public abstract class Animal {
    // 可以有普通的成员变量 （接口不行）
    private String name;

    // 抽象类可以有构造方法，主要是给子类初始化属性用的
    public Animal(String name) {
        this.name = name;
    }

    // 抽象方法 没有方法体 必须用abstract 修饰
    // 子类必须去重写实现这个方法
    public abstract void makeSound();

    public void breathe() {
        System.out.println(name + "is breathing");
    }

    public String getName() {
        return name;
    }
}

```

当子类继承这个抽象类是，必须重写它的抽象方法:

```java
public class Dog extends Animal{
    public Dog(String name) {
        super(name);
    }

    @Override
    public void makeSound() {
        System.out.println(getName() + "wanwang");
    }
}
```

## 注意

1. 不能被实例化

你不能写`Animal a = new Animal("动物")`。因为抽象类是半成品，里面可能包含具体没有实现的abstract方法，如果让你new出来去调用这个方法,JVM就会彻底崩溃

2. 抽象类不一定非要有抽象方法：

一个类哪怕一个抽象方法都没有，也可以被声明为抽象类。这往往是因为设计者不想让外部直接`new`这个类的对象

3. 有抽象方法的类，必须声明为抽象类

只要类里面有一行`public abstract void xxx();`，这个类就必须声明为抽象类，否则编译器直接报错

```

```

## 场景

抽象类最经典的实战场景就是“模板方法模式”。它可以把通用的步骤留在父类里实现，而把个性化的核心步骤留给子类去发挥。

比如，我们要做一个“泡饮品”的程序：

```java
public abstract class Beverage {
    // 模板方法：固定了泡饮品的标准流程，子类不能乱改（用 final 修饰）
    public final void prepareRecipe() {
        boilWater();       // 1. 烧水
        brew();            // 2. 冲泡（抽象步骤，留给具体饮品实现）
        pourInCup();       // 3. 倒进杯子里
        addCondiments();   // 4. 加调料（抽象步骤，留给具体饮品实现）
    }

    private void boilWater() {
        System.out.println("把水烧开至 100°C");
    }

    private void pourInCup() {
        System.out.println("把饮料倒入杯中");
    }

    // 具体的冲泡方法和调料，各自不同，留给子类去决定
    protected abstract void brew();
    protected abstract void addCondiments();
}
```

现在我们只需要专注于实现“咖啡”和“茶”的具体冲泡步骤：

```java
class Coffee extends Beverage {
    @Override
    protected void brew() {
        System.out.println("用沸水冲泡咖啡粉");
    }

    @Override
    protected void addCondiments() {
        System.out.println("加入牛奶和糖");
    }
}
```

外部调用时直接调用模板方法即可：

```java
Beverage myCoffee = new Coffee();
myCoffee.prepareRecipe();
// 会严格按照：烧水 -> 冲泡咖啡 -> 倒杯 -> 加奶和糖 的顺序执行！
```
