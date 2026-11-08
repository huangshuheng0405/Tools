# function

用`fun`关键字定义函数

函数体有两种形式

- 块体：用`{}`包起来
- 表达式体：用`=`直接给结果

```kotlin
// 块体：有花括号和 return，返回类型必须显式写出
fun add(a: Int, b: Int): Int {
    return a + b
}

// 表达式体：没有花括号和 return，返回类型可以省略
fun subtract(a: Int, b: Int): Int = a - b

// 块体但没有 return，返回类型可以省略 : Unit
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    println(add(1, 2))
    println(subtract(1, 2))
    printSum(1, 2)
}
```

