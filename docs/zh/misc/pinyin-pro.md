# pinyin-pro

[pinyin-pro](https://github.com/zh-lx/pinyin-pro) 是一个专业的 JS 汉字拼音转换库：把中文转成拼音 / 声母 / 韵母 / 首字母，也支持拼音匹配与分词。主打多音字识别准（官方称准确率约 99.8%，高于同类库）、Web 与 Node 通用，当前版本 3.29.5。

## 安装

```bash
npm install pinyin-pro
```

浏览器直接引入：`<script src="https://unpkg.com/pinyin-pro"></script>`

## 核心 API

| API | 用途 |
| --- | --- |
| `pinyin(text, options)` | 汉字 → 拼音（最常用） |
| `match(text, pinyin)` | 按拼音 / 首字母匹配中文文本，返回命中下标 |
| `convert(pinyin, options)` | 拼音格式互转（数字 ↔ 声调符号） |
| `segment(text)` | 中文分词并返回每段的拼音 |
| `html(text)` | 生成带 `<ruby>` 注音的 HTML 字符串 |

```js
import { pinyin, match } from 'pinyin-pro'

pinyin('汉语拼音')                       // 'hàn yǔ pīn yīn'
pinyin('汉语拼音', { type: 'array' })    // ['hàn', 'yǔ', 'pīn', 'yīn']
pinyin('汉语拼音', { toneType: 'none' }) // 'han yu pin yin'
pinyin('汉语拼音', { toneType: 'num' })  // 'han4 yu3 pin1 yin1'
pinyin('睡着了')                         // 'shuì zháo le'（自动识别多音字）

match('中文拼音', 'zwp')          // [0, 1, 2]  首字母匹配
match('中文拼音', 'zhongwenpin')  // [0, 1, 2]  全拼匹配
match('中文拼音', 'zhongwp')      // [0, 1, 2]  混合匹配
```

**常用参数**：

- `toneType`：`'symbol'`（默认，hàn）｜`'num'`（han4）｜`'none'`（han）
- `type`：`'string'`（默认）｜`'array'`
- `pattern`：`'pinyin'`｜`'initial'` 声母｜`'final'` 韵母｜`'first'` 首字母｜`'all'` 全部信息
- `multiple`：多音字时返回全部读音
- `surname`：姓氏模式（如「单」按 shàn 读）
- `v`：把 `ü` 输出成 `v`（`lǜ` → `lv`）

## 注意事项

- **体积偏大**：整包约 561 KB（gzip 158 KB），因为内置完整字典。按 API 拆分后 `pinyin` / `segment` / `html` 各约 135 KB gzip，只有 `convert` 极小（约 1 KB）。ESM 支持 Tree Shaking，UMD 不支持。
- 自带 TypeScript 类型声明，无需额外装 `@types`。

> 典型场景：搜索框的拼音 / 首字母搜索、汉字注音（`<ruby>`）、按拼音排序、中文分词。
