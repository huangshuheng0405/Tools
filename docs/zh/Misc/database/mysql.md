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

#### 条件查询

