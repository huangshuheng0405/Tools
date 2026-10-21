# localhost

在绝大多数场景下`localhost`和`127.0.0.1`是可以互换使用的，但是它们**本质不同**，尤其在一些特殊场景（MySQL、Docker、SSH隧道）会有区别

## 本质区别

|              | `localhost`                      | `127.0.0.1`    |
| ------------ | -------------------------------- | -------------- |
| 是什么       | 主机名（hostname）               | IPV回环IP地址  |
| 类型         | 名字                             | 地址           |
| 是否需要解析 | 需要（通过hosts文件或DNS）       | 不需要，直接用 |
| 解析结果     | 通常是`127.0.0.1`，也可能是`::1` | 就是本身       |

`localhost`是一个名字，`127.0.0.1`是地址，名字需要被**解析**才能使用

## 解析

系统拿到`localhost`后，回去查解析规则，通常顺序是：

1. `/etc/hosts`文件
2. DNS（一般不会把localhost交给DNS）

典型的`/etc/hosts`：

```
127.0.0.1   localhost
::1         localhost ip6-localhost ip6-loopback
```

注意这里有两行：

- `127.0.0.1 localhost` → IPv4 解析
- `::1 localhost` → IPv6 解析

所以用哪个取决于系统用哪个协议族（由`getaddrinfo`的顺序和`etc/gai.conf`决定）

> 服务只监听了 IPv4 的 `127.0.0.1:3306`，客户端却把 `localhost` 解析成了 `::1`，去连 IPv6 的 3306，结果 `Connection refused`。
