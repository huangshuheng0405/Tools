# Compose

## @Composable

所有UI组件都是带`@Composable`注解的函数

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "你好，$name！")
}
```

- 它是一个注解，告诉编译器这个函数是UI组件
- Compose组件函数名推荐**大驼峰**
- 不能有返回值（返回`Unit`）
- 可以被其他`@Composable`函数调用

## Modifier

`Modifier`是Compose中最重要的，用于设置尺寸、间距、背景、点击等所有外观和行为。相当于CSS的集合

### 链式调用

```kotlin
@Composable
fun ModifierDemo() {
    Text(
        text = "你好",
        modifier = Modifier
            .fillMaxWidth()           // 填满宽度
            .padding(16.dp)           // 内边距
            .background(Color.Yellow) // 背景色
    )
}
```

### dp sp

```kotlin
@Composable
fun UnitDemo() {
    Column(modifier = Modifier.padding(16.dp)) {
        // dp = 密度无关像素，用于尺寸（宽高、间距、圆角）
        Box(modifier = Modifier
            .width(100.dp)            // 固定宽度 100dp
            .height(50.dp)            // 固定高度 50dp
            .background(Color(0xFF2196F3))  // 蓝色方块
        )

        Spacer(modifier = Modifier.height(8.dp))

        // sp = 缩放无关像素，用于字体大小
        Text("20sp字号", fontSize = 20.sp)
        Text("14sp字号", fontSize = 14.sp)
    }
}
```

<ColorBarCard title="为什么要使用dp和sp？">
不同手机屏幕密度，用px会导致界面在不同手机上大小不一

dp会根据屏幕密度自动缩放，保证视觉一致。sp和dp类似，但还会跟随系统字体大小设置缩放
</ColorBarCard>

### Color

```kotlin
@Composable
fun ColorDemo() {
    Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        // 方式1：预设颜色
        Box(modifier = Modifier.size(60.dp).background(Color.Red))

        Spacer(modifier = Modifier.height(8.dp))

        // 方式2：ARGB 十六进制（最常用）
        // 0xFF=完全不透明，1A73E8=RGB色值
        Box(modifier = Modifier.size(60.dp).background(Color(0xFF1A73E8)))

        Spacer(modifier = Modifier.height(8.dp))

        // 方式3：带透明度
        Box(modifier = Modifier.size(60.dp).background(Color.Black.copy(alpha = 0.3f)))
    }
}
```

### 常用Modifier

```kotlin
Modifier
    // 尺寸
    .width(100.dp)              // 固定宽度
    .height(50.dp)              // 固定高度
    .size(48.dp)                // 宽高相同
    .fillMaxWidth()             // 填满父容器宽度
    .fillMaxSize()              // 填满父容器
    .weight(1f)                 // 按比例分配空间（仅在 Row/Column 中）

    // 间距
    .padding(16.dp)             // 四周内边距
    .padding(horizontal = 16.dp, vertical = 8.dp)  // 分别设置

    // 外观
    .background(Color.White)    // 背景色
    .clip(RoundedCornerShape(8.dp))  // 圆角裁剪
    .border(1.dp, Color.Gray, RoundedCornerShape(8.dp))  // 边框

    // 交互
    .clickable { onClick() }    // 点击事件

    // 其他
    .aspectRatio(2.65f)         // 宽高比（宽:高 = 2.65:1）
    .offset(x = 10.dp, y = -4.dp)  // 偏移
```

### 顺序问题

Modifier是**从左到右**依次应用的。先`padding`再`background`，`padding`在背景外面，先`background`再`padding`，`padding`在背景里面

## Column

垂直排列

```kotlin
@Composable
fun ColumnDemo() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(color = Color.Red),
        horizontalAlignment = Alignment.CenterHorizontally,  // 水平居中
        verticalArrangement = Arrangement.spacedBy(16.dp)    // 子元素间距 16dp
    ) {
        Text("第一行", fontSize = 18.sp, modifier = Modifier.background(color = Color.Green))
        Text("第二行", fontSize = 18.sp, modifier = Modifier.background(color = Color.Green))
        Text("第三行", fontSize = 18.sp, modifier = Modifier.background(color = Color.Green))
    }
}
```

| 参数                | 作用     | 常用值                         |
| ------------------- | -------- | ------------------------------ |
| `horizontalAlignment` | 水平对齐 | `Start`/`CenterHorizontally`/`End`   |
| `verticalArrangement` | 垂直排列 | `Top`/`Center`/`Bottom`/`SpacedBy(dp)` |

## Row

水平排列

```kotlin
@Composable
fun RowDemo() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,       // 垂直居中
        horizontalArrangement = Arrangement.SpaceBetween      // 两端对齐
    ) {
        Text("左", fontSize = 16.sp, color = Color.Red)
        Text("中", fontSize = 16.sp, color = Color.Green)
        Text("右", fontSize = 16.sp, color = Color.Blue)
    }
}
```

| 参数                  | 作用     | 常用值                                                   |
| --------------------- | -------- | -------------------------------------------------------- |
| `verticalAlignment`     | 垂直对齐 | `Top`/`CenterVertically`/`Bottom`                              |
| `horizontalArrangement` | 水平排列 | `Start`/`Center`/`End`/`SpaceBetween`/`SpaceEvenly`/`SpacedBy` |

<ColorBarCard title="SpaceBetween和SpaceEvenly区别">

- `SpaceBetween`：第一个贴左，最后一个贴右。中间均匀分布
- `SpaceEvenly`：所有间距完全相同（包括两端到边缘的距离）

</ColorBarCard>

## Box

```kotlin
@Composable
fun BoxDemo() {
    Box(
        modifier = Modifier.size(120.dp),
        contentAlignment = Alignment.Center  // 子元素居中
    ) {
        // 底层：蓝色背景方块
        Box(modifier = Modifier
            .size(120.dp)
            .background(Color(0xFF2196F3))
            .clip(RoundedCornerShape(8.dp))
        )
        // 上层：白色文字（后写的在上层）
        Text("叠加文字", color = Color.White, fontSize = 16.sp)
    }
}
```

子元素按代码顺序**从下往上叠加**，后写的在上层

## Spacer

间距

```kotlin
@Composable
fun SpacerDemo() {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("标题", fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(8.dp))  // 标题和内容之间 8dp 间距
        Text("这是内容文字", fontSize = 14.sp, color = Color.Gray)
    }
}
```

## weight

按比例分配

```kotlin
@Composable
fun WeightDemo() {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 比例 1:1:1 → 各占 1/3
        Row(modifier = Modifier.fillMaxWidth().height(40.dp)) {
            Box(modifier = Modifier.weight(1f).fillMaxSize().background(Color.Red))
            Box(modifier = Modifier.weight(1f).fillMaxSize().background(Color.Green))
            Box(modifier = Modifier.weight(1f).fillMaxSize().background(Color.Blue))
        }

        Spacer(modifier = Modifier.height(8.dp))

        // 比例 2:1 → 左边占 2/3，右边占 1/3
        Row(modifier = Modifier.fillMaxWidth().height(40.dp)) {
            Box(modifier = Modifier.weight(2f).fillMaxSize().background(Color(0xFFFF9800)))
            Box(modifier = Modifier.weight(1f).fillMaxSize().background(Color(0xFF2196F3)))
        }
    }
}
```



## Image

### 本地图片

```kotlin
@Composable
fun ImageDemo() {
    Column(
        modifier = Modifier
            .padding(top = 36.dp)
            .fillMaxSize()
            .background(color = Color.Red),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
		// 加载本地 drawable中的图片
        Image(
            painter = painterResource(R.drawable.na),
            contentDescription = "A beautiful landscape painting", // 无障碍描述
            modifier = Modifier
                .size(width = 200.dp, height = 120.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(color = Color.Green),
            contentScale = ContentScale.Crop // 保持比例，不会完整显示
//            contentScale = ContentScale.FillBounds // 保持比例，不会完整显示
        )
    }
}
```

| ContentScale | 效果                           | 使用场景     |
| ------------ | ------------------------------ | ------------ |
| fit          | 保持比例，完整显示（可能留白） | 图标产品图   |
| Crop         | 保持比例，填满容器（可能裁剪） | 头像、轮播图 |
| FillBounds   | 拉伸填满（可能变形）           | 不推荐       |

### 网络图片

加载网络图片需要第三方库**Coli**

1. 添加依赖

   ```kotlin
   implementation("io.coil-kt.coil3:coil-compose:3.0.0") // 版本号请检查最新
   ```

   > Coli 3.x版本默认不包含网络支持，需要额外添加`coli-network-okhttp`依赖才能加载、

   ```kotlin
   implementation("io.coil-kt.coil3:coil-network-okhttp:3.0.0")
   ```

2. 配置网络权限

   在`AndroidManifest.xml`加一条声明，通常放在 `<manifest>` 下、`<application>` 同级即可

   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```

   允许发起网络请求

   - 加载网络图片
   - 调用后端API
   - 下载文件
   - 使用Websocket/Socket

3. 用`AsyncImage`加载网络图片

   ```kotlin
   @Composable
   fun NetworkImageDemo() {
    Column(
        modifier = Modifier
            .padding(top = 36.dp)
            .fillMaxSize()
            .background(color = Color.Red),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        AsyncImage(
            model = "https://esther-1393670083.cos.ap-shanghai.myqcloud.com/images/255a46afd9454f1990d5ed60b47affd2.png",
            contentDescription = "A beautiful landscape painting",
            modifier = Modifier
                .size(width = 200.dp, height = 200.dp)
                .clip(CircleShape)
                .background(color = Color.Red),
            contentScale = ContentScale.Crop
        )
    }
   }
   ```

   - `AsyncImage`，Coli提供的Compose组件，自动处理网络下载、缓存、解解码
   - `model = "https://..."`传入图片url，Coli自动异步加载

4. 设置加载中动画、加载失败显示图，改用`SubcomposeAsyncImage`

   ```kotlin
   @Composable
   fun NetworkImageDemo2() {
       Column(
           modifier = Modifier
               .padding(top = 36.dp)
               .fillMaxSize()
               .background(color = Color.Red),
           horizontalAlignment = Alignment.CenterHorizontally
       ) {
           // 精细控制
           SubcomposeAsyncImage(
               model = "https://esther-1393670083.cos.ap-shanghai.myqcloud.com/images/255a46afd9454f1990d5ed60b47affd2.pngs",
               contentDescription = "A beautiful landscape painting",
               modifier = Modifier
                   .size(width = 200.dp, height = 200.dp),
               contentScale = ContentScale.Crop,
               // 加载中
               loading = {
                   Box(
                       modifier = Modifier
                           .fillMaxSize()
                           .background(Color.Cyan),
                       contentAlignment = Alignment.Center
                   ) {
                       CircularProgressIndicator(
                           modifier = Modifier.size(30.dp)
                       )
                   }
               },
               // 加载失败
               error = {
                   Box(
                       modifier = Modifier
                           .fillMaxSize()
                           .background(Color.White),
                       contentAlignment = Alignment.Center
                   ) {
                       Text(text = "Error", color = Color.Gray)
                   }
               }
           )
       }
   }
   ```

   `AsyncImage`不支持`loading`/`error`

## Icon

添加依赖

```kotlin
implementation("androidx.compose.material:material-icons-core")
```

在组件中使用

```kotlin
@Composable
fun IconDemo() {
    Column(
        modifier = Modifier
            .padding(top = 36.dp)
            .fillMaxSize()
            .background(color = Color.Red),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row() {
            Icon(
                imageVector = Icons.Default.Edit, // 设置图标
                contentDescription = "Edit",
                modifier = Modifier.size(24.dp), // 图标大小
                tint = Color.Cyan // 图标颜色
            )
        }
    }
}
```

