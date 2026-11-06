# 继承

## Any

Kotlin所有类都有一个共同的超类`Any`，没有显式写父类的都默认继承它

`Any`声明了三个方法：`equals()`、`hashCode()`、`toString()`，它们的默认实现都是可以被子类重写

```kotlin
class Site(val name: String, val url: String) {
    override fun toString(): String {
        // 重写 toString
        return "Site(name=$name, url=$url)"
    }

    // 重写 equals 改为按内容比较
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Site) return false
        return name == other.name && url == other.url
    }

    // 重写 equals 后必须一起重写 hashCode 保证对象哈希码相同
    override fun hashCode(): Int {
        return 31 * name.hashCode() + url.hashCode()
    }
}

fun main() {
    val site1 = Site("Runoob", "www.runoob.com")
    val site2 = Site("Runoob", "www.runoob.com")

    println("site1 == site2: ${site1 == site2}")
    println("site1 === site2: ${site1 === site2}")
    println("${site1.hashCode() == site2.hashCode()}")
}
```

`==`调用的是`equals()`，比较内容；`===`比较的是引用，判断是不是同一个对象

> 只重写equals而不重写hashCode，会让对象在HashSet、HashMap里表现异常，所以要成对出现

## open

Kotlin的类默认是`final`，不能被继承；被继承必须加`open`

类里的成员同样默认是`final`，想被重写也要加`open`

```kotlin
// 加了 open 才能继承
open class Animal(val name: String) {
    // 加了 open 才能继承
    open fun sound(): String = "..."

    // 没有 open 子类不能重写
    fun eat(): String = "${name} eats food"
}

class Dog(name: String): Animal(name) {
    override fun sound(): String {
        return "wangwang"
    }
}

fun main() {
    val dog = Dog("Buddy")
    println(dog.sound())
    println(dog.eat())
    println("${dog is Animal}")
}
```

## 子类有主构造器时的基类初始化

子类有主构造器时，父类必须在子类的类头里初始化，写法是父类名加括号

父类的初始化块**先于**子类的初始化块执行，这一点和大多数面向对象语言一致

```kotlin
open class Site(val name: String) {
    init {
        println("base class")
    }

    open fun show(): String = "site: ${name}"
}

// 子类主构造器把 name 传给父类构造器
class SubSite(name: String, val url: String): Site(name) {
    init {
        println("sub class")
    }

    override fun show(): String {
        return "${super.show()}, url: ${url}"
    }
}

fun main() {
    val s = SubSite("Esther", "www.esther.com")
    println(s.show())
}
```

子类构造器执行时，父类的属性已经初始化完成，所以`super.show()`能读到`name`

## 子类无主构造器时的 super 调用

子类没有主构造器时，父类要在每个次构造器里用 **super(...)** 初始化，或者委托给另一个已经初始化父类的次构造器。

下面的例子让父类只有次构造器，子类也全部使用次构造器。

```kotlin
open class Person {
    open val role: String = "Esther"

    constructor(name: String) {
        println("Person constructor1 $name")
    }

    // 委托给上一个次构造器，避免重复初始化
    constructor(name: String, age: Int): this(name) {
        println("Person constructor2 $name $age")
    }
}

class Student: Person {
    constructor(name: String): super(name) {
        println("Student constructor1 $name")
    }

    constructor(name: String, age: Int): super(name, age) {
        println("Student constructor2 $name $age")
    }

    override val role: String = "Student"
}

fun main() {
    val s = Student("Esther", 18)
    println(s.role)
}
```

父类构造函数执行完，才会执行子类构造函数

## override

子类重写父类的成员必须写`override`关键字，编译器会检查被重写的成员确实存在且是`open`的

重写后的成员默认是`open`的，如果不希望再被重写，加`final`