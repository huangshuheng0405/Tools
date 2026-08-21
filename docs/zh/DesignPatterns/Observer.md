# Observer Pattern

## Code

```js [Observer Pattern.js]
// 被观察者
class Subject {
  constructor() {
    this.observers = []
  }

  /**
   * 添加观察者
   * @param observer 观察者
   */
  add(observer) {
    this.observers.push(observer)
  }

  /**
   * 通知所有观察者
   * @param message 观察者名字
   */
  notify(message) {
    this.observers.forEach((observer) => observer.update(message))
  }
}

// 观察者
class Observer {
  constructor(name) {
    this.name = name
  }

  /**
   * 收到通知后的反应
   * @param message 通知的消息
   */
  update(message) {
    console.log(`${this.name} received ${message}`)
  }
}

const boss = new Subject()
const worker1 = new Observer('xiaozhang')
const worker2 = new Observer('xiaowang')

boss.add(worker1)
boss.add(worker2)

boss.notify('可以下班了')
```

## notice

- **观察者模式**：”直接认识“。Subject内部维护者Observer的列表。就像老板直接对着办公室里的员工喊话，他们之间是有联系的
- **发布-订阅模式**：”互不认识“。发布者和订阅者之间隔着一个”事件中心（Event Channel）“。就像你在报社订报纸，你不需要认识作者，作者也不需要认识你，报社是中间商

## Apply

### A.Vue2的响应式原理

Vue2的核心逻辑就是观察者模式：

- **Dep(Subject)**:每一个数据属性都有一个Dep
- **Watcher(Observer)**：每一个用到该数据的组件或`computed`都是一个Watcher。
- 当你修改`this.name = 'gemini'`时，`name`的Dep就会通知所有相关的Watcher去重新渲染页面

## Conclusion

优点：

- **自动触发**：支持简单的广播通信
- **实时性**：目标一变，观察者立即相应

缺点：

- **循环引用**：如果观察者和目标互相观察，可能会导致死循环
- **性能开销**：如果观察者太多，一次`notify`可能会导致程序卡顿（尤其是在做复杂的DOM操作时）
