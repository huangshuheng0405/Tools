# MongoDB

`MongoDB`是关系型（如`MySQL`）完全不同。非关系型数据库每一行的结构可以不同。

对比`MySQL`：

- `MySQL`的`Database`(数据库) -> `MongoDB`的`Database`(数据库)
- `MySQL`的`Table`(表) -> `MongoDB`的`Collection`(集合)
- `MySQL`的`Row`(行记录) -> `MongoDB`的`Document`(文档)
- `MySQL`的`Column`(列字段) -> `MongoDB`的`Field`(字段)

## 特点

Document（文档）
使用的是JSON的BSON（Binary JSON）格式。支持更多数据类型，如`Date`、`ObjectId`等。

无模式

同一个集合里的文档，结构可以完全不一样（字段可以多可以少）

## CRUD

查看所有数据库：`show dbs`
切换/创建数据库：`use <db_name>`（数据库不存在会自动创建）
查看当前数据库下的集合：`show collections`

### Create

- 插入单条：`db.collection.insertOne({ name: 'zhangsan', age: 18})`
- 插入多条：`db.collection.insertMany({ ... }, { ... })`

> 每条数据会自动生成一个唯一的`_id`（ObjectId）

### Read

- 查询所有：`db.collection.find()`
- 格式化显示：`db.collection.find().pretty()`
- 条件查询：`db.collection.find({ name: 'zhangsan' })`
- 操作符：
  - `$gt`：大于
  - `$lt`：小于
  - `$gte`：大于等于
  - `$lte`：小于等于
  - `$ne`：不等于
  - `$or`：或
  - `$and`：且

### Update

- 更新单条：`db.collection.updateOne({筛选条件}, {修改器})`
- 更新多条：`db.collection.updateMany(...)`
- 修改器：
  - `$set`：只修改指定字段，如果不加`$set`，整条文档会被直接替换掉
  - `$inc`：对数字字段进行自增
  - `$push`：推入
  - `$pull`：拉出
  - `$unset`：删除
  - `$rename`：重命名

### Delete

- 删除单条：`db.collection.deleteOne({ name: 'zhangsan' })`
- 删除多条：`db.collection.deleteMany({ age: {$lt: 18} })`
