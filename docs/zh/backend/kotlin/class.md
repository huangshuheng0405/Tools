# Class

## 定义

用`class`关键字定义类，类后面可以跟主构造器，类体写在大括号里

创建一个对象不需要`new`关键字，直接写类名加括号即可


## 属性与getter/setter

类体里`val`声明只读属性，用`var`声明可变属性

每个属性都自带getter，`var`属性还自带setter

```kotlin
class Site {
    var name: String = "runoob"
    val url : String = "www.runoob.com"

    val info: String
        get() = "Name: $name, URL: $url"

    var visits: Int  = 0
        set(value) {
            if (value < 0) {
                println("Visits cannot be negative")
            } else {
                field = value
            }
        }
}

fun main() {
    val site = Site()

    println(site.info)

    site.visits = 100
    println(site.visits)

    site.visits = -1
    println(site.visits)
}
```

在setter里，`value`是新值，`field`是属性真正的存储位置，只能写在getter与setter内部

## 主构造器

主构造器写在类名后面，参数前加`var`或`val`就会同时声明属性

```kotlin
class Site(val name: String, var visits: Int) {
    init {
        println("Site initialized: $name, $visits")
    }
}

fun main() {
    val site = Site("runoob", 0)
    site.visits = 10
    println("Site name: ${site.name}, Site visits: ${site.visits}")
}
```

如果参数前不写`var`或`val`，只是构造参数，不是属性，只能在初始化块和属性初始化器里使用

当主构造器带可见修饰符或注解时，`constructor`不能省略了，例如`private constructor`，后面[私有构造器](#私有构造器)会提到

## init

属性初始化器和`init`块按书写顺序执行

```kotlin
class Demo(val name: String) {
    private val first = "first".also { println("first") }

    init {
        println("init, $name")
    }

    private val second = "second".also { println("second") }
}

fun main() {
    Demo("demo")
}
```

## 次构造器与this

次构造器用`constructor`关键字，写在类体里

如果类有主构造器，每个次构造器都必须直接或间接委托给主构造器，委托用`this(...)`调用

```kotlin
class Site(val name: String, val url: String) {
    var visits: Int = 0

    constructor(name: String): this(name, "www.runoob.com") {
        println("Secondary constructor called")
    }
}

fun main() {
    val a = Site("runoob", "www.runoob.com")
    println("Site name: ${a.name}, Site URL: ${a.url}")

    val b = Site("runoob")
    println("Site name: ${b.name}, Site URL: ${b.url}")
}
```

```
Site name: runoob, Site URL: www.runoob.com
Secondary constructor called
Site name: runoob, Site URL: www.runoob.com
```

主构造器如果参数够，就不调用次构造器，不够才调用次构造器

## 私有构造器

把主构造器标记为`private`，外部不能直接创建对象，只能通过类内部提供的工厂方法获取实例

这种写法常用于单例、工具类

```kotlin
class Token private constructor(val value: String) {
    // 外部无法调用 Token("...")，只能通过工厂方法获取实例
    companion object {
        fun create(): Token = Token("runoob")
    }

    fun describe(): String  = "Token with value: $value"
}

fun main() {
    // val t = Token("abc") // 报错 构造函数是私有的
    val token = Token.create()
    println(token.describe())
}
```

## 抽象类

用`abstract`关键字声明抽象类，不能被实例化，只能被继承

抽象类可以同时有抽象成员函数和普通成员，抽象成员必须由子类实现

```kotlin
abstract class Shape {
    // 抽象方法没有方法体，子类必须实现
    abstract fun area(): Double

    // 普通成员默认是final 加 open 才能被子类重写
    open fun describe(): String = "This shape has an area of ${area()}"
}

class Circle(val radius: Double): Shape() {
    override fun area(): Double {
        return Math.PI * radius * radius
    }
}

class Square(val side: Double): Shape() {
    override fun area(): Double {
        return side * side
    }

    override fun describe(): String {
        return "Square " + super.describe()
    }
}

fun main() {
    // val s = Shape() // 抽象类不能被实例化

    val shapes: List<Shape> = listOf(Circle(2.0), Square(3.0))
    for (shape in shapes) {
        println(shape.describe())
    }
}
```

注意 `abstract fun area()` 天然是 open 的，但 `describe()` 想被子类重写，必须显式加 `open`


