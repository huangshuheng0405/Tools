# Lazy Function

**惰性函数**是一种设计模式，指的是函数在**第一次执行时**进行一些初始化操作（如环境判断、资源加载等），然后动态地重写自身，使得后续调用时直接使用第一次计算的结果，跳过重复初始化过程

```js
function addEvent(element, type, handler) {
  if (window.addEventListener) {
    addEvent = function (element, type, handler) {
      element.addEventListener(type, handler, false)
    }
  } else if (window.attachEvent) {
    addEvent = function (element, type, handler) {
      element.attachEvent('on' + type, handler)
    }
  }

  // 首次调用时立即执行当前分支重写版本
  addEvent(element, type, handler)
}
```

后续调用`addEvent`时，会直接使用重写后的版本，不会重复进行特性检测
