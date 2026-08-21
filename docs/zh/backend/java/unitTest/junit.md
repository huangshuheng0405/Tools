# JUnit

JUnit 是 Java 最主流的**单元测试框架**，JUnit 5（也叫 JUnit Jupiter）是目前的标准版本。

核心思想：写一段代码来**自动验证**另一段代码是否正确，不用每次手动 `main` 方法去跑。

## Maven 依赖

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.11.4</version>
    <scope>test</scope>
</dependency>
```

> `scope` 设为 `test` 表示这个依赖只在测试代码里能用，不会打进最终的 jar 包。

## 第一个测试

假设有一个计算器类：

```java
// src/main/java/com/example/Calculator.java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}
```

对应的测试类：

```java
// src/test/java/com/example/CalculatorTest.java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculatorTest {

    @Test
    void testAdd() {
        Calculator calc = new Calculator();
        int result = calc.add(2, 3);
        assertEquals(5, result);
    }
}
```

在 IDE 里对着 `testAdd` 方法名右键 → 运行，或者用 `mvn test` 执行。

## 核心注解

| 注解 | 作用 | 执行次数 |
|------|------|----------|
| `@Test` | 标记一个方法是测试方法 | 每个测试方法一次 |
| `@BeforeEach` | 在**每个** `@Test` 之前执行 | N 次（N = 测试方法数） |
| `@AfterEach` | 在**每个** `@Test` 之后执行 | N 次 |
| `@BeforeAll` | 在**所有** `@Test` 之前执行（仅一次） | 1 次 |
| `@AfterAll` | 在**所有** `@Test` 之后执行（仅一次） | 1 次 |
| `@Disabled` | 跳过该测试方法 | 0 次 |

> `@BeforeAll` 和 `@AfterAll` 修饰的方法必须是 `static` 的（除非测试类用 `@TestInstance(Lifecycle.PER_CLASS)` 修改了生命周期）。

## 执行顺序

单文件运行规则：

1. `@BeforeAll`（如果有）
2. 对每个 `@Test`：
   - `@BeforeEach`
   - `@Test`
   - `@AfterEach`
3. `@AfterAll`（如果有）

示例：

```java
import org.junit.jupiter.api.*;

class LifecycleTest {

    @BeforeAll
    static void initAll() {
        System.out.println("BeforeAll — 全局初始化（只跑一次）");
    }

    @BeforeEach
    void init() {
        System.out.println("BeforeEach — 每个测试前都会跑");
    }

    @Test
    void testOne() {
        System.out.println("testOne");
    }

    @Test
    void testTwo() {
        System.out.println("testTwo");
    }

    @AfterEach
    void tearDown() {
        System.out.println("AfterEach — 每个测试后都会跑");
    }

    @AfterAll
    static void tearDownAll() {
        System.out.println("AfterAll — 全局清理（只跑一次）");
    }
}
```

输出：

```
BeforeAll — 全局初始化（只跑一次）
BeforeEach — 每个测试前都会跑
testOne
AfterEach — 每个测试后都会跑
BeforeEach — 每个测试前都会跑
testTwo
AfterEach — 每个测试后都会跑
AfterAll — 全局清理（只跑一次）
```

> 每个 `@Test` 方法会拿到**独立的新实例**（JUnit 默认行为）。`testTwo` 里改的字段不会影响 `testOne`，两者完全隔离。

## 常用断言

断言就是"我期望某件事一定是真的，否则测试失败"。导入 `org.junit.jupiter.api.Assertions.*`。

```java
// 相等
assertEquals(42, result);

// 不等
assertNotEquals(0, result);

// 布尔条件
assertTrue(user.isLoggedIn());
assertFalse(list.isEmpty());

// 是否为 null
assertNull(errorMessage);
assertNotNull(user);

// 是否同一个引用（==）
assertSame(expected, actual);

// 包含子串
assertTrue(message.contains("success"));

// 数组比较
assertArrayEquals(new int[]{1, 2, 3}, resultArray);
```

## 断言异常

```java
@Test
void testDivideByZero() {
    Calculator calc = new Calculator();

    assertThrows(ArithmeticException.class, () -> {
        calc.divide(10, 0);
    });
}
```

也可以拿到异常对象做进一步验证：

```java
@Test
void testExceptionMessage() {
    Exception ex = assertThrows(IllegalArgumentException.class, () -> {
        throw new IllegalArgumentException("年龄不能为负数");
    });

    assertEquals("年龄不能为负数", ex.getMessage());
}
```

## 参数化测试

同一个测试逻辑，传不同的参数跑多次。需要额外引入依赖：

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-params</artifactId>
    <version>5.11.4</version>
    <scope>test</scope>
</dependency>
```

基本用法：

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ParamTest {

    @ParameterizedTest
    @ValueSource(ints = {2, 4, 6, 8, 10})
    void testIsEven(int number) {
        assertTrue(number % 2 == 0);
    }
}
```

`@ValueSource` 测试会分别用 `2`、`4`、`6`、`8`、`10` 执行一次。

更多数据来源：

```java
//  测试 (input, expected) 组合
@ParameterizedTest
@CsvSource({
    "1, 2",   // input=1, expected=2
    "2, 4",   // input=2, expected=4
    "3, 6"    // input=3, expected=6
})
void testDouble(int input, int expected) {
    assertEquals(expected, input * 2);
}

// null 和空字符串
@ParameterizedTest
@NullAndEmptySource
void testIsBlank(String text) {
    assertTrue(text == null || text.isEmpty());
}

// 方法作为数据源
@ParameterizedTest
@MethodSource("provideNumbers")
void testWithMethodSource(int input, int expected) {
    assertEquals(expected, input * input);
}

static Stream<Arguments> provideNumbers() {
    return Stream.of(
        Arguments.of(2, 4),
        Arguments.of(3, 9),
        Arguments.of(4, 16)
    );
}
```

## 常用源注解速查

| 注解 | 用途 |
|------|------|
| `@ValueSource` | 单一原始类型列表（ints、strings 等） |
| `@CsvSource` | CSV 格式的多参数值 |
| `@MethodSource` | 从静态方法获取参数 |
| `@NullSource` | 传入 `null` |
| `@EmptySource` | 传入空字符串或空集合 |
| `@NullAndEmptySource` | 先传 `null`，再传空值 |

## 常用命令

```bash
# 运行全部测试
mvn test

# 跳过测试
mvn package -DskipTests
```
