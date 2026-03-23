# Commander

[commander](https://www.npmjs.com/package/commander)

## argument

在`Command`对象上使用`.argument()`来按次序指定命令参数，该方法接受参数名称和参数描述。尖括号`<>`表示必选，方括号`[]`表示可选

```js [argument.js]
#!/usr/bin/env node

import { Command, program } from 'commander'

program
  .name('connect')
  .argument('server', 'connect to specified')
  .argument('[user]', 'user account for connection', 'guest')
  .description('Example program with argument descriptions')
  .action((server, user) => {
    console.log('🚀 ~ server:', server)
    console.log('🚀 ~ user:', user)
  })

program.parse()
```

```bash
$ node test.js main.remote.site
~ server: main.remote.site
~ user: guest

$ node test.js main.remote.site admin
~ server: main.remote.site
~ user: admin
```

## option

```js
.option('-t, --template <template>', 'template name')
```

- `-t`: 短选项
- `--template`：长选项
- \<template>：必选参数值
- 'template name'：帮助说明（`-h`时会显示）

使用方法

```bash
# 短写法
hsh create project-name -t vue
# 长写法
hsh create project-name --template react
```

### 选项的默认值

```js [test.js]
#!/usr/bin/env node

import { Command, program } from 'commander'

program.option(
  '-c, --cheese <type>',
  'add the specified type of cheese',
  'blue'
)

program.parse()

console.log(`cheese: ${program.opts().cheese}`)
```

```bash
$ node test.js
cheese: blue
$ node test.js -c red
cheese: red
```

### 可选参数

`--optional [value]`，在选项不带参数时可用作boolean选项，在有带参数时从参数中得到值

```js [test.js]
#!/usr/bin/env node

import { Command, program } from 'commander'

program.option('-c, --cheese [type]', 'add the specified type of cheese')

// eslint-disable-next-line no-undef
program.parse(process.argv)

const { cheese } = program.opts()

if (cheese === undefined) console.log('no cheese')
else if (cheese === true) console.log('add cheese')
else console.log(cheese)
```

```bash
$ pizza-options
no cheese
$ pizza-options --cheese
add cheese
$ pizza-options --cheese mozzarella
add cheese type mozzarella
```

## action

命令处理函数的参数：命令声明的所有参数，除此之外还有两个附加额外参数，一个是解析出的选项，另一个时该命令对象自身

如果`.arguments()`有多个参数，`.action()`里就会按顺序接收多个参数，最后才是`options`

`.arguments('<a> <b> <c>')`
对应
`.action(async (a, b, c, options) => {})`
顺序必须完全一致
最后一个options对象 包含所有的`-x/--x`选项

```js [test.js]
#!/usr/bin/env node

import { Command, program } from 'commander'

program
  .argument('<name>')
  .option('-t --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action((name, options, command) => {
    if (options.debug)
      console.error('Called %s with options %o', command.name(), options)
    const title = options.title ? `${options.title}` : ''
    console.log(`Thank you ${title}${name}`)
  })

program.parse()
```

```bash
$ node thank.js John
Thank you john
$ node thank.js Doe --title Mr
Thank you MrDoe
$ node thank.js --debug Doe --title Mr
Called test with options { debug: true, title: 'Mr' }
Thank you MrDoe
```

## 自主化帮助信息

帮助信息是 Commander 基于你的程序自动生成的，默认的帮助选项是`-h`,`--help`

```bash
$ node test.js -h
Usage: test [options] <name>

Options:
  -t --title <honorific>  title to use before name
  -d, --debug             display some debugging
  -h, --help              display help for command
```
