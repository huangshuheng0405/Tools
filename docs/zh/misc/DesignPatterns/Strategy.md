# Strategy Pattern

核心思想是：定义一系列算法，把他们一个个封装起来，并且使他们可以相互替换

通俗点来说，策略模式就是把原本写在`if...else`或`switch`里的逻辑拆出来，变成一个个独立的“插件”

## Why use Strategy Pattern

假设做一个年终奖计算器，不同表现等级的员工奖金倍数不同：

```javascript
const calculateBonus = (level, salary) => {
  if (level === 'S') return salary * 4
  if (level === 'A') return salary * 3
  if (level === 'B') return salary * 2
  // 如果以后多了 C、D 等级，或者 S 的倍数改了，你得不停修改这个函数
}
```

## Code

推荐写法：

```js [Strategy.js]
// 利用对象映射
const strategies = {
  S: (salary) => salary * 4,
  A: (salary) => salary * 3,
  B: (salary) => salary * 2,
  C: (salary) => salary * 1
}

/**
 * 环境调用 者
 * @param level 等级
 * @param salary 薪水
 * @returns {*|number} 奖金
 */
const calculateBonus = (level, salary) => {
  // 直接根据key获取对应的策略并执行
  return strategies[level] ? strategies[level](salary) : 0
}

console.log(calculateBonus('S', 2000))
console.log(calculateBonus('A', 2000))
console.log(calculateBonus('D', 2000))
```

## Apply

如果你表单有：非空校验、手机号校验、密码校验等，你可以用策略模式来实现。

如果不加策略模式：你会写出一个长达200行的`submit`函数，里面全是`if...else`或`switch`语句。

使用策略模式：

1. 创建一个`validatorStrategies`对象，里面包含`isNonEmpty`,`minLength`,`isMobile`等函数
2. 在提交时，遍历配置好的规则，动态调用这些策略

---

当你使用高德地图从A点到B点时：

- 步行
- 驾车
- 骑行

地图软件不会把所有逻辑写在一个巨大的函数里，而是每个模式都有独立的计算模块
