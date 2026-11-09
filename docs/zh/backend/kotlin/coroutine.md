# Coroutine

协程：用同步的写法写异步代码

```kotlin
// 回调写法
api.getUser(userId, onSuccess = { user ->
    api.getAvatar(user.avatarId, onSuccess = { avatar ->
        runOnUiThread { imageView.setImageBitmap(avatar) }
    }, onError = { ... })
}, onError = { ... })

// 协程写法
lifecycleScope.launch {
    val user = api.getUser(userId)        // 挂起，不阻塞线程
    val avatar = api.getAvatar(user.avatarId)
    imageView.setImageBitmap(avatar)      // 自动回到主线程
}
```

