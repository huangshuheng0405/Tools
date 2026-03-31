# Pub-Sub Pattern

核心理念：**解耦**。让“发消息的人”和“接受消息的人”完全互不认识。

## Code

```js [Pub-Sub Pattern.js]
class EventEmitter {
  constructor() {
    this.events = {} // 存储事件及其对应的订阅者列表
  }

  // 订阅
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  // 发布
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data))
    }
  }

  // 取消订阅
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback
      )
    }
  }
}

const bus = new EventEmitter()

bus.on('order', (food) => console.log(`后厨收到订单：制作${food}`))
bus.on('order', (food) => console.log(`财务收到订单：记录${food}的收入`))

bus.emit('order', '宫保鸡丁')
```

## Apply

### A.DOM事件监听

```js
document.body.addEventListener('click', (e) => {....})
```

当你点击页面时，浏览器（发布者）发布了一个`click`信号。你写的匿名寒素（订阅者）收到了这个信号并执行

### B.消息队列（RabbitMQ/Kafka）

在后端架构中，这用于处理高并发。用户下单后，订单系统发布“下单成功”消息，库存系统、短信系统、积分系统各自订阅消息并处理

## Conclusion

优点：

- 极度灵活：模块之间互不干扰，你可以随时增加新的订阅者
- 异步友好：发布者发完消息可以走人，不需要等待反馈

缺点；

- 追踪困难：如果滥用，你会发现系统里到处在闪现消息，很难查出某个逻辑是谁触发的
- 内存泄漏：如果订阅了时间但忘记`off`（解绑），订阅者函数会一直留在内存里
