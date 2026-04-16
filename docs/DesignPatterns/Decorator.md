# Decorator Pattern

核心思想：在不改变原对象结构和其源代码的前提下，动态地给对象添加额外的功能

## Code

```js [Decorator.js]
class Coffee {
  cost() {
    return 10
  }
  describe() {
    return '美式咖啡'
  }
}

// 装饰器基类
class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee
  }
  cost() {
    return this.coffee.cost()
  }
  describe() {
    return this.coffee.describe()
  }
}

// 具体装饰器：加奶
class MilkDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee)
  }
  cost() {
    return this.coffee.cost() + 5
  }
  describe() {
    return this.coffee.describe() + ',加奶'
  }
}

// 具体装饰器：加糖
class SugarDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee)
  }
  cost() {
    return this.coffee.cost() + 2
  }
  describe() {
    return this.coffee.describe() + ',加糖'
  }
}

let myCoffee = new Coffee()
myCoffee = new MilkDecorator(myCoffee) // 套上奶
myCoffee = new SugarDecorator(myCoffee) // 套上糖

console.log(myCoffee.describe())
console.log(myCoffee.cost()) // 17
```
