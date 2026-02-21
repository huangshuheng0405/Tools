# ES6 类继承

1. `class`和`extends`关键字：使用`class`关键字定义类，使用`extends`关键字实现继承
2. 构造函数：使用`constructor`方法定义类的构造函数，用于初始化对象的属性，并通过`super`调用父类的构造函数
3. 不使用原型链，而是直接定义在类内部
4. `super`关键字用于子类中调用父类的方法，包括构造函数和普通函数

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  speak() {
    console.log(this.name + 'make a sound')
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }

  speak() {
    // 覆盖父类的函数
    console.log(this.name + ' wangwang')
  }
}

const myDog = new Dog('Buddy', 'golden')
myDog.speak()
```

## ES5 类继承

原型链继承：

```js
function Animal(name) {
  this.name = name
}

Animal.prototype.speak = function () {
  console.log(this.name + ' make a sound')
}

function Dog(breed) {
  this.breed = breed
}

Dog.prototype = new Animal('Unknow')

let myDog = new Dog('golden')
myDog.speak()
```

缺点：

- 属性共享： 子类共享了父类原型上的属性，一旦父类有引用类型，其中一个实例修改了这个引用类型的属性值，会影响所有其他的实例
- 不能传递参数：无法向父类构造函数传参，因为父类构造函数已经被调用
