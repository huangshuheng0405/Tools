# Navigation

Navgation Compose是Jetpack官方推荐的**页面导航方案*

| 概念              | 作用                                                         |
| ----------------- | ------------------------------------------------------------ |
| NavController     | 导航控制器。`navigate()`跳转、`popBackStack()`返回、`currentBackStackEntryAsState()`观察当前路由 |
| NavHost           | 导航宿主Composable，根据返回栈栈顶渲染对于页面               |
| NavGraph          | 导航图，用`composable {}`/`navigation {}`声明所有目的地      |
| Destination/Route | 一个目的地，用路由字符串或type-safe对象标识                  |
| NavBackStackEntry | 每次导航push进返回栈的条目，携带参数、`Lifecycle`、`ViewModelStore`、`SaveStateRegistry` |
| Arguments         | 路由参数，通过`navArgumment`声明类型                         |

1. `navigate()`默认push一个新条目到栈顶

2. `popBackStack()`默认pop栈顶

3. `NavHost`只显示栈顶，但栈里其他条目**仍然存活**（状态保留，只是不可见）

4. 系统返回键默认触发`popBackStack()`，不用手动处理

5. 栈空了再返回，默认退出Activity

## navigate

```
navController.navigate("detail/30") {
	launchSingleTop = true 
	popUpTo("home") {
		inclusive = false
		saveState = true
	}
	restoreState = true
}
```

- `launchSingleTop`：避免栈顶重复。连续点击同一个按钮不会压入多个页面
- `popUpTo(route)`：跳转前先弹到指定路由
- `inclusive`：`popUpTo`时是否包含目标本身
- `saveState`：pop时保存被移除页面的状态
- `restoreState`：恢复之前`saveState`保存的状态

### 跳转、返回

```kotlin
navController.navigate("detail/30")   // 跳转
navController.popBackStack()          // 返回
navController.navigateUp()            // 等价于返回，语义更明确
```

### 当前路由

```kotlin
val currentRoute = navController.currentBackStackEntryAsState()
    .value?.destination?.route
```

常用于判断底部导航栏判断选中项、顶部标题切换

### 参数传递

#### 字符串路由+`navArgument`

```kotlin
// 声明：模板
composable(
    route = "detail/{id}",
    arguments = listOf(navArgument("id") { type = NavType.IntType })
) { entry ->
    val id = entry.arguments?.getInt("id")
}

// 跳转：实际值
navController.navigate("detail/30")
```

- `composable`里用模板`"detail/{id}"`
- `navigate`里用实际值`"detail/30"`
- `NavType`和读取方法必读对应：`IntType -> getInt`、`StringType -> getString`
- String参数肯能包含`/`、空格、中文时，跳转前要`Url.encode()`

#### Type-safe Navigation

用 `@Serializable` 数据类定义路由，编译期检查：

```kotlin
@Serializable data object Home
@Serializable data class Detail(val id: Int)

NavHost(navController, startDestination = Home) {
    composable<Home> {
        HomeScreen(onItemClick = { id -> navController.navigate(Detail(id)) })
    }
    composable<Detail> { entry ->
        val detail = entry.toRoute<Detail>()
        DetailScreen(id = detail.id, ...)
    }
}
```

优点：

- 参数类型、名称编译期检查
- 不拼字符串，不怕特殊字符
- IDE 能跳转、能重构

需要依赖：

```kotlin
implementation("androidx.navigation:navigation-compose:2.8.0")
implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.0")
```

以及 Kotlin serialization 插件。

**新项目建议直接用 type-safe 方式。**

## Composable