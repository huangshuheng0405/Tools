# Factory Pattern

将对象的"**创建过程**"和"**使用过程**"分开

在代码中，不用到处使用`new`关键字去实例化类，而是调用一个”工厂方法“，让它根据我们提供的参数，决定返回哪种实例

## Why use Factory Pattern

- **解耦**：如果以后创建的对象的逻辑变了（比如`User`类增加了一个必填参数），你只需要修改工厂函数一处，而不需要翻遍项目修改所有`new User()`
- **逻辑封装**：创建对象有时很复杂（需要设置初始值、建立关联），工厂可以把这个脏活累活封装起来

## Code

```js [Factory.js]
class Admin {
  constructor() {
    this.role = 'Admin'
    this.permission = ['all']
  }
}

class Editor {
  constructor() {
    this.role = 'Editor'
    this.permission = ['editor']
  }
}

class UserFactory {
  static createUser(type) {
    switch (type) {
      case 'admin':
        return new Admin()
      case 'editor':
        return new Editor()
      default:
        return {
          role: 'guest',
          permission: []
        }
    }
  }
}

const myUser = UserFactory.createUser('admin')
const edit = UserFactory.createUser('editor')
const de = UserFactory.createUser('de')
console.log(myUser)
console.log(edit)
console.log(de)
```

## Apply

### A.弹窗UI组件库

当你调用`Element UI`的弹窗时：

```js
Message.success('操作成功')
Message.error('操作失败')
```

你调用的其实是一个工厂。它会根据你传入的类型（'success'、'error'），返回不同的弹窗实例。

### B.`document.createElement`

这是浏览器原生的工厂模式

你传入`'div'`，它会返回`HTMLDivElment`,你传入`’canvas‘`， 它会返回`HTMLCanvasElement`

### C.`Axios`的实例创建

```js
const ervice = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
})
```

`axios.create`是一个工厂函数，它会根据你的配置，生产出一个定制化的请求实例
