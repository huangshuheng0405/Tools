# loader

## 自定义 loader

创建`hideHeyi.js`文件，内容如下：

```js [hideHeyi.js]
module.exports = function (content) {
  return content.replace(/heyimeng/gi, '****')
}
```

配置文件`webpack.config.js`如下：

```js [webpack.config.js]
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['./loaders/hideHeyi.js']
      }
    ]
  }
}
```

> `webpack`的`use`里不能直接放函数或模块对象
