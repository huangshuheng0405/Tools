# network

前置知识

1. 声明网络权限。没有声明会直接抛`SecurityException`

  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  ```

2. 主线程不允许做阻塞IO。任何一次网络请求，都必须发生在有生命周期的协程作用域里（例如`viewModelScope`）而不是在`onCreate`直接调用

3. HTTPS默认放行，调HTTP接口默认会被禁（Android 9+的明文流量限制）。须在manifest的`<application>`上加`android:usesCleartextTraffic="true"`，或者用`network_security_config`

|                     | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| `HttpURLConnection` | JDK原生，零依赖。但API笨重、易错，只建议了解概念             |
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

