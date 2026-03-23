# consola

[consola](https://www.npmjs.com/package/consola)

## Installation

```bash
npm install consola
```

## Getting Started

```js [consola.js]
// ESM
import { consola, createConsola } from 'consola'

// CommonJS
const { consola, createConsola } = require('consola')

consola.info('Using consola 3.0.0')
consola.start('Building project...')
consola.warn('A new version of consola is available: 3.0.1')
consola.success('Project built!')
consola.error(new Error('This is an example error. Everything is fine!'))
consola.box('I am a simple box')
await consola.prompt('Deploy to the production?', {
  type: 'confirm'
})
```

```bash
node consola.js
$ node consola.js
ℹ Using consola 3.0.0                                                                          21:36:21
◐ Building project...                                                                           21:36:21

 WARN  A new version of consola is available: 3.0.1                                             21:36:21

✔ Project built!                                                                               21:36:21

 ERROR  This is an example error. Everything is fine!                                           21:36:21

    at /D:/react-demo/consola.js:8:15
    at ModuleJob.run (node:internal/modules/esm/module_job:430:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:654:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)


 ╭───────────────────────────────────────╮
 │                                       │
 │  I am a simple boxssssssssssssssssss  │
 │                                       │
 ╰───────────────────────────────────────╯


❯ Deploy to the production?
● Yes / ○ No

```

## Log Level

- `0`: Fatal and Error
- `1`: Warnings
- `2`: Normal logs
- `3`: Informational logs, success, fail, ready, start, ...
- `4`: Debug logs
- `5`: Trace logs
- `-999`: Silent
- `+999`: Verbose logs

## creating a new instance

```js
import { createConsola } from 'consola'

const logger = createConsola({
  // level: 4,
  // fancy: true | false
  // formatOptions: {
  //     columns: 80,
  //     colors: false,
  //     compact: false,
  //     date: false,
  // },
})
```

### level

控制输出哪些日志

- 数字越小 -> 越严格
- 数字越大 -> 输出越多

### fancy

控制输出效果

- true 彩色 + 图标
- false 纯文本（适合CI/日志文件）

### formatOptions

输出格式控制

#### columns

控制一行最大宽度

#### colors

是否启用颜色

#### compact

输出更紧凑，减少空行，适合日志文件

#### data

每条日志加时间
