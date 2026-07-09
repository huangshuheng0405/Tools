# FormData

## 定义

**FormData** 是浏览器提供的 Web API，用于通过程序构造一组键值对，用来模拟 HTML 表单。它可以方便地通过 `fetch` 或 `XMLHttpRequest` 发送数据，并且天然支持文件上传。

## 创建 FormData

```js
// 1. 创建一个空的 FormData 对象
const formData = new FormData()

// 2. 基于已有的 HTML 表单元素创建
const form = document.querySelector('form')
const formData = new FormData(form) // 自动收集表单内所有带 name 属性的字段
```

## 常用方法

### `append(name, value)` / `append(name, value, filename)`

添加一个字段，**同名不覆盖**，会保留多个值。

```js
formData.append('username', 'john')
formData.append('hobbies', 'reading')
formData.append('hobbies', 'coding') // 'hobbies' 现在有两个值
```

### `set(name, value)` / `set(name, value, filename)`

设置一个字段，**同名会覆盖**旧值。

```js
formData.set('username', 'john')
formData.set('username', 'jane') // username 变成 'jane'，只有一个值
```

### `get(name)`

获取指定字段的**第一个值**，找不到返回 `null`。

```js
formData.append('color', 'red')
formData.append('color', 'blue')
formData.get('color') // 'red'
```

### `getAll(name)`

获取指定字段的**所有值**，返回数组。

```js
formData.append('color', 'red')
formData.append('color', 'blue')
formData.getAll('color') // ['red', 'blue']
```

### `has(name)`

检查是否存在某个字段，返回 `boolean`。

```js
formData.has('username') // true / false
```

### `delete(name)`

删除指定字段的所有值。

```js
formData.delete('username')
```

### `entries()` / `keys()` / `values()`

返回 **Iterator**，可用 `for...of` 遍历。

```js
for (const [key, value] of formData.entries()) {
  console.log(key, value)
}

for (const key of formData.keys()) {
  console.log(key)
}

for (const value of formData.values()) {
  console.log(value)
}
```

### `forEach(callback)`

```js
formData.forEach((value, key) => {
  console.log(key, value)
})
```

## 发送 FormData

### 使用 fetch

```js
const formData = new FormData()
formData.append('username', 'john')
formData.append('avatar', fileInput.files[0]) // 文件

fetch('/api/upload', {
  method: 'POST',
  body: formData // 不需要设置 Content-Type，浏览器会自动设置 boundary
})
```

### 使用 XMLHttpRequest

```js
const xhr = new XMLHttpRequest()
xhr.open('POST', '/api/upload')
xhr.send(formData) // 同样不需要手动设置 Content-Type
```

> **注意：** 不要手动设置 `Content-Type` 为 `multipart/form-data`，浏览器会自动添加正确的 `boundary` 参数。手动设置会导致缺少 `boundary`，服务端无法正确解析。

## 文件上传

FormData 原生支持 Blob 和 File 对象：

```js
const formData = new FormData()
// 从 input[type=file] 获取文件
formData.append('file', fileInput.files[0])
// 第三个参数可以指定文件名
formData.append('file', blobData, 'custom-filename.png')
```

## 格式转换

### FormData → 普通对象

```js
function formDataToObject(formData) {
  const obj = {}
  formData.forEach((value, key) => {
    if (key in obj) {
      // 已存在则转为数组
      obj[key] = [].concat(obj[key], value)
    } else {
      obj[key] = value
    }
  })
  return obj
}
```

### 普通对象 → FormData

```js
function objectToFormData(obj) {
  const formData = new FormData()
  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value)
  })
  return formData
}
```

### FormData → JSON 字符串

```js
const json = JSON.stringify(formDataToObject(formData))
```

### 打印 FormData 内容（用于调试）

FormData 无法直接用 `console.log` 查看内容：

```js
// 正确方式：转为对象再打印
console.log(formDataToObject(formData))
// 或遍历
for (const [k, v] of formData.entries()) {
  console.log(k, v)
}
```

## 注意事项

- **`append` 可重复添加同名键，`set` 会覆盖**：需要多选值时用 `append`，单选时用 `set`。
- **不要手动设置 `Content-Type`**：浏览器会根据 FormData 自动生成带有 `boundary` 的 `multipart/form-data` 头。
- **值类型支持**：字段值可以是 `String`、`Blob`（含 `File`），其他类型会被自动转为字符串。
- **`console.log(formData)` 看不到内容**：FormData 是不可见的，需要用 `forEach` / `entries()` 或在浏览器 Network 面板查看请求体。
- **Node.js 环境**：FormData 在 Node.js 18+ 原生支持（`globalThis.FormData`），旧版本需要 `form-data` 或 `undici`。
