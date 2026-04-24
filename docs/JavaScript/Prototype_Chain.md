# Prototype Chain

要了解原型链，首先要知道`prototype`和`__proto__`

## prototype

实例都有一个构造函数属性（`constructor`）指向构造函数，通过构造函数创建的对象拥有构造函数内部定义的属性和方法

```js
function Test(name, age) {
  this.name = name
  this.age = age
}

Test.prototype.say = function () {
  console.log('say')
}

let obj = new Test('xiaoming', 20)
let obj2 = new Test('xiaohong', 21)

console.log(obj.constructor === Test) // true
console.log(obj2.constructor === Test) // true
console.log(obj.constructor === obj2.constructor) // true
```

在js中，每一个对象（函数也是对象）都有一个特殊的属性叫原型（`prototype`），它指向另一个对象，这个对象（`Test.prototype`）被称为原型对象，原型对象是用来共享属性和方法的

```js
function Test(name, age) {
  this.name = name
  this.age = age
}

Test.prototype.say = function () {
  console.log('我能说话')
}
var obj3 = new Test('Jack', 26)
var obj4 = new Test('Rose', 25)

obj3.say() // 我能说话
obj4.say() // 我能说话
console.log(obj3.say === obj4.say) // true
```

## \_\_proto\_\_

每个对象都有一个\_\_proto\_\_属性，被称为隐式原型

```js
console.log(obj3.__proto__ === Test.prototype) // true
```

每个js对象的`__proto__`，它指向创建**它的构造函数的原型对象**

`__proto__`的意义在于为原型链查找提供方向，原型链查找靠的是`__proto__`，而不是`prototype`

![](/JavaScript/prototype.png)

## prototype chain

`Test.prototype`当然也存在属性`__proto__`，那么`Test.prototype.__proto__`是谁呢

```js
console.log(Test.prototype.__proto__ === Object.prototype) // true
```

所有的对象，包括构造函数的原型对象，最终都是继承自`Object.prototype`，这是`js`原型链的**顶点**

`Object.prototype`作为原型链的顶端，因此，`Object.prototype.__proto__`指向`null`，表示原型链的**终点**

```js
console.log(Object.prototype.__proto__ === null) // true
```

![](/JavaScript/prototype2.png)

每一个对象都有一个原型（`prototype`）指向另一个对象，而这个对象又存在属性（`__proto__`）另一个对象

当我们访问一个对象的属性时，会先在**自己的属性**中查找，没找到就会沿着`__proto__`一路**向上找**。最终形成一个**链式结构**，称为**原型链**

## 进阶

### 原型链机制

还记得`__proto__`存在的意义时为原型链查找提供方向
![](/JavaScript/prototype4.png)

### Function的原型

`Function.prototype === Function.__proto__`

按照刚才的结论，函数对象的`__proto__`应该指向`Function.prototype`（即`function.prototype.__proto__ === function.prototype`），但是自己指向自己没有意义。别忘记`Object.prototype`才是原型链的终点，指向`Object.prototype`能保证原型链存在终点，所以`Function.prototype.__proto__ === Object.prototype`

![](/JavaScript/prototype3.png)

如果再深究一点，Object也是函数对象，`Object.__proto__ `也会指向`Function.prototype`

构造函数`Test`也有`constructor`属性，这个属性指向创建该函数的构造函数；如果自己没有构造函数，会指向`Function`

原型链就成了这样：
![](/JavaScript/prototype5.png)

在构造函数Test上访问`Object.prototype`中的属性时，其实是顺着`Test.__proto__`从`Function`去访问的

```js
function Test(name, age){
    this.name = name
    this.age = age
}
var obj = new Test('Jack', 26)
 
Object.prototype.price = 2000
 
Function.prototype.price = 300
 
Test.price // 300
```

若`Function.prototype`上没有`price`，才会往上找到`Object.prototype`
