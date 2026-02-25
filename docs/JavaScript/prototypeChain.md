# 原型链

## 例1

```js
const Foo = function () {
  this.a = function () {
    console.log(2)
  }
}

Foo.prototype.a = function () {
  console.log(3)
}

Foo.a = function () {
  console.log(4)
}

let obj = new Foo()
obj.a() // 2
```

输出结果为2，当js尝试访问一个方法的属性时，首先会实例本身去寻找，找不到就会往`prototype`上找，foo实例本身就有a方法，所以就会直接执行，输出2

所以，当Foo没有a方法时，就会寻找prototype上的a方法，输出3

而Foo.a则是Foo的静态方法，通过`Foo.a()`直接执行，输出4
