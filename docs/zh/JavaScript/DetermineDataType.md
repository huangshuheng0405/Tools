# 如何判断JavaScript的数据类型

## typeof

可以用来确定一个值得基本数据类型，返回一个表示数据类型的字符串

```javascript
typeof '1' // string
typeof 1 // number
typeof true // boolean
typeof 123n // bigint
typeof undefined // undefined
typeof null // object
typeof Symbol('id') // symbol
typeof { a: 1 } // object
typeof [1, 2, 3] // object
typeof function () {} // function (特殊 虽然函数也是对象 但是 typeof 函数会返回 function)
typeof new Date() // object
```

> `typeof null`返回`object`是历史遗留问题，不是很准确

## Object.prototype.toString.call()

用于获取更详细的数据类型信息

```javascript
Object.prototype.toString.call(123) 			// '[object Number]'
Object.prototype.toString.call('hello') 		// '[object String]'
Object.prototype.toString.call(true) 			// '[object Boolean]'
Object.prototype.toString.call(undefined) 		// '[object Undefined]'
Object.prototype.toString.call(null) 			// '[object Null]'
Object.prototype.toString.call({ a: '1' }) 		// '[object Object]'
Object.prototype.toString.call([1, 2, 3]) 		// '[object Array]'
Object.prototype.toString.call(function () {}) 	// '[object Function]'
```

## instanceof

用于检查对象是否属于某个类的实例

```javascript
var obj = {}
obj instanceof Object // true
var arr = []
arr instanceof Array // true
function Person() {}
var p = new Person()
p instanceof Person // true
```

## Array.isArray

用于检查一个值是否为数组

```javascript
Array.isArray([]) // true
Array.isArray({}) // false
```
