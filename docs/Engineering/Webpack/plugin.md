# plugin

## 自定义 plugin

创建插件`MyPlugin.js`，内容如下：

```js [MyPlugin.js]
class MyPlugin {
  apply(compiler) {
    console.log('MyPlugin 启动')
  }
}

module.exports = MyPlugin
```

配置文件`webpack.config.js`如下：

```js [webpack.config.js] {7}
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    clean: true
  },
  plugins: [new MyPlugin()]
}
```
