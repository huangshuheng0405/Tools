# Maven 生命周期

Maven 的生命周期（Lifecycle）是一个**流程框架**，它定义了一系列的阶段（Phase），告诉 Maven"什么时候做什么事"。

只要告诉 Maven 执行到哪个阶段，它会自动把前面的阶段依次跑完，不用自己逐个去执行。

## 三套生命周期

Maven 内置了三套生命周期，各自独立：

| 生命周期 | 用途 |
|---------|------|
| `clean` | 清理项目（删除编译产物） |
| `default` | 构建项目（编译、测试、打包、部署等） |
| `site` | 生成项目站点文档 |

## default 生命周期

最核心的一套，定义了从源码到部署的完整流程。阶段从上到下依次执行：

| 阶段 | 作用 |
|------|------|
| `validate` | 验证项目结构和配置是否正确 |
| `compile` | 编译源代码（`.java` → `.class`） |
| `test` | 运行单元测试（`src/test/java` 下的测试代码） |
| `package` | 打包编译好的代码（生成 `.jar` / `.war`） |
| `verify` | 对集成测试做检查，确保包符合质量要求 |
| `install` | 将打包好的构件安装到**本地仓库**（默认 `~/.m2/repository`），供其他本地项目引用 |
| `deploy` | 将打包好的构件部署到**远程仓库**（如 Nexus、Artifactory），供团队共享 |

这几个是最常用的，完整列表有 20 多个阶段，大多不常直接用到。

## clean 生命周期

负责清理构建目录（默认是 `target`）：

| 阶段 | 作用 |
|------|------|
| `pre-clean` | 执行清理前需要完成的操作 |
| `clean` | 删除上一次构建生成的所有文件（即删除 `target` 目录） |
| `post-clean` | 执行清理完成后需要完成的操作 |

## site 生命周期

生成项目站点（比如自动生成 Javadoc、代码统计报告等）：

| 阶段 | 作用 |
|------|------|
| `pre-site` | 在生成站点文档前需要执行的操作 |
| `site` | 生成项目站点文档 |
| `post-site` | 生成站点文档后需要执行的操作 |
| `site-deploy` | 将站点文档部署到指定的服务器上 |

## 阶段与插件的关系

阶段本身不做具体的事，它只是一个**时间点**。真正干活的是一些 Maven 插件（Plugin），每个插件有自己的**目标（Goal）**，目标会绑定到对应的阶段上。

```java
// 举个例子：执行 mvn compile 时
// compile 阶段绑定了 maven-compiler-plugin 的 compile 目标
// 这个目标才是真正"把 .java 编译成 .class"的执行者
```

常见绑定关系：

| 阶段 | 插件:目标 |
|------|----------|
| `compile` | `maven-compiler-plugin:compile` |
| `test` | `maven-surefire-plugin:test` |
| `package` | `maven-jar-plugin:jar`（或 `maven-war-plugin:war`） |
| `install` | `maven-install-plugin:install` |
| `deploy` | `maven-deploy-plugin:deploy` |

## 常用命令

```bash
# 清理（删除 target 目录）
mvn clean

# 编译（只编译源代码，不跑测试）
mvn compile

# 编译 + 跑单元测试
mvn test

# 清理 + 编译 + 测试 + 打包
mvn clean package

# 跳过测试直接打包
mvn package -DskipTests

# 编译 + 测试 + 打包 + 安装到本地仓库
mvn install

# 安装到本地仓库，但跳过测试
mvn install -Dmaven.test.skip=true

# 部署到远程仓库
mvn deploy
```

## 重要规则

1. **阶段是顺序执行的。** 执行后面阶段的命令时，前面的阶段会自动依次运行。比如 `mvn package` 会自动先执行 `validate` → `compile` → `test` → `package`。

2. **三套生命周期互不干扰。** `mvn clean` 只走 clean 周期，默认不会去编译。通常把 `clean` 和 `default` 周期配合使用：`mvn clean package`。

3. **阶段（Phase）和目标（Goal）是不同层级的。** 命令行可以直接调用目标，格式是 `mvn 插件名:目标名`，比如：

   ```bash
   # 只执行 compiler 插件的 compile 目标，不触发前后阶段
   mvn compiler:compile

   # 只执行 surefire 插件的 test 目标
   mvn surefire:test
   ```

   平时建议用阶段名（`mvn compile`），更简洁，且能自动触发前置阶段。
