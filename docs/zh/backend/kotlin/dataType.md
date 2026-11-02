# dataType

kotlin是一门静态类型语言，变量在声明时类型就确定了，编译器会在编译期检查类型是否正确

## 数值类型与位宽

kotlin的数值类型与java基本一致，但是kotlin的Char不属于数值类型，不能直接参与数值运算

| 类型   | 位宽 | 取值类型                                   | 说明                                     |
| ------ | ---- | ------------------------------------------ | ---------------------------------------- |
| Byte   | 8    | -128~127                                   | 最小的整数类型                           |
| Short  | 16   | -32768 ~ 32767                             | 较少使用                                 |
| int    | 32   | -2147483648 ~ 2147483647                   | 整数的默认类型                           |
| Long   | 64   | -9223372036854775808 ~ 9223372036854775807 | 字面量后面需要加L后缀                    |
| Float  | 32   | 约 ±3.4×$10^{38}$                          | 单精度，6~7 位有效数字，字面量加 f 后缀  |
| double | 64   | 约 ±1.8×$10^{308}$                         | 双精度，15~16 位有效数字，浮点的默认类型 |

### 位宽与溢出

每种整数类型的位宽是固定的，运算结果超出范围会发生溢出，而不是抛出异常

```kotlin
fun main() {
    val max = Int.MAX_VALUE      // Int 的最大值
    println(max)                 // 2147483647
    println(max + 1)             // -2147483648，溢出后绕回最小值

    val min = Int.MIN_VALUE      // Int 的最小值
    println(min)                 // -2147483648
    println(min - 1)             // 2147483647，向另一个方向溢出

    // 需要更大范围时使用 Long，注意先把 Int 转成 Long 再相加
    val big = Int.MAX_VALUE.toLong() + 1
    println(big)                 // 2147483648
}
```

## 隐式转换

kotlin与java、c的一个关键差异：**较小的数值类型不会自动转为较大的类型**

```kotlin
fun main() {
    val b: Byte = 1
    // val i: Int = b        // 编译错误：Kotlin 不会把 Byte 隐式转换为 Int
    val i: Int = b.toInt()   // 必须显式调用转换函数
    println(i)               // 1

    // 字面量是例外：编译器在编译期就能确认 100 在 Byte 范围内
    val b2: Byte = 100
    println(b2)              // 100

    // 算术运算可以混合类型，结果类型由操作数决定
    val l = 1L + 3           // Long + Int 得到 Long
    println(l)               // 4
}
```

## Char

字符用Char表示，字面量必须写在单引号里，例如`'a'`、`'0'`

与Java不同，Kotlin的Char不属于数值类型，不能直接赋值给`Int`，也不能直接和数字比较

```kotlin
fun main() {
    val c: Char = 'A'

    println(c)                  // A
    println(c.code)             // 65，字符的 Unicode 码点
    println(c + 1)              // B，Char + Int 得到新的 Char
    println(c - 'A')            // 0，两个 Char 相减得到 Int
    println('5'.digitToInt())   // 5，把数字字符转换成数字

    // val n: Int = c           // 编译错误：Char 不能直接赋给 Int
    val n: Int = c.code
    println(n)                  // 65
}
```

### 转义字符

| 转义序列 | 含义                           |
| -------- | ------------------------------ |
| \t       | 制表符                         |
| \b       | 退格                           |
| \n       | 换行                           |
| \r       | 回车                           |
| \\'      | 单引号                         |
| \\"      | 双引号                         |
| \\\      | 反斜杠                         |
| \\$      | 美元符号，避免被当作字符串模板 |
|          |                                |

