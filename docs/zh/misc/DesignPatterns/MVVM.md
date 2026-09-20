# MVVM

Model-View-ViewModel，旨在通过“数据绑定”讲图形界面的开发与业务逻辑的开发完全分离

## Code

```js [MVVM.js]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <!-- View 层 -->
    <input id="input" type="text" />
    <div id="content"></div>
  </body>
  <script type="text/javascript">
    window.onload = () => {
      // Model 层
      const data = {
        inputVal: '',
      }

      // ViewModel 层
      const input = document.getElementById('input')
      input.addEventListener('input', (e) => {
        proxy.inputVal = input.value
        console.log('input val', input.value)
      })

      const proxy = new Proxy(data, {
        // 目标对象 属性名 属性值
        set(target, p, newValue) {
          if (p === 'inputVal') {
            const content = document.getElementById('content')
            content.innerHTML = newValue
          }
        },
      })
    }
  </script>
</html>


```

## Conclusion

1. **Input改变** -> 修改**Proxy**
2. **Proxy被修改** -> 触发**set拦截器**
3. **拦截器** -> 修改**DOM内容**

MVVM的核心特征：**数据双向绑定**

1. View -> Model
   用户在输入框打字 -> 触发`input`事件 -> 代码修改`proxy.inputVal`（Model更新）
2. Model -> View
   proxy.inputVal 被修改 -> 触发`set`拦截器 -> 代码修改`content.innerHTML`（View更新）
