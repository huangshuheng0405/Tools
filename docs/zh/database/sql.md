# SQL

## 1. SQL 简介

- SQL（Structured Query Language）结构化查询语言，用于操作关系型数据库
- 分类：
  - **DDL**（Data Definition Language）数据定义语言：建库建表、改表结构
  - **DML**（Data Manipulation Language）数据操作语言：增删改数据
  - **DQL**（Data Query Language）数据查询语言：查询数据
  - **DCL**（Data Control Language）数据控制语言：权限管理

## 2. DDL 数据定义

### 2.1 数据库操作

- `CREATE DATABASE` / `DROP DATABASE` / `USE`

### 2.2 表操作

- `CREATE TABLE` / `DROP TABLE` / `ALTER TABLE`（添加/删除/修改列）

### 2.3 数据类型

- 数值型：`INT`、`DECIMAL`、`FLOAT`
- 字符串：`VARCHAR`、`TEXT`、`CHAR`
- 日期：`DATE`、`DATETIME`、`TIMESTAMP`
- 布尔：`BOOLEAN`

### 2.4 约束

- `PRIMARY KEY` 主键：唯一且非空，一张表只能有一个
- `FOREIGN KEY` 外键：关联其他表
- `UNIQUE` 唯一
- `NOT NULL` 非空
- `DEFAULT` 默认值
- `CHECK` 检查约束
- `AUTO_INCREMENT` 自增

## 3. DML 数据操作

- `INSERT INTO`：插入数据（单条 / 多条）
- `UPDATE ... SET`：更新数据，注意加 `WHERE`
- `DELETE FROM`：删除数据，注意加 `WHERE`
- `TRUNCATE` 与 `DELETE` 的区别

## 4. DQL 数据查询（重点）

### 4.1 基础查询

- `SELECT` 查询指定列、`DISTINCT` 去重、`AS` 别名

### 4.2 条件过滤 WHERE

- 比较运算符：`= > < >= <= !=`
- `AND` / `OR` / `NOT`、`IN`、`BETWEEN`、`LIKE`（模糊查询）、`IS NULL`

### 4.3 排序与分页

- `ORDER BY ... ASC/DESC`，多字段排序
- `LIMIT offset, count` 分页

### 4.4 聚合函数

- `COUNT` / `SUM` / `AVG` / `MAX` / `MIN`
- `COUNT(*)` 与 `COUNT(column)` 区别

### 4.5 分组 GROUP BY

- `GROUP BY` 分组
- `HAVING` 对分组结果过滤，与 `WHERE` 的区别

### 4.6 连接 JOIN

- `INNER JOIN` 内连接：只返回匹配的行
- `LEFT JOIN` 左连接：左表全部 + 右表匹配
- `RIGHT JOIN` 右连接
- `FULL JOIN` / 笛卡尔积

### 4.7 子查询

- `WHERE` 子查询、`FROM` 子查询、`EXISTS`

### 4.8 合并

- `UNION` 去重合并、`UNION ALL` 不去重

### 4.9 常用函数

- 字符串函数：`CONCAT`、`SUBSTRING`、`LENGTH`...
- 日期函数：`NOW`、`DATE_FORMAT`...
- 条件函数：`IF`、`CASE WHEN`

## 5. 索引

- 什么是索引、为什么快、优缺点
- 普通索引 / 唯一索引 / 联合索引
- 联合索引最左前缀原则
- 什么时候建索引

## 6. 事务

- ACID：原子性、一致性、隔离性、持久性
- 隔离级别：读未提交、读已提交、可重复读、串行化
- 并发问题：脏读、不可重复读、幻读

## 7. 面试题 / 实战

- 常见面试题整理
- 待补充
