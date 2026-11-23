# network

## 前置

1. 声明网络权限。没有声明会直接抛`SecurityException`

  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  ```

2. 主线程不允许做阻塞IO。任何一次网络请求，都必须发生在有生命周期的协程作用域里（例如`viewModelScope`）而不是在`onCreate`直接调用

3. HTTPS默认放行，调HTTP接口默认会被禁（Android 9+的明文流量限制）。须在manifest的`<application>`上加`android:usesCleartextTraffic="true"`，或者用`network_security_config`

|                     | 说明                                                               |
| ------------------- | ------------------------------------------------------------------ |
| `HttpURLConnection` | JDK原生，零依赖。但API笨重、易错，只建议了解概念                   |
| `OkHttp`            | 第三方主流客户端，连接池、拦截器、重试、缓存都有，实际项目基本都用 |

`HttpURLConnection`的请求，理解原理即可

```kotlin
val conn = URL("https://api.example.com/users").openConnection() as HttpURLConnection
conn.requestMethod = "GET"
conn.connectTimeout = 10_000
try {
    if (conn.responseCode == 200) {
        val json = conn.inputStream.bufferedReader().readText()
    }
} finally {
    conn.disconnect()
}
```

反观`OkHttp`等价代码只需三行

```kotlin
val client = OkHttpClient()
val request = Request.Builder().url("https://api.example.com/users").build()
client.newCall(request).execute()  // 或用 enqueue() 异步
```

## 序列化

接口返回的是字符串，需转化为数据类，常用：

- Gson
- Moshi
- kotlin.serialization：官方Kotlin方案，编译期生成，性能好

这里讲`kotlin.serialization`

- `ignoreUnknownKeys`：JSON里**多出来**的key不报错
- `coerceInputValues`：值是`null`或非法枚举时，用属性默认值兜住
- `isLenient`：容忍不规范的JSON语法（单引号、无引号key）

## 异步

现在的写法是Kotlin**协程**

```kotlin
lifecycleScope.launch {
    val user = withContext(Dispatchers.IO) { fetchUser() }
    textView.text = user.name
}
```

## Retrofit

实际项目都是用Retrofit+OkHttp+序列化+协程。Retrofit把HTTP请求**声明成接口**

```kotlin
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: Int): User
}

val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
    .client(okHttpClient)
    .build()

val api = retrofit.create(ApiService::class.java)
val user = api.getUser(1)  // 在协程里直接调用
```

只需写接口和数据类

### 注解

| 注解                    | 含义   | 备注          |
| ----------------------- | ------ | ------------- |
| `@GET("users")`         | GET    | 不能带body    |
| `@POST("users")`        | POST   | 通常配`@Body` |
| `@PUT("users/{id}")`    | PUT    | 全量替换      |
| `@PATCH("users/{id}")`  | PATCH  | 部分更新      |
| `@DELETE("users/{id}")` | DELETE |               |

### URL 与参数

| 注解             | 作用                       | 例子                                                |
| ---------------- | -------------------------- | --------------------------------------------------- |
| `@Path("id")`    | 替换路径里的`{id}`         | `@GET("users/{id}")` + `@Path("id") 1` → `/users/1` |
| `@Query("type")` | 拼到`?`后面                | `?type=1`；值为`null`时这个参数整个不出现           |
| `@QueryMap`      | Map批量拼query             | 筛选条件多的搜索接口                                |
| `@QueryName`     | 只有名、没有值的query      | `?sort`                                             |
| `@Url`           | 直接给完整url，跳过baseUrl | 下载、多域名、CDN                                   |

### Header

| 注解                                  | 作用                                 |
| ------------------------------------- | ------------------------------------ |
| `@Header("Authorization")`            | 单个动态header                       |
| `@HeaderMap`                          | Map批量塞header                      |
| `@Headers("Cache-Control: no-cache")` | 静态header，写在方法上方，可以写多条 |

### 请求体（三选一，互斥）

| 组合                                 | Content-Type                        | 场景                        |
| ------------------------------------ | ----------------------------------- | --------------------------- |
| `@Body user: User`                   | `application/json`                  | 最常用，交给Converter序列化 |
| `@FormUrlEncoded` + `@Field("name")` | `application/x-www-form-urlencoded` | 传统表单、部分登录接口      |
| `@Multipart` + `@Part` / `@PartMap`  | `multipart/form-data`               | 传文件、图文混传            |

## 依赖

`OkHttp`+`Retrofit`+`kotlin.serialization`

```kotlin [app/build.gradle.kts]
plugins {
    // 版本必须与项目 Kotlin 插件一致
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.21"
}

dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-kotlinx-serialization:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
}
```

## 单例

```kotlin
object NetworkModule {
    private const val BASE_URL = "https://jsonplaceholder.typicode.com/"  // 结尾必须有 /

    val json = Json { ignoreUnknownKeys = true }

    val client: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY
                        else HttpLoggingInterceptor.Level.NONE
            })
            .build()
    }

    val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
    }

    val api: ApiService by lazy { retrofit.create(ApiService::class.java) }
}
```

- `by lazy`：首次访问才创建、线程安全、全App一份
- Client内含连接池+线程池，**绝不能每个页面new**
- 日志拦截器上线前要关掉，避免敏感信息进logcat

### ApiService

声明式接口

```kotlin
interface ApiService {
    @GET("todos/1")
    suspend fun getTodo(): Todo
}
```

### 数据类

serialization解析

```kotlin
@Serializable
data class Todo(
    val userId: Int,
    val id: Int,
    val title: String,
    val completed: Boolean,
)
```

- 字段名默认与JSON key一对一；下划线字段用`@SerialName("user_id")`
- `ignoreUnknownKeys = true`：服务端多字段不会解析崩溃

### 调用

```kotlin
scope.launch {
    try {
        todo = NetworkModule.api.getTodo()
    } catch (e: HttpException) {           // 4xx / 5xx
        errorMsg = "HTTP ${e.code()}: ${e.message()}"
    } catch (e: IOException) {             // 断网 / 超时 / DNS
        errorMsg = "网络异常: ${e.message}"
    } finally {
        loading = false
    }
}
```

## 流程

1. 用户点击按钮：`Button(onClick = { ... })`
2. ViewModel开一个协程：`viewModelScope.launch { ... }`
3. 接口调用方法（挂起，不阻塞）：`val res = api.getQuestList/type = 1`
4. `Retrofit`把注解翻译成`http`请求：`@GET @Query -> GET /api/question/list?type=1`
5. OkHttp发出，拦截器依次加工：加`Authorization`头/日志
6. 服务器端处理并返回JSON：`{"code":0,"message":"ok","data":{...}}`
7. 反序列化成Kotlin对象：JSON 字符串 → `ApiResponse<PageData<QuestionItem>>`
8. 业务判断后写进 StateFlow：`if (res.code == 0) _questionList.value = res.data?.rows.orEmpty()`
9. UI 自动重组，列表出现在屏幕上：`val list by vm.questionList.collectAsState()`

### 前置

|          | 内容                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| 权限     | `AndroidManifest.xml`加`<uses-permission android:name="android.permission.INTERNET" />`                        |
| 线程     | 主线程不能发网络请求，会抛`NetworkOnMainThreadException`                                                       |
| 明文流量 | HTTPS默认放行；调HTTP接口需`android:usesCleartextTraffic="true"`或`network_security_config`。Android 9+ 才限制 |

### 依赖

```kotlin
plugins {
    // 版本必须与项目 Kotlin 插件一致
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.21"
}

dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-kotlinx-serialization:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
}
```

> OkHttp由 Retrofit 传递引入，不必单独声明

### 全局单例

```kotlin
object NetworkModule {
    private const val BASE_URL = "https://jsonplaceholder.typicode.com/"  // 结尾必须有 /

    val json = Json { ignoreUnknownKeys = true }

    val client: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY
                        else HttpLoggingInterceptor.Level.NONE
            })
            .build()
    }

    val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
    }

    val api: ApiService by lazy { retrofit.create(ApiService::class.java) }
}
```

关键点

- `by lazy`：首次访问才创建、线程安全、全app一份
- client内含连接池+线程池，绝不能每个页面new
- 日志拦截器上线要关掉，避免敏感信息进logcat

### ApiService

声明式接口

```kotlin
interface ApiService {
    @GET("todos/1")
    suspend fun getTodo(): Todo
}
```

### 数据类

serialization解析目标

```kotlin
@Serializable
data class Todo(
    val userId: Int,
    val id: Int,
    val title: String,
    val completed: Boolean,
)
```

- 字段名默认与JSON key一对一下划线字段用`@SerialName("user_id")`
- `ignoreUnknownKeys = true`：服务端加字段不会解析崩溃

### 调用

```kotlin
scope.launch {
    try {
        todo = NetworkModule.api.getTodo()
    } catch (e: HttpException) {           // 4xx / 5xx
        errorMsg = "HTTP ${e.code()}: ${e.message()}"
    } catch (e: IOException) {             // 断网 / 超时 / DNS
        errorMsg = "网络异常: ${e.message}"
    } finally {
        loading = false
    }
}
```

