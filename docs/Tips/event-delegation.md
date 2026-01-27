# 事件委托 (Event Delegation)

事件委托（Event Delegation）是一种利用事件冒泡机制来优化事件处理的技术。

## 什么是事件委托？

在 DOM 中，事件会从目标元素向上传播到父级元素（这称为“事件冒泡”）。事件委托就是利用这一特性，将事件监听器绑定到**父元素**上，而不是绑定到每个子元素上。当子元素触发事件时，事件会冒泡到父元素，父元素可以通过 `event.target` 来判断是哪个子元素触发了事件。

## 为什么要使用事件委托？

1.  **减少内存消耗**：如果一个列表中有 1000 个列表项，为每个项添加一个事件监听器需要创建 1000 个函数对象。而使用事件委托，只需要在父元素上添加 1 个监听器。
2.  **动态元素处理**：如果列表项是动态添加或删除的，使用事件委托不需要手动为新元素绑定事件或为删除的元素解绑事件。

## 原生 JavaScript 示例

假设我们有一个列表：

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

### 不使用委托（反面教材）

```javascript
const items = document.querySelectorAll('li');
items.forEach(item => {
  item.addEventListener('click', e => {
    console.log('Clicked:', e.target.innerText);
  });
});
```
*缺点：如果有新元素添加进来，需要重新绑定；内存占用高。*

### 使用委托（推荐）

```javascript
const list = document.getElementById('list');

list.addEventListener('click', function(e) {
  // e.target 是实际点击的元素
  // e.currentTarget 是绑定事件的元素 (ul#list)
  
  // 检查点击的是否是 li 元素
  if (e.target && e.target.nodeName === 'LI') {
    console.log('Clicked:', e.target.innerText);
  }
});
```

## 处理嵌套元素

如果 `<li>` 内部还有其他标签（如 `<span>`），点击 `<span>` 时 `e.target` 就是 `<span>`，而不是 `<li>`。这时直接判断 `nodeName === 'LI'` 会失败。

我们可以使用 `closest()` 方法来查找最近的匹配祖先元素：

```javascript
list.addEventListener('click', function(e) {
  // 查找被点击元素最近的 li 祖先（包括自身）
  const li = e.target.closest('li');
  
  // 确保找到的 li 确实是在我们的 list 容器内
  if (li && list.contains(li)) {
    console.log('Clicked li:', li.innerText);
  }
});
```

## Vue 中的事件委托

在 Vue 中，我们通常使用 `v-for` 直接在元素上绑定 `@click`，Vue 内部已经做了优化，并且会自动处理事件解绑。

```vue
<ul>
  <li v-for="item in list" :key="item.id" @click="handleClick(item)">
    {{ item.text }}
  </li>
</ul>
```

虽然 Vue 的写法看起来像是给每个元素绑定了事件，但在处理大量数据（如虚拟列表）或极其复杂的交互时，手动在父组件实现事件委托仍然是一个可选的优化手段。

你也可以使用事件修饰符来控制事件行为，例如 `.self` 只有点击元素本身时才触发：

```vue
<!-- 只有点击 div 本身时触发，点击子元素不触发 -->
<div @click.self="doSomething">...</div>
```
