# 事件冒泡和事件捕获

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .parent {
        padding: 20px;
        background-color: lightgray;
      }
      .child {
        padding: 20px;
        background-color: lightblue;
      }
    </style>
  </head>
  <body>
    <div class="parent">
      <div class="child"><button id="btn">click me</button></div>
    </div>

    <script>
      const parent = document.querySelector('.parent')
      const child = document.querySelector('.child')
      const btn = document.getElementById('btn')

      parent.addEventListener(
        'click',
        (e) => {
          console.log('parent')
        },
        true
      ) // 事件捕获

      child.addEventListener('click', (e) => {
        console.log('child')
      }) //  事件冒泡

      btn.addEventListener('click', (e) => {
        console.log('button')
        e.stopPropagation() // 阻止事件冒泡
      }) // 事件冒泡
    </script>
  </body>
</html>
```

如果`parent`不启用事件捕获，点击按钮不会打印`parent`
