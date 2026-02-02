这是一个前端面试中的经典问题。虽然现在我们习惯用 Vite 或 Webpack 自动处理，但理解这两者的底层差异对理解代码运行逻辑（尤其是调试 SSR 或 Node.js 脚本时）非常重要。

最核心的区别可以总结为：**一个是“静态编译”，一个是“动态加载”**。

---

### 1. 核心差异对比表

| 特性          | ES Module (ESM)            | CommonJS (CJS)                 |
| ------------- | -------------------------- | ------------------------------ |
| **标准**      | ECMAScript 官方标准 (ES6+) | Node.js 早期制定的社区规范     |
| **关键字**    | `import` / `export`        | `require` / `module.exports`   |
| **加载机制**  | **编译时输出引用（静态）** | **运行时输出值的拷贝（动态）** |
| **加载方式**  | 异步加载（适用于浏览器）   | 同步加载（适用于服务器/磁盘）  |
| **this 指向** | `undefined`                | 当前模块对象 `module.exports`  |
| **严格模式**  | 默认开启                   | 默认不开启                     |

---

### 2. 深度差异解析

#### ① 值的拷贝 vs 值的引用 (最重要)

- **CommonJS**: 当你 `require` 一个变量时，得到的是原模块导出的一个**副本**。一旦模块内部改了值，外部持有的副本不会改变。
- **ESM**: `import` 得到的是对原始模块值的**实时动态绑定（Read-only View）**。如果原模块里的值变了，外部访问时也会同步更新。

#### ② 静态分析 vs 动态执行

- **ESM** 的 `import` 必须写在文件顶层。引擎在执行代码前（编译阶段）就知道模块的依赖关系。这使得 **Tree-shaking（剔除无用代码）** 成为可能。
- **CommonJS** 的 `require` 可以写在 `if` 语句或函数里。这意味着它必须等代码**运行到这一行**才知道加载什么，无法进行静态优化。

---

### 3. 代码对比示例

#### CommonJS 示例（拷贝）

```javascript
// lib.js
let count = 1
module.exports = { count, add: () => count++ }

// main.js
const { count, add } = require('./lib')
add()
console.log(count) // 输出 1，因为 count 被拷贝出来了
```

#### ESM 示例（引用）

```javascript
// lib.js
export let count = 1
export const add = () => count++

// main.js
import { count, add } from './lib.js'
add()
console.log(count) // 输出 2，因为它是对原数据的实时绑定
```

---

### 4. 现代开发中的现状

随着 Node.js 逐渐全面支持 ESM，现在的趋势是：

1. **浏览器端**：原生支持 ESM。
2. **Node.js**：旧项目用 CJS，新项目推荐在 `package.json` 中设置 `"type": "module"` 来启用 ESM。
3. **互操作性**：ESM 可以异步 `import()` CJS 模块，但 CJS 无法直接 `require` ESM 模块（因为 CJS 是同步的，无法处理 ESM 的异步加载链路）。

---

### 总结

- 如果你追求**性能优化（Tree-shaking）和官方标准**，用 **ESM**。
- 如果你在处理**旧版 Node.js 环境**或需要**动态加载依赖**，会用到 **CommonJS**。
