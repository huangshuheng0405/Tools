# ToPrimitive

## hint

### "string"

对象到字符串的转换，当我们对期望一个字符串的对象执行操作时，如“alert”：

```js
// 输出
alert(obj);

// 将对象作为属性键
anotherObj[obj] = 123;
```

### "number"

对象到数字的转换，例如我们进行数学运算时：

```js
// 显式转换
let num = Number(obj);

// 数学运算（除了二元加法）
let n = +obj; // 一元加法
let delta = date1 - date2;

// 小于/大于的比较
let greater = user1 > user2;
```

### "default"

在少数情况下发生，当运算符不确定期望值的类型时

例如，二元加法 `+` 可用于字符串（连接），也可以用于数字（相加）。因此，当二元加法得到对象类型的参数时，它将依据 `"default"` hint 来对其进行转换

此外，如果对象被用于与字符串、数字或 symbol 进行 `==` 比较，这时到底进行哪种转换也不是很明确，因此也应该使用 `"default"` hint

```js
// 二元加法使用默认 hint
let total = obj1 + obj2;

// obj == number 使用默认 hint
if (user == 1) { ... };
```

像 `<` 和 `>` 这样的小于/大于比较运算符，也可以同时用于字符串和数字。不过，它们使用 “number” hint，而不是 “default”。这是历史原因。

## Symbol.toPrimitive

它被用来给转换方法命名，像这样：

```js
obj[Symbol.toPrimitive] = function(hint) {
  // 这里是将此对象转换为原始值的代码
  // 它必须返回一个原始值
  // hint = "string"、"number" 或 "default" 中的一个
}
```

如果`Symbol.toPrimitive`方法存在，则它会被用于所有hint，无需其他方法

```js
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// 转换演示：
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // hint: default -> 1500
```

从代码中可以看到，根据不同的 hint，`user` 变成一个自描述字符串或者一个金额

`user[Symbol.toPrimitive]`方法处理了所有的转换情况

## toString/valueOf

如果没有`Symbol.toPrimitive`，那么JavaScript将寻找`toString`和`valueOf`方法：

- 对于`"string"`hint:调用`toString`方法。如果它不存在，则调用`valueOf`方法（因此，对于字符串转换，优先调用 `toString`）
- 对于其他hint：调用`valueOf`方法，如果它不存在，则调用`toString`方法（因此，对于数学运算，优先调用`valueOf`方法）

这些方法**必须返回一个原始值**，如果`toString`或`valueOf`返回**一个对象**，那么返回值会被忽略（和这里没有方法的时候相同）

默认情况下，普通对象都有`toString`和`valueOf`方法：

- `toString` 方法返回字符串 `"[object Object]"`（注意是小写 `object`）
- `valueOf`方法返回对象自身

示例：

```js
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true
```

在对象里重写这两个方法：

```js
let user = {
  name: "John",
  money: 1000,

  // 对于 hint="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // 对于 hint="number" 或 "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```

如果我们希望一个全能的地方处理所有的原始转换。这种情况下，我们可以只实现`toString`，就像这样：

```js
let user = {
  name: "John",

  toString() {
    return this.name;
  }
};

alert(user); // toString -> John
alert(user + 500); // toString -> John500
```

如果没有`Symbol.toPrimitive`和`valueOf`，`toString`将处理所有的原始转换

## 进一步的转换

如果我们将对象作为参数传递，则会出现两个运算阶段：

1. 对象被转换为原始值（通过前面我们描述的规则）
2. 如果我们还需要进一步的计算，则生成的原始值会被进一步转化

例如：

```js
let obj = {
  // toString 在没有其他方法的情况下处理所有转换
  toString() {
    return "2";
  }
};

alert(obj * 2); // 4，对象被转换为原始值字符串 "2"，之后它被乘法转换为数字 2。
```

1. 乘法`obj * 2`首先将对象转换为原始值（字符串“2”）
2. 之后`“2” * 2`变为`2 * 2`（字符串被转换为数字）

二元加法在同样的情况下会将其连接为字符串，因为它更愿意接受字符串：

```js
let obj = {
  toString() {
    return "2";
  }
};

alert(obj + 2); // "22"（对象先转为原始值字符串 "2"，再与 2 做字符串拼接）
```

## 总结

三种类型（hint）：

- `string`（对于`alert`和其他需要字符串的操作）
- `number`（对于数字运算）
- `default`

转换算法是：

1. 若存在 `obj[Symbol.toPrimitive]`，则调用 `obj[Symbol.toPrimitive](hint)`
2. 否则，若 hint 为 `string`：先调用 `obj.toString()`；若该方法不存在或返回值不是原始值，再调用 `obj.valueOf()`
3. 否则（hint 为 `number` 或 `default`）：先调用 `obj.valueOf()`；若该方法不存在或返回值不是原始值，再调用 `obj.toString()`

若某次调用得到原始值，转换结束；若方法不存在或返回对象，则按顺序尝试下一方法。若最终仍得不到原始值，则抛出 `TypeError`。
