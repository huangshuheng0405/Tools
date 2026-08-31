# MySQL

<img src="/Misc/mysql.svg" alt="mysql" width="180px">

## with Docker

先拉取镜像

```bash
docker pull mysql
```

用命令启动

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=sky_take_out \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

一定要挂载数据卷，也就是这一段`-v mysql_data:/var/lib/mysql`

mysql_data 是一个本地目录，用于存储 MySQL 数据文件，即使你重新创建容器
