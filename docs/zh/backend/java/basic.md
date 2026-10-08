# basic

## String

```java
String s = "abc";
s += "d"; // s 指向了新对象，原对象没变 -- String 不可变
```

- 不可变：每个“修改”都会产生新对象。好处是线程安全，可做常量池、可安全当`HashMap`的key

- 常量池：`String a = "abc"`走常量池，`new String("abc")`强制在堆上新建。所以`"abc" == "abc"`是`true`，但`new String("abc") == "abc"`是`false`。同样，`String`比较一律用`equals`

- 循环拼接：每次`+=`都新建对象，循环里是`O(n^2)`

  ```java
  // 不标准
  String result = "";
  for (String id : ids) result += id + ",";
  // 标准
  StringBuilder sb = new StringBuilder();
  for (String id : ids) sb.append(id).append(',');
  String result = sb.toString();
  ```

  单次拼接（如`"a" + b + "c"`）编译器会自动优化成`StringBuilder`，不用手动改

## equals和hashCode

重写`equals`必须同时重写`hashCode`；两个`equals`相等的对象，`hashCode`必须相等

```java
// 手写写法(理解契约用)
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User u = (User) o;
    return Objects.equals(id, u.id);
}
@Override
public int hashCode() {
    return Objects.hash(id);
}
```

但是更标准的写法还是别手写

```java
public record User(Long id, String name) { }   // Java 16+,自动生成 equals/hashCode/toString
```

或者实体类上用`Lombok`的`@EqualsAndHashCode(onlyExplicitlyIncluded = true)`

## 小数别用double

```java
0.1 + 0.2 == 0.3;                    // false
new BigDecimal(0.1);                 // 0.1000000000000000055511151231257827...
new BigDecimal("0.1");               // 0.1  ← 正确
BigDecimal.valueOf(0.1);             // 0.1  ← 推荐
```

金额、价格、任何需要精确小数的场景用`BigDecimal`，并且用`String`构造或`valueOf`，比较不用`equals`（`equals`会比精度/scale，`2.0`和`2.00`不相等）

## final

同一个关键字，位置不同含义不同

```java
final int MAX = 10;  // 变量：只能赋值一次
final List<String> list = new ArrayList<>(); // 引用不能改 但 list.add() 可以
final class User {}  // 类：不能被继承（String Integer就是）
public final void save() {} // 方法：子类不嫩被继承 
```

第二个跟JS很类似，引用不能变，但是内容能变

```java
final List<String> list = new ArrayList<>();
list.add("a");        // ✅ 合法,内容变了
list = new ArrayList<>();  // ❌ 编译错误,引用不能换
```

真正要不可变集合，用`List.of(...)`/`List.copyOf(...)`，改动会抛`UnsupportedOperationException`

## static

```java
public class Counter {
    static int total = 0; // 属于类，所有实例共享一份
    int self = 0;         // 属于每个实例，各一份
}
```

- `static`成员不依赖实例，用`Counter.total`访问
- `static`方法不能直接访问实例成员（他不知道你指的是哪个实例）

## 重载 重写

重载：同名、不同参数。在编译器根据变量的静态类型就选的了，运行时不在变

```java
class Printer {
    void print(Object o) { System.out.println("object"); }
    void print(String s) { System.out.println("string"); }
}

Object obj = "hello";     // 静态类型 Object,实际类型 String
new Printer().print(obj); // 输出 "object" ← 编译期按静态类型选!
```

变量 `obj` 的静态类型是 `Object`,编译器按这个选了 `print(Object)`,即使运行时它其实是 `String`。

还有个经典陷阱:传 `null` 给重载方法时,编译器选"最具体的那个"

```java
p.print(null);   // 选 print(String),因为 String 比 Object 更具体
```

重写：子类覆写父类方法，在运行期根据对象的真实类型

```java
class Animal { String sound() { return "..."; } }
class Dog extends Animal { @Override String sound() { return "wang"; } }

Animal a = new Dog();
a.sound();     // "wang" ← 运行期看实际类型,这是多态
```

记忆点:**重载看左边(声明类型),重写看右边(实际对象)**。`@Override` 注解一定要加——它让编译器帮你检查签名写对了没,写错方法名时立刻报错而不是默默多出一个新方法。