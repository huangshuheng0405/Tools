# Scaffold

`Scaffold`是Material Design里的页面骨架组件，

## 核心参数

```kotlin
@Composable
fun Scaffold(
    modifier: Modifier = Modifier,
    topBar: @Composable () -> Unit = {},
    bottomBar: @Composable () -> Unit = {},
    snackbarHost: @Composable () -> Unit = {},
    floatingActionButton: @Composable () -> Unit = {},
    floatingActionButtonPosition: FabPosition = FabPosition.End,
    containerColor: Color = MaterialTheme.colorScheme.background,
    contentColor: Color = contentColorFor(containerColor),
    contentWindowInsets: WindowInsets = ScaffoldDefaults.contentWindowInsets,
    content: @Composable (PaddingValues) -> Unit
)
```

| 参数                 | 作用                                        |
| -------------------- | ------------------------------------------- |
| `topBar`               | 顶部栏，通常放TopAppBar                     |
| `bottomBar`           | 底部栏，通常放NavigationBar/BottomAppBar    |
| `snackbarHost`         | SnackBar宿主，通常放SnackbarHost(hostState) |
| `floatingActionButton` | 悬浮按钮，自动定位到右下角                  |
| `content`              | **页面主体内容**，接受一个`PaddingValues`   |
|                      |                                             |
|                      |                                             |

最关键：`content: @Composable(PaddingValues) -> Unit`，这个`PaddingValues`是Scaffold算出来的**内容安全区**


## 示例

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(
        // 顶部栏 显示标题 Home
        topBar = {
            TopAppBar(title = { Text("Home") })
        },
        // 默认位置在 底部 FAB bottomBar 上面
        snackbarHost = { SnackbarHost(snackbarHostState) },
        // 右下角悬浮按钮
        floatingActionButton = {
            FloatingActionButton(onClick = {
                // 点击 FAB 后 在协程触发 Snackbar
                scope.launch {
                    // showSnackbar 是 suspend 函数
                    snackbarHostState.showSnackbar(
                        "点击了 FAB", // 提示文字
                        actionLabel = "Undo", // 可选操作按钮
                        withDismissAction = true, // 右侧关闭按钮
                        duration = SnackbarDuration.Short // 显示时间
                    )
                }
            }) {
                // 按钮内容 一个加号
                Icon(Icons.Default.Add, contentDescription = "Add")
            }
        }
    ) { paddingValues -> // 安全内边距
        LazyColumn(
            modifier = Modifier.padding(paddingValues)
        ) {
            items(50) { index ->
                Text("Item $index", Modifier.padding(8.dp))
            }
        }
    }
}
```