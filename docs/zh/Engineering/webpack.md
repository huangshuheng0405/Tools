# Webpack

## 打包流程

1. **初始化阶段（Initialization）**

当运行`webpack`命令，它会先读取配置文件`webpack.config.js`，并于内部默认配置合并。接着，会实例化一个对象Compiler

2. **构建依赖图谱**

- **寻找入口**：webpack从你指定的`entry`文件开始
- **递归解析**：它会读取入口文件的内容，找出所有的`import`和`require`语句
- **构建模块图**：webpack会根据这些引用关系，递归的寻找所有依赖，直到所有文件被找齐，形成一张**巨大的依赖图**

3. **编译转换**
在这个过程中，webpack并不会直接读源码，而是把文件交给**Loader**处理
- **AST解析**：Webpack会将JS代码转换成**抽象语法树（AST）**，从而理解内部代码的逻辑
- **Loader介入**：每当遇到非JS文件（如CSS，TS、图片），webpack会调用配置好的loader，例如label-loader会把AST里的ES6语法降级为ES5
- **转换结果**：所有的模块都会转换成webpack能识别的js模块

4. **优化与封存**
- **代码分割**：根据你的配置，把模块组合成不同的**Chunks**
- **代干预**：各种plugin开始发力，比如代码压缩、混淆变量、删除注释，或者通过tree shaking剔除代码

5. **输出资源**
会根据chunk生成最终的资源文件（通常是`dist`目录下的`.js`\`.css`\`.map`等文件）
- **确定文件名**：根据配置生成带有hash值的文件名（用于缓存控制）
- **写入文件系统**：把内存中的打包结果写入硬盘

## 配置笔记

### 入口配置

- 单入口
- 多入口
- 对象形式

### 输出配置

- 输出位置：path
- 输出文件名：filename
- 输出chunk： chunkFileName
- 清除clean
- 环境配置：environment：arrowFunction、asyncFunction

为了浏览器每次应用发布后，第一次不走缓存，会将文件打包时，输出文件名加hash

### 模块解析

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

### 辅助解析 （resolve）

- extensions：导入模块时，可以省略文件后缀

### 自定义 loader

loader本质上是一个函数，它的作用是将模块的原始内容转换为新的内容。

### 自定义 plugin

plugin本质上是一个类，它的作用是在webpack打包的生命周期中，插入自定义的逻辑。

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
