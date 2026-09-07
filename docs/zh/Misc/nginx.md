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

## 常用命令

`Linux`下：

- `nginx -t`：检查配置文件有没有语法错误
- `nginx -s reload`：热加载配置文件，不用重启容器
- `nginx -s stop`：停止 Nginx，等所有请求完成后再退出
- `nginx`：启动 Nginx

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

## nginx.conf

### 整体结构

配置文件是层层嵌套的块状结构，从外到内：**全局 → events → http → server → location**，指令从外层继承到内层，内层可以覆盖外层

```
# 全局层：影响整个进程
worker_processes auto;                    # 工作进程数，auto 表示跟随 CPU 核数
error_log /var/log/nginx/error.log warn;  # 错误日志及级别

events {                                  # 连接层
    worker_connections 1024;              # 单个工作进程的最大并发连接数
}

http {                                    # 所有 HTTP 相关配置都在这里
    include      /etc/nginx/mime.types;   # MIME 映射，缺了它静态文件会按纯文本返回
    default_type application/octet-stream;

    sendfile          on;                 # 零拷贝发送文件，提升静态资源性能
    keepalive_timeout 65;                 # 长连接保持时间（秒）

    server {                              # 一个 server 对应一个站点 / 域名
        listen      80;
        server_name example.com;

        location / {                      # 按请求路径匹配，决定请求怎么处理
            root  /usr/share/nginx/html;
            index index.html;
        }
    }
}
```

继承规则：指令写在 `http` 里对所有站点生效，写在某个 `server` 里只对该站点生效，写在 `location` 里只对该路径生效。比如前面的 `underscores_in_headers on` 写在 `http` 里就是全局开启

配置多了可以用 `include` 拆分，官方镜像的默认配置就有 `include /etc/nginx/conf.d/*.conf;`，即把每个站点单独写成一个 conf 文件放进 `conf.d` 目录

### location 匹配优先级

匹配顺序有优先级，从高到低：

```
location = /user {}          # 精确匹配，命中后直接停止，优先级最高
location ^~ /static/ {}      # 前缀匹配，命中后不再尝试正则
location ~ \.(png|js)$ {}    # 正则，区分大小写
location ~* \.(png|js)$ {}   # 正则，不区分大小写
location /api/ {}            # 普通前缀，选匹配最长的那个
location / {}                # 兜底
```

匹配过程：先看 `=` 精确匹配 → 再找最长前缀，若它是 `^~` 则直接采用 → 否则按配置中的书写顺序尝试正则，命中第一个就采用 → 正则都没命中就退回最长的普通前缀。日常用 `/api/` 这类普通前缀就够了

### 常用配置

#### try_files

按顺序查找，返回第一个存在的结果，常用于 SPA 回退（见上文「部署前端项目」）

```
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}
```

- `$uri`：按路径找文件，请求 `/logo.png` 就找 `<root>/logo.png`
- `$uri/`：按目录找，配合 `index` 返回目录默认页
- 最后一个参数是前面都没找到时的兜底，会发起内部重定向，重新走一遍 location 匹配

#### gzip 压缩

```
http {
    gzip on;
    gzip_min_length 1k;                 # 小于 1k 不压缩，压了可能反而变大
    gzip_comp_level 5;                  # 压缩比 1~9，越高压得越小但越费 CPU
    gzip_types text/plain text/css application/json
               application/javascript image/svg+xml;  # jpg/png 本身已压缩，不用加
    gzip_vary on;                       # 响应头带上 Vary: Accept-Encoding
}
```

对 JS/CSS/JSON 这类文本资源效果最明显，通常能减小 70% 以上

#### 静态资源缓存

配合构建工具的文件名 hash（内容变了文件名才变），可以放心做长缓存：

```
server {
    # 带 hash 的 js/css/图片，长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # index.html 不能强缓存，否则发版后用户拿不到新版本
    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

#### 上传大小限制

```
http {
    client_max_body_size 10m;   # 默认只有 1m，超了会返回 413
}
```

#### 自定义错误页

```
server {
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

SPA 项目的 404 一般已经被 `try_files` 回退到 `index.html`，就不需要 `error_page 404` 了

#### HTTPS

```
# HTTP 自动跳转 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        root  /usr/share/nginx/html;
        index index.html;
    }
}
```

Docker 部署时还要挂载证书目录：`-v ./certs:/etc/nginx/certs`

#### 负载均衡

```
http {
    upstream backend {
        server 10.0.0.1:8080 weight=3;   # 加权轮询
        server 10.0.0.2:8080;
        server 10.0.0.3:8080 backup;     # 备机，其他都挂了才用它
    }

    server {
        location /api/ {
            proxy_pass http://backend/;
        }
    }
}
```

常见策略：默认轮询；`ip_hash;` 让同一客户端固定打到同一台；`least_conn;` 发给连接数最少的机器

#### WebSocket 代理

```
location /ws/ {
    proxy_pass http://host.docker.internal:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;      # 协议升级
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;                    # 防止长时间空闲被断开
}
```

#### 日志

```
http {
    log_format main '$remote_addr [$time_local] "$request" $status "$http_user_agent"';
    access_log /var/log/nginx/access.log main;
}
```

官方镜像已把日志软链到标准输出，容器里直接 `docker logs nginx` 就能看

### 常用内置变量

| 变量           | 含义                                 |
| -------------- | ------------------------------------ |
| `$host`        | 请求的域名（不带端口）               |
| `$request_uri` | 完整的原始请求路径（含 query）       |
| `$uri`         | 当前请求路径（重写后会变）           |
| `$remote_addr` | 客户端 IP                            |
| `$http_xxx`    | 请求头 `xxx` 的值，如 `$http_origin` |
