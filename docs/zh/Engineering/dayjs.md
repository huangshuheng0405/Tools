# Day.js

[Day.js](https://day.js.org/) 是一个轻量的日期时间库，API 与 Moment.js 接近，但默认不可变，核心包体积很小。

```ts
import dayjs from 'dayjs'

dayjs().format('YYYY-MM-DD HH:mm:ss')
```

## 安装

::: code-group

```bash [npm]
npm i dayjs
```

```bash [yarn]
yarn add dayjs
```

```bash [pnpm]
pnpm add dayjs
```

```bash [bun]
bun add dayjs
```

:::

## 创建与解析

### 当前时间

```ts
import dayjs from 'dayjs'

const now = dayjs()
```

### 从字符串解析

ISO 8601 格式可以直接解析：

```ts
dayjs('2024-01-01')
dayjs('2024-01-01 10:30:00')
dayjs('2024-01-01T10:30:00+08:00')
```

带 `Z` 或时区偏移的 ISO 字符串会携带明确的时区信息；不带时区的字符串会按本地时区解析。

### 从 Date 或时间戳解析

```ts
dayjs(new Date(2024, 0, 1))
dayjs(1704067200000) // 毫秒时间戳
dayjs.unix(1704067200) // 秒时间戳
```

### 自定义格式解析

如果字符串不是 ISO 格式，需要加载 `customParseFormat` 插件：

```ts
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const date = dayjs('25/01/2024', 'DD/MM/YYYY')
const strictDate = dayjs('25/01/2024', 'DD/MM/YYYY', true)
```

第三个参数传入 `true` 时启用严格模式，格式不完全匹配会得到无效日期。

### 判断是否有效

```ts
const date = dayjs('not-a-date')

date.isValid() // false
```

展示用户输入或接口数据时，应先判断 `isValid()`，避免继续格式化无效日期。

## 格式化

```ts
const date = dayjs('2024-01-01 09:05:06.123')

date.format() // ISO 8601 字符串，包含当前本地时区偏移
date.format('YYYY-MM-DD')
date.format('YYYY年MM月DD日')
date.format('HH:mm:ss')
date.format('YYYY-MM-DD HH:mm:ss.SSS')
date.format('dddd')
```

常用格式化 token：

| Token | 含义 | 示例 |
| --- | --- | --- |
| `YYYY` | 四位年份 | `2024` |
| `MM` | 两位月份 | `01` |
| `DD` | 两位日期 | `09` |
| `HH` | 24 小时制 | `15` |
| `mm` | 分钟 | `05` |
| `ss` | 秒 | `06` |
| `SSS` | 毫秒 | `123` |
| `dddd` | 星期全称 | `Monday` |
| `Z` | 时区偏移 | `+08:00` |
| `X` | 秒级 Unix 时间戳 | `1704099906` |
| `x` | 毫秒级 Unix 时间戳 | `1704099906123` |

`Q`、`Do`、`k`、`kk` 等 token 需要加载 `advancedFormat` 插件：

```ts
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

dayjs().format('YYYY-Q')
dayjs().format('Do')
```

## 读取与设置

### 读取字段

```ts
const date = dayjs('2024-01-09 15:30:45.123')

date.year() // 2024
date.month() // 0，月份从 0 开始
date.date() // 9，一个月中的第几天
date.day() // 2，星期，0 表示星期日
date.hour() // 15
date.minute() // 30
date.second() // 45
date.millisecond() // 123
date.daysInMonth() // 31
```

注意：`month()` 从 `0` 开始，但 `format('MM')` 从 `01` 开始。

### 设置字段

Day.js 实例不可变，设置方法会返回新实例：

```ts
const date = dayjs('2024-01-01')

const nextYear = date.year(2025)
const changed = date.set('month', 5).set('date', 15)

date.format('YYYY-MM-DD') // 2024-01-01，原实例不变
nextYear.format('YYYY-MM-DD') // 2025-01-01
changed.format('YYYY-MM-DD') // 2024-06-15
```

## 加减时间

```ts
const date = dayjs('2024-01-31')

date.add(1, 'day')
date.add(2, 'month')
date.add(1, 'year')
date.add(90, 'minute')

date.subtract(1, 'week')
date.subtract(3, 'hour')
```

常用单位包括 `year`、`month`、`week`、`day`、`hour`、`minute`、`second` 和 `millisecond`。

月末加月份时，Day.js 会把结果限制在目标月份的最后一天：

```ts
dayjs('2024-01-31').add(1, 'month').format('YYYY-MM-DD')
// 2024-02-29
```

## 获取起止时间

```ts
const date = dayjs('2024-01-09 15:30:45')

date.startOf('day').format('YYYY-MM-DD HH:mm:ss')
// 2024-01-09 00:00:00

date.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS')
// 2024-01-09 23:59:59.999

date.startOf('month').format('YYYY-MM-DD')
// 2024-01-01

date.endOf('month').format('YYYY-MM-DD')
// 2024-01-31
```

常见查询范围可以这样生成：

```ts
const start = dayjs().startOf('day')
const end = dayjs().endOf('day')
```

## 比较时间

### isBefore、isAfter 和 isSame

```ts
const date = dayjs('2024-01-01')

date.isBefore(dayjs('2024-02-01')) // true
date.isAfter('2023-12-31') // true
date.isSame('2024-01-01') // true
date.isSame('2024-01-02', 'month') // true
```

第二个参数可以限制比较精度。例如按 `day` 比较时，同一天的不同时刻也会被视为相同。

### 包含相等的情况

`isSameOrBefore` 和 `isSameOrAfter` 是插件方法：

```ts
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const date = dayjs('2024-01-01')

date.isSameOrBefore('2024-01-01', 'day') // true
date.isSameOrAfter('2024-01-01', 'day') // true
```

### 判断星期

```ts
dayjs('2024-01-07').day() // 0，星期日
dayjs('2024-01-08').day() // 1，星期一
```

## 时间差

使用 `diff()` 计算两个日期之间的差值：

```ts
const start = dayjs('2024-01-01 00:00:00')
const end = dayjs('2024-01-02 12:30:00')

end.diff(start) // 毫秒
end.diff(start, 'hour') // 36
end.diff(start, 'day') // 1
end.diff(start, 'day', true) // 1.5208333333333333
```

`diff()` 默认向下取整；传入第三个参数 `true` 后返回浮点数。

## 时间戳与格式转换

```ts
const date = dayjs('2024-01-01 10:00:00')

date.valueOf() // 毫秒时间戳
date.unix() // 秒时间戳
date.toISOString() // ISO 8601 字符串
date.toDate() // 原生 Date
date.toJSON() // 等价于 toISOString()
```

反方向转换：

```ts
dayjs(date.valueOf())
dayjs.unix(date.unix())
dayjs(date.toDate())
```

发送给后端前，推荐统一使用明确的格式：

```ts
const payload = {
  createdAt: dayjs().toISOString(),
}
```

## 常用插件

Day.js 核心只包含常用功能，时区、相对时间、周数等能力需要按需加载插件。插件应统一在应用入口或日期工具模块中注册一次。

### relativeTime

```ts
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

dayjs().subtract(2, 'hour').fromNow() // 2 hours ago
dayjs().add(3, 'day').fromNow() // in 3 days
```

### duration

```ts
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const value = dayjs.duration({
  days: 2,
  hours: 3,
  minutes: 30,
})

value.humanize()
value.asHours()
value.asMinutes()
```

也可以基于两个日期的时间差创建 duration：

```ts
const start = dayjs('2024-01-01')
const end = dayjs('2024-01-03')

dayjs.duration(end.diff(start)).asDays()
```

### weekOfYear 和 isoWeek

```ts
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

dayjs().week()
dayjs().isoWeek()

dayjs().startOf('isoWeek')
dayjs().endOf('isoWeek')
```

需要 ISO 周定义时优先使用 `isoWeek`，它规定星期一是一周的第一天。

### minMax

```ts
import minMax from 'dayjs/plugin/minMax'

dayjs.extend(minMax)

const dates = [dayjs('2024-01-03'), dayjs('2024-01-01'), dayjs('2024-01-02')]

dayjs.min(dates)
dayjs.max(dates)
```

## UTC 与时区

时区功能需要同时加载 `utc` 和 `timezone`，并且必须先注册 `utc`：

```ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
```

### UTC

```ts
dayjs.utc().format()
dayjs.utc('2024-01-01T00:00:00Z').format('YYYY-MM-DD HH:mm:ss')
dayjs('2024-01-01T00:00:00Z').utc().format()
```

### 指定时区

```ts
dayjs().tz('Asia/Shanghai').format()
dayjs().tz('America/New_York').format()

dayjs('2024-01-01T10:00:00+08:00').tz('UTC').format()
// 2024-01-01T02:00:00Z

dayjs('2024-01-01T10:00:00+08:00').tz('UTC', true).format()
// 2024-01-01T10:00:00Z，只替换时区标识，不换算实际时间点
```

把一个“某时区的本地时间字符串”解析为目标时区时，使用 `dayjs.tz()`：

```ts
const date = dayjs.tz(
  '2024-01-01 10:00:00',
  'YYYY-MM-DD HH:mm:ss',
  'Asia/Shanghai',
)
```

`keepLocalTime` 为 `true` 时只替换时区标识，不换算实际时间点；大多数业务场景应使用默认的 `false`。

## 国际化

Day.js 默认使用英文，语言包需要按需加载：

```ts
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

dayjs('2024-01-01').format('dddd')
// 星期一
```

可以只让单个实例使用指定语言，不修改全局配置：

```ts
const date = dayjs('2024-01-01').locale('zh-cn')
const englishDate = dayjs('2024-01-01').locale('en')
```

`relativeTime` 和 `duration.humanize()` 的输出也会跟随当前 locale。

## Vue 项目中的推荐写法

不要让每个组件分别注册插件，可以在独立工具模块中统一配置：

```ts [src/utils/dayjs.ts]
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('zh-cn')

export default dayjs
```

业务代码统一从工具模块导入：

```ts
import dayjs from '@/utils/dayjs'

dayjs().format('YYYY-MM-DD HH:mm:ss')
```

## 常见坑

- Day.js 默认不可变，`add()`、`subtract()`、`set()`、`startOf()` 等方法不会修改原实例。
- `month()` 返回 `0` 到 `11`，`format('MM')` 返回 `01` 到 `12`。
- `day()` 返回 `0` 到 `6`，其中 `0` 是星期日；ISO 星期规则应使用 `isoWeekday()`。
- 非 ISO 字符串必须配合 `customParseFormat`，不要依赖不同浏览器对 `new Date()` 的兼容行为。
- 时区不是核心功能，必须加载 `utc`、`timezone` 插件，并先注册 `utc`。
- `dayjs()` 默认使用本地时区和当前全局 locale，二者都会影响格式化结果。
- 后端接口应明确日期字段使用 ISO 8601、秒级时间戳还是毫秒级时间戳，避免前端自行猜测。
