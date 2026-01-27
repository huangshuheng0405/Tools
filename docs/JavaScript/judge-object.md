# 如何判断object为空

## 常见方法：

- `Object.keys(obj).length === 0`
- `JSON.stringify === '{}'`
- for in 判断

以上方法都是不太严谨，因为处理不了`const obj = {[Sumbol('a')]: 1}`
更严谨的方法：`Reflect.ownKeys(obj).length === 0`
