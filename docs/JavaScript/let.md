# let声明变量的特性

## 块级作用域

```javascript
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 1000)
}
```

1秒后输出10个10，循环体变量i会渗透到循环体外部，所以在setTimeout 1秒后访问到的i都是10

```javascript
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 1000)
}
```

变成let定义之后，问题会消失，正常在1秒后，输出0-9，因为let是块级作用域，仅限于循环体内部

```javascript
for (let i = 0; i < 10; i++) {
  ;(function (index) {
    setTimeout(() => {
      console.log(index)
    }, 1000)
  })(i)
}
```

如果var定义，可通过在循环体内部添加一个立即执行函数，把迭代变量的作用域保护起来

## 暂时性死区

在let声明之前的执行瞬间被称为‘暂时性死区’（Temporal Dead Zone, TDZ），在TDZ中，访问该变量会抛出ReferenceError错误

```js
{
  a = 1
  let a = 10
}
```

## 同级作用域下不能重复声明变量

```js
{
  let a = 10
  let a = 100 // SyntaxError: Identifier 'a' has already been declared
}
```

## 全局作用域下let声明的变量不会挂载到window对象上

```js
{
  let a = 10
}
console.log(a) // ReferenceError: a is not defined
```
