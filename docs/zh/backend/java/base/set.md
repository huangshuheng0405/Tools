# set

如果我们只需要存储不重复的key，并不需要存储映射的value，那么就可以使用`Set`

`Set`主要提供以下几个方法：

- 将元素添加进`Set<E>`：`boolean add(E e)`
- 将元素从`Set<E>`中删除：`boolean remove(Object e)`
- 判断是否包含某个元素：`boolean contains(Object e)`

示例

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        System.out.println(set.add("abc")); // true
        System.out.println(set.add("xyz")); // true
        System.out.println(set.add("xyz")); // false，添加失败，因为元素已存在
        System.out.println(set.contains("xyz")); // true，元素存在
        System.out.println(set.contains("XYZ")); // false，元素不存在
        System.out.println(set.remove("hello")); // false，删除失败，因为元素不存在
        System.out.println(set.size()); // 2，一共两个元素
    }
}
```
