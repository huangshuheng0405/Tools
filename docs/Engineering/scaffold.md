# CLI

命令行界面：Command Line Interface

## 大体流程

**1.** 创建`bin`文件夹，创建一个文件`hsh`（**没有后缀名**）

```js
#!/usr/bin/env node

import { runCLI } from '../dist/index.js'

runCLI()
```

**2.** `package.json`

```json
{
  "bin": {
    "hsh": "bin/hsh"
  }
}
```

**3.** 创建`index.ts`和`cli.ts`

::: code-group

```ts [index.ts]
import { run } from './cli.js'

export const defineConfig = () => {}

export const runCLI = () => {
  run(process.argv)
}
```

```ts [cli.ts]
import { program } from 'commander'
import './commands/index.js'
import './utils/loadTemplate.js'

program.version('0.0.1').name('hsh')

export const run = (args: string[]) => {
  program.parse(args)
}
```

:::

**4.** 配置`tsup.config.ts` （前提：`npm install tsup`）

```ts [tsup.config.ts]
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  shims: true,
  clean: true,
  dts: true,
  platform: 'node',
  outDir: 'dist'
})
```

将`index.ts`文件转译成`/dist/index.js`

**5.** 设置`tsup`

```json [package.json]
{
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup"
  }
}
```

`pnpm dev`改动代码实时更新，`pnpm build`启动`tsup`

**6.** 创建`src/commands/base`，里面创建如下文件

::: code-group

```ts [build.ts]
import { Command } from 'commander'
import { logger } from '../../utils/logger.js'
import { spawn } from 'node:child_process'

export function build(program: Command) {
  return program
    .createCommand('build')
    .description('build project')
    .action(() => {
      // 执行项目的打包命令
      // npm run build
      logger.info('build projects')

      const command = 'npm'
      const params = ['run', 'build']

      const child = spawn(command, params, {
        stdio: 'inherit',
        shell: process.platform === 'win32' // 在 windows 系统下开启 shell 模式以正确识别 npm.cmd
      })

      child.on('close', (code) => {
        logger.log(`子进程退出，退出码：${code}`)
      })
    })
}
```

```ts [create.ts]
import { Command } from 'commander'
import { logger } from '../../utils/logger.js'
import picocolors from 'picocolors'
import { loadTemplate } from '../../utils/loadTemplate.js'
import prompts from 'prompts'

export function create(program: Command) {
  return program
    .createCommand('create')
    .description('create project')
    .arguments('<name>')
    .option('-t, --template <template>', 'template name')
    .action(async (projectName, options) => {
      logger.log('创建项目')
      logger.info(
        `create projects, name:${projectName}, ${JSON.stringify(options)}`
      )
      let { template } = options

      if (!template) {
        const { framework } = await prompts({
          type: 'select',
          name: 'framework',
          message: 'please select a framework',
          choices: [
            { title: 'react', value: 'react' },
            { title: 'vue', value: 'vue' },
            { title: 'angular', value: 'angular' }
          ]
        })

        template = framework
      }

      // 选择模板 本地 或者 远程
      const { source } = await prompts({
        type: 'select',
        name: 'source',
        message: 'please select local or remote template',
        choices: [
          { title: 'local', value: 'local' },
          { title: 'remote', value: 'remote' }
        ]
      })

      if (!source) return

      logger.info(picocolors.bgCyan(`create ${template} project`))
      // react 不是写死的 要用户选择 项目名称也要用户输入
      loadTemplate({
        projectName,
        templateName: template,
        local: source === 'local'
      })
    })
}
```

```ts [preview.ts]
import { Command } from 'commander'
import { logger } from '../../utils/logger.js'
import { spawn } from 'node:child_process'

export function preview(program: Command) {
  return program
    .createCommand('preview')
    .description('preview project')
    .action(() => {
      // 执行项目的打包命令
      // npm run preview
      logger.info('preview projects')

      const command = 'npm'
      const params = ['run', 'preview']

      const child = spawn(command, params, {
        stdio: 'inherit',
        shell: process.platform === 'win32' // 在 windows 系统下开启 shell 模式以正确识别 npm.cmd
      })

      child.on('close', (code) => {
        logger.log(`子进程退出，退出码：${code}`)
      })
    })
}
```

```ts [serve.ts]
import { Command } from 'commander'
import { logger } from '../../utils/logger.js'
import { spawn } from 'node:child_process'

export function serve(program: Command) {
  return program
    .createCommand('serve')
    .description('serve project')
    .action(() => {
      // npm run dev pnpm dev
      logger.log('启动项目')
      /**
       * node 中怎么执行命令
       */

      const command = 'npm'
      const params = ['run', 'dev']

      const child = spawn(command, params, {
        stdio: 'inherit',
        shell: process.platform === 'win32' // 在 windows 系统下开启 shell 模式以正确识别 npm.cmd
      })

      child.on('close', (code) => {
        logger.log(`子进程退出，退出码L: ${code}`)
      })
    })
}
```

```ts [info.ts]
// ESM
import { logger } from '../../utils/logger.js'
import pkg from '../../../package.json'
import picocolors from 'picocolors'
import { Command } from 'commander'

export function info(program: Command) {
  return program
    .createCommand('info')
    .description('show info')
    .action(() => {
      logger.info('Using consola 3.0.0')
      logger.start('Building project...')
      logger.warn('A new version of consola is available: 3.0.1')
      logger.success('Project built!')
      // logger.error(new Error('This is an example error. Everything is fine!'))
      logger.box('huangshuheng')

      logger.log(picocolors.bgGreen(`Product: hsh CLI v${pkg.version}`))
      logger.log(picocolors.green(`Author: hsh`))
      logger.log(picocolors.underline(`License: ${pkg.license}`))
    })
}
```

:::

**7.** 在`commands`文件夹下创建如下

::: code-group

```ts [index.ts]
import { create } from './base/create.js'
import { registerCommand } from './registerCommand.js'
import { info } from './base/info.js'
import { serve } from './base/serve.js'
import { build } from './base/build.js'
import { greet } from './base/greet.js'
import { preview } from './base/preview.js'

// 注册命令
registerCommand(create)
registerCommand(info)
registerCommand(serve)
registerCommand(build)
registerCommand(greet)
registerCommand(preview)
```

```ts [registerCommand.ts]
import { Command, program } from 'commander'

type Fn = (p: Command) => Command
// 这个类型是一个 函数类型 传入的参数是 Command类型  返回值也是Command类型

/**
 * 注册命令
 * @param fn1 命令函数
 */
export function registerCommand(fn1: Fn) {
  program.addCommand(fn1(program))
}
```

:::

**8.** 在`src`文件夹下创建`utils`文件夹，在`utils`文件夹创建文件如下

::: code-group

```ts [loadTemplate.ts]
import { copy } from 'fs-extra'
import { join } from 'node:path'
import { downloadTemplate } from 'giget'

interface LoadTemplateParams {
  projectName: string
  templateName: string
  local?: boolean
}

/**
 * 加载本地模板
 */
const loadLocalTemplate = async (params: LoadTemplateParams) => {
  // 把模板 复制到 当前文件夹下去
  copy(
    join(__dirname, `../templates/template-${params.templateName}`),
    `${process.cwd()}/${params.projectName}`
  )
  // process.cwd() 返回当前的工作目录
}

/**
 * 加载远程模板
 * @param params
 */
const loadRemoteTemplate = async (params: LoadTemplateParams) => {
  const { dir } = await downloadTemplate(
    // giget 尝试解压文件 所以链接必须是一个压缩包的地址
    // 改用gh前缀 会触发专门的api去下载 .tar.gz 存档
    'gh:huangshuheng0405/javascript#main',
    {
      dir: `${process.cwd()}/.temp`,
      force: true
      // 确保 .temp 目录中存在之前下载失败的残留文件 会被强制覆盖 保证下载环境干净
    }
  )

  await copy(dir, `${process.cwd()}/${params.projectName}`)
}

export const loadTemplate = async (params: LoadTemplateParams) => {
  const { local } = params

  if (local) {
    await loadLocalTemplate(params)
  } else {
    await loadRemoteTemplate(params)
  }
}
```

```ts [logger.ts]
import { createConsola } from 'consola'

export const logger = createConsola()
```

:::

**9.** 大致如上，其余详情见[cli](https://github.com/huangshuheng0405/cli)

## `files`

在`package.json`中 `files`字段作用是定义在执行`npm publish`发布包时，那些文件或目录应该被上传到`npm`仓库

- 默认情况，`npm`会上传全部文件，通过设置`files`可以排除掉源代码（src）、测试文件（test）、配置文件（ts.config.json）等开发环境才需要的文件，从而大幅减少用户安装你的cli工具时的下载体积

## `npm`包发布

在`cli`文件夹下的`package.json`设置

```json [package.json]
{
  "scripts": {
    "publish:npm": "npm publish --access public"
  }
}
```

先运行`npm login`登录`npm`，再运行`pnpm publish:npm`上传即可，版本号必须和上次版本号大
