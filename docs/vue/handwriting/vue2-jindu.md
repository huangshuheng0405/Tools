# 手写Vue2

::: code-group

```html [myVue.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      {{ name }}
      <input type="text" v-model="name" />
      <input type="text" v-model="time.h" />
      <input type="text" v-model="time.m" />
      <input type="text" v-model="time.s" />
      <div v-html="html"></div>
      <div v-text="text"></div>
      <p>{{ name }}</p>
      <p>age: {{ age }}</p>
      <p>{{n}} -- {{ doubleN }}</p>
      <p>{{ time.h }} : {{ time.m}} : {{ time.s }}</p>
      <button v-on:click="handleClick">click me</button>
      <button v-on:click="handleDoubleN">add 1</button>
    </div>
    <script src="./myVue.js"></script>

    <script>
      const vm = new myVue({
        el: document.querySelector('#app'),
        data: {
          name: 'andy',
          age: 18,
          n: 20,
          html: '<h1>i am h1</h1>',
          text: '<h1>i am h1</h1>',
          time: {
            h: 12,
            m: 22,
            s: 34
          }
        },
        methods: {
          handleClick() {
            console.log('handleClick', this)
            // this.$data.name = 'jack'
          },
          handleDoubleN() {
            this.n++
          }
        },
        computed: {
          doubleN() {
            return this.n * 2
          }
        }
      })

      console.log(vm.$el)
      console.log(vm.$data)
    </script>
  </body>
</html>
```

```js [my.js]
class myVue {
  constructor(options) {
    if (this.isElement(options.el)) {
      this.$el = options.el
    } else {
      this.$el = document.querySelector(options.el)
    }
    this.$data = options.data
    // 需要把data映射到this上面
    this.proxyDataToVm()

    //
    this.$computed = options.computed
    this.computedToData()

    this.$methods = options.methods

    // 数据的劫持
    new Observe(this.$data)

    new Complier(this)
  }
  computedToData() {
    for (let attr in this.$computed) {
      Object.defineProperty(this.$data, attr, {
        get: () => {
          return this.$computed[attr].call(this)
        }
      })
    }
  }
  // 需要把data映射到this上面
  proxyDataToVm() {
    for (let attr in this.$data) {
      Object.defineProperty(this, attr, {
        get: () => {
          return this.$data[attr]
        },
        set: (newValue) => {
          this.$data[attr] = newValue
        }
      })
    }
  }

  // 判断是否是一个dom对象
  isElement(node) {
    return node.nodeType === 1
  }
}

// 完成指令的操作
const DirectiveUtils = {
  getValue(vm, value) {
    // vm.$data['time']['h']
    return value.split('.').reduce((data, key) => {
      return data[key.trim()]
    }, vm.$data)
  },
  setVal(vm, value, newValue) {
    console.log('setValue ', value)
    value.split('.').reduce((data, k, index, arr) => {
      if (index === arr.length - 1) {
        // 赋值给最后一个
        data[k] = newValue
      }

      return data[k]
    }, vm.$data)
  },
  getContent(vm, value) {
    let reg = /\{\{(.+?)\}\}/gi // 利用正则的分组 提取到插值表达式里面的变量 然后进行替换
    return value.replace(reg, (...args) => {
      console.log('getContent args', args)
      return this.getValue(vm, args[1])
    })
  },
  model(node, value, vm) {
    // console.log('model  value', value)
    new Watcher(vm, value, (newValue, oldValue) => {
      node.value = newValue
    })
    node.value = this.getValue(vm, value)

    // 当我们在页面更新了数据 实例对象里面的数据也要更新
    node.addEventListener('input', (e) => {
      let newValue = e.target.value
      // 赋值的时候 需要给value的最后一个属性赋值
      this.setVal(vm, value, newValue)
    })
  },
  html(node, value, vm) {
    new Watcher(vm, value, (newValue, oldValue) => {
      node.innerHTML = newValue
    })
    node.innerHTML = this.getValue(vm, value)
  },
  text(node, value, vm) {
    new Watcher(vm, value, (newValue, oldValue) => {
      node.innerText = newValue
    })
    node.innerText = this.getValue(vm, value)
  },
  content(node, content, vm) {
    console.log('content   11', content)
    let reg = /\{\{(.+?)\}\}/gi
    // let val = this.getContent(vm, content)
    let val = content.replace(reg, (...args) => {
      console.log('插值表达式里面的变量 我们需要发布订阅', args)
      new Watcher(vm, args[1], (newValue, oldValue) => {
        node.textContent = this.getContent(vm, content)
      })

      return this.getValue(vm, args[1])
    })
    node.textContent = val
  },
  on(node, value, vm, type) {
    node.addEventListener(type, (e) => {
      vm.$methods[value].call(vm, e)
    })
  }
}

class Complier {
  constructor(vm) {
    // console.log(vm, '进行视图的编译操作')
    this.vm = vm
    let fragment = this.nodeToFragment(this.vm.$el)

    // console.log('文档碎片', fragment)

    // 将数据和视图进行编译
    this.buildTemplate(fragment)

    // 把编译后的结果更新到vue管理的区域
    this.vm.$el.appendChild(fragment)
  }

  buildTemplate(fragment) {
    // console.log(fragment.childNodes)
    let nodeList = [...fragment.childNodes]

    nodeList.forEach((node) => {
      if (this.vm.isElement(node)) {
        this.buildElement(node)
        // 如果是元素 则继续向下编译
        this.buildTemplate(node)
      } else {
        this.buildText(node)
      }
    })
  }
  // 对元素进行编译 处理指令
  buildElement(node) {
    // console.log('================', node)
    let attrs = [...node.attributes]
    // console.log(attrs, '=================')
    attrs.forEach((attr) => {
      let { name, value } = attr
      // console.log('============', name, value)
      if (name.startsWith('v-')) {
        // v-on:click="handleClick"
        let [directiveName, directiveType] = name.split(':')
        // 指令
        let [_, directive] = directiveName.split('-')
        // console.log(directive, '指令')
        // 处理指令
        DirectiveUtils[directive](node, value, this.vm, directiveType)
      }
    })
  }
  // 对文本进行编译 处理插值表达式
  buildText(node) {
    let content = node.textContent
    let reg = /\{\{.+?\}\}/gi // 插值表达式

    if (reg.test(content)) {
      console.log('插值表达式', content)
      DirectiveUtils['content'](node, content, this.vm)
    }
  }
  // 把所有dom节点加到fragment里面
  nodeToFragment(app) {
    let fragment = document.createDocumentFragment()
    let node = app.firstChild
    while (node) {
      fragment.appendChild(node)
      node = app.firstChild
    }

    return fragment
  }
}

class Observe {
  constructor(obj) {
    this.observe(obj)
  }

  observe(obj) {
    if (obj && typeof obj === 'object') {
      for (let attr in obj) {
        this.defineReactive(obj, attr, obj[attr])
      }
    }
  }
  // obj 待处理的对象 attr 对象的属性 value 进行get/set 操作时候的value值
  defineReactive(obj, attr, value) {
    this.observe(value)
    let dep = new Dep()
    Object.defineProperty(obj, attr, {
      // 将观察者添加到订阅列表
      get() {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set: (newValue) => {
        if (newValue !== value) {
          this.observe(newValue)
          value = newValue
          dep.notify()
          console.log('set 操作 数据变化了 视图进行更新', newValue)
        }
      }
    })
  }
}

class Watcher {
  /**
   * vm 实例对象
   * attr 属性
   * cb 回调函数
   */
  constructor(vm, attr, cb) {
    this.vm = vm
    this.attr = attr
    this.cb = cb

    // 先存储一个最初的值 然后再获取最新的值 做一个比较 得到是否变化
    this.oldValue = this.getOldValue()
  }

  getOldValue() {
    Dep.target = this
    let oldValue = DirectiveUtils.getValue(this.vm, this.attr)
    Dep.target = null
    return oldValue
  }
  update() {
    let newValue = DirectiveUtils.getValue(this.vm, this.attr)
    if (this.oldValue !== newValue) {
      this.cb(newValue, this.oldValue)
    }
  }
}

class Dep {
  constructor() {
    this.subs = []
  }
  // 将观察者添加到订阅列表
  addSub(watcher) {
    this.subs.push(watcher)
  }
  // 发布通知 执行观察者的更新方法
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}
```

:::
