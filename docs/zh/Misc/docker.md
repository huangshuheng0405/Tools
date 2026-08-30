# Docker

![Docker](/Misc/docker.svg)

## Installation

Windows，直接下载Docker Desktop即可

[Docker Desktop](https://www.docker.com/)

安装后验证

```bash
docker --version
```

## Nginx

```bash
# 1. 拉取 Nginx 镜像
docker pull nginx

# 2. 运行容器，映射端口 8080 → 80
docker run -d --name my-nginx -p 8080:80 nginx

# 3. 访问 http://localhost:8080 能看到 Nginx 欢迎页

# 4. 查看日志
docker logs my-nginx

# 5. 停止并删除
docker stop my-nginx
docker rm my-nginx
```

## MySQL

前置知识

-d，后台运行（detach）

--name，容器名称，`--name mysql-container`

-p，端口映射，`-p 3306:3306`，左边是主机端口，右边是容器端口，外部连接就用`localhost:3306`即可

-e，环境变量，`-e MYSQL_ROOT_PASSWORD=123456`，设置MySQL根密码为123456

-v，

TODO leaflet 组件

## Dockerfile

`Dockerfile`用来构建镜像，下面以Spring Boot项目来举例

```dockerfile
FROM eclipse-temurin:26-jre

WORKDIR /app

COPY target/sky-server.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

- 指定java的版本环境
- 指定容器的工作目录
- 把本地打包好的`jar`包，复制到镜像下的`/app`目录下的`app.jar`中
- 指定Spring Boot的端口号
- 容器启动时，执行的命令，`java -jar app.jar`这样就启动项目了

## Docker Compose

用一个yaml文件，统一定义和启动多个Docker容器

先看存放位置

```
sky-take-out/
├── docker-compose.yml   ← Compose配置
│
├── sky-server/
│   ├── Dockerfile
│   └── target/
│       └── sky-server.jar
│
└── nginx/
    └── nginx.conf
```

下面先以Nginx举例

```yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
```

然后在`docker-compose.yml`所在的目录执行

```bash
docker compose up -d
```

docker就会找到nginx的镜像然后创建nginx的容器并启动

- `services`：定义容器
- `image`：使用的容器，冒号后面可以指定版本
- `container_name`：指定容器的名字
- `ports`：格式`宿主机端口:容器端口`
- `volumes`：数据持久化
- `environment`：环境变量
- `networks`：让不同容器执行能互相访问

服务名可以直接作为域名来使用，例如

```yaml
services:

  mysql:
    image: mysql:8.0

  sky-server:
    ...
```

Spring Boot：

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/sky_take_out
```

以完整的Spring Boot项目为例

```yaml
services:

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: sky_take_out
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  sky-server:
    build: ./sky-server
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
    depends_on:
      - mysql
      - redis

volumes:
  mysql-data:
  redis-data:
```

注意`build`，代表去`./sky-server`目录下找Dockerfile文件，然后根据Dockerfile构建对象，`image`则是直接使用官方现成的镜像

`depends_on`，代表在启动`sky-server`之前，先启动`mysql`和`redis`

执行`docker compose up -d`然后`docker compose ps`就能看到是否启动成功

后面如果java项目修改后，只要执行`docker compose up -d --build  sky-server`

就会重写构建Spring Boot镜像，其他容器不受影响

- 第一次启动`docker compose up -d --build`
- 查看容器`docker compose ps`
- 停止`docker compose down`
- 
