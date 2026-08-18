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
