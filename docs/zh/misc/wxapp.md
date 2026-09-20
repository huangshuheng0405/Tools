# 微信小程序

## 事件传参

```html
<button
  bindtap="handleAddToCart"
  data-id="{{item.id}}"
  data-name="{{item.name}}"
>
  加入购物车
</button>
```

这里会把`item.id`、`item.name`放到`e.currentTarget.dataset`中。

```js
// 处理加入购物车事件
handleAddToCart(e) {
// 可以解构
  const { id, name } = e.currentTarget.dataset;
  console.log(id, name);
}
```

## wx.navigateTo

```js
// 跳转到购物车页面
const id = e.currentTarget.dataset.id

wx.navigateTo({
  url: `/pages/cart/index?id=${id}`,
})
```

购物车页面

```js
Page({
  onLoad(options) {
    const id = options.id
    console.log(id)
  },
})
```

## wx.request

```js [utils/request.js]
const BASE_URL = 'https://localhost:8080'

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const { method = 'GET', data = {}, showLoading = false } = options

    if (showLoading) {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
    }

    const token = wx.getStorageSync('token')

    wx.request({
      url: BASE_URL + url,
      method,
      data,

      header: {
        'Content-Type': 'application/json',
        token,
      },

      success(res) {
        if (showLoading) {
          wx.hideLoading()
        }

        if (res.statusCode === 200) {
          const result = res.data

          if (result.code === 200) {
            resolve(result)
          } else {
            wx.showToast({
              title: result.msg || '请求失败',
              icon: 'none',
            })

            reject(result)
          }

          return
        }

        // Token 过期，重新登录
        if (res.statusCode === 401) {
          wx.removeStorageSync('token')

          wx.showToast({
            title: '登录过期',
            icon: 'none',
          })

          reject(res)
          return
        }

        wx.showToast({
          title: '请求失败',
          icon: 'none',
        })
        reject(res)
      },
      fail(err) {
        if (showLoading) {
          wx.hideLoading()
        }

        wx.showToast({
          title: '请求失败',
          icon: 'none',
        })

        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
        })

        reject(err)
      },
    })
  })
}

module.exports = {
  request,
}
```

查询参数和请求参数都放`data`中，路径参数放`url`中
