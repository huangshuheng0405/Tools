# mongoose

Mongoose 是 Node.js 中用于操作 MongoDB 数据库的 ORM（对象关系映射）库。

## Create

1. `Model.create(doc(s), [options])`

- `doc(s)`：（必填，对象或对象数组）要插入的数据。传对象就插入单条，传数组就批量插入。
- `options`：（可选，对象）插入选项，如`{ validateBeforeSave: false }`（保存前不进行Schema验证）。

notice：

- 推荐首选：它是最常用的插入方法，在批量插入数组时，必循环调用`save()`性能高得多
- 返回值：单条插入返回对应的`Document`对象，多条插入返回对应的`Document`数组。

2. `Model.prototype.save([options])`

- `options`：（可选，对象）配置项，常用于设置`session`（事务控制）。

notice:

- 必须先实例化：它不是Model的静态方法，必须先`const doc = new Model(data)`得到实例后，才能调用`doc.save()`。

## Read

查询函数的参数结果非常统一，通常为：`(conditions, [projection], [options])`

1. `Model.find(conditions, [projection], [options])`
   - `conditions`：必填，对象）查询条件（如`{ age: { $gt: 18 } }`），传空对象`{}`表示查询所有数据。
   - `projection`：（可选，对象/字符串）投影，指定返回或排除哪些字段，如`{ name: 1, age: 0 }`（只返回`name`字段）。
   - `options`：（可选，对象）查询配置项，如`{ lean: true, limit: 10, sort: { age: -1 } }`。
     notice:
   - 返回值：如果没有匹配到数据，返回空数组`[]`，而不是`null`。因此判断是否有数据要用`result.length > 0`。

2. `Model.findOne(conditions, [projection], [options])`
   - 参数：与`find()`相同。

   notice:
   - 只返回一条数据：`findOne()`只返回一条数据，即使数据库有多个匹配项，也只返回第一个匹配项。
   - 返回值：如果没有匹配到数据，返回`null`。

3. `Model.findById(id, [projection], [options])`
   - `id`：（必填，ObjectId/string）MongoDB的`_id`值。Mongoose会把字符串类型的ID自动转换为`ObjectId`类型。

   notice：
   - ID格式报错：如果传入的字符串不符合MOngoDB的ObjectId24位16进制格式（例如`findById('123')`，Mongoose会直接**抛出CastError异常**，导致程序崩溃。所以在调用前确保ID格式正确，或者使用`try...catch`包裹。

## Update

1. `Model.updateOne / updateMany(conditions, doc, [options])`
   - `conditions`：（必填，对象）查询条件，决定更新哪些数据。
   - `doc`：（必填，对象）要修改的数据。通常配合修改操作符，如`{ $set: { age: 20 } }`（更新`age`字段为20）。如果不用修改操作符，整条文档会被直接替换掉。
   - `options`：（可选，对象）更新配置项

   notice:
   - 不返回文档：这两个函数返回的是一个**操作结果对象**，（如 `{ acknowledged: true, modifiedCount: 1, matchedCount: 1 }`），**绝对不会返回被修改的文档数据**。

2. `Model.findByIdAndUpdate(id, doc, [options])`

- `id`：（必填）文档的`_id`
- `doc`：（必填）要修改的数据。
- `options`：（可选，对象）更新配置项
  notice:
- 默认返回旧数据：如果你想获取更新后的数据，必须传入`{ new: true }`。
- 默认不验证： 需要开启验证必须传入`{ validateBeforeSave: true }`。

## Delete

1. `Model.deleteOne / deleteMany(conditions, [options])`
   - `conditions`：（必填，对象）删除条件，注意：如果`deleteMany`传入空对象`{}`，会删除整个集合的数据。
     notice:
   - 返回值：返回一个结果对象，例如`{ acknowledged: true, deletedCount: 1, matchedCount: 1 }}`。可以通过`deletedCount`判断是否真正删除了数据。

2. `Model.findByIdAndDelete(id, [options])`
   - `id`：（必填，ObjectId）数据的`_id`

     notice:

   - **返回被删数据**：返回一个被删除的那条Document数据（如果数据存在），如果数据本来就不存在，返回`null`。

## 性能优化

### `lean()`

**针对查询**

Mongoose 查询返回的不是普通 JS 对象，而是包装了大量内部方法（如 `.save()`, `.populate()`）的 Mongoose Document，比较占内存。

如果你只是想查询出来展示给前端（不做二次修改和保存），一定要加上 `.lean()`。例如 `User.find().lean()`。这会直接返回纯粹的 JS POJO 对象，性能会提升数倍。
