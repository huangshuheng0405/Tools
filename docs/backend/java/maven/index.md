# Maven

## 安装

[Maven](https://maven.apache.org/download.cgi#CurrentMaven)直接去官网下载二进制文件

- Binary (apache-maven-3.9.x-bin.tar.gz 或 .zip)：这是编译好的、可以直接运行的程序。解压后配置一下环境变量就能直接用。绝大多数人、绝大多数时候都选这个。

- Source (apache-maven-3.9.x-src.tar.gz 或 .zip)：这是 Maven 的源代码（未编译的 Java 文件）。只有在你想要研究 Maven 本身是怎么写出来的、或者想修改 Maven 源码、自己编译它的时候才需要下载这个。

在环境变量里面新增`MAVEN_HOME`，值为`D:\apache-maven-3.9.x`（下载的目录）

在环境变量里面新增`PATH`，值为`%MAVEN_HOME%\bin`

在命令行里面输入`mvn -version`，如果显示版本号，说明安装成功
