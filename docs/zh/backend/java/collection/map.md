# Map

高效通过`key`快速查找`value`（元素）

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Xiao Ming", 99);
        Map<String, Student> map = new HashMap<>();
        map.put("Xiao Ming", s); // 将"Xiao Ming"和Student实例映射并关联
        Student target = map.get("Xiao Ming"); // 通过key查找并返回映射的Student实例
        System.out.println(target == s); // true，同一个实例
        System.out.println(target.score); // 99
        Student another = map.get("Bob"); // 通过另一个key查找
        System.out.println(another); // 未找到返回null
    }
}

class Student {
    public String name;
    public int score;
    public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

```

`Map<K, V>`是一种键-值映射表

- `put(K key, V value)`
- `V get(K key)`
- `boolean containsKey(K key)`：查询某个`key`是否存在

如果`key`不存在，则返回`null`，和`List`类似，`Map`也是接口，最常用的实现类是`HashMap`

如果对同一个`key`调用两次`put`方法，分别放入不同的`value`

```java
Map<String, Integer> map = new HashMap<>();
map.put("xiao", 20);
System.out.println(map.put("xiao", 22));
System.out.println(map.get("xiao"));
```

实际上`put()`方法的签名是`V put(K key, V value)`，如果放入的`key`已经存在，`put()`方法会返回删除的旧的`value`，否则返回`null`

## 遍历

要遍历`key`可以使用`for each`循环遍历`Map`实例的`keySet()`方法返回的`Set`集合

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 123);
        map.put("pear", 456);
        map.put("banana", 789);
        for (String key : map.keySet()) {
            Integer value = map.get(key);
            System.out.println(key + " = " + value);
        }
    }
}
```

同时遍历`key`和`value`可以使用`for each`循环遍历`Map`对象的`entrySet()`集合，它包含每一个`key-value`映射

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 123);
        map.put("pear", 456);
        map.put("banana", 789);
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            String key = entry.getKey();
            Integer value = entry.getValue();
            System.out.println(key + " = " + value);
        }
    }
}
```

> 遍历`Map`时，输出的`key`不是有序的

## HashCode

`HashMap`之所以能根据`key`直接拿到`value`，原因时它内部通过**空间换时间**的方法，用一个大数组存储所有的`value`，并根据`key`直接计算出`value`应该存在哪个索引

##### equals

当我们放入`Map`的`key`是字符串"a"，但是，当我们获取`value`时，传入的变量不一定就是放入的那个`key`对象

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        String key1 = "a";
        Map<String, Integer> map = new HashMap<>();
        map.put(key1, 123);

        String key2 = new String("a");
        map.get(key2); // 123

        System.out.println(key1 == key2); // false
        System.out.println(key1.equals(key2)); // true
    }
}
```

在`Map`的内部，对`key`的比较是通过`equals()`实现的，和`List`查找元素要正确覆写`equals()`是一样的

而`String`已经正确覆写了`equals()`

通过`key`计算索引的方式就是调用`key`对象的`hashCode()`方法，它返回一个`int`整数，`HashMap`就是通过这个方法直接定位`key`对应的`value`的索引，继而直接返回`value`

因此正确使用`Map`必须保证：

- 正确覆写`equals()`
- 正确覆写`hashCode()`

```java
public class Person {
    String firstName;
    String lastName;
    int age;

    @Override
    int hashCode() {
        int h = 0;
        h = 31 * h + firstName.hashCode();
        h = 31 * h + lastName.hashCode();
        h = 31 * h + age;
        return h;
    }
}
```

但是如果`firstName`或`lastName`为`null`，可能会抛出`NullPointerException`，所以经常借助`Objects.hash()`

```js
int hashCode() {
    return Objects.hash(firstName, lastName, age);
}
```

### 延伸

`hashCode()`返回的`int`范围高达21亿，那么内部的数组得有多大

实际上`HashMap`初始化时默认的数组大小只有16，无论它的`hashCode`有多大，都可以通过`&`

```java
int index = key.hashCode() & 0xf; // 0xf = 15
```

把索引确定在0~15

添加的`key-value`超过大小时，`HashMap`会在内部自动扩容，改变计算方式

```java
int index = key.hashCode() & 0x1f; // 0x1f = 31
```

由于扩容会导致重新分布已有的`key-value`，所以频繁扩容对`HashMap`的性能影响很大

> `hashCode()`编写的越好，`HashMap`的工作效率越高

## EnumMap

如果key的对象时enum类型，那么可以使用EnumMap，它在内部以一个非常紧凑的数组存储value，并且根据enum类型的key直接定位到内部数组的索引，并不需要计算hashCode()，不但效率最高，而且没有额外的空间浪费

```java
Map<DayOfWeek, String> map = new EnumMap<>(DayOfWeek.class);
map.put(DayOfWeek.TUESDAY, "Tuesday");
System.out.println(map);
System.out.println(map.get(DayOfWeek.TUESDAY));
```

## TreeMap

HashMap内部是无序的，而SortedMap在内部会对Key排序，注意到SortedMap是接口，它的实现类是TreeMap

SortedMap保证遍历时以Key的顺序来进行排序

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> map = new TreeMap<>();
        map.put("orange", 1);
        map.put("apple", 2);
        map.put("pear", 3);
        for (String key : map.keySet()) {
            System.out.println(key);
        }
        // apple, orange, pear
    }
}
```

使用TreeMap时，放入的Key必须实现Comparable接口，String、Integer这些类已经实现了Comparable接口，因此可以直接作为Key使用

如果没实现Comparable接口，那么在创建TreeMap时同时指定一个自定义排序算法

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<Person, Integer> map = new TreeMap<>(new Comparator<Person>() {
            public int compare(Person p1, Person p2) {
                return p1.name.compareTo(p2.name);
            }
        });
        map.put(new Person("Tom"), 1);
        map.put(new Person("Bob"), 2);
        map.put(new Person("Lily"), 3);
        for (Person key : map.keySet()) {
            System.out.println(key);
        }
        // {Person: Bob}, {Person: Lily}, {Person: Tom}
        System.out.println(map.get(new Person("Bob"))); // 2
    }
}

class Person {
    public String name;
    Person(String name) {
        this.name = name;
    }
    public String toString() {
        return "{Person: " + name + "}";
    }
}
```

Comparator接口要求实现一个比较算法，负责比较传入的两个元素

另外，注意到Person类并没有覆写equals()和hashCode()，因为TreeMap不使用这两个

看一个复杂的例子，定义Student类，并用分数score进行排序

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<Student, Integer> map = new TreeMap<>(new Comparator<Student>() {
            public int compare(Student p1, Student p2) {
                return p1.score > p2.score ? -1 : 1;
            }
        });
        map.put(new Student("Tom", 77), 1);
        map.put(new Student("Bob", 66), 2);
        map.put(new Student("Lily", 99), 3);
        for (Student key : map.keySet()) {
            System.out.println(key);
        }
        System.out.println(map.get(new Student("Bob", 66))); // null?
    }
}

class Student {
    public String name;
    public int score;
    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }
    public String toString() {
        return String.format("{%s: score=%d}", name, score);
    }
}
```

在查找时出现了null，在比较的时候，我们只返回了-1、1，并没有判断相等的情况，也就是没有返回0，所以TreeMap工作出问题了。于是代码修改如下

```java
public int compare(Student p1, Student p2) {
    if (p1.score == p2.score) {
        return 0;
    }
    return p1.score > p2.score ? -1 : 1;
}
```

或者借助`Integer.compare(int, int)`也可以返回正确的比较结果
