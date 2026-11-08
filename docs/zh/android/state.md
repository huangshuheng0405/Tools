## 状态管理

在Compose中，状态就是会变化的数据，当状态会变化时，界面自动更新

remember+mutableStateOf

```kotlin
@Composable
fun CounterDemo() {

    val count = remember { mutableIntStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("counter: ${count.intValue}", fontSize = 24.sp)
        Button(onClick = { count.intValue++ }) {
            Text("click to add")
        }
    }
}
```

<ColorBarCard title="为什么要 remember？">

Compose界面会频繁重组（数据变化重新执行@Compose函数）

如果没有`remember`，每次重组`mutableStateOf(0)`都会重新创建，值就会重置为0

</ColorBarCard>

### by

上述是一种写法，用`by`委托更简洁

```kotlin
var count by remember { mutableStateOf(0) }
count++
println(count)
```

<ColorBarCard title="by是什么">

by是kotlin的**属性委托**语法

`var count by remember { mutableStateOf(0) }` 的效果是：把 `mutableStateOf` 的 `.value` 读写操作委托给 `count` 变量，这样你就可以直接用 `count` 代替 `count.value`

</ColorBarCard>

### 状态提升

将状态从子组件提升到父组件，子组件只负责展示和回调

```kotlin
@Composable
fun ParentComp() {

    // 定义一个状态变量
    var query by remember { mutableStateOf("Esther") }


    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 40.dp, start = 10.dp),
        horizontalAlignment = Alignment.Start
    ) {
        Text("content: $query")
        // 放一个子组件
        ChildComp(text = query, onTextChange = { query = it })
    }
}

@Composable
fun ChildComp(
    text: String,
    onTextChange: (String) -> Unit
) {
    TextField(value = text, onValueChange = onTextChange)
}
```

## LazyColumn

只渲染可见区域的项，性能高效

### 基本用法

```kotlin
@Composable
fun SimpleList() {
    val items = listOf("Apple", "Banana", "Cherry")

    LazyColumn {
        items(items) { item ->
            Text(
                text = item,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            )
        }
    }
}
```

`item { }`：单个条目

```kotlin
LazyColumn {
    item {
        Text("头部")
    }
    item {
        Text("底部")
    }
}
```

`items(count) {}`：按数量

```kotlin
LazyColumn {
    items(count = 100) { index ->
        Text("第 $index 项")
    }
}
```

`items(list {})`：按集合（常用）

```kotlin
LazyColumn {
    items(items = list) { item ->
        Text(item.name)
    }
}
```

### key

key是LazyColumn复用的关键，不传key，Compose默认用位置作为标识。当列表发生插入、删除、移动时，可能导致

- item内部状态错位（比如输入框内容跑到别的项上）
- 不必要的重组
- 动画异常

所以，推荐给每个item传稳定且**唯一**的key

```kotlin
LazyColumn {
    items(
        items = users,
        key = { user -> user.id }   // 唯一且稳定
    ) { user ->
        UserRow(user)
    }
}
```

