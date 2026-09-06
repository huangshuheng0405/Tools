# Hutool

一个Java工具类

```
Hutool
├── Bean 操作
├── 字符串处理
├── 集合处理
├── 日期时间
├── JSON
├── 加密
├── HTTP
├── 文件
├── 随机数
├── JWT
└── ...
```

## BeanUtil

### copyProperties

它会按照**属性名**自动复制

```java
UserDTO dto = BeanUtil.copyProperties(user, UserDTO.class);

User
 ↓
id        → id
nickName  → nickName
icon      → icon
 ↓
UserDTO
```

### beanToMap

把Java Bean转成Map

```java
Map<String, Object> map = BeanUtil.beanToMap(userDTO);
```

## MapUtil

专门处理Map的工具

```java
MapUtil.getStr(map, "name");

// 相当于
Object value = map.get("name");

String name = value == null ? null : value.toString();
```

