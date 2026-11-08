# 循环控制

## for

for循环用于遍历任何提供了迭代器（iterator）的对象，包括集合、数组、区间都可以

```kotlin
fun main() {
    // listOf 只读列表
    val sites = listOf("runoob", "www.runoob.com", "RUNOON")

    for (site in sites) {
        println(site)
    }
}
```

数组同样提供了迭代器

```kotlin
fun main() {
    // intArrayOf 创建 Int 数组，避免装箱开销
    val numbers = intArrayOf(10, 20, 30)

    for (num in numbers) {
        println("${num}")
    }
}
```

## range

区间（range）本身就是一个可遍历对象，用`..`、`until`、`downTo`、`step`构造

它们的边界规则各不相同

写法 含义 遍历结果
1..5 闭区间，包含左右两端 1 2 3 4 5
1 until 5 左闭右开，不包含右端 1 2 3 4
5 downTo 1 从大到小递减 5 4 3 2 1
1..10 step 2 指定步长，只取奇数 1 3 5 7 9
1..<5 半开区间，等价于 until，Kotlin 1.9 起稳定 1 2 3 4
