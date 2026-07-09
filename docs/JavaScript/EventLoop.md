# 事件循环

## 运行流程

- **执行同步代码**： js从调用栈顶部开始执行，知道栈为空
- **清空微任务（Mircotasks）**：只要栈空了，事件循环会立即检查微任务队列。**它会一口气执行完所有的微任务**，直到该队列清空
- **渲染（Rendering）**：如果浏览器认为有必要（比如屏幕刷新率到了），会进行UI渲染
- **执行宏任务（Maccotasks）**：从任务队列中取出一个（且仅一个）任务放入调用栈执行
- **循环**：回到步骤2，循环往复

## 微任务

- **`Promise.then()` / `.catch()` / `.finally()`**（注意：`new Promise()` 内部的代码是同步执行的，只有回调是微任务）

- **`Async / Await`**（本质上是 Promise 的语法糖，`await` 后面的代码会被放入微任务）

- **`MutationObserver`**（Web API：用于监听 DOM 树的变化）

- **`queueMicrotask()`**（原生用于直接向微任务队列添加任务的方法）

- **`process.nextTick()`**（**仅限 Node.js 环境**，它的优先级比普通的微任务还要高，会最先被执行）

## 注意事项

- 微任务优于宏任务：在一个事件循环迭代中，当前宏任务执行完毕后，总是优先清空微任务队列，才会进行下一个宏任务

## 示例一

```js
console.log('1');

setTimeout(() => {
    console.log('2');
    Promise.resolve().then(() => {
        console.log('3');
    });
}, 0);

new Promise((resolve) => {
    console.log('4');
    resolve();
}).then(() => {
    console.log('5');
    setTimeout(() => {
        console.log('6');
    }, 0);
});

queueMicrotask(() => {
    console.log('7');
});

console.log('8');
```

$$
1 \rightarrow 4 \rightarrow 8 \rightarrow 5 \rightarrow 7 \rightarrow 2 \rightarrow 3 \rightarrow 6
$$

