# kotlinc

kotlinc是Kotlin的命令行编译器

> 安装前先执行`java -version`确认JDK已就绪，JDK安装请参考[JDK](../java/jdk.md)

## Installation

从`github`下载最新的`kotlin-compiler-*.zip`，解压到一个目录，然后将该目录下的`bin`文件夹**路径添加到系统的PATH环境变量**

下载完成后在终端输入

```bash
kotlinc -version
```

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

第一条命令把源码编译并打包，第二条用JVM运行生产的`jar`

-d

指定输出位置，

-include-runtime

打包Kotlin运行时（kotlin-stdlib）到jar中，使`jar`可以独立运行
