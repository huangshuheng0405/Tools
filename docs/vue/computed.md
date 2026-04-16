# computed

## 可写计算属性

```js [computed.js]
import { reactive, ref, watch, computed } from 'vue'

const count = ref(0)

const alwaysSmall = computed({
  get(previous) {
    if (count.value < 3) {
      return count.value
    }
    return previous
  },
  set(newValue) {
    count.value = newValue * 2
  }
})
```

当`alwaysSmall`的值发生变化时，`count`的值也会发生变化。

## \_dirty

1. 解决重复计算带来的开销

- 没有`_dirty`：每次你在模板里写`fullname`，Vue都要运行一次`getter`。如果模板里用了10次，就运行10次
- 有了`_dirty`：
  - 第一次访问：`_dirty`是`true`，执行计算，把结果存起来，`_dirty`变`false`
  - 第2~10次访问：发现\_dirty是`false`，直接从内存拿上次的结果。耗时几乎为0

2. 解决无效计算（懒处理）
   当计算属性的依赖的数据（如`count`）发生变化时，`computed`并不会重新计算。

- 它只是把`_dirty`设为true
- 意义：如果这个计算属性没有在页面上显示，也没有被其他地方引用，那么这次计算就被省下来了。只有等到下次有人真的去读取`.value`，它才会根据`_dirty`状态触发计算
