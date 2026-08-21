# Object.keys, values, entries

在`map`里，有`map.keys`，`map.values`，`map.entries`方法，这次方法是通用的

它们支持

- `Map`
- `Set`
- `Array`

普通对象也有类似的方法，但语法有些不同

- `Object.keys`：返回一个包含该对象所有键的数组
- `Object.values`：返回一个包含该对象所有值的数组
- `Object.entries`：返回一个包含该对象所有`[key,value]`的数组

跟`map`的区别

|          | Map          | Object                                  |
| -------- | ------------ | --------------------------------------- |
| 调用语法 | `map.keys()` | `Object.keys(obj)`，而不是 `obj.keys()` |
| 返回值   | 可迭代对象   | 数组                                    |

注意：

`Object.keys/values/entries`**会忽略 symbol 属性**

就像`for..in`循环一样，这些方法会忽略`Symbol(...)`作为键的属性

## 转化对象

对象缺少数组存在的许多方法，例如 `map` 和 `filter` 等。

如果我们想应用它们，那么我们可以使用 `Object.entries`，然后使用 `Object.fromEntries`：

1. 使用 `Object.entries(obj)` 从 `obj` 获取由键/值对组成的数组。
2. 对该数组使用数组方法，例如 `map`，对这些键/值对进行转换。
3. 对结果数组使用 `Object.fromEntries(array)` 方法，将结果转回成对象。

例如，我们有一个带有价格的对象，并想将它们加倍：