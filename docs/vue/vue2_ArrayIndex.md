# Vue2不能监听数组下标原因

- Vue2用的是`defineProperty`劫持数据实现数据视图双向绑定
- `Object.defineProperty`是可以劫持数组的

```js
const arr = [1, 2, 3, 4]
Object.keys(arr).forEach(function (key) {
  Object.defineProperty(arr, key, {
    get: function () {
      console.log('key: ' + key)
    },
    set: function (value) {
      console.log('value: ' + value)
    }
  })
})

arr[1]
arr[2] = 4
// key: 1
// value: 4
```

- 真实情况: 是Object.defineProperty可以劫持数组的下标而vue2没有用来劫持数组
- defineProperty是属性级别的劫持,如果按上面代码的方式去劫持数组,随着数组长度增加,会有很大的性能损耗,倒是框架的性能不稳定,因此vue2放弃一定的用户便捷性,提供$set方法
  去操作数组,以最大程度保证框架的性能稳定
