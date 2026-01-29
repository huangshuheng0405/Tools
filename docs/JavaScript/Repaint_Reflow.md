# 重排和重绘

- 重排（Reflow）：当 DOM 元素的几何属性发生变化时，浏览器需要重新计算元素的位置和大小，这个过程称为重排。如改变元素的宽度、高度、位置等。
- 重绘（Repaint）：当元素的外观发生变化时，浏览器需要重新绘制元素，这个过程称为重绘。如改变元素的颜色、背景等。
- 回流的成本比重绘高得多，因为它涉及重新计算元素的几何属性和页面布局。而重绘只需要重新绘制已计算好的元素样式
- 如何减少：
  - 使用CSS动画代替JavaScript动画：CSS动画是在GPU上进行渲染的，而JavaScript动画是在CPU上进行渲染的。因此，CSS动画的性能要优于JavaScript动画。使用CSS的`transform`和`opacity`属性来创建动画效果，而不是改变元素的布局属性，如宽度、高度等。
  - 使用`translate3d`开启硬件加速：将元素的位移属性设置为`translate3d(0, 0, 0)`，可以强制使用GPU加速。这有助于避免回流，并提高动画的流畅度。
  - 避免频繁操作影响布局的样式属性：当需要对元素进行多次样式修改时，应该将这些修改合并为一次操作，通过添加/移除CSS类来一次改变多个样式属性，而不是逐个修改
  - 使用文档片段（Document Fragment）：当需要向DOM中插入大量新元素时，可以先将这些元素添加到文档片段中，然后再将整个文档一次性插入到DOM中。这样做可以减少回流次数。（Vue底层）

## 文档片段

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <ul id="box"></ul>

    <script>
      //   let ul = document.getElementById('box')

      //   for (let i = 0; i < 10; i++) {
      //     let li = document.createElement('li')
      //     li.innerHTML = `idnex: ${i}`
      //     ul.appendChild(li)
      //   }

      let ul = document.getElementById('box')
      let fragment = document.createDocumentFragment()
      for (let i = 0; i < 20; i++) {
        let li = document.createElement('li')
        li.innerHTML = `idnex: ${i}`
        fragment.appendChild(li)
      }
      ul.appendChild(fragment)
    </script>
  </body>
</html>
```

场景一

```js
const box = document.getElementById('box')
const ol = box.offsetLeft // 强制出发了一次 dirty = false
box.style.left = ol + 100 + 'px' // dirty = true
const ot = box.offsetTop // 强制触发了一次 dirty = false
box.style.top = ot + 100 + 'px' // dirty = true

// if (dirty) { layout() } 触发一次
```

答案：触发了3次回流

优化方案：

```js
const box = document.getElementById('box')
const ol = box.offsetLeft // 强制触发了一次 dirty = false
const ot = box.offsetTop // if (dirty) { layout() }
box.style.left = ol + 100 + 'px' // 记录变化 dirty = true
box.style.top = ot + 100 + 'px' // 记录变化

// if (dirty) { layout() } // 触发一次
```

答案：触发两次（利用合并特性，减少一次）
