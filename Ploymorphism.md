# 多态

要实现多态，必须满足三个前提条件：

1. 继承：子类继承父类
2. 重写：子类重写父类的方法
3. 父类引用指向子类对象

示例

```java
class Animal {
    public void makeSound() {
        System.out.println("动物发出叫声");
    }
}

// 继承并重写方法
class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("wangwang");
    }
}

// 继承并重写方法
class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("miaomiao");
    }
}
```

下面来看怎么用

```java
class Animal {
    public void makeSound() {
        System.out.println("动物发出叫声");
    }
}

// 继承并重写方法
class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("wangwang");
    }

    public void say() {

    }
}

// 继承并重写方法
class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("miaomiao");
    }
}

public class Main {
    public static void main(String[] args) {
        // 父类引用 a1 指向子类 Dog 的实例
        Animal a1 = new Dog();
        Animal a2 = new Cat();

        a1.makeSound(); // wangwang
        a2.makeSound(); // miaomiao

//        a1.say()  // error
    }
}
```

编译时，编译器只知道`a1`是一个`Animal`，所以只能调用`Animal`里的方法

运行时，JVM会去探测`a1`实际指向的内存地址，并指向`Dog`里重写的方法

如果没有多态的写法

每增加一种动物，都要专门写一个方法，代码会变得很臃肿

```java
class Feeder {
    // 喂狗
    public void feed(Dog dog) {
        System.out.print("准备食物 -> ");
        dog.makeSound();
    }
    // 喂猫
    public void feed(Cat cat) {
        System.out.print("准备食物 -> ");
        cat.makeSound();
    }
    // 以后每多一个动物（比如猪、鸭、羊），你都得在这里加一个 feed() 方法...
}
```

有多态的写法

```java
class Feeder {
    // 只需要写一个方法，接收通用的 Animal 即可！
    public void feed(Animal animal) {
        System.out.print("准备食物 -> ");
        animal.makeSound(); // 多态在这里生效！
    }
}
```

```java
public class Test {
    public static void main(String[] args) {
        Feeder feeder = new Feeder();

        Animal myDog = new Dog();
        Animal myCat = new Cat();

        feeder.feed(myDog); // 输出：准备食物 -> 汪汪汪！
        feeder.feed(myCat); // 输出：准备食物 -> 喵喵喵~
    }
}
```

之后再想加一个类，只要继承`Animal`类，重写`makeSound`方法，就可以用`Feeder`类来喂了

## 注意

- 成员变量没有多态

如果父类和子类有同名的成员变量，通过父类引用去访问时，访问的依然是父类的变量

- 多态下不能直接调用子类特有的方法

如果 Dog 类里面写了一个特有的方法 public void fetchBall()（捡球），那么 Animal dog = new Dog(); 是无法直接调用 dog.fetchBall() 的。因为在编译期，编译器只看左边的 Animal，而 Animal 里没有 fetchBall。

解决方法：使用向下转型（强制类型转换）之前先用`instanceof`判断

```java
class Animal {
    public void makeSound() {
        System.out.println("动物发出叫声");
    }
}

// 继承并重写方法
class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("wangwang");
    }

    public void say() {
        System.out.println("real dog");
    }
}

// 继承并重写方法
class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("miaomiao");
    }
}

public class Main {
    public static void main(String[] args) {
        // 父类引用 a1 指向子类 Dog 的实例
        Animal a1 = new Dog();
        Animal a2 = new Cat();

        a1.makeSound(); // wangwang
        a2.makeSound(); // miaomiao

        if (a1 instanceof Dog) {
            Dog realDog = (Dog) a1;
            realDog.say(); // 成功调用
        }
    }
}
```

## 重载

在同一个类，方便用户使用，提供了同名但参数不同的多个方法（比如多种加法器）

方法名**必须相同**，参数列表（个数、类型、顺序至少一个不同）**必须不同**

示例：

```java
public class Calculator {
    // 两个整数相加
    public int add(int a, int b) {
        return a + b;
    }

    // 三个整数相加（参数个数不同）
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // 两个双精度浮点数相加（参数类型不同）
    public double add(double a, double b) {
        return a + b;
    }
}
```

**重载（Overload）=编译时多态（静态绑定）**

重载在代码编译阶段就已经决定好了

当你写下 calculator.add(10, 20) 时，编译器在编译成字节码（.class 文件）的那一刻，就已经通过参数类型和个数，锁定了该去调用 add(int, int) 这个具体的方法。

- 特点：不需要运行程序，看一眼参数就能确定

**重写（Override）=运行时多态（动态绑定）**

当你写下`Printer p = new ColorPrinter(); p.print();` 时，编译器在编译阶段只知道 p 是 Printer 类型，它不知道（也无法确定）你在运行期间会塞给它一个什么子类对象。
只有当程序真正跑起来，JVM 执行到这一行时，它才会去内存里探测：“哦，原来 p 指向的真实对象是`ColorPrinter` 呀！” 进而调用子类重写后的方法。

- 特点：编译器无法决定，必须在运行期动态寻找
