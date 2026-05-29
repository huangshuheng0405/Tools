# 图片懒加载

## Intersection Observer API

只有当图片即将进入视口范围时才进行加载。这可以大大减轻页面 的加载时间，并降低带宽消耗，提高了用户的体验。

```js
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div style="height: 1000px"></div>
    <img
      class="lazy"
      data-src="./na.jpg"
      alt=""
      style="width: 100px; height: 100px"
    />

    <script>
      const lazyImages = document.querySelectorAll('.lazy')
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            observer.unobserve(img)
          }
        })
      })

      lazyImages.forEach((img) => {
        observer.observe(img)
      })
    </script>
  </body>
</html>

```

一定要用`data-src`而不是`src`，如果直接写`src`会直接加载图片