# nginx

<svg width="200px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 600 600"><path fill="#009639" d="M40.2 450.1q4.1 7.2 11.5 11.2l233 134.4a30 30 0 0 0 30.9 0l233-134.4a31 31 0 0 0 15.5-27V165.7c0-11.2-5.8-21.5-15.5-27L315.6 4.4a30 30 0 0 0-30.9 0l-233 134.4a30 30 0 0 0-15.8 27v269q-.1 8.1 4.3 15.4"/><path fill="#fff" d="M225.4 402.6c0 16.6-13.3 30-30 30s-30-13.4-30-30V197.1c0-16 14.3-29 34-29 14.2 0 30.8 5.7 40.8 18.1l9.1 10.9 125.3 149.8V197.7c0-16.6 13.3-30 30-30s30 13.4 30 30v205.5c0 16-14.3 29-34 29a54 54 0 0 1-40.8-18.1L225.4 253.7z"/></svg>

## use docker

先拉取镜像

```bash
docker pull nginx
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

nginx默认会丢弃带下划线的请求头，如果一定要保留，需要在配置文件中添加以下内容

特别留意 proxy_pass 末尾的斜杠 /
写法一：proxy_pass http://后端地址/;（末尾带 /）
→ 请求 /api/user 会被转发为 http://后端地址/user（去掉了 /api）。

写法二：proxy_pass http://后端地址;（末尾不带 /）
→ 请求 /api/user 会被转发为 http://后端地址/api/user（保留了 /api）。

你需要根据你的后端接口是否包含 /api 前缀来决定使用哪种写法。

```
underscores_in_headers on;
```

还有一个要注意的

```
location /api {
	proxy_pass http://localhost:8080/
}
```

这样写的话会导致`/api`被替换成`/`，导致出现双斜杠，后端路由就匹配不上出现404，记得写成`/api/`

还有一种办法，就是利用重写

```
location /api {
    rewrite ^/api(/.*)$ $1 break;
    proxy_pass http://host.docker.internal:8080;
}

```

