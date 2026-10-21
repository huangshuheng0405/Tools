# to mysql

## Java类型映射

查看[MySQL数据类型](../../database/mysql#数据类型)

| MySQL        | Java                 |
| ------------ | -------------------- |
| `tinyint(1)` | `Boolean`            |
| `tinyint`    | `Byte`               |
| `int`        | `Integer`            |
| `bigint`     | `Long`               |
| `decimal`    | `BigDecimal`         |
| `varchar`    | `String`             |
| `text`       | `String`             |
| `datetime`   | `LocalDateTime`      |
| `date`       | `LocalDate`          |
| `time`       | `LocalTime`          |
| `json`       | `String`或自定义类型 |
