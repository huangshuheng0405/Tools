# notes

## 入口配置

- 单入口
- 多入口
- 对象形式

## 输出配置

- 输出位置：path
- 输出文件名：filename
- 输出chunk： chunkFileName
- 清除clean
- 环境配置：environment：arrowFunction、asyncFunction

为了浏览器每次应用发布后，第一次不走缓存，会将文件打包时，输出文件名加hash

## 模块解析

针对不同类型的文件，需要转换处理

- js -> babel-loader
- ts -> ts-loader
- image -> raw-loader url-loader
- font -> raw-loader
- css -> css-loader style-loader
- scss -> sass-loader
- less -> less-loader
- file -> raw-loader

浏览器原生支持ES Modules，所以vite打包更快

## 辅助解析 （resolve）

- extensions：导入模块时，可以省略文件后缀

## 自定义 loader

loader本质上是一个函数，它的作用是将模块的原始内容转换为新的内容。

## 自定义 plugin

plugin本质上是一个类，它的作用是在webpack打包的生命周期中，插入自定义的逻辑。
