# Docker

## Installation

Windows，直接下载Docker Desktop即可

[Docker Desktop](https://www.docker.com/)

安装后验证

```bash
docker --version
```

- `docker start container-name`：启动容器
- `docker run ...` ：创建并启动容器
- `docker stop container-name`：停止容器
- `docker ps -a`：显示所有容器的状态

## 镜像

一个只读的安装包/模板，里面包含了

- 精简的操作系统
- 运行环境（MySQL、Redis）
- 代码和配置

```bash
docker images               # 查看镜像
docker pull mysql:8.0       # 拉取镜像
docker rmi mysql:8.0        # 删除镜像
docker build -t myapp:1.0   # 根据dockerfile 构建镜像
```

### Docker Hub

[Docker Hub](https://hub.docker.com/)

镜像仓库，一些软件的官方会把它们的软件上传上去

## 容器

镜像运行起来的实例，一个镜像可以跑出多个容器，互相隔离，互不影响

```bash
docker run -d --name mysql -p 3306:3306 mysql:8.0 # 启动容器
docker ps                        # 查看运行中的容器
docker ps -a                     # 查看所有容器
docker stop mysql                # 停止容器
docker start mysql               # 启动已停止的容器
docker rm mysql                  # 删除容器
docker logs -f mysql             # 查看容器日志
docker exec -it mysql bash       # 进入容器内部
```

`docker run`中常见的参数

- `-d`：后台运行
- `--name`：给容器命名
- `-e`：环境变量
- `-p`：宿主机端口映射到容器内端口

镜像名称结构`[repository]:tag`

- `repository`：镜像仓库，Docker Hub上的用户名
- `tag`：镜像标签，版本号，没指定，默认是`latest`

## 案例

为了更好的熟悉常用命令，以下以拉取Nginx镜像为例，创建并运行Nginx容器

先去Docker Hub上查看nginx镜像仓库及相关信息

```bash
docker pull nginx
```

拉取完成后，查看镜像

```bash
docker images
```

创建并运行Nginx容器

```bash
docker run -d --name nginx -p 80:80 nginx
```

查看运行中的容器

```bash
docker ps
```

停止容器

```bash
docker stop nginx
```

启动Nginx容器

```bash
docker start nginx
```

查看容器详细信息

```bash
docker inspect nginx
```

进入容器，查看容器内目录

```bash
docker exec -it nginx bash
```

删除容器

```bash
docker rm nginx
```

如果容器在运行中，可以强制删除容器

```bash
docker rm -f nginx
```

## 挂载

### 数据卷

数据卷（volume）是一个虚拟目录，是容器内目录与宿主机目录之间映射的桥梁

#### 案例

以Nginx为例，Nginx有两个关键的目录：

- `html`：防止一些静态资源
- `conf`：防止配置文件

在创建容器时挂载数据卷

```bash
docker run -d --name nginx -p 80:80 -v html:/usr/share/nginx/html nginx
```

然后查看数据卷

```java
docker volumes ls
# 结果
DRIVER    VOLUME NAME
local     html
```

接着查看数据卷详情

```bash
docker volume inspect html
# 结果
[
    {
        "CreatedAt": "2026-10-17T18:17:48+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/html/_data",
        "Name": "html",
        "Options": null,
        "Scope": "local"
    }
]

ll /var/lib/docker/volumes/html/_data
# 可以看到与nginx的html目录内容一样，结果如下：
总用量 8
-rw-r--r--. 1 root root 497 12月 28 2021 50x.html
-rw-r--r--. 1 root root 615 12月 28 2021 index.html
```

这时候修改`_data`目录下的文件，会同步到容器内的文件

```bash
cd /var/lib/docker/volumes/html/_data
vi index.html
```

打开本地`80`端口，查看变化

`/var/lib/docker/volumes`这个目录（`Linux`）时默认存放所有容器数据卷的目录，其下再根据数据卷名称创建新目录，

格式为`数据卷名/_data`

#### 耦合

- 为什么不让容器目录直接指向宿主机目录呢，因为直接指向宿主机目录就与宿主机强耦合了，如果切换了环境，宿主机目录可能会发生改变。由于容器一旦创建，目录挂载无法修改了，这样容器没办法正常工作

- 但是指向数据卷，如果宿主机目录发生改变，只要改变数据卷与宿主机目录之间的映射关系即可

#### 命令

| 命令                    | 说明                 |
| ----------------------- | -------------------- |
| `docker volume create`  | 创建数据卷           |
| `docker volume ls`      | 查看所有数据卷       |
| `docker volume rm`      | 删除指定数据卷       |
| `docker volume inspect` | 查看某个数据卷的详情 |
| `docker volume prune`   | 清除数据卷           |

> 对于创建好的容器是不能设置数据卷的，所以要在创建容器时配置

创建容器的时候，数据卷会自动创建

### 本地目录

挂载本地目录也是`-v`

```bash
# 挂载本地目录
-v 本地目录:容器内目录
# 挂载本地文件
-v 本地文件:容器内文件
```

本地目录或文件必须以`/`或`./`开头，如果直接以名字开头，会被识别为数据卷名

```bash
-v mysql:/var/lib/mysql # 会被识别为一个数据卷叫mysql，运行时会自动创建这个数据卷
-v ./mysql:/var/lib/mysql # 会被识别为当前目录下的mysql目录，运行时如果不存在会创建目录
```

## Dockerfile

举个例子，从0部署一个Java应用，大概流程：

- 准备一个Linux服务
- 安装并配置JDK
- 上传Jar包
- 运行Jar包

因此，打包镜像也是分这么几步：

- 准备Linux运行环境
- 安装并配置JDK
- 拷贝Jar包
- 配置启动脚本

而这种记录镜像结构的文件就称为`Dockerfile`

比较常用的语法

| 指令       | 说明                                   |
| ---------- | -------------------------------------- |
| FROM       | 指定基础镜像                           |
| ENV        | 设置环境变量                           |
| COPY       | 拷贝本地文件到镜像的指定目录           |
| RUN        | 指向Linux的shell命令                   |
| EXPOSE     | 指定容器运行时监听的端口，给使用者看的 |
| ENTRYPOINT | 镜像中应用的启动命令，容器运行时调用   |

下面以`Spring Boot`项目来举例（基于`Unbuntu`）

```dockerfile
# 基础镜像
FROM eclipse-temurin:17-jre-jammy
# 设定时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
# 拷贝 jar 包
COPY docker-demo.jar /app.jar
# 暴露端口
EXPOSE 8080
# 入口
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

把jar包和Dockerfile文件上传到Linux，这里假设在`/root/demo`

```bash
# 进入镜像目录
cd /root/demo
# 开始构建
docker build -t docker-demo:1.0 .
```

- `docker build`：构建镜像命令
- `-t`：指定镜像的名称（`repository`和`tag`）
- `.`：指构建时`Dockerfile`所在的路径，这里因为我们进入到了`demo`目录，所以是`.`，当然也可以直接指定目录`/root/demo`

## 网络

| 命令                        | 说明                     |
| --------------------------- | ------------------------ |
| `docker network create`     | 创建一个网络             |
| `docker network ls`         | 查看所有网络             |
| `docker network rm`         | 删除指定网络             |
| `docker network prune`      | 清除未使用网络           |
| `docker network connect`    | 使指定容器连接加入某网络 |
| `docker network disconnect` | 使指定容器连接离开某网络 |
| `docker network inspect`    | 查看网络详细信息         |

- 在自定义网络中，可以给容器起多个别名，默认别名是容器本身
- 在同一个自定义网络中的容器，可以通过别名互相访问

## Docker Compose

对于复杂的项目，会有各种各样的中间件，需要部署的东西很多，一个一个部署太麻烦了

我们可以通过一个`docker-compose.yml`文件来定义一组相关联的应用容器，以`SpringBoot+Redis+MySQL`为例

```yml [docker-compose.yml]
name: app

services:
  # ------------------------- MySQL -------------------------
  mysql:
    image: ${MYSQL_IMAGE:-mysql:latest}
    container_name: mysql
    restart: unless-stopped
    environment:
      # 容器首次启动时用这三个变量初始化：root 密码 + 自动建库
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      TZ: Asia/Shanghai
    command:
      # 字符集必须 utf8mb4，否则 emoji / 部分中文会乱码
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --default-time-zone=+08:00
    ports:
      # 只绑到本机回环：外部无法直连数据库，避免公网扫描爆破
      # 应用是通过容器网络 mysql:3306 访问的，不依赖这个映射
      # 需要远程连库时临时改成 "3307:3306"，用完改回来
      - '127.0.0.1:${MYSQL_HOST_PORT:-3307}:3306'
    volumes:
      - mysql-data:/var/lib/mysql
      # 建表 + 演示数据：仅在数据目录为空（首次启动）时自动执行
      - ./mysql/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      # $$ 是 compose 的转义，实际传给容器的变量是 $MYSQL_ROOT_PASSWORD
      test:
        [
          'CMD-SHELL',
          'mysqladmin ping -h 127.0.0.1 -uroot -p$$MYSQL_ROOT_PASSWORD --silent',
        ]
      interval: 10s
      timeout: 5s
      retries: 12
      start_period: 40s
    networks:
      - backend

  # ------------------------- Redis -------------------------
  redis:
    image: ${REDIS_IMAGE:-redis:latest}
    container_name: redis
    restart: unless-stopped
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      TZ: Asia/Shanghai
    # 必须开 requirepass：application 里配了密码，无密码的 Redis 连不上
    # 开 appendonly：登录态需要落盘，重启后 token 不丢
    command:
      [
        'redis-server',
        '--requirepass',
        '${REDIS_PASSWORD}',
        '--appendonly',
        'yes',
      ]
    ports:
      # 同样只绑回环，Redis 暴露到公网是高危项（无 TLS + 弱密码）
      - '127.0.0.1:${REDIS_HOST_PORT:-6380}:6379'
    volumes:
      - redis-data:/data
    healthcheck:
      test:
        [
          'CMD-SHELL',
          'redis-cli --no-auth-warning -a "$$REDIS_PASSWORD" ping | grep -q PONG',
        ]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 10s
    networks:
      - backend

  # ---------------------- Spring Boot ----------------------
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: app:latest
    container_name: app
    restart: unless-stopped
    depends_on:
      # 等健康检查通过再启动，否则应用会比数据库先起来直接连不上
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      TZ: Asia/Shanghai
      # 关键：切到 prod profile，连接信息全部走下面的环境变量
      SPRING_PROFILES_ACTIVE: prod
      # 注意 host 写服务名（mysql / redis），不是 localhost —— 容器之间靠 Docker 网络 DNS 互通
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: ${MYSQL_DATABASE}
      DB_USERNAME: root
      DB_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      REDIS_DATABASE: 0
      # prod profile 里没有 tencent.cos 配置，但 CosConfig 是 @Configuration 会实例化；
      # 环境变量名规则：tencent.cos.access-key → TENCENT_COS_ACCESSKEY（去掉横线）
      TENCENT_COS_ACCESSKEY: ${TENCENT_COS_ACCESSKEY:-}
      TENCENT_COS_SECRETKEY: ${TENCENT_COS_SECRETKEY:-}
      TENCENT_COS_REGION: ${TENCENT_COS_REGION:-ap-shanghai}
      TENCENT_COS_BUCKETNAME: ${TENCENT_COS_BUCKETNAME:-}
    ports:
      - '${APP_HOST_PORT:-8080}:8080'
    healthcheck:
      # 项目没引 actuator，这里用一个免登录接口探活
      test:
        [
          'CMD-SHELL',
          'curl -fsS http://127.0.0.1:8080/auth/publicKey >/dev/null || exit 1',
        ]
      interval: 15s
      timeout: 5s
      retries: 10
      start_period: 60s
    stop_grace_period: 30s
    networks:
      - backend

volumes:
  mysql-data:
  redis-data:

networks:
  backend:
    driver: bridge
```

### ENV

在`docker-compose.yml`里使用环境变量文件，主要由两种方式，作用范围不同：`env_file`指令用于为**容器内的应用**提供变量，而`--env-file`参数用于为**Compose文件本身**进行变量插值

#### env_file

```yml
services:
  app:
    image: my-app:latest
    env_file:
      - ./app.env # 使用相对路径
      - ./secrets.env # 可以指定多个文件
```

- 路径解析：相对路径是相对于**Compose文件**所在的目录来解析的，不是执行命令的命令
- 优先级：`environment:`的同名变量会覆盖`env_file`中的值
- 文件格式：文件内容为标准的 `KEY=VALUE` 格式，每行一个变量，以 `#` 开头的行为注释。

#### --env-file

这种方式为`docker-compose.yml`**文件本身**提供变量值，以支持配置文件中的`${VARIABLE}`插值

1. 通过命令行临时指定

   ```bash
   docker compose --env-file ./config/prod.env up -d
   ```

2. 通过`COMPOSE_ENV_FILES`环境变量指定
   如果你不想每次都输入参数，可以设置这个环境变量，Compose会自动读取

   ```bash
   export COMPOSE_ENV_FILES=./config/prod.env
   ```

   > 如果**不指定任何文件**，Compose默认尝试加载当前目录下的`.env`文件

#### 优先级

当同一个变量在多个地方被定义时，Docker Compose 会按以下**从高到低**的顺序决定最终值：

1. 命令行`-e`：`docker compose run -e`临时设置的值
2. Shell环境变量：你在当前终端导出的变量
3. `environment`属性：文件中的`environment:`段
4. `env_file`属性：`env_file`指定的文件

### 命令

`docker compose up`

创建并启动所有服务。`-d`后台运行，`--build`启动前重新构建镜像

`docker compose down`

停止并删除容器、网络。加`-v`同时删除数据卷

`docker compose start`

启动已经存在的服务容器（不创建新的容器）

`docker compose stop`

停止服务容器，但不删除

`docker compose restart`

重启服务

`docker compose ps`

列出项目中各服务的容器状态

`docker compose logs`

查看服务日志。加`-f`实时跟踪，`-t`显示时间戳

## 后续部署

### 后端

对于后端项目：

本地打包，生成jar包

```bash
mvn clean package -DskipTests
```

重新构建

```bash
docker compose up -d --build app
```

- 根据`Dockerfile`重新构建`app:latest`镜像
- 停掉旧的`app`容器
- 用新镜像创建并启动新的`app`容器
- 其他服务（mysql、redis、nginx）保持不动

看日志是否启动成功

```bash
docker compose logs -f app
```

### 前端

只要打包`pnpm build`后，把`dist`目录上传即可（覆盖原文件）

## MySQL

### 挂载

| 容器内路径                       | 目的       |
| -------------------------------- | ---------- |
| `/var/lib/mysql`                 | 数据持久化 |
| `/etc/mysql/conf.d`              | 自定义配置 |
| `/docker-entrypoint-initdb.d:ro` | 初始化脚本 |

```bash
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -v mysql_data:/var/lib/mysql mysql:latest
```

## Redis

```bash
docker run -d --name redis -p 6379:6379 redis --requirepass 123456
```
