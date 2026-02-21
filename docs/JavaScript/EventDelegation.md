# 事件委托

将事件处理程序附加到一个祖先元素上，而不是直接附加到每个子元素上，当事件在子元素上冒泡时，祖先元素捕获事件并根据事件目标来确定如何处理事件

- 只需要为一个祖先元素添加一个事件处理程序，降低内存消耗和提升元素性能
- 代码简洁可维护
- 在祖先元素上处理多个事件类型，提高灵活性

```js
const ulElement = document.querySelector('ul')
ulElement.addEventListener('click', function(event)) {
    if (event.target.tagName === "LI") {
        // ...
    }
}
```
