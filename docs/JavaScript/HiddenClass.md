---
outline: deep
---

# JavaScript 隐藏类（Hidden Classes）

JavaScript 是动态语言，对象可以随时新增、删除属性。但在底层实现里，
为了让属性访问更快，现代 JS 引擎（比如 V8）会为「形状相同」的对象
创建一种内部结构，叫作「隐藏类」（Hidden Class，也叫 Shape）。

理解隐藏类有助于写出更容易被引擎优化、运行更快的代码。

### 测试代码

上面的代码效率更高，因为重用了**隐藏类**

```js [test.js]
console.time('a')
for (let i = 0; i < 100000; i++) {
  const obj = {}
  obj['a'] = i
}

console.timeEnd('a')

console.time('b')

for (let i = 0; i < 100000; i++) {
  const obj = {}
  obj[`${i}`] = i
}
console.timeEnd('b')
```

## 1. 隐藏类是什么？

可以类比「结构体」或「类的字段布局」：

- 对象有哪些属性
- 属性的顺序
- 每个属性在内存里的「偏移位置」

当两个对象拥有**相同的属性集合和顺序**时，它们可以共享同一个隐藏类，
这样引擎在访问 `obj.foo` 时，就能像访问「固定偏移」一样快速。

一旦对象的属性结构发生变化，引擎就需要创建一个新的隐藏类，
并迁移原有数据，这会带来额外开销。

## 2. 为什么顺序和方式很重要？

看一个简单例子：

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

const p1 = new Person('Alice', 20)
const p2 = new Person('Bob', 25)
```

在这个例子里：

- `p1` 和 `p2` 的属性完全一致（`name`、`age`），顺序也一样
- 引擎可以为它们共享同一个隐藏类
- 访问 `p1.name` / `p2.name` 时，JIT 可以做非常激进的优化

反例：

```js
function PersonBad(name) {
  this.name = name
}

const a = new PersonBad('Alice')
// 运行一段时间后
a.age = 20

const b = new PersonBad('Bob')
b.age = 25
```

这里有几个问题：

- `a` 在构造时只有 `name`，后来又动态加了 `age`
- `b` 在构造后马上加 `age`，但隐藏类的迁移时机可能不同

这种「先用再加」的写法会导致：

- 对象在不同时间点拥有不同形状
- 引擎需要频繁创建 / 迁移隐藏类
- JIT 生成的优化代码更难生效

更好的做法是：在构造函数里一次性定义好所有需要的属性。

```js
function PersonGood(name, age) {
  this.name = name
  this.age = age
}

const a = new PersonGood('Alice', 20)
const b = new PersonGood('Bob', 25)
```

## 3. 影响隐藏类的常见操作

下面这些写法都会让隐藏类变得「不稳定」，从而影响性能：

### 3.1 运行时新增属性

```js
const obj = {}
obj.x = 1
obj.y = 2
```

如果大量对象都是这样「先创建空对象，再慢慢加属性」，每一步都可能触发隐藏类迁移。

更推荐：

```js
const obj = { x: 1, y: 2 }
```

### 3.2 属性顺序不一致

```js
const a = {}
a.x = 1
a.y = 2

const b = {}
b.y = 2
b.x = 1
```

虽然 `a` 和 `b` 都有 `x`、`y` 两个属性，但顺序不同，会导致它们拥有不同的隐藏类。

如果这些对象被放到同一个数组里频繁访问，性能会受到影响。

### 3.3 删除属性 `delete`

```js
const obj = { x: 1, y: 2 }
delete obj.x
```

`delete` 会改变对象的形状，一般不利于优化。

如果只是想「标记无效」，可以考虑：

```js
const obj = { x: 1, y: 2 }
obj.x = null // 或 undefined，保留属性结构
```

### 3.4 数组里混用不同形状的对象

```js
const list = []

list.push({ x: 1, y: 2 })
list.push({ x: 3 }) // 少了 y
list.push({ x: 4, y: 5, z: 6 }) // 多了 z
```

同一个数组里，如果存放了很多「形状不同」的对象，JIT 很难对这段访问逻辑进行稳定优化。

更推荐让数组里的对象类型尽量统一。

## 4. 和内联缓存（Inline Cache）的关系（简略）

当你多次访问 `obj.foo` 时，引擎会记住「某个调用点通常看到的隐藏类」，
这就是内联缓存（Inline Cache，IC）。

如果这个调用点大多数时候看到的都是**同一个隐藏类**，IC 就是「单态」的，
可以生成非常高效的机器码。

但如果你在同一处代码里，传入了各种形状不同的对象，比如：

```js
function logX(obj) {
  console.log(obj.x)
}

logX({ x: 1 })
logX({ x: 2, y: 3 })
logX({ x: 3, z: 4 })
```

那么这个调用点的 IC 可能变成「多态」甚至「超多态」，优化效果会明显变差。

## 5. 实战建议（如何写出对隐藏类友好的代码）

综合前面的内容，可以总结出几条简单易记的实践：

- 尽量在构造函数 / 工厂函数里**一次性声明所有属性**
- 保证同一类对象的属性顺序一致
- 避免频繁 `delete` 属性，改用 `null` 或 `undefined` 标记
- 同一个数组中，尽量放结构相似的对象
- 避免在热路径上给对象「临时加字段」

这些习惯并不会改变你的业务逻辑，却能让 JS 引擎更容易把代码优化到「接近原生」的速度。

## 6. 需要记住什么？

如果只记一件事，可以是：

> 对象的「形状」要稳定：**属性集合 + 顺序** 尽量保持一致。

这背后就是隐藏类的工作方式。

当你写高性能前端、Node.js 服务端，或者对性能敏感的库时，
对隐藏类多一点感觉，会帮你避开很多「看不见的坑」。
