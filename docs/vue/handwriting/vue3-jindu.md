# 手写vue3

```js
let obj = new Proxy(
  {},
  {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey, receiver)
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey, value, receiver)
    }
  }
)
```

`get(target, propKey, receiver)`依次是目标对象、属性名和proxy实例本身

`set(target, propKey, value, receiver)`依次是目标对象、属性名、属性值和proxy实例本身

::: code-group

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <div id="box"></div>
    <div id="container"></div>

    <script src="reactive.js"></script>
    <script>
      let obj = {
        username: 'andy',
        age: 18
      }
      let obj1 = {
        username: 'lilei',
        age: 18
      }

      let state = reactive(obj)
      let state1 = reactive(obj1)

      //   console.log(state)

      function effect() {
        console.log('effect')
        document.getElementById('app').innerText = state.username
      }
      function effect1() {
        console.log('effect1')
        document.getElementById('box').innerText = state1.username
      }
      //   function effect2() {
      //     console.log('effect2')
      //     document.getElementById('container').innerText = state.age
      //   }

      registerEffect(effect)
      registerEffect(effect1)
      //   registerEffect(effect2)

      // 针对不同的属性有与之对应的集合
      // username ---> set1(fn1, fn2, fn3)
      // age ---> set1(fn6, fn4, fn5)
      setTimeout(() => {
        state.username = 'mark'
      }, 2000)
    </script>
  </body>
</html>
```

```js [index.js]
let bucket = new WeakMap()
let activeEffect = null // 指针 指向当前正在副作用函数

function isObject(data) {
  return typeof data == 'object' && data !== null
}

// 依赖收集
function track(target, key) {
  if (activeEffect) {
    let depMap = bucket.get(target)
    if (!depMap) {
      depMap = new Map()
      bucket.set(target, depMap)
    }
    let depSet = depMap.get(key)
    if (!depSet) {
      depSet = new Set()
      depMap.set(key, depSet)
    }
    depSet.add(activeEffect)
  }
}
// 副作用触发函数
function trigger(target, key, value) {
  let depMap = bucket.get(target)
  if (depMap) {
    let depSet = depMap.get(key)
    if (depSet) {
      depSet.forEach((fn) => fn())
    }
  }
}

function reactive(data) {
  if (!isObject(data)) {
    return
  }

  return new Proxy(data, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      // effect()
      trigger(target, key, value)
      return true
    }
  })
}

function registerEffect(fn) {
  if (typeof fn !== 'function') {
    return
  }
  activeEffect = fn
  fn()
  activeEffect = null
}
```

:::

## track

当读取属性时（触发get）：

- 找`bucket`里面的`target` -> 拿到 `depMap`
- 找`depMap`里面的`key` -> 拿到 `depSet`
- 把 `activeEffect`加到`depSet`里
- 现在这个属性就记住了谁在用它

## trigger

当修改属性时（触发set）：

- 先更新原始对象的值
- 按顺序查找桶：
- 找`bucket`里的`target` -> `depMap`
- 找`depMap`里的`key` -> `depSet`
- 执行：遍历`depSet`，重新执行里面的所有的副作用函数
