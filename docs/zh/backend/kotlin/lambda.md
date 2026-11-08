# Lambda

lambda就是匿名函数，可以当作值传递、赋值给变量、作为参数或返回值

```kotlin
val sum = { a: Int, b: Int -> a + b }
println(sum(1, 2)) // 3
```

- `{}`包裹
- `->`左边是参数，右边是函数体
- 最后一行表达式的值就是返回值（没有`return `关键字）

## 基本语法

```kotlin
val greet: (String) -> String = { name: String -> "Hello, $name" }
```

省略参数，用隐式`it`（只有一个参数时）

```kotlin
val square: (Int) -> Int = { it * it }
```

建议：lambda嵌套较深或`it`含义不明显时，显示命名

```kotlin
// 不推荐，嵌套后不知道 it 是谁
list.filter { it.isActive }.map { it.name }

// 推荐
list.filter { user -> user.isActive }.map { user -> user.name }
```

无参数

```kotlin
val hello = { println("Hello") }
```

多行函数体

```kotlin
val process = { x: Int ->
    val doubled = x * 2
    doubled + 1        // 最后一行是返回值
}
```

没有返回值（返回`Unit`）

```kotlin
val log: (String) -> Unit = { msg -> println(msg) }
```

## 返回语义

lambda内部最后一行是返回值

```kotlin
val add = { a: Int, b: Int -> a + b }   // 返回 a+b
```

不能用`return`返回lambda的值

```kotlin
val add = { a: Int, b: Int ->
    // return a + b   // 编译错误：'return' is not allowed here
}
```



## 高阶函数

**参数或返回值是函数**类型的函数，叫高阶函数

```kotlin
fun calculate(a: Int, b: Int, op: (Int, Int) -> Int): Int {
    return op(a, b)
}

calculate(2, 3) { x, y -> x + y }   // 5
```

尾随lambda语法：最后一个参数是函数类型时，lambda可以写在括号外

```kotlin
list.filter { it > 0 }              // 等价于 list.filter({ it > 0 })
repeat(3) { println("hi") }         // 等价于 repeat(3, { println("hi") })
```

如果只有一个函数类型参数，括号完全可以省略

```kotlin
run { println("hi") }
```

