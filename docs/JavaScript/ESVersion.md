# ES 每个版本都引入了什么内容

ECMAScript (ES) 是 JavaScript 的标准。自 ES6 (2015) 以来，ECMAScript 每年都会发布一个新的版本。

## ES6 (ES2015) - 划时代的更新

这是 JavaScript 历史上最大的一次更新。

- **`let` 和 `const`**：块级作用域变量声明。
- **箭头函数 (Arrow Functions)**：`() => {}`，保留 `this` 上下文。
- **类 (Classes)**：`class` 语法糖，支持 `extends` 继承。
- **模块化 (Modules)**：`import` 和 `export`。
- **模板字符串 (Template Literals)**：反引号 `` `Hello ${name}` ``。
- **解构赋值 (Destructuring)**：`const { a, b } = obj;` 或 `const [x, y] = arr;`。
- **默认参数 (Default Parameters)**：`function(a = 1) {}`。
- **展开运算符 (Spread Operator)**：`...arr` 或 `...obj`。
- **Promise**：原生异步解决方案。
- **Symbol**：新的基本数据类型，表示唯一标识符。
- **Map 和 Set**：新的数据结构。
- **Iterators 和 Generators**：`function*` 和 `yield`。

## ES7 (ES2016)

小版本更新。

- **`Array.prototype.includes()`**：判断数组是否包含某个值（替代 `indexOf`）。
- **指数运算符 (`**`)**：`2 \*\* 3`等同于`Math.pow(2, 3)`。

## ES8 (ES2017)

- **`async` / `await`**：基于 Promise 的终极异步解决方案。
- **`Object.values()` / `Object.entries()`**：获取对象的值或键值对数组。
- **`String.prototype.padStart()` / `padEnd()`**：字符串填充。
- **`Object.getOwnPropertyDescriptors()`**：获取属性描述符。
- **Trailing commas**：函数参数列表允许尾后逗号。

## ES9 (ES2018)

- **异步迭代 (Asynchronous Iteration)**：`for await (const x of asyncIterable) {}`。
- **对象展开/剩余属性**：`const { a, ...rest } = obj;` 和 `const newObj = { ...oldObj, b: 2 };`。
- **Promise.prototype.finally()**：无论成功失败都会执行。
- **正则改进**：
  - 命名捕获组 `(?<name>...)`。
  - Lookbehind assertions `(?<=...)`。
  - `s` (dotAll) flag。

## ES10 (ES2019)

- **`Array.prototype.flat()` / `flatMap()`**：数组扁平化。
- **`Object.fromEntries()`**：`Object.entries()` 的逆操作。
- **`String.prototype.trimStart()` / `trimEnd()`**：去除首尾空格。
- **`catch` 参数可选**：`try { ... } catch { ... }` (不再需要 `catch(e)`)。
- **`Symbol.prototype.description`**：直接获取 Symbol 的描述。

## ES11 (ES2020)

- **BigInt**：支持任意精度的整数 `123n`。
- **动态导入 (Dynamic Import)**：`import('./module').then(...)`。
- **空值合并运算符 (Nullish Coalescing, `??`)**：只有 `null` 或 `undefined` 时才返回右侧值。
- **可选链 (Optional Chaining, `?.`)**：`obj?.prop?.method()`，安全访问深层属性。
- **`Promise.allSettled()`**：等待所有 Promise 完成（无论成功或失败）。
- **`globalThis`**：统一的全局对象访问方式。

## ES12 (ES2021)

- **逻辑赋值运算符**：`||=`, `&&=`, `??=`。
- **`String.prototype.replaceAll()`**：一次性替换所有匹配项。
- **`Promise.any()`**：只要有一个 Promise 成功就返回（与 `race` 不同，`race` 是无论成败）。
- **数字分隔符**：`1_000_000`。
- **WeakRef** 和 **FinalizationRegistry**：弱引用和垃圾回收回调（高级特性）。

## ES13 (ES2022)

- **类字段 (Class Fields)**：直接在类中定义属性，支持 `static` 和私有属性 `#private`。
- **顶层 await (Top-level await)**：在模块顶层直接使用 `await`。
- **`Array.prototype.at()`**：支持负索引访问，如 `arr.at(-1)`。
- **`Object.hasOwn()`**：替代 `Object.prototype.hasOwnProperty.call()`。
- **`error.cause`**：在 `new Error()` 时传递原始错误原因。

## ES14 (ES2023)

- **数组非变异方法**：`toSorted()`, `toReversed()`, `toSpliced()`, `with()` (返回新数组，不改变原数组)。
- **Hashbang 语法**：支持在脚本文件开头使用 `#!/usr/bin/env node`。
- **Symbols 作为 WeakMap 的键**。

## ES15 (ES2024)

- **`Object.groupBy()` / `Map.groupBy()`**：原生数组/可迭代对象分组功能。
- **`Promise.withResolvers()`**：直接返回 `{ promise, resolve, reject }`。
- **正则表达式 `v` flag**：支持集合操作和 Unicode 属性。
- **`Atomics.waitAsync()`**：异步等待共享内存。

_(注：每年 6 月正式发布新标准，以上列表涵盖了主要特性)_
