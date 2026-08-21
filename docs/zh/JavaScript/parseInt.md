# parseInt

`parseInt(string, radix)`解析一个字符串并返回指定基数的十进制整数，`radix`是2-36之间的整数，表示被解析字符串的基数

```js
console.log(parseInt('123')) // 123 默认十进制
console.log(parseInt('123', 10)) // 123 指定十进制
console.log(parseInt('   123  ')) // 123 空格忽略
console.log(parseInt('077')) // 77 前导零忽略
console.log(parseInt('1.99')) // 1  小数部分被忽略
console.log(parseInt('ff', 16)) // 255 小写16进制
console.log(parseInt('0xFF', 16)) // 255 大写十六进制以0x为前缀
console.log(parseInt('xyz')) // NaN 不能被转换成整数
```
