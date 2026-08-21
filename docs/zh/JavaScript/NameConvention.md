# 命名规范

## 基本命名规则

### 合法字符

JavaScript 变量名可以包含以下字符：

| 字符类型      | 可用于开头 | 可用于中间 | 示例              |
| ------------- | ---------- | ---------- | ----------------- |
| 字母 a-z, A-Z | 是         | 是         | name, Name        |
| 数字 0-9      | 否         | 是         | count1, item2     |
| 下划线 \_     | 是         | 是         | \_private, my_var |
| 美元符号 $    | 是         | 是         | $element, price$  |
| Unicode 字符  | 是         | 是         | 用户名, café      |

```js
// 合法的变量名
let name = '张三'
let _private = '私有'
let $element = document.body
let count1 = 0
let firstName = 'John'
let 用户名 = '李四' // 合法但不推荐

// 不合法的变量名
// let 1name = 'error';     // 不能以数字开头
// let my-name = 'error';   // 不能包含连字符
// let my name = 'error';   // 不能包含空格
// let class = 'error';     // 不能使用保留字
```

### 保留字限制

js的保留字不能做变量名，例如class，let，const等

### 大小写敏感

js的变量名是大小写敏感的，例如name和Name是不同的变量名

## 命名约定

### 小驼峰命名法（camelCase）

用变量名和函数名时，第一个单词小写，后续单词首字母大写

```js
// 变量
let firstName = '张'
let lastName = '三'
let dateOfBirth = '1990-01-01'
let isActive = true
let hasPermission = false

// 函数
function getUserById(id) {
  // ...
}

function calculateTotalPrice(items) {
  // ...
}

function formatDateString(date) {
  // ...
}
```

### 大驼峰命名法（PascalCase）

用类名和构造函数名时，每个单词的首字母都大写

```js
// 类
class UserAccount {
  constructor(name) {
    this.name = name
  }
}

class ShoppingCart {
  constructor() {
    this.items = []
  }
}

// 构造函数（ES5 风格）
function Person(name, age) {
  this.name = name
  this.age = age
}

// 组件（如 React）
function UserProfile({ user }) {
  return <div>{user.name}</div>
}
```

### 全大写下划线分隔（SCREAMING_SNAKE_CASE）

用常量名时，所有字母都大写，单词之间用下划线分隔

```js
// 配置常量
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3
const DEFAULT_TIMEOUT = 5000
const HTTP_STATUS_OK = 200

// 环境变量
const NODE_ENV = process.env.NODE_ENV
const DATABASE_URL = process.env.DATABASE_URL

// 枚举值
const USER_ROLE = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
}
```

### 下划线前缀

用于私有变量或内部使用的变量

```js
class BankAccount {
  constructor(balance) {
    this._balance = balance // 私有属性（约定）
  }

  _validateAmount(amount) {
    // 私有方法（约定）
    return amount > 0
  }

  deposit(amount) {
    if (this._validateAmount(amount)) {
      this._balance += amount
    }
  }

  getBalance() {
    return this._balance
  }
}

// ES2022 真正的私有字段
class ModernBankAccount {
  #balance // 真正的私有

  constructor(balance) {
    this.#balance = balance
  }

  #validateAmount(amount) {
    // 真正的私有方法
    return amount > 0
  }

  getBalance() {
    return this.#balance
  }
}
```

##　语义化命名

### 布尔值命名

```js
// 使用 is 前缀
let isActive = true
let isVisible = false
let isLoading = true
let isValid = false

// 使用 has 前缀
let hasPermission = true
let hasChildren = false
let hasError = true

// 使用 can 前缀
let canEdit = true
let canDelete = false

// 使用 should 前缀
let shouldUpdate = true
let shouldRender = false

// 避免否定命名
// 不好
let isNotActive = false // 双重否定容易混淆

// 好
let isActive = true
```

### 数组命名

数组变量用复数形式

```js
// 使用复数
const users = ['张三', '李四', '王五']
const items = [1, 2, 3, 4, 5]
const products = []
const selectedIds = [1, 2, 3]

// 或使用 List 后缀
const userList = []
const itemList = []

// 避免单数
// 不好
const user = ['张三', '李四'] // 容易误解为单个用户

// 好
const users = ['张三', '李四']
```

### 函数命名

函数名应该是动词或动词短语

```js
// 获取数据
function getUser(id) {}
function fetchProducts() {}
function loadConfiguration() {}

// 设置数据
function setName(name) {}
function updateUser(user) {}
function saveSettings(settings) {}

// 计算
function calculateTotal(items) {}
function computeAverage(numbers) {}

// 检查/验证
function isValid(value) {}
function hasPermission(user) {}
function validateEmail(email) {}
function checkAvailability(item) {}

// 转换
function formatDate(date) {}
function parseJSON(str) {}
function convertToNumber(value) {}

// 事件处理
function handleClick(event) {}
function onSubmit(form) {}
function onChange(value) {}
```

### 对象和类命名

使用名词表示实体

```js
// 实体类
class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }
}

class Product {
  constructor(name, price) {
    this.name = name
    this.price = price
  }
}

// 服务类
class UserService {
  getUser(id) {}
  createUser(data) {}
}

class PaymentService {
  processPayment(order) {}
}

// 工具类
class StringUtils {
  static capitalize(str) {}
  static truncate(str, length) {}
}

// 对象
const userConfig = {
  theme: 'dark',
  language: 'zh-CN'
}

const apiResponse = {
  data: [],
  status: 200
}
```
