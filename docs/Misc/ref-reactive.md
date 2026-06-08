# ref reactive

| ref          | 对比               | reactive  |
| ------------ | ------------------ | --------- |
| 适合         | 基本类型/单值      | 对象      |
| 访问方式     | `.value`           | 直接访问  |
| 底层         | 包装对象           | Proxy代理 |
| 替换整个值   | 很方便             | 不方便    |
| 解构后响应式 | 会丢失（普通解构） | 会丢失    |

`Proxy`只能代理对象，所以`reactive`只能代理对象，而`ref`会包一层而变成对象

## reactive的坑

直接替换会丢失响应式

```js
let user = reactive({
  name: 'Tom'
})

user = {
  name: 'Jack'
}
```

原来的`Proxy`被整个替换掉了，而`ref`可以整个替换

```js
const user = ref({
  name: 'Tom'
})

user.value = {
  name: 'Jack'
}
```

## reactive解构丢失响应式

```js
const user = reactive({
  name: 'Tom'
})

const { name } = user
```

这里的`name`已经不是响应式了

解决：

```js
import { toRefs } from 'vue'

const user = reactive({
  name: 'Tom'
})

const { name } = toRefs(user)
```

## 总结

- `ref`：给一个值讨一个盒子
- `reactive`：直接把对象变成响应式代理

底层关系：

实际上`ref({})`内部也会调用`reactive()`，所以里面的对象其实也是`Proxy`