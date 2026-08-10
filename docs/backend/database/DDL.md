# DDL

```sql
-- 查询所有的数据库
show databases;

-- 查询当前数据库
select database();

-- 切换到指定数据库
use database_name;

-- 创建数据库
create database [if not exists] database_name [default charset utf8mb4];

-- 删除数据库
drop database [if exists] database_name;
```
