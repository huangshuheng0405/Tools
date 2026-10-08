# Apache POI

## 引入

在`pom.xml`引入依赖

```xml
<dependencies>
    <!-- 核心依赖，用于处理 .xlsx 和 .docx 等 OOXML 格式 -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi-ooxml</artifactId>
        <version>5.2.5</version> <!-- 建议使用 5.2.x 或更新的稳定版 -->
    </dependency>
</dependencies>
```

## Excel

主要围绕`Workbook`、`Sheet`、`Row`、`Cell`这几个接口展开

### 写入文件

```java
 		// 创建一个新的工作簿
        XSSFWorkbook workbook = new XSSFWorkbook();
        // 创建一个工作表 Sheet
        XSSFSheet sheet = workbook.createSheet();
        // 创建一个行 行号从0开始
        XSSFRow row = sheet.createRow(0);
        // 在行中创建单元格 并设置值
        row.createCell(0).setCellValue("姓名");
        row.createCell(1).setCellValue("年龄");
        row.createCell(2).setCellValue("注册日期");

        // 创建第二行数据
        XSSFRow dataRow = sheet.createRow(1);
        dataRow.createCell(0).setCellValue("huang");
        dataRow.createCell(1).setCellValue(18);

        // 处理日期类型
        XSSFCell dataCell = dataRow.createCell(2);
        dataCell.setCellValue(new Date());
        // 为日期单元格创建样式 否则会显示为数字
        XSSFCellStyle cellStyle = workbook.createCellStyle();
        XSSFCreationHelper creationHelper = workbook.getCreationHelper();
        cellStyle.setDataFormat(creationHelper.createDataFormat().getFormat("yyyy-MM-dd"));
        dataCell.setCellStyle(cellStyle);

        // 将工作簿写入文件
        try {
            FileOutputStream fileOutputStream = new FileOutputStream("D://info.xlsx");
            workbook.write(fileOutputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
```

### 读取文件

```java
	try (FileInputStream fileInputStream = new FileInputStream("D://info.xlsx")) {
            XSSFWorkbook workbook = new XSSFWorkbook(fileInputStream);
            XSSFSheet sheet = workbook.getSheetAt(0);
            // 遍历所有行
            for (Row row : sheet) {
                // 遍历所有单元格
                for (Cell cell : row) {
                    // 根据单元格类型读取值
                    switch (cell.getCellType()) {
                        // 字符串
                        case STRING:
                            System.out.print(cell.getStringCellValue() + "\t");
                            break;
                        // 数字
                        case NUMERIC:
                            if (DateUtil.isCellDateFormatted(cell)) {
                                System.out.print(cell.getDateCellValue() + "\t");
                            } else {
                                System.out.print(cell.getNumericCellValue() + "\t");
                            }
                            break;
                        // 布尔
                        case BOOLEAN:
                            System.out.print(cell.getBooleanCellValue() + "\t");
                            break;
                        case FORMULA:
                            System.out.print(cell.getCellFormula() + "\t");
                            break;
                        default:
                            System.out.print("UNKNOWN\t");
                            break;
                    }
                }
                System.out.println();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
```

