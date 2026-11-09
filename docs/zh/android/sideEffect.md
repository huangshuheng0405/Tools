# 副作用

Composable的本职是根据状态描述界面，应该是纯的、幂等的、无副作用的。但真实的应用总要做这些

- 发起网络请求、读数据库
- 注册/注销监听器、广播接收器
- 弹Toast、跳转页面
- 启动协程、定时器
- 打日志、埋点
- 操作第三方View或系统API

**为什么不能直接写在Composable里**

因为Composable会被反复执行（重组）

```kotlin
@Composable
fun BadScreen() {
    // ❌ 每次重组都发一次请求
    val data = api.fetchData()

    // ❌ 每次重组都弹一次 Toast
    Toast.makeText(context, "Hello", Toast.LENGTH_SHORT).show()

    // ❌ 每次重组都注册一个新监听器，从不注销
    sensorManager.registerListener(...)

    Text(data)
}
```

重组可能因为：

- 状态变化
- 父组件重组
- 配置变更
- 动画每一帧

所以Compose提供了一组**Effect API**，

## LaunchedEffect

在组合中启动一个协程，用于异步副作用（最常用）

```kotlin
@Composable
fun UserScreen(userId: String) {
    var user by remember { mutableStateOf<User?>(null) }

    LaunchedEffect(userId) {          // key = userId
        user = repository.loadUser(userId)   // suspend 调用
    }

    user?.let { Text(it.name) }
}
```

- 进入组合时启动，执行`block`里的协程
- key变化时，取消旧协程，用新key重新启动
- 离开组合时，自动取消协程
- `key`可以是任何数量参数：`LaunchedEffect(a, b, c) {}`
- key用`Unit`表示只执行一次（进入组合时）

常见场景

```kotlin
// 1. 首次加载
LaunchedEffect(Unit) { viewModel.load() }

// 2. 参数变化时重新请求
LaunchedEffect(userId) { viewModel.loadUser(userId) }

// 3. 防抖搜索
LaunchedEffect(query) {
    delay(300)
    viewModel.search(query)
}

// 4. 显示 Snackbar
LaunchedEffect(errorMessage) {
    if (errorMessage != null) {
        snackbarHostState.showSnackbar(errorMessage)
    }
}

// 5. 启动定时器
LaunchedEffect(isRunning) {
    while (isRunning) {
        delay(1000)
        tick()
    }
}
```

## rememberCoroutineScope

`LaunchedEffect`是进入组合时**自动启动**的协程。但很多副作用是用**户点击、滚动触发**的，这时用到`rememberCoroutineScope`

```kotlin
@Composable
fun ScrollToTopButton(listState: LazyListState) {
    val scope = rememberCoroutineScope()

    Button(onClick = {
        scope.launch {
            listState.animateScrollToItem(0)
        }
    }) {
        Text("回到顶部")
    }
}
```

- 返回一个`CoroutineScope`，与当前组合的生命周期绑定
- 组合离开时，这个scope的协程自动取消
- 适合**事件驱动**的协程，而不是进入组合就执行的协程
- 不要再Composable函数体直接调用，应该在`onClick`等回调里用

