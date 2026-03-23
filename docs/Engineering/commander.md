# Commander

[commander](https://www.npmjs.com/package/commander)

## 安装

```bash
npm install commander
```

## version

在程序中通过 `.version()` 设置版本号，默认对应的选项是 `-V` 和 `--version`。

```js
program.version('0.0.1')
```

```bash
$ node test.js -V
0.0.1
```

## argument

在 `Command` 对象上使用 `.argument()` 来按次序指定命令参数。尖括号 `<>` 表示必选，方括号 `[]` 表示可选。

```js [argument.js]
#!/usr/bin/env node
import { program } from 'commander'

program
  .name('connect')
  .description('Example program with argument descriptions')
  .argument('<server>', 'connect to specified server')
  .argument('[user]', 'user account for connection', 'guest')
  .action((server, user) => {
    console.log('🚀 ~ server:', server)
    console.log('🚀 ~ user:', user)
  })

program.parse()
```

### 变长参数 (Variadic arguments)

在参数名后面添加 `...`，表示接受多个参数，解析后为一个数组。

```js
program.argument('<dirs...>').action((dirs) => {
  dirs.forEach((dir) => console.log('rmdir %s', dir))
})
```

## option

### 必选选项 (Required Options)

使用 `.requiredOption()` 声明必选选项，如果运行程序时未提供该选项，程序将报错并退出。

```js
program.requiredOption('-c, --config <path>', 'path to configuration file')
```

### 选项的默认值

```js [test.js]
#!/usr/bin/env node
import { program } from 'commander'

program.option(
  '-c, --cheese <type>',
  'add the specified type of cheese',
  'blue'
)

program.parse()
console.log(`cheese: ${program.opts().cheese}`)
```

## 子命令 (Sub-commands)

这是构建复杂 CLI 工具的核心。可以使用 `.command()` 来添加子命令。

```js [git-cli.js]
import { program } from 'commander'

// 1. 基本子命令
program
  .command('clone <source> [destination]')
  .description('clone a repository')
  .action((source, destination) => {
    console.log('cloning %s to %s', source, destination || 'current directory')
  })

// 2. 嵌套子命令
const build = program.command('build').description('build related commands')

build.command('web').action(() => console.log('building web...'))

build.command('mobile').action(() => console.log('building mobile...'))

program.parse()
```

```bash
$ node git-cli.js clone http://github.com/repo
cloning http://github.com/repo to current directory

$ node git-cli.js build web
building web...
```

## action

命令处理函数的参数：命令声明的所有参数，除此之外还有两个附加额外参数，一个是解析出的选项，另一个是该命令对象自身。

如果 `.argument()` 有多个参数，`.action()` 里就会按顺序接收多个参数，最后才是 `options`。

```js [test.js]
#!/usr/bin/env node
import { program } from 'commander'

program
  .argument('<name>')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action((name, options, command) => {
    if (options.debug) {
      console.error('Called %s with options %o', command.name(), options)
    }
    const title = options.title ? `${options.title} ` : ''
    console.log(`Thank you, ${title}${name}`)
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

## 获取选项值

有两种方式可以获取解析后的选项值：

1.  **在 `.action()` 回调中**：推荐方式，可以直接获取当前命令的选项。
2.  **通过 `program.opts()`**：获取全局定义的选项。

```js
const options = program.opts()
console.log(options.debug)
```

## 自主化帮助信息

帮助信息是 Commander 基于你的程序自动生成的，默认的帮助选项是 `-h`, `--help`。

你可以通过 `.helpCommand(false)` 关闭默认的 `help` 子命令，或者使用 `.addHelpText()` 添加自定义文本。

```js
program.addHelpText(
  'after',
  `
Example call:
  $ node test.js --help`
)
```
