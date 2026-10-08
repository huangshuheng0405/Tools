# Spring Boot WebSocket

WebSocket 解决的是「服务端主动推消息给浏览器」这件事。HTTP 是请求-响应,服务端想说句话得等客户端来问;WebSocket 握手一次之后就是**全双工长连接**,两边随时能发。

Spring Boot 里做 WebSocket 有两条路:

| 方案                    | 依赖                            | 适合场景                                             |
| ----------------------- | ------------------------------- | ---------------------------------------------------- |
| STOMP(消息模型)         | `spring-boot-starter-websocket` | 聊天、通知、协同编辑 —— 需要「订阅 / 广播 / 点对点」 |
| 原生 `WebSocketHandler` | 同上                            | 自己定义协议、对接非浏览器客户端、只想收原始文本     |

**绝大多数业务项目应该用 STOMP。**

原因是 WebSocket 协议本身只规定了「怎么传字节」,没规定「消息是什么格式、该发给谁」。用原生 Handler,你得自己维护一个 `Map<userId, WebSocketSession>`,自己实现群发、广播、离线剔除、并发发送。STOMP 把这层订阅关系交给 Spring 的消息模型,你只管写 `@MessageMapping`。

## 一、STOMP

### 引依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 配置类

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 握手地址:前端连 http://host:port/ws
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");   // 跨域,上线要收紧
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 1. 客户端「订阅」的地址前缀,命中后由 broker 负责广播
        config.enableSimpleBroker("/topic", "/queue");
        // 2. 客户端「发送」的地址前缀,命中后路由到 @MessageMapping 方法
        config.setApplicationDestinationPrefixes("/app");
        // 3. 点对点地址前缀
        config.setUserDestinationPrefix("/user");
    }
}
```

**`@EnableWebSocketMessageBroker` 不加就完全没反应** —— 和 `@EnableScheduling` 一个毛病:不报错、不提示,就是连不上。新手卡在这里的时间最长。

三个前缀各自管什么,记住这张表就不会写错:

| 前缀                     | 方向            | 谁处理                           |
| ------------------------ | --------------- | -------------------------------- |
| `/app/**`                | 客户端 → 服务端 | 路由到 `@MessageMapping` 方法    |
| `/topic/**`、`/queue/**` | 服务端 → 客户端 | 交给 broker,广播给所有订阅者     |
| `/user/**`               | 服务端 → 客户端 | 交给 broker,只发给指定用户的会话 |

`/topic` 和 `/queue` 在 Spring 内置 broker 里**没有任何语义差别**,只是约定成「广播用 topic、点对点用 queue」。用外部 broker(RabbitMQ)时才需要按它的规矩来。

### 消息是怎么走的

Spring 在中间架了三个 channel,消息全部在里面流转:

```
浏览器                  Spring 应用                        broker
  │                        │                                │
  │  ① SEND /app/chat      │                                │
  ├───────────────────────>│ clientInboundChannel           │
  │                        │   ↓ 按前缀分发                  │
  │                        │ @MessageMapping 方法            │
  │                        │   ↓ 返回值 / SimpMessagingTemplate
  │                        │ brokerChannel ────────────────>│
  │                        │                                │
  │  ③ MESSAGE /topic/chat │ clientOutboundChannel          │
  │<───────────────────────┴────────────────────────────────│
  │  ② SUBSCRIBE /topic/chat  (订阅在这时注册到 broker,① 和 ② 顺序无关)
```

- `clientInboundChannel`:收客户端消息
- `clientOutboundChannel`:往客户端发消息
- `brokerChannel`:应用内部代码往 broker 发消息(也就是 `SimpMessagingTemplate` 用的那条)

这三个 channel 背后都是线程池,消息处理天然是异步的。

### 收消息:@MessageMapping

```java
@Controller
public class ChatController {

    @MessageMapping("/chat.send")          // 客户端往 /app/chat.send 发
    @SendTo("/topic/public")               // 返回值广播到 /topic/public
    public ChatMessage send(@Payload ChatMessage message) {
        message.setTime(LocalDateTime.now());
        return message;
    }
}
```

对应关系:

| STOMP 侧注解           | HTTP 侧的对应物   |
| ---------------------- | ----------------- |
| `@MessageMapping`      | `@RequestMapping` |
| `@Payload`             | `@RequestBody`    |
| `@DestinationVariable` | `@PathVariable`   |

**不加 `@SendTo` 时,返回值默认发到「原地址 + `/topic` 前缀」。** 客户端发 `/app/chat.send`,返回值会广播到 `/topic/chat.send`。这个默认行为很隐蔽,一旦前端订阅的地址和它不一致就是「明明发出去了却没反应」。**建议永远显式写 `@SendTo`。**

### 主动推送:SimpMessagingTemplate

定时任务、HTTP 接口、别的 Service 想推消息,注入这个就行:

```java
@Service
public class NoticeService {

    @Resource
    private SimpMessagingTemplate messagingTemplate;

    public void publish(Notice notice) {
        messagingTemplate.convertAndSend("/topic/notice", notice);
    }
}
```

`convertAndSend(目的地, 对象)` 里的对象会被 Jackson 序列化成 JSON。入参如果是 `Map`、`List` 也照转。

> 这个 Bean 由 Spring Boot 自动配置提供,名字是 `brokerMessagingTemplate`。如果容器里有多个同类型 Bean 注入冲突,用 `@Qualifier("brokerMessagingTemplate")` 限定。

### 点对点:@SendToUser

给「某个用户」而不是「所有订阅者」发消息,用 `/user` 前缀:

```java
@Controller
public class OrderController {

    @MessageMapping("/order.subscribe")
    @SendToUser("/queue/order")     // 只回给发消息的那个人
    public OrderResult subscribe(OrderQuery query, Principal principal) {
        return orderService.query(principal.getName());
    }
}
```

服务端主动推:

```java
// 发给 username 对应的所有会话
messagingTemplate.convertAndSendToUser("zhangsan", "/queue/order", result);
```

客户端订阅的地址是 `/user/queue/order`(注意**不加用户名**),Spring 的 `UserDestinationMessageHandler` 会在内部翻译成 `/queue/order-user<sessionId>` 这种唯一地址,避免不同用户撞车。

> `@SendToUser` 默认发给该用户的**所有**会话(比如他开了三个浏览器标签页,三个都收到)。只想回给发消息的那一个会话,加 `broadcast = false`。

### 前端

服务端建议用 [stompjs](https://github.com/stomp-js/stompjs) —— 官方文档里点名推荐的,也是目前维护最活跃的 JavaScript STOMP 客户端。

```
npm install @stomp/stompjs
```

```js
import { Client } from '@stomp/stompjs'

const client = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  reconnectDelay: 5000, // 断线自动重连,必配
  onConnect: () => {
    // 订阅(地址和后端 @SendTo 对上)
    client.subscribe('/topic/public', (frame) => {
      const message = JSON.parse(frame.body)
      console.log(message)
    })
    client.subscribe('/user/queue/order', (frame) => {
      console.log('只属于我的消息', JSON.parse(frame.body))
    })
  },
})

client.activate()

// 发消息(地址和后端 @MessageMapping 对上)
function send(text) {
  client.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({ content: text }),
  })
}
```

页面关闭时 `client.deactivate()`,否则重连定时器会一直跑。

> 老教程里常见的 `sockjs-client` + `stompjs`(注意不是 `@stomp/stompjs`)组合已经过时。现代浏览器和 Nginx 对 WebSocket 支持都没问题,不需要 SockJS 那套降级方案;真要用,服务端加 `.withSockJS()`,前端换成 `webSocketFactory` 才行。

### 鉴权

**WebSocket 不走 `Filter` 和 `HandlerInterceptor`。** 握手之后连接就升级了,后续的 STOMP 帧根本不经过 `DispatcherServlet`,所以你在 `filter.md` / `interceptor.md` 里写的那套拦不住它。这是最容易踩的坑。

有两条路,一般**两条都要**:

**1. 握手时校验**(拦住未登录的连接)—— `HandshakeInterceptor`:

```java
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String token = UriComponentsBuilder.fromUri(request.getURI())
                .build().getQueryParams().getFirst("token");

        if (!JwtUtil.verify(token)) {
            return false;            // 返回 false 直接拒绝握手
        }
        attributes.put("username", JwtUtil.getUsername(token));   // 传给 WebSocketSession
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
```

注册到 STOMP 端点上:

```java
registry.addEndpoint("/ws")
        .addInterceptors(new AuthHandshakeInterceptor())
        .setAllowedOriginPatterns("*");
```

**2. STOMP 层绑定用户**(让 `/user/**` 能工作)—— `ChannelInterceptor`:

`Principal` 由 CONNECT 帧解出来,`@SendToUser` 和 `convertAndSendToUser` 都依赖它。

```java
@Configuration
public class WebSocketAuthConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String token = accessor.getFirstNativeHeader("Authorization");
                    String username = JwtUtil.getUsername(token);
                    accessor.setUser(new UsernamePasswordAuthenticationToken(username, null));
                }
                return message;
            }
        });
    }
}
```

前端带上:

```js
const client = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  connectHeaders: { Authorization: localStorage.getItem('token') },
})
```

> 握手用的 `?token=xxx` 走的是 URL,会被 Nginx 访问日志、浏览器历史记下来;STOMP 的 `connectHeaders` 放在帧里,相对安全。生产环境里如果两者都有,以 STOMP 层的为准。

### 心跳

STOMP 有心跳机制,长时间没消息时空包保活,顺便让两端都能发现断线。默认关着,要用得显式配,而且**必须给一个 `TaskScheduler`**:

```java
@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private TaskScheduler messageBrokerTaskScheduler;

    @Autowired
    public void setMessageBrokerTaskScheduler(@Lazy TaskScheduler taskScheduler) {
        this.messageBrokerTaskScheduler = taskScheduler;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue")
              .setHeartbeatValue(new long[]{10000, 20000})   // {服务端发送间隔, 期望客户端间隔},毫秒
              .setTaskScheduler(this.messageBrokerTaskScheduler);
        // ...
    }
}
```

不注入 `TaskScheduler` 直接调 `setHeartbeatValue`,启动就抛异常。

### 单机够用,多实例就不够

`enableSimpleBroker` 是**内置 broker,订阅关系全在内存里**。这意味着:

```
实例 A ─┐   用户 1 连在 A,用户 2 连在 B
实例 B ─┘   用户 1 发的消息,只有 A 上的订阅者收得到,B 上的收不到
```

三个办法:

| 办法                   | 说明                                                 |
| ---------------------- | ---------------------------------------------------- |
| 网关做会话粘滞(sticky) | 同一用户固定打到同一实例。简单,但扩容、重启时体验差  |
| 换外部 broker          | 上 RabbitMQ,`enableStompBrokerRelay` 转发,是标准做法 |
| Redis 广播自己实现     | 能用,但等于把 STOMP 的好处又写回去了,不推荐          |

改外部 broker(RabbitMQ 开了 STOMP 插件):

```java
@Override
public void configureMessageBroker(MessageBrokerRegistry config) {
    config.setApplicationDestinationPrefixes("/app");
    config.enableStompBrokerRelay("/topic", "/queue")
          .setRelayHost("127.0.0.1")
          .setRelayPort(61613)
          .setClientLogin("guest")
          .setClientPasscode("guest");
}
```

**单机部署用 `enableSimpleBroker`,多实例必须换 relay。** 判断标准和 `@Scheduled` vs XXL-JOB 那边是同一个:你的服务部署几个实例。

## 二、原生 WebSocketHandler

只有在你不需要订阅语义、或者客户端不是浏览器时才用这条路。

### 配置类

```java
package com.demo.sessiondemo.web.config;

import com.demo.sessiondemo.web.interceptor.AuthHandshakeInterceptor;
import com.demo.sessiondemo.web.handler.OrderWebsocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * websocket 配置
 * 客户端连接 ws://localhost:8080/ws?token=xxx
 */
@Configuration
@EnableWebSocket
public class WebsocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new OrderWebsocketHandler(), "/ws")
                .addInterceptors(new AuthHandshakeInterceptor())
                .setAllowedOrigins("*"); // 演示放开跨域 生产按域名 限制
    }
}

```

### 拦截器

```java
package com.demo.sessiondemo.web.interceptor;

import cn.dev33.satoken.stp.StpUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * 握手鉴权 从 ws url 的 query 里取 token 校验
 * 注意 浏览器 websocket api 不能自定义请求头 所以 token 走 query 参数
 */
public class AuthHandshakeInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // ws://host//ws?token=xxx&client=web
        String token = ((ServletServerHttpRequest) request).getServletRequest().getParameter("token");
        Object loginId;
        try {
            loginId = StpUtil.getLoginIdByToken(token); // 无效/过期返回 null
        } catch (Exception e) {
            return false; // 校验失败 拒绝握手
        }
        if (loginId == null) {
            return false;
        }
        attributes.put("userId", Long.valueOf(loginId.toString())); // 传给 session
        String client = ((ServletServerHttpRequest) request).getServletRequest().getParameter("client");
        attributes.put("client", client == null ? "web" : client); // 默认后台端
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}

```

浏览器原生Websocket API不能自定义请求头，只能发URL参数

### 处理器

```java
package com.demo.sessiondemo.web.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * websocket 处理器
 * 连接表： userId -> session
 * 业务里调用 sendToUser 主动推送
 */
@Component
public class OrderWebsocketHandler extends TextWebSocketHandler {

    // 连接表 key 改成 web:1 app:1 这样两端互不干扰
    private static final Map<String, WebSocketSession> SESSIONS = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        SESSIONS.put(buildKey(session), session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        SESSIONS.remove(buildKey(session)); // 断开 清理
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 心跳保活 可客户端发 ping  服务端发 pong
        if ("ping".equals(message.getPayload())) {
            session.sendMessage(new TextMessage("pong"));
        }
    }

    /**
     * 推给指定端的指定用户
     */
    public static void sendToUser(String client, Long userId, String json)  {
        WebSocketSession session = SESSIONS.get(client + ":" + userId);
        if (session != null && session.isOpen()) {
            try {
            session.sendMessage(new TextMessage(json));

            } catch (IOException e) {

            }
        }
    }


    /**
     * 广播给某一个端的所有在线连接
     */
    public static void sendToClient(String client, String json)  {
        for (Map.Entry<String, WebSocketSession> e : SESSIONS.entrySet()) {
            if (e.getKey().startsWith(client + ":") && e.getValue().isOpen()) {
                try {
                    e.getValue().sendMessage(new TextMessage(json));
                } catch (IOException ignored) {

                }
            }
        }
    }

    /**
     * key = 端 + userId
     */
    private static String buildKey(WebSocketSession session) {
        return session.getAttributes().get("client") + ":" + session.getAttributes().get("userId");
    }
}

```

1. 握手即鉴权：第一步是握手，鉴权必须在这里做，用`HandshakeInterceptor`
2. token走query
3. 端隔离：后台和小程序的id可能会相同，所以用String区分，而不是直接用id
4. 连接表必须清理：`afterConnectionClosed`里remove，否则内存泄漏+推送打到死链接
5. 发送前判断session.isOpen()：对方可能断开但close回调还没触发
6. 心跳保活：客户端定时发ping，服务端回pong，防NAT/代理回收空闲连接

两个必须知道的坑:

**1. 一个 session 不能并发发送。** 底层 JSR-356 明确规定同一个 `WebSocketSession` 不允许多线程同时 `sendMessage`,不然后果不可预期(可能直接断开)。定时任务和请求线程同时推就会撞上。标准解法是包一层装饰器:

```java
@Override
public void afterConnectionEstablished(WebSocketSession session) {
    // 内部加锁串行化发送,可以设置缓冲区大小和发送超时
    WebSocketSession wrapped = new ConcurrentWebSocketSessionDecorator(session, 10_000, 512 * 1024);
    SESSIONS.put(id, wrapped);
}
```

**2. `SESSIONS` 得自己管生命周期。** 连接断开、实例重启都会留下脏数据,`sendMessage` 抛异常时还得主动清理。这部分工作量就是 STOMP 帮你省掉的。

## 注意事项

**通用**

- **`@EnableWebSocketMessageBroker` / `@EnableWebSocket` 必须加**,不加不报错但功能完全不存在。
- **WebSocket 不经过 `Filter` 和 `HandlerInterceptor`**,别指望已有的登录拦截器能拦住它,鉴权要在 `HandshakeInterceptor` 或 `ChannelInterceptor` 里做。
- **Nginx 反代要显式开协议升级**,否则连接建不起来(表现为前端一直握手失败或很快断开):

  ```nginx
  location /ws {
      proxy_pass http://backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_read_timeout 3600s;    # 默认 60s 会把长连接掐掉
  }
  ```

  加心跳后 `proxy_read_timeout` 可以短一些,心跳包会刷新它。

- 消息体积有上限,大文件走 WebSocket 不合适,改用 OSS 直传 + 推一个 URL。
- 前端一定要配**自动重连**(stompjs 的 `reconnectDelay`),并订阅 `onWebSocketClose` 做 UI 提示。

**STOMP**

- **不加 `@SendTo`,返回值默认发到 `/topic` + 原地址**,这个默认行为极易踩坑,建议显式声明。
- **`enableSimpleBroker` 是内存态**,多实例部署收不到彼此的消息,必须换 `enableStompBrokerRelay`。
- `setHeartbeatValue` **必须配 `TaskScheduler`**,否则启动报错。
- `/topic` 和 `/queue` 在内置 broker 里没有语义区别,只是约定。
- 没有内置的「历史消息」,用户离线期间推的消息直接丢掉。需要离线补偿得自己落库,上线时再拉一次。

**原生 Handler**

- **同一 session 不能并发发送**,包 `ConcurrentWebSocketSessionDecorator`。
- 会话 Map 要自己维护,断连和异常都要清理,否则内存泄漏。
- 没有订阅概念,广播、点对点全靠手写过滤逻辑。

## 前端websokcet代码

```ts [src/utils/ws.ts]
// src/utils/ws.ts
let socket: WebSocket | null = null // 单例
let handlers: Array<(data: any) => void> = [] // 订阅者回调列表
let heartTimer: ReturnType<typeof setInterval> | null = null // 心跳定时器

/** 建立连接 登录后调用 */
export function connectWS() {
  if (socket) return // 已经有连接了 防止重复建连
  const token = localStorage.getItem('token')
  if (!token) return // 没 token 就不建连接
  socket = new WebSocket(`ws://localhost:8080/ws?token=${token}&client=web`)
  // 握手成功 后端 鉴权已通过
  socket.onopen = () => console.log('ws connected')
  // 监听消息
  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data) // 服务端发来的是一段json文本
      handlers.forEach((fn) => fn(data)) // 逐个通知每个订阅者
    } catch (err) {
      console.error('ws message parse error', err)
    }
  }
  // 断开连接
  socket.onclose = () => {
    socket = null // 清除引用 下一次才能重连
    setTimeout(connectWS, 5000) // 5s后自动重连
  }
  // 出错时主动close 让onclose的重连逻辑接管
  socket.onerror = () => socket?.close()
  // 心跳定时器 30s发一次ping
  if (heartTimer) clearInterval(heartTimer) // 防止重连后定时器叠加
  heartTimer = setInterval(() => {
    // 只有连接真正活着才发ping 避免向死连接send触发异常
    if (socket && socket.readyState === WebSocket.OPEN) socket.send('ping')
  }, 30000)
}

/** 订阅消息 页面里用 记得退订 */
export function onWSMessage(fn: (data: any) => void) {
  handlers.push(fn) // 把回调函数加进名单
  return () => {
    // 返回一个 退订函数 （闭包） 这个函数没有自己
    // 所以在onUnmounted的时候就能把自己去掉不影响其他函数
    handlers = handlers.filter((h) => h !== fn)
  }
}

/** 断开 退出登录时调用 */
export function closeWS() {
  socket?.close() // 关连接
  socket = null // 解除引用
  // 这里不清 handlers：订阅者各自在卸载时退订，退订函数会把自己从数组里摘掉。
  // 清空的话，挂在 App 上的常驻订阅（如订单提醒）会被一起干掉，重新登录后就再也收不到推送了。
  if (heartTimer) {
    clearInterval(heartTimer)
    heartTimer = null
  }
}
```

```
登录/启动 ──> connectWS() ──> socket 单例 + 心跳
页面 ──────> onWSMessage(fn) ──> 登记进 handlers
                 ↑                     │
后端推送 ──> onmessage ──────> handlers 挨个通知
退出登录 ──> closeWS() ──> 关连接+杀心跳, 保留订阅名单
```

订阅

```vue
import { onMounted, onUnmounted } from 'vue' import { onWSMessage } from
'@/utils/ws' let off: (() => void) | null = null onMounted(() => { off =
onWSMessage((data) => { if (data.type === 'ORDER_PAID') { load() //
收到"新订单已支付" → 刷新订单列表 } }) }) onUnmounted(() => off?.()) // 离开页面
→ 退订
```

收到消息后

```ts
// 后端推: {"type":"ORDER_PAID","orderId":1}
socket.onmessage = (e) => {
  const data = JSON.parse(e.data) // → {type:"ORDER_PAID", orderId:1}
  handlers.forEach((fn) => fn(data)) // → 你的 load() 被调用
}
```
