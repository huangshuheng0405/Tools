# basic

## main

程序入口时`main`函数，最简形式不接受参数，等价`java`的`public static void main(String[] args)`

```kotlin
fun main() {

}
```

需要读取命令行参数

```kotlin
fun main(args: Array<String>) {

}
```

## var val

`val`声明不可变变量，`var`声明可变变量

`val`相当于`java`的`final`变量，一旦赋值就不能指向别的对象

> 推荐优先使用`val`，只有确实要修改的再用`var`

### 类型推断

声明变量时可以省略类型，编译器会根据初始值自动推断

```kotlin
fun main() {
    val name = "Runoob"             // 推断为 String
    val age = 25                    // 推断为 Int
    val price = 9.9                 // 推断为 Double
    val isOpen = true               // 推断为 Boolean

    println("$name $age $price $isOpen")
    println(name::class.simpleName) // 打印运行时类型名
}
```

也可以显示写出类型，声明与赋值分开时就必须写

```kotlin
fun main() {
    val siteName: String = "菜鸟教程"    // 显式指定类型
    var age: Int                         // 只声明不赋值，此时必须写类型

    age = 25                             // 之后再赋值
    println("$siteName，age = $age")
}
```

## 字符串模板

直接在字符串里引用变量

用`$`加变量名即可，简单表达式用`${}`包起来

## 空安全

类型后面加门号标识可空，不加问好表示一定不为空

```kotlin
fun main() {
    val a: String = "Esther"
    val b: String? = null
    
    // println(b.length) // This will throw a NullPointerException
    println(b?.length) // 安全调用
    println(b?.length ?: 0) // Elvis 运算符 为 null 时 给默认值
}
```

