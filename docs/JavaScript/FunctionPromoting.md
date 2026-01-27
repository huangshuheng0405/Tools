# 变量提升 & 函数提升（优先级）

```js
console.log(a)
var a = 10
function a() {}
console.log(a)

// 答案
[function: a]
10
```

- var变量提升
- 优先级：函数提升 > 变量提升
- 代码演变

```js
function a() {}
console.log(a)
var a = 10
console.log(a)
```
