# Singleton Pattern

保证一个类只有一个实例，并且提供一个全局访问点

## Why use Singleton Pattern

在程序开发中，有些对象只需要一个，多了反而会出现乱子或浪费资源

- 节省内存： 比如数据库连接池、缓存对象，频繁创建和销毁非常消耗性能
- 避免冲突： 比如网页中的“登录弹窗”。如果用户点击多了。界面就会乱套。单例可以保证全局只存在一个弹窗实例。
- 数据共享：全局的状态管理(如状态管理库 Redux、Vuex 等)，需要一个统一的地方来存放数据

## Code

```javascript [Singleton.js]
const Singleton = (function () {
  let instance

  return function (name) {
    if (instance) return instance
    this.name = name
    return (instance = this)
  }
})()

const a = new Singleton('First')
const b = new Singleton('Second')
console.log(a.name) // First
console.log(a === b) // true
console.log(b.name) // First
```

## Conclusion

缺点：

- 隐藏依赖：代码之间耦合度变高，很难看清数据是从哪来
- 扩展困难： 单例类职责过重，违背了单一职责原理
- 测试不便：在单元测试中，单例的状态可能会干扰后续测试

优点：

- 节省资源
- 全局同步
