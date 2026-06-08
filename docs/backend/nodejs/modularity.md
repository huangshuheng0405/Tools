# modularity

## `CommonJS`的导出

不能使用`exports = value`的形式暴露数据

```js
// exports = '123' // x
```

因为`exports = module.exports = {}`，且`require`返回的是`module.exports`，所以上面这样没有改变`module.exports`的内容

而`exports.xxx = value`可以暴露数据

```js
exports.xxx = '123'
```

这是因为在对象上添加属性

## 导入文件夹

当你导入一个文件夹时，Node.js会先查找`package.json`文件中的`main`字段（`main`通常指向`CommonJS`入口）

对于ES模块，可以使用`exports`，如果没有`main`字段，会尝试导入`index.js`文件
