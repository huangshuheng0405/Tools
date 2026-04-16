# effect

## 参数总览

```js
effect(fn, {
  scheduler,
  lazy,
  onTrack,
  onTrigger
})
```

- fn 副作用函数（必须）
- scheduler 调度执行
- lazy 是否懒执行
- onTrack 依赖收集时触发（调试用）
- onTrigger 依赖时触发（调试用）
