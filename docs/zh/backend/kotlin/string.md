# String

## 字符串基础与不可变性

字符串用双引号包裹起来，类型是String

String是不可变的（immutable）；一旦创建，内容不可改变

所有看起来想”修改“的方法（`uppercase`、`replace`），实际都是返回一个新的字符串，原字符串保持不变

```kotlin
fun main() {
    val site = "Runoob"

    // 调用 uppercase 得到新字符串，原字符串不受影响
    val upper = site.uppercase()
    println(site)         // Runoob
    println(upper)        // RUNOOB

    // 用方括号按下标取字符，下标从 0 开始
    println(site[0])      // R
    println(site.length)  // 6

    // 用 for 遍历每一个字符
    for (c in site) {
        print(c)
    }
    println()             // 输出换行
}
```

比较字符串内容要用`--`，它比较的是值，`===`比较的是引用，不要用来判断字符串是否相等

```kotlin
fun main() {
    val a = "aaa"
    val b = "aaa"
    val c = String(charArrayOf('a', 'a', 'a'))

    println(a == b) // true
    println(a === b) // true
    println(c) // aaa
    println(a == c) // true
    println(a === c) // false c 是运行时新建的对象
}
```

> 字符串不可变，意味着拼接、替换都会产生新的对象，在循环里拼接字符串时，应改用StringBuilder，否则会产生大量的临时对象

## 字符串模板

字符串模板允许把变量或表达式直接嵌入字符串，用 `$` 开头。

简单的变量名用 `$name`，表达式或带点的调用用 `${...}`。

## 常用方法

| 方法       | 说明 | 示例 |
| ---------- | ---- | ---- |
| `length`     | 字符个数，这是属性 | "Esther".lenth得到6 |
| `isEmpty()`    | 是否为空字符串 | "".isEmpty()得到true |
| `isBlank()`    | 是否为空白（只有空格也算） | " ".isBlank()得到true |
| `lowercase()`  | 转小写，返回新字符串 |      |
| `uppercase()`  | 转大写，返回新字符串 |      |
| `trim()`       | 去首尾空白 |      |
| `split()`      | 按分隔符分成List |      |
| `replace()`    | 替换所有匹配内容 |      |
| `substring()`  |      |      |
| `padStart()`   |      |      |
| `repeat()`     |      |      |
| `startsWith()` |      |      |
| `contains()`   |      |      |
| `indexOf()`    |      |      |
| `toInt()`      |      |      |