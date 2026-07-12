# 事件委托

事件委托也叫**事件代理**，一种高性能事件处理模式

简单来说，**不在子元素（比如每个`<li>`）上单独设置事件监听器，而是把事件监听器设置在它们共同的父元素（比如`<ul>`）上，由父元素统一监听和处理子元素的事件**

## 底层原理

得益于浏览器的**冒泡事件（Event Bubbling）**机制

当你在页面上点击一个按钮时，点击事件不仅发生在这个按钮上，还会像水底的气泡一样，一层一层往上传递给它的爸爸、爷爷，直到最外层的 `document` 和 `window`。

例如

- 用户点击了最里面的子元素`<ul>`
- 事件向上传递，触发父元素`<ul>`的点击事件
- 时间继续传递，触发爷爷元素`<div id="app">`的点击事件
- 一直向上 传递到`<body>`，`<document>`，最后到`window`

## 示例

传统方法

```js
// 如果列表有 1000 个商品，浏览器要在内存里创建 1000 个监听器函数
const items = document.querySelectorAll('li');
items.forEach(item => {
  item.addEventListener('click', function() {
    console.log(this.innerText);
  });
});
```

缺点：浪费内存，且如果后续通过JS动态新增了一个`<li>`，这个新元素没有绑定事件，点击毫无反应

优化方法：事件委托只给父元素绑定

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
      <li>7</li>
      <li>8</li>
      <li>9</li>
      <li>10</li>
    </ul>

    <script>
      const ul = document.querySelector('ul')

      ul.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          console.log(e.target.innerText)
        }
      })
    </script>
  </body>
</html>

```

## 注意事项

### 嵌套子元素的处理

如果你的 `<li>` 里面还包了其他标签（比如 `<li><span>商品名</span><i>图标</i></li>`），用户点击了 `<span>` 时，`event.target` 就会变成 `SPAN`，此时上面的 `event.target.tagName === 'LI'` 判断就会**失效**！

*解决方案*：使用 `element.closest()` 方法，向上寻找最近的符合条件的祖先元素：

```js
list.addEventListener('click', function(event) {
  // 寻找点击元素本身或其祖先中最近的 li 标签，直到找到 ul 为止
  const li = event.target.closest('li');
  
  // 确保找到了 li，并且这个 li 确实属于当前的 ul（防止跑到外面去）
  if (li && list.contains(li)) {
    console.log(li.innerText);
  }
});
```

### 不是所有事件都能委托

不支持冒泡的常见事件：`focus`、`blur`、`mouseenter`、`mouseleave`

如果非要委托 `focus/blur`，可以使用它们对应的支持冒泡的兄弟事件：`focusin` 和 `focusout`。
