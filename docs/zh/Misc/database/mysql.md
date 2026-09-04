# MySQL

<img src="/Misc/mysql.svg" alt="mysql" width="180px">

- DDL：数据定义语言，用来定义数据库对象（数据库、表、字段）
- DML：数据操作语言，用来对数据库表中的数据进行增删改
- DQL：数据查询语句，用来查询数据库表的记录
- DCL：数据控制语言，用来创建数据库用户、控制数据库的控制权限

## DML

#### 添加数据

指定字段：

`INSERT INTO table (name1,name2, ...) VALUES (value1, value2, ...);`

全部字段：

`INSERT INTO table VALUES (value1, value2, ...);`

#### 更新和删除数据

修改数据：

`UPDATE table SET name1 = value1, name2 = value2, ... [ WHERE condition ];`

例：

`UPDATE emp SET name = 'Jack' where id = 1;`

删除数据：

`DELETE FROM table [ WHERE condition]`

## DQL

语法:

```
SELECT
	字段列表
FROM
	表名字段
WHERE
	条件列表
GROUP BY
	分组字段列表
HAVING
	分组后的条件列表
ORDER BY
	排序字段列表
LIMIT
	分页参数
```

### 条件查询

语法：

`SELECT name FROM table WHERE condition`

条件：

| 比较运算符       | 功能                                       |
| ---------------- | ------------------------------------------ |
| >                | 大于                                       |
| >=               | 大于等于                                   |
| <                | 小于                                       |
| <=               | 小于等于                                   |
| =                | 等于                                       |
| <>或!=           | 不等于                                     |
| BETWEEN...AND... | 在某个范围                                 |
| IN(...)          | 在in之后的列表中的值，多选一               |
| LIKE             | 模糊匹配（_匹配单个字符，%匹配任意个字符） |
| IS NULL          | 是NULL                                     |

| 逻辑运算符 | 功能 |
| ---------- | ---- |
| AND或&&    | 并且 |
| OR或\|\|   | 或者 |
| NOT或!     | 非   |

### 聚合查询（聚合函数）

常见聚合函数：

| 函数  | 功能     |
| ----- | -------- |
| count | 统计数量 |
| max   | 最大值   |
| min   | 最小值   |
| avg   | 平均值   |
| sum   | 求和     |

语法：

`select func(name) from table;`

例：

`select count(id) from employee where workaddress = "广东省";`

### 分组查询

语法：

`select name from table [where condition] group by groupname [having filtercondition]`

where和having的区别：

- 执行时机不同：where是分组之前进行过滤，不满足where条件不参与分组；having是分组后对结果进行过滤
- 判断条件不同：where不能对聚合函数进行判断，而having可以

注意事项：

- 执行顺序：where > 聚合函数 > having
- 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义

### 排序查询

语法：

`select name from table order by name1, 排序方式1, ...;`

排序方式：

- ASC：升序（默认)
- DESC：降序

### 分页查询

语法：

`select name from table limmit startIndex, records;`

例子：

```sql
-- 查询第一页数据，展示10条
SELECT * from employee LIMIT 0, 10;
-- 查询第二页
SELECT * from employee LIMIT 10, 10;
```

注意事项

- 起始索引从0开始，起始索引=（查询页码  - 1） * 每页显示记录数
- 分页查询是数据库的方言，不同数据库有不同实现

### DQL执行顺序：

from -> where -> group by -> select -> order by -> limit

### 约束

| 约束     | 描述                                                     | 关键字      |
| -------- | -------------------------------------------------------- | ----------- |
| 非空约束 | 限制该字段不能为null                                     | not null    |
| 唯一约束 | 保证该字段的所有数据都是唯一、不重复的                   | unique      |
| 主键约束 | 主键是一行数据的唯一标识，要求非空且唯一                 | primary key |
| 默认约束 | 保存数据时，如果未指定该字段的值，则采用默认值           | default     |
| 检查约束 | 保证字段值满足某一个条件                                 | check       |
| 外键约束 | 用来让两张图的数据之间建立连接，保证数据的一致性和完整性 | foreign key |

#### 常用约束

| 约束条件 | 关键字         |
| -------- | -------------- |
| 主键     | PRIMARY KEY    |
| 自动增长 | AUTO_INCREMENT |
| 不为空   | NOT NULL       |
| 唯一     | UNIQUE         |
| 逻辑条件 | CHECK          |
| 默认值   | DEFAULT        |

外键约束

添加外键：

```sql
CREATE TABLE 表名(
	字段名 字段类型,
	...
	[CONSTRAINT] [外键名称] FOREIGN KEY(外键字段名) REFERENCES 主表(主表列名)
);

ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名) REFERENCES 主表(主表列名);

-- 例子
alter table emp add constraint fk_emp_dept_id foreign key(dept_id) references dept(id);
```

删除外键：

`alert table 表名 drop foreign key 外键名;`

### 多表查询

多表关系

一对多

案例：部门与员工

关系：一个部门对应多个员工，一个员工对应一个部门

实现：在多的一方建立外键，指向一的一方的主键

多对多

案例：学生与课程

关系：一个学生可以选多门课程，一门课程也可以供多个学生

实现：建立第三张中间表，至少包含两个外键，分别关联两方主键

一对一

案例：用户与用户详情
关系：一对一关系，多用于单表拆分，将一张表的基础字段放在一张表中，其他详情字段放在另一张表中，以提升操作效率
实现：在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的（UNIQUE）

#### 内连接查询

内连接查询的是两张表交集的部分

隐式内连接：

`select name from table1, table2 where condition ...;`

显式内连接：

`select name from table1 [inner] join table2 on joincondition ,,,;`

> 显式性能比隐式高

例子：

```sql
-- 查询员工姓名，及关联的部门的名称
-- 隐式
select e.name, d.name from employee as e, dept as d where e.dept_id = d.id;
-- 显式
select e.name, d.name from employee as e inner join dept as d on e.dept_id = d.id;
```

#### 外连接查询

左外连接：

查询左表的所有数据，以及两张表交集部分数据

`select name from table1 left [out] join table2 on condition ...;`

相当与查询表1的所有数据，包含表1和表2交集部分数据

右外连接：

查询右表的数据

例子

### 事务

事务是一组操作的集合，事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求，即这些操作要么同时成功，要么同时失败

```sql
start transaction;
select * from account where name = '张三';
update account set money = money - 1000 where name = '张三';
update account set money = money + 1000 where name = '李四';
commit;
```

#### 四大特性

- 原子性（Atomicity）：事务时不可分割的最小操作单元，要么全部成，要么全部失败
- 一致性（Consistency）：事务完成时，必须使所有数据都保持一致状态
- 隔离性（Isolation）：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行
- 持久性（Durability）：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的
