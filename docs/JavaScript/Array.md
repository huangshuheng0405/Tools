# Array

## at

获取最后一个元素我们可以不必使用`fruits[fruits.length - 1]`，需要些两次遍历名

可以使用`fruits.at(-1)`

```js
let fruits = ['Apple', 'Orange', 'Plum']

// 与 fruits[fruits.length-1] 相同
alert(fruits.at(-1)) // Plum
```

`arr.at(i)`:

- 如果对于`i >= 0`，则与`arr[i]`完全相同
- 对于`i`为负数的情况，它则从数组的尾部向前数

## pop

取出并返回数组的最后一个元素

```js
let fruits = ['Apple', 'Orange', 'Pear']

alert(fruits.pop()) // 移除 "Pear" 然后 alert 显示出来

alert(fruits) // Apple, Orange
```

`fruits.pop()` 和 `fruits.at(-1)` 都返回数组的最后一个元素，但 `fruits.pop()` 同时也删除了数组的最后一个元素，进而修改了原数组。

## 不要使用 == 比较数组

回顾一下规则

- 仅当两个对象引用的是同一个对象时，它们才相等`==`
- 如果`==`左右两个参数之中有一个参数是对象，另一个参数是原始类型，那么该对象会被转换为原始类型，转换规则见[toPrimitive](./ToPrimitive.md)
- `null`和`undefined`相等，且各自不等于任何其他的值

如果我们用`==`来比较数组，除非我们比较的是两个引用同一数组的变量，否则它们永不相等

```js
console.log([] == []) // false
console.log([0] == [0]) // false
```

与原始类型比较会产生奇怪的效果

```js
console.log(0 == []) // true
console.log('0' == '') // false
```

对象的转换规则见[toPrimitive](./ToPrimitive.md)

```
console.log(0 == []) // true
// [] 会被转换为 ''
//  '' 再转换为 数字 0

console.log('0' == '') // false
// 没有进一步转换
```

## splice

可以做添加，删除和插入

语法：`arr.splice(start, deleteCount, elem1, elem2, ..., elemN)`

它从索引 `start` 开始修改 `arr`：删除 `deleteCount` 个元素并在当前位置插入 `elem1, ..., elemN`。最后返回被删除的元素所组成的数组。

## slice

语法：`arra.slice(start, end)`

