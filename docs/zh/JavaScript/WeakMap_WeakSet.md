# WeakMap and WeakSet

先了解一下垃圾回收

```js
let john = { name: 'John' }

// 该对象能被访问，john 是它的引用

// 覆盖引用
john = null

// 该对象将会被从内存中清除
```

通常，当对象、数组之类的数据结构在内存中，他们的子元素，例如对象的属性、数组的元素都被认为是可达的

例如把一个对象放入到数组中，那么只要这个数组存在，那么这个对象也就存在，即使没有其他对这个对象的引用

就像这样

```js
let john = { name: 'John' }

let array = [john]

john = null // 覆盖引用

// 前面由 john 所引用的那个对象被存储在了 array 中
// 所以它不会被垃圾回收机制回收
// 我们可以通过 array[0] 获取到它
```

类似的，如果我们使用对象作为常规的`Map`的键，那么当`Map`存在时，该对象也将存在。它会占用内存，并且不会被（垃圾回收机制）回收

```js
let john = { name: 'John' }

let map = new Map()
map.set(john, '...')

john = null // 覆盖引用

// john 被存储在了 map 中，
// 我们可以使用 map.keys() 来获取它
```

而`WeakMap`在这方面有着根本的不同。他不会阻止垃圾回收机制对作为键的对象的回收

## WeakMap

和`Map`的第一个不同的就是，`WeakMap`的键必须是**对象**，不能是原始类型

```js
let weakMap = new WeakMap()

let obj = {}

weakMap.set(obj, 'ok') // 正常工作（以对象作为键）

// 不能使用字符串作为键
weakMap.set('test', 'Whoops') // Error，因为 "test" 不是一个对象
```

如果我们在`WeakMap`中直接使用一个对象作为键，并且没有其他对这个对象的引用——该对象将从内存中自动清除

```js
let john = { name: 'John' }

let weakMap = new WeakMap()
weakMap.set(john, '...')

john = null // 覆盖引用

// john 被从内存中删除了！
```

`WeakMap`不支持迭代以及`keys()`，`values()`和`entries()`方法。所以没有办法获取`WeakMap`的所有键或值

`WeakMap`只有以下的方法：

- `WeakMap.get(key)`
- `WeakMap.set(key, value)`
- `WeakMap.has(key)`
- `WeakMap.delete(key)`

## 应用场景

### 额外的数据

例如当我们要处理用户访问计数的代码，收集信息被存储到`map`中：一个用户对象作为键，其访问次数为值。当一个用户离开时，这是我们就不需要它的访问次数了

下面是一个使用`Map`的计数函数的例子：

```js [visitCount.js]
let visitCountMap = new Map()

function countUser(user) {
  let count = visitCountMap.get(user) || 0
  visitCountMap.set(user, count + 1)
}
```

下面是可能使用它的代码：

```js [main.js]
import { CountUser } from './visitCount'

let john = { name: 'john' }

CountUser(john)

// 不久之后，john 离开了
john = null
```

现在，`john`这个对象应该被垃圾回收，但它仍在内存中，因为它是`visitCountMap`中的一个键

当我们移除用户时，我们需要清理`visitCountMap`，否则它将在内存中无限增大。在复杂的架构中，这种清理会成为一项繁重的任务

我么可以使用`WeakMap`来避免这样的问题：

```js [visitCount.js]
let visitsCountMap = new WeakMap() // weakmap: user => visits count

// 递增用户来访次数
function countUser(user) {
  let count = visitsCountMap.get(user) || 0
  visitsCountMap.set(user, count + 1)
}
```

现在我们不需要去清理`visitCountMap`了，当`john`对象变成不可达时，即便它是`WeakMap`里的一个键，它也会连同它作为`WeakMap`里的键所对应的信息一同被从内存中删除

### 缓存

我们可以存储缓存函数的结果，以便将来同一个对象的调用可以重用这个结果

为了实现这一点，我们可以使用`Map`（非最佳方案）：

```js [cache.js]
let cache = new Map()

function process(obj) {
  if (!cache.has(obj)) {
    let result = /* calculations of the result for */ obj

    cache.set(obj, result)
  }
  return cache.get(obj)
}

// // 现在我们在其它文件中使用 process()

let obj = {}

let result1 = process(obj) // 计算完成

let result2 = process(obj) // 取自缓存被记忆的结果

// 当我们不需要这个对象时
obj = null

console.log(cache.size) // 1（啊！该对象依然在 cache 中，并占据着内存！）
```

对于多次调用同一个对象，它只需在第一次调用时计算出结果，之后的调用可以直接从 `cache` 中获取。这样做的缺点是，当我们不再需要这个对象的时候需要清理 `cache`。

如果我们用 `WeakMap` 替代 `Map`，便不会存在这个问题。当对象被垃圾回收时，对应缓存的结果也会被自动从内存中清除。

```js [cache.js]
let cache = new WeakMap()

// 计算并记结果
function process(obj) {
  if (!cache.has(obj)) {
    let result = /* calculate the result for */ obj

    cache.set(obj, result)
  }

  return cache.get(obj)
}

// 📁 main.js
let obj = {
  /* some object */
}

let result1 = process(obj)
let result2 = process(obj)

// ……稍后，我们不再需要这个对象时：
obj = null

// 无法获取 cache.size，因为它是一个 WeakMap，
// 要么是 0，或即将变为 0
// 当 obj 被垃圾回收，缓存的数据也会被清除
```
