# kotlinc

从`github`下载最新的`kotlin-compiler-*.zip`，解压到一个目录，然后将该目录下的`bin`文件夹**路径添加到系统的PATH环境变量**

创建一个`hello.kt`文件

```kotlin
fun main() {
    println("Hello, Kotlin!")
}
```

在终端中编译并允许

```bash
kotlinc hello.kt -include-runtime -d hello.jar
java -jar hello.jar
```
