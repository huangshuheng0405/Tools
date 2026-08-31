# nginx

<svg width="200px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#009639" d="M40.2 450.1q4.1 7.2 11.5 11.2l233 134.4a30 30 0 0 0 30.9 0l233-134.4a31 31 0 0 0 15.5-27V165.7c0-11.2-5.8-21.5-15.5-27L315.6 4.4a30 30 0 0 0-30.9 0l-233 134.4a30 30 0 0 0-15.8 27v269q-.1 8.1 4.3 15.4"/><path fill="#fff" d="M225.4 402.6c0 16.6-13.3 30-30 30s-30-13.4-30-30V197.1c0-16 14.3-29 34-29 14.2 0 30.8 5.7 40.8 18.1l9.1 10.9 125.3 149.8V197.7c0-16.6 13.3-30 30-30s30 13.4 30 30v205.5c0 16-14.3 29-34 29a54 54 0 0 1-40.8-18.1L225.4 253.7z"/></svg>

Nginx 是高性能的 HTTP 服务器，常用作**静态资源托管**、**反向代理**和**负载均衡**。

## 用 Docker 安装

先拉取镜像

```bash
docker pull nginx
```

创建目录

```
nginx/
├── conf/
│   └── nginx.conf
└── html/
```

先在 `conf/nginx.conf` 写一份最小配置，文件不存在的话挂载会把它创建成目录，导致容器启动失败

```
events {}

http {
    include /etc/nginx/mime.types;

    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
    }
}
```

创建容器，挂载配置文件

```bash
docker run -d \
  --name nginx \
  -p 80:80 \
  -v ./nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
  -v ./nginx/html:/usr/share/nginx/html \
  nginx:latest
```

`docker run -d` 已经把容器启动起来了，不需要再执行 `docker start`

常用操作

```bash
docker ps -a                       # 查看容器状态
docker exec nginx nginx -t         # 检查配置文件语法
docker exec nginx nginx -s reload  # 改完配置热加载，不用重启容器
```

## 配置文件结构

```
http {
    server {                # 一个 server 对应一个站点 / 域名
        listen 80;
        server_name xxx.com;
        location / {        # 匹配请求路径
            ...
        }
    }
}
```

## 部署前端项目（SPA）

Vue / React 这类单页应用用 history 路由时，刷新 `/xxx` 会 404，需要用 `try_files` 把所有路径回退到 `index.html`

```
location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

## 反向代理

把 `/api` 开头的请求转发给后端

```
location /api/ {
    proxy_pass http://host.docker.internal:8080/;
}
```

### 结尾斜杠：双斜杠导致 404

`proxy_pass` 带了 URI（哪怕只是一个 `/`）时，Nginx 会把 location 匹配到的前缀**替换**成 `proxy_pass` 的 URI；不带 URI 则原样转发完整路径

```
# ❌ location 没写结尾 /，请求 /api/user 会被拼成 //user，后端匹配不上返回 404
location /api {
    proxy_pass http://host.docker.internal:8080/;
}

# ✅ location 补上结尾 /
location /api/ {
    proxy_pass http://host.docker.internal:8080/;
}
```

也可以不改 location，用 `rewrite` 重写路径

```
location /api {
    rewrite ^/api(/.*)$ $1 break;
    proxy_pass http://host.docker.internal:8080;
}
```

### 容器里访问宿主机要用 host.docker.internal

Nginx 跑在 Docker 里，容器内的 `localhost` 指的是**容器自己**，访问不到宿主机上的后端，要用 `host.docker.internal`

```
# ❌ 容器内 localhost 到不了宿主机后端
proxy_pass http://localhost:8080;

# ✅
proxy_pass http://host.docker.internal:8080;
```

> 如果是 Linux 宿主机，`host.docker.internal` 默认不可用，启动容器时加 `--add-host=host.docker.internal:host-gateway`

### 转发真实客户端信息

反向代理默认会丢失客户端信息，后端拿不到真实 IP，用 `proxy_set_header` 补上

```
location /api/ {
    proxy_pass http://host.docker.internal:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 下划线请求头被丢弃

Nginx 默认会丢弃带下划线的请求头（比如自定义的 `my_token`），要保留需要在 `http` 或 `server` 块里开启

```
http {
    underscores_in_headers on;
}
```
