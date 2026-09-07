# List

list是一个有序、可重复、有索引的容器

因为`List`本身就是一个**接口（Interface）**，所以你不能直接`new List()`。你必须使用它的具体实现类。最常用的实现类`ArrayList`和`LinkedList`

对于`List<E>`接口，可以看到几个主要的方法：

- 末尾添加一个元素：`boolean add(E e)`
- 在指定索引添加一个元素：`E add(int index, E e)`
- 删除指定索引的元素：`E remove(int index)`
- 删除某个元素：`E remove(Object o)`
- 获取指定索引的元素：`E get(int index)`
- 获取链表大小（包含元素的个数）：`int size()`
- 修改指定索引的元素：`E set(int index, E e)`

## 创建List

```java
List<Integer> list = List.of(1, 2, 5);
```

但是`List.of()`方法不接受`null`值，如果传入`null`，会抛出`NullPointerexception`异常

这样创建的是一个只读`List`，如果调用`add()`、`remove()`，会抛出`UnsupportedOperationException`

## 遍历List

和数组遍历相似，可以用`for`循环和索引配合`get(int)`方法遍历：

```java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> list = List.of("apple", "pear", "banana");
        for (int i=0; i < list.size(); i++) {
            String s = list.get(i);
            System.out.println(s);
        }
    }
}
```

但是如果是`LinkedList`，索引越大，访问速度越慢

所以最好用迭代器`Iterator`来访问`List`

`Iterator`对象有两个方法：`boolean hasNext()`判断是否有下一个元素，`E next()`返回下一个元素

```java
import java.util.Iterator;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> list = List.of("apple", "pear", "banana");
        for (Iterator<String> it = list.iterator(); it.hasNext(); ) {
            String s = it.next();
            System.out.println(s);
        }
    }
}

```

Java的`for each`循环也是使用的`Iterator`遍历

```java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> list = List.of("apple", "pear", "banana");
        for (String s : list) {
            System.out.println(s);
        }
    }
}

```



## ArrayList

我们还可以通过List接口提供的of()方法，根据给定元素快速创建List：

### 用法

通常使用多态的写法来创建List（用父接口的引用指向子类对象）

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main() {
        // 1. 创建一个只能装 String 的 ArrayList
        List<String> list = new ArrayList<>();

        // 2. 添加元素
        list.add("java");
        list.add("go");
        list.add("python");
        list.add("java"); // 允许重复元素

        // 3. 获取元素
        System.out.println(list.get(1));

        // 4. 修改元素
        list.set(3, "rust");

        // 5. 删除元素
        list.remove(2);
        list.remove("rust");

        for (String s : list) {
            System.out.prinln(s);
        }

    }
}
```

### 底层实现

ArrayList的底层就是一个普通的`Object []`**数组**

- 查询快：因为数组在内存里是连续存储的，根据索引找元素，可以通过 首地址 + 索引 \* 元素大小 的公示一步定位（时间复杂度为 `O(1)`）

- 增删慢：如果要在中间插入一个元素，它必须把该位置后面所有的元素都往后挪一位；当数组满了，它还需要创建一个更大的新数组，把所有老数据拷贝过去（扩容机制，每次扩容为原来的 1.5 倍）。

## LinkedList

```java
List<String> list = new LinkedList<>();
```

### 底层原理

它的底层是**链表**，由一个个独立的 Node（节点）通过指针串联起来的。

- 增删快：要在两个元素之间插入一个新元素，只需要修改它们前后指针的指向即可，不需要移动任何数据（时间复杂度为 `O(1)`）。
- 查询慢：因为节点在内存中是散落分布的，你想找第 100 个元素，只能老老实实从第一个节点顺着链条挨个往后数（时间复杂度为 $O(n)）。

## 比较

|                     | ArrayList    | LinkedList     |
| ------------------- | ------------ | -------------- |
| 获取指定元素        | 速度很快     | 需要从头开始找 |
| 添加元素到末尾      | 速度很快     | 速度很快       |
| 在指定位置添加/删除 | 需要移动元素 | 不需要移动元素 |
| 内存占用            | 少           | 较大           |

通常情况下，总是使用`ArrayList`

## List和Array转换

最常用的是传入一个大小恰好的数组：

```java
Integer[] array = list.toArray(new Integer[list.size()]);
```

简洁写法：

```java
Integer[] array = list.toArray(Integer[]::new);
```

反过来，把`Array`变为`List`简单多了，通过`List.of()`

```java
Integer[] array = { 1, 2, 3 };
List<Integer> list = List.of(array);
```

## equals

`List`提供了`contains`和`indexOf`方法，如果不存在返回-1

```java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> list = List.of("A", "B", "C");
        System.out.println(list.contains("C")); // true
        System.out.println(list.contains("X")); // false
        System.out.println(list.indexOf("C")); // 2
        System.out.println(list.indexOf("X")); // -1
    }
}

```

但是这里`List`中的`"C"`和调用`contains("C")`传入的`"C"`并不是同一个实例，但是仍然能得到正确的结果，这是因为`String`、`Integer`这些对象已经实现了`equals()`方法

我们`Person`为例

```java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Person> list = List.of(
            new Person("Xiao Ming"),
            new Person("Xiao Hong"),
            new Person("Bob")
        );
        System.out.println(list.contains(new Person("Bob"))); // false
    }
}

class Person {
    String name;
    public Person(String name) {
        this.name = name;
    }
}
```

原因就是`Person`类没有覆写`equals()`方法

```java
public boolean equals(Object o) {
    if (o instanceof Person p) {
        return Objects.equals(this.name, p.name) && this.age == p.age;
    }
    return false;
}
```

总结：

1. 用`instanceof`判断传入的待比较的`Object`是不是当前类型
2. 对引用类型用`Objects.equals()`比较，对基本类型直接用`==`比较

使用`Objects.equals()`比较是为了省去判断`null`，两个引用类型都是`null`时也是相等的

否则，`this.name.equals(p.name)`，如果`this.name`为`null`，`equals()`方法就会报错
