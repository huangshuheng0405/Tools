# prototype 和 **proto**

## `prototype`

只有函数（Function）对象才有这个属性（普通对象没有）

作用：它是函数作为构造函数时，为其实例化出来的对象定义的**公共祖先**

## `__proto__`

几乎所有对象（包括函数、数组、普通对象）都有这个属性

作用：它是对象指向其构造函数`prototype`的指针。当你访问一个对象没有的属性时，JavaScript引擎就会顺着`__proto__`往上找，直到找到`null`为止

## 关系

当`new`关键字创建一个实例时，JavaScript会进行如下绑定：

实例.**proto** === 构造函数.prototype

## 示例

```js
function Robot(name) {
  this.name = name
}

Robot.prototype.sayHi = function () {
  console.log('Hi, I am ' + this.name)
}

const robot = new Robot('robot')

console.log(robot.prototype) // 作为一个对象 没有 prototype

console.log(robot.__proto__ === Robot.prototype) // true

robot.sayHi() // robot 本身没有这个方法 顺着 __proto__ 去 Robot.prototype 找到 sayHi 方法
```

当访问`robot.toString()`时：

1. 引擎检查`robot`自身（没有）
2. 引擎通过`robot.__proto__`找到`Robot.prototype`（也没有）
3. 引擎再通过`Robot.prototype.__proto__`找到`Object.prototype`（找到了）
4. 如果还没找到，最后会指向`null`，返回`undefined`
