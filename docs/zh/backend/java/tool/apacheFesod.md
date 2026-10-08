# Apache Fesod

Apache Fesod(Incubating) 是读写 Excel 的 Java 库。它的前身就是大家熟悉的 **EasyExcel** —— 阿里开源的、用来替代 Apache POI 的内存友好型 Excel 库。

一条线理清它的来历:

| 阶段              | 坐标                           | 状态                            |
| ----------------- | ------------------------------ | ------------------------------- |
| Alibaba EasyExcel | `com.alibaba:easyexcel`        | 2024-11 停更,最后版本 4.0.3     |
| FastExcel         | `cn.idev.excel:fastexcel`      | 原作者出走后另起,最后版本 1.3.0 |
| Apache Fesod      | `org.apache.fesod:fesod-sheet` | 捐给 Apache 孵化,当前维护版本   |

EasyExcel 的 GitHub 仓库已归档只读,不再有 bug 修复和 CVE 响应。所以新项目直接用 Fesod。

**API 几乎完全一致**,区别只有三处:

| 变化点 | EasyExcel                            | Fesod                                  |
| ------ | ------------------------------------ | -------------------------------------- |
| 包名   | `com.alibaba.excel.*`                | `org.apache.fesod.sheet.*`             |
| 入口类 | `EasyExcel.write(...)`               | `FesodSheet.write(...)`                |
| 坐标   | `<artifactId>easyexcel</artifactId>` | `<artifactId>fesod-sheet</artifactId>` |

网上和公司里的老教程全是 EasyExcel 写法,把这三处换掉就能直接抄。

> 为什么要用它而不是 POI:POI 的 `XSSFWorkbook` 会把整个文件读进内存,几十万行直接 OOM。Fesod 基于 SAX 逐行解析,读的时候可以边读边丢,写的时候可以分批写。

## 引入依赖

```xml
<dependency>
    <groupId>org.apache.fesod</groupId>
    <artifactId>fesod-sheet</artifactId>
    <version>2.0.2-incubating</version>
</dependency>
```

Gradle:

```groovy
implementation 'org.apache.fesod:fesod-sheet:2.0.2-incubating'
```

`fesod-sheet` 会自动带上 `fesod-common`(工具类)和 `fesod-shaded`(依赖隔离)。**不需要再单独引 POI**,它已经打进 shaded 包里了,自己再引一份反而可能冲突。

JDK 要求:2.0.x 支持 JDK 8 ~ 25。

**版本号必须自己写。** `org.apache.fesod` 不在 `spring-boot-dependencies` 的管理范围内,漏了 `<version>` 直接编译报错。

## 写入 Excel

### 最简写法

先定义一个数据类,用 `@ExcelProperty` 标注每个字段对应哪一列:

```java
@Data
public class DemoData {

    @ExcelProperty("字符串标题")
    private String string;

    @ExcelProperty("日期标题")
    private Date date;

    @ExcelProperty("数字标题")
    private Double doubleData;

    @ExcelIgnore
    private String innerField;   // 不导出
}
```

然后一行写出去:

```java
String fileName = "demo.xlsx";
FesodSheet.write(fileName, DemoData.class)
        .sheet("模板")        // sheet 名,不传默认叫 Sheet0
        .doWrite(dataList);
```

写出来的表头顺序 = 字段在类里的**声明顺序**。想固定顺序就加 `index`:

```java
@ExcelProperty(value = "字符串标题", index = 0)
private String string;
```

> 建议**要么所有字段都写 `index`,要么一个都不写**。混着用时列顺序取决于框架怎么调和 `index` 和声明顺序,很容易和预期对不上。

### 写多级表头

`@ExcelProperty` 传数组,数组长度就是表头行数:

```java
@ExcelProperty({"主标题", "字符串标题"})
private String string;

@ExcelProperty({"主标题", "日期标题"})
private Date date;
```

上面两个字段共享第一行的"主标题",第二行各自分开。

### 大数据量:分批写

`doWrite()` 是一次性把整个 list 交出去。几十万行时,数据本身就在内存里占一份,再加上写入缓冲,容易顶不住。这时用 `ExcelWriter` 分批喂:

```java
try (ExcelWriter writer = FesodSheet.write(fileName, DemoData.class).build()) {
    WriteSheet sheet = FesodSheet.writerSheet("模板").build();

    // 分页查库,每批 10000 条写一次
    int pageSize = 10000;
    for (int page = 1; ; page++) {
        List<DemoData> batch = mapper.selectPage(page, pageSize);
        if (batch.isEmpty()) {
            break;
        }
        writer.write(batch, sheet);
    }
}
```

关键点:**同一个 `WriteSheet` 对象反复传进去**,数据会往同一个 sheet 里追加。`ExcelWriter` 本身持有文件句柄,必须 `try-with-resources` 或者手动 `finish()`,否则文件写不完整。

### 只导出部分列

```java
// 排除某些字段
Set<String> exclude = new HashSet<>();
exclude.add("date");
FesodSheet.write(fileName, DemoData.class).excludeColumnFieldNames(exclude).sheet("模板").doWrite(list);

// 只要某些字段
Set<String> include = new HashSet<>();
include.add("date");
FesodSheet.write(fileName, DemoData.class).includeColumnFieldNames(include).sheet("模板").doWrite(list);
```

### 一个文件多个 sheet

```java
try (ExcelWriter writer = FesodSheet.write(fileName, DemoData.class).build()) {
    writer.write(list1, FesodSheet.writerSheet(0, "第一个").build());
    writer.write(list2, FesodSheet.writerSheet(1, "第二个").build());
}
```

不同 sheet 的数据结构不同的话,在 `writerSheet` 上重新指定 head:

```java
FesodSheet.writerSheet(1, "第二个").head(OtherData.class).build()
```

## 读取 Excel

读取的核心是**监听器**:Fesod 逐行解析,每解析出一行就回调一次你的监听器。所以文件多大都不会一次性进内存 —— 前提是你在监听器里也别攒着不放。

### 最简写法

```java
FesodSheet.read(fileName, DemoData.class, new DemoDataListener())
        .sheet()          // 不传读第一个 sheet
        .doRead();
```

监听器:

```java
public class DemoDataListener implements ReadListener<DemoData> {

    @Override
    public void invoke(DemoData data, AnalysisContext context) {
        // 每读到一行进来一次
        System.out.println(data);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 全部读完回调一次
    }
}
```

### 分批入库

一行一行往数据库 insert 是最常见的性能灾难。标准做法是攒够一批再批量插入:

```java
@Slf4j
public class DemoDataListener implements ReadListener<DemoData> {

    private static final int BATCH_COUNT = 100;
    private List<DemoData> cached = new ArrayList<>(BATCH_COUNT);

    private final DemoDataMapper mapper;

    public DemoDataListener(DemoDataMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void invoke(DemoData data, AnalysisContext context) {
        cached.add(data);
        if (cached.size() >= BATCH_COUNT) {
            mapper.insertBatch(cached);
            cached = new ArrayList<>(BATCH_COUNT);   // 用完必须换新 list
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        if (!cached.isEmpty()) {
            mapper.insertBatch(cached);   // 最后不满一批的别忘了
        }
        log.info("解析完成");
    }
}
```

> **`invoke` 里不要写 `cached.clear()`。** 如果 `mapper.insertBatch` 是异步的或者 MyBatis 批量插入延迟执行,`clear()` 会把还没写库的数据清掉 —— 换成新 list 是唯一安全的做法。

### 更省事的写法:PageReadListener

不想为每种类型写一个监听器,用官方的分页监听器,传个 lambda 就行:

```java
FesodSheet.read(fileName, DemoData.class, new PageReadListener<DemoData>(dataList -> {
    mapper.insertBatch(dataList);
}, 100))
        .sheet()
        .doRead();
```

第二个参数是每批条数,默认 100。

### 表头校验

用户传上来的 Excel 表头经常对不上,在 `invokeHead` 里拦一下:

```java
@Override
public void invokeHead(Map<Integer, ReadCellData<?>> headMap, AnalysisContext context) {
    headMap.forEach((index, cell) ->
            log.info("第 {} 列表头: {}", index, cell.getStringValue()));
}
```

常见的做法是和预期表头逐个比对,对不上直接抛异常终止读取。

### 解析出错时跳过这一行

某一行格式不对(比如日期列填了文字),默认会整个抛异常中断。想跳过继续:

```java
@Override
public void onException(Exception exception, AnalysisContext context) throws Exception {
    if (exception instanceof ExcelDataConvertException e) {
        log.warn("第 {} 行第 {} 列解析失败,已跳过",
                e.getRowIndex() + 1, e.getColumnIndex() + 1);
        return;   // 不往外抛,继续读下一行
    }
    throw exception;   // 其他异常照常抛出
}
```

### 读多个 sheet

每个 sheet 用各自的监听器:

```java
try (ExcelReader reader = FesodSheet.read(fileName).build()) {
    ReadSheet sheet1 = FesodSheet.readSheet(0)
            .head(DemoData.class)
            .registerReadListener(new DemoDataListener())
            .build();

    ReadSheet sheet2 = FesodSheet.readSheet(1)
            .head(OtherData.class)
            .registerReadListener(new OtherDataListener())
            .build();

    reader.read(sheet1, sheet2);   // 一次读多个,避免重复解析文件
}
```

## 注解速查

**字段映射**(`org.apache.fesod.sheet.annotation`):

| 注解                      | 作用                                                  |
| ------------------------- | ----------------------------------------------------- |
| `@ExcelProperty`          | 标记字段对应的列,可用 `value`(表头名)或 `index`(列号) |
| `@ExcelIgnore`            | 读写都跳过这个字段                                    |
| `@ExcelIgnoreUnannotated` | 加在**类**上,没标 `@ExcelProperty` 的字段全部忽略     |

**格式转换**(`annotation.format`):

| 注解              | 作用                                        |
| ----------------- | ------------------------------------------- |
| `@DateTimeFormat` | 日期格式,如 `@DateTimeFormat("yyyy-MM-dd")` |
| `@NumberFormat`   | 数字格式,如 `@NumberFormat("#.##%")`        |

**样式**(`annotation.write.style`):

| 注解                 | 作用                    |
| -------------------- | ----------------------- |
| `@ColumnWidth`       | 列宽,可加在类上或字段上 |
| `@HeadRowHeight`     | 表头行高                |
| `@ContentRowHeight`  | 内容行高                |
| `@HeadStyle`         | 表头单元格样式          |
| `@ContentStyle`      | 内容单元格样式          |
| `@HeadFontStyle`     | 表头字体                |
| `@ContentFontStyle`  | 内容字体                |
| `@ContentLoopMerge`  | 每隔 N 行合并一次单元格 |
| `@OnceAbsoluteMerge` | 指定坐标合并一次单元格  |
| `@FreezePane`        | 冻结窗格                |

样式注解写在数据类上:

```java
@Data
@ColumnWidth(25)
@HeadRowHeight(20)
@ContentRowHeight(15)
@HeadStyle(fillPatternType = FillPatternType.SOLID_FOREGROUND, fillForegroundColor = 10)
@HeadFontStyle(fontHeightInPoints = 14, bold = true)
public class DemoData {

    @ExcelProperty("字符串标题")
    @ColumnWidth(50)                 // 字段上单独覆盖
    private String string;

    @ExcelProperty("日期标题")
    @DateTimeFormat("yyyy年MM月dd日")
    private Date date;
}
```

> `fillForegroundColor` 这些是 POI 的 `IndexedColors` 索引。写法繁琐又不好记,不如直接在模板里调好格式用"填充"功能(见下面)。

## 自定义转换器

`@DateTimeFormat` / `@NumberFormat` 覆盖不了的情况,比如"1 存男、0 存女",或者"金额统一乘 100",就自己写 `Converter`:

```java
public class GenderConverter implements Converter<String> {

    @Override
    public Class<?> supportJavaTypeKey() {
        return String.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    // Excel → Java
    @Override
    public String convertToJavaData(ReadConverterContext<?> context) {
        String value = context.getReadCellData().getStringValue();
        return "1".equals(value) ? "男" : "女";
    }

    // Java → Excel
    @Override
    public WriteCellData<?> convertToExcelData(WriteConverterContext<String> context) {
        return new WriteCellData<>("男".equals(context.getValue()) ? "1" : "0");
    }
}
```

挂上去有两种方式:

```java
// 1. 字段级:只作用于这一个字段
@ExcelProperty(value = "性别", converter = GenderConverter.class)
private String gender;

// 2. 全局级:所有 String 类型的字段都用它
FesodSheet.write(fileName, DemoData.class)
        .registerConverter(new GenderConverter())
        .sheet("模板")
        .doWrite(list);
```

> 别写网上老教程的 `convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty p, GlobalConfiguration c)` 三段式签名 —— 那两个方法从 4.x 起已标记 `@Deprecated`,新代码一律用带 `Context` 的版本。

## 填充模板

写死样式的报表用"填充"更省事:先在 Excel 里把格式、合并单元格、公式都调好,把要变的格子换成 `{占位符}`,代码只管塞数据。

占位符有两种写法,区别很关键:

| 写法           | 含义                        |
| -------------- | --------------------------- |
| `{name}`       | 普通变量,填一个值           |
| `{.name}`      | **列表**,会往下循环复制整行 |
| `{data1.name}` | 带前缀的列表,配合多列表用   |

### 列表填充

模板里某行写成 `{.name}` `{.number}`,代码:

```java
FesodSheet.write(fileName)
        .withTemplate(templateFileName)
        .sheet()
        .doFill(dataList);
```

数据多的话,还是分批填避免一次全进内存:

```java
try (ExcelWriter writer = FesodSheet.write(fileName).withTemplate(templateFileName).build()) {
    WriteSheet sheet = FesodSheet.writerSheet().build();

    FillConfig config = FillConfig.builder().forceNewRow(Boolean.TRUE).build();
    for (List<FillData> batch : batches) {
        writer.fill(batch, config, sheet);
    }
}
```

`forceNewRow(true)` 的作用:列表行下面如果还有别的内容(比如合计行),开启后新行会**插入**而不是覆盖,否则下面的内容会被顶掉。

### 变量和列表混合填充

```java
try (ExcelWriter writer = FesodSheet.write(fileName).withTemplate(templateFileName).build()) {
    WriteSheet sheet = FesodSheet.writerSheet().build();

    // 先填列表
    writer.fill(dataList, FillConfig.builder().forceNewRow(Boolean.TRUE).build(), sheet);

    // 再填变量,模板里写 {date} {total}
    Map<String, Object> map = new HashMap<>();
    map.put("date", new Date());
    map.put("total", 1000);
    writer.fill(map, sheet);
}
```

变量填充不带 `forceNewRow` 的那个重载,直接 `fill(map, sheet)`。

### 多列表填充

一个模板里要填好几段结构相同的列表时,用 `FillWrapper` 加前缀区分。模板里分别写 `{data1.name}`、`{data2.name}`:

```java
writer.fill(new FillWrapper("data1", list1), sheet);
writer.fill(new FillWrapper("data2", list2), sheet);
```

## Spring Boot 上传下载

### 上传

监听器里注入 Mapper 的需求很常见,但监听器是 `new` 出来的、不是 Spring Bean,所以要么构造函数把依赖传进去,要么在 Controller 里 `new` 的时候传:

```java
@PostMapping("/import")
public String upload(MultipartFile file) throws IOException {
    FesodSheet.read(file.getInputStream(), DemoData.class, new DemoDataListener(demoDataMapper))
            .sheet()
            .doRead();
    return "success";
}
```

### 下载

```java
@GetMapping("/export")
public void download(HttpServletResponse response) throws IOException {
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setCharacterEncoding("utf-8");

    // 文件名必须 URL 编码,否则中文文件名在部分浏览器上乱码
    String fileName = URLEncoder.encode("用户列表", StandardCharsets.UTF_8).replaceAll("\\+", "%20");
    response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");

    FesodSheet.write(response.getOutputStream(), DemoData.class)
            .sheet("模板")
            .doWrite(dataList);
}
```

注意写的是 `response.getOutputStream()`,不要自己再 `close()`,交给容器管。

## 注意事项

- **文件名后缀必须是 `.xlsx`**。EasyExcel/Fesod 只支持 xlsx 格式(本质是 OOXML),传 `.xls` 会报错。
- **读取时优先按表头名匹配,不是按列序**。`@ExcelProperty("姓名")` 找的是表头文字完全等于"姓名"的那一列,多个空格都会匹配不上。想按列号匹配就显式写 `index`。
- **写入时默认按字段声明顺序**,和 `index` 混用会乱,要么全写 `index` 要么全不写。
- **`doWrite()` 拿的是完整 list**,几十万行会先全查出来进内存。量大就换 `ExcelWriter` 分批写。
- **监听器实例不要复用**。`new` 一个监听器配一次 `read()`,同一个监听器对象注册到多个 sheet 上,内部缓存会串。
- **`ExcelWriter` / `ExcelReader` 必须关闭**。用 `try-with-resources`,或者手动 `finish()`,否则文件写不完整、句柄泄漏。
- 想读 `.csv` 用 `ExcelTypeEnum.CSV`;`.xls`(老格式)不支持,让用户另存为 xlsx。

## 从 EasyExcel 迁过来

三步,基本是纯机械替换:

1. 换 Maven 坐标:`com.alibaba:easyexcel` → `org.apache.fesod:fesod-sheet`
2. IDE 全局替换包名:`com.alibaba.excel` → `org.apache.fesod.sheet`
3. 全局替换入口类:`EasyExcel` → `FesodSheet`

容易漏的两处:

- **自定义 `Converter` 的签名**:EasyExcel 3.x 的三段式方法(`convertToJavaData(ReadCellData, ExcelContentProperty, GlobalConfiguration)`)在 4.x/Fesod 上虽然还能跑(标了 `@Deprecated`),但建议顺手改成 `ReadConverterContext` / `WriteConverterContext` 版本。
- **`AnalysisEventListener`**:老代码里常见的这个类在新版本里已经不是推荐接口,统一换成 `ReadListener`,方法名一致。

跑一遍回归测试,主要验证日期格式和自定义转换器这两块 —— 这两处最容易因为默认行为变化而静默出错。
