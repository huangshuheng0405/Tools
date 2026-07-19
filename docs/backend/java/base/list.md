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

## ArrayList

我们还可以通过List接口提供的of()方法，根据给定元素快速创建List：

```java
List<Integer> list = List.of(1, 2, 5);
```

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
            System.out.println(s);
        }

    }
}
```

### 底层实现

ArrayList的底层就是一个普通的`Object []`数组

- 查询快：因为数组在内存里是连续存储的，根据索引找元素，可以通过 首地址 + 索引 \* 元素大小 的公示一步定位（时间复杂度为 $O(1)$）

- 增删慢：如果要在中间插入一个元素，它必须把该位置后面所有的元素都往后挪一位；当数组满了，它还需要创建一个更大的新数组，把所有老数据拷贝过去（扩容机制，每次扩容为原来的 1.5 倍）。

## LinkedList

### 底层原理

它的底层是由一个个独立的 Node（节点）通过指针串联起来的。

- 增删快：要在两个元素之间插入一个新元素，只需要修改它们前后指针的指向即可，不需要移动任何数据（时间复杂度为 $O(1)$）。
- 查询慢：因为节点在内存中是散落分布的，你想找第 100 个元素，只能老老实实从第一个节点顺着链条挨个往后数（时间复杂度为 $O(n)$）。
