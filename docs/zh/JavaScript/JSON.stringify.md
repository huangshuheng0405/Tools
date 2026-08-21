# JSON.stringify

`JSON.stringify()` 将 JavaScript 值转换为 JSON 字符串。

## 基本语法

```javascript
JSON.stringify(value[, replacer[, space]])
```

| 参数 | 说明 |
|------|------|
| `value` | 要序列化的值 |
| `replacer` | 可选。用于过滤/转换值的函数或数组 |
| `space` | 可选。缩进用的空格或字符串，用于美化输出 |

## 基本用法

```javascript
const obj = { name: '张三', age: 25 }

JSON.stringify(obj)
// => '{"name":"张三","age":25}'
```

---

## replacer 参数

### 数组形式 —— 白名单过滤

```javascript
const user = { name: '张三', age: 25, password: '123456', email: 'zhang@example.com' }

// 只序列化指定的 key
JSON.stringify(user, ['name', 'email'])
// => '{"name":"张三","email":"zhang@example.com"}'
```

### 函数形式 —— 自定义转换

```javascript
const user = { name: '张三', age: 25, password: '123456' }

JSON.stringify(user, (key, value) => {
  // 过滤掉敏感字段
  if (key === 'password') return undefined
  return value
})
// => '{"name":"张三","age":25}'
```

`replacer` 函数会对每个 key-value 递归调用，**第一次调用时 `key` 为空字符串，`value` 是整个对象**：

```javascript
JSON.stringify({ a: 1, b: 2 }, (key, value) => {
  console.log(key, '->', value)
  return value
})

// 输出：
// ""  -> { a: 1, b: 2 }    ← 第一次调用
// "a" -> 1
// "b" -> 2
```

---

## space 参数 —— 美化输出

```javascript
const obj = { name: '张三', skills: ['JavaScript', 'Vue'] }

// 数字：每级缩进 2 个空格
JSON.stringify(obj, null, 2)
/*
{
  "name": "张三",
  "skills": [
    "JavaScript",
    "Vue"
  ]
}
*/

// 字符串：用指定字符缩进
JSON.stringify(obj, null, '\t')
JSON.stringify(obj, null, '--')
```

---

## 特殊值的处理规则

| 类型 | 序列化结果 |
|------|-----------|
| `undefined` | 作为对象属性值 → **被忽略**；作为数组元素 → `null`；单独序列化 → `undefined`（返回值，非字符串） |
| `Function` | **被忽略** |
| `Symbol` | **被忽略** |
| `NaN` / `Infinity` | `null` |
| `null` | `null` |
| `Date` | 调用 `toISOString()` 转为 ISO 字符串 |
| `BigInt` | **抛出 TypeError** |
| `Map` / `Set` / `WeakMap` / `WeakSet` | `{}`（只能序列化可枚举的自有属性） |
| HTML 元素 / DOM 节点 | `{}` 或不完整对象 |

```javascript
const obj = {
  a: undefined,         // 被忽略
  b: function () {},    // 被忽略
  c: Symbol('foo'),     // 被忽略
  d: NaN,               // null
  e: Infinity,          // null
  f: null,              // null
  g: new Date('2025-01-01'),  // "2025-01-01T00:00:00.000Z"
  h: [undefined, function () {}, Symbol('bar')]  // [null, null, null]
}

JSON.stringify(obj)
// => '{"d":null,"e":null,"f":null,"g":"2025-01-01T00:00:00.000Z","h":[null,null,null]}'
```

---

## toJSON() 方法

如果对象有 `toJSON()` 方法，`JSON.stringify` 会调用它并使用其返回值：

```javascript
const user = {
  name: '张三',
  birth: new Date('2000-01-01'),
  toJSON() {
    return {
      name: this.name,
      birth: this.birth.toISOString().split('T')[0]
    }
  }
}

JSON.stringify(user)
// => '{"name":"张三","birth":"2000-01-01"}'
```

### Date 的 toJSON

`Date.prototype.toJSON()` 内部调用了 `toISOString()`，所以：

```javascript
JSON.stringify({ time: new Date() })
// => '{"time":"2025-01-01T00:00:00.000Z"}'
```

---

## 循环引用

存在循环引用时抛出 `TypeError`：

```javascript
const obj = { name: 'foo' }
obj.self = obj

JSON.stringify(obj)
// ❌ TypeError: Converting circular structure to JSON
```

### 解决方案：自定义 replacer

```javascript
const seen = new WeakSet()

JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return '[Circular]'
    seen.add(value)
  }
  return value
})
// => '{"name":"foo","self":"[Circular]"}'
```

---

## JSON.parse 的反操作

`JSON.parse()` 的第二个参数 `reviver` 可以对解析出的值做转换：

```javascript
const json = '{"name":"张三","birth":"2000-01-01T00:00:00.000Z"}'

const obj = JSON.parse(json, (key, value) => {
  // 将日期字符串还原为 Date 对象
  if (key === 'birth') return new Date(value)
  return value
})

console.log(obj.birth instanceof Date) // true
```

---

## 常用场景

### 1. 深拷贝（有局限性）

```javascript
const obj = { a: 1, b: { c: 2 } }
const clone = JSON.parse(JSON.stringify(obj))
```

**注意：** 这种方式无法拷贝 `Function`、`undefined`、`Symbol`、`Date`（会变成字符串）、`Map`/`Set`、循环引用等。

### 2. 存入 localStorage

```javascript
const user = { name: '张三', age: 25 }
localStorage.setItem('user', JSON.stringify(user))

// 取出
const stored = JSON.parse(localStorage.getItem('user'))
```

### 3. 比较两个对象

```javascript
const a = { x: 1, y: 2 }
const b = { x: 1, y: 2 }

JSON.stringify(a) === JSON.stringify(b) // true
```

> 注意：这种方式依赖 key 的顺序，`{a:1,b:2}` 和 `{b:2,a:1}` 的比较结果取决于引擎实现。

### 4. 格式化日志输出

```javascript
console.log('data:', JSON.stringify(data, null, 2))
```

---

## 总结

- `replacer` 用**数组**做白名单过滤，用**函数**做自定义转换
- `space` 控制缩进，方便日志和调试
- `undefined`、`Function`、`Symbol` 在对象中会被**静默忽略**
- `BigInt` 和**循环引用**会抛错
- `toJSON()` 让对象自定义序列化行为
- `JSON.parse` + `JSON.stringify` 做深拷贝有局限性，仅适用于纯数据对象
