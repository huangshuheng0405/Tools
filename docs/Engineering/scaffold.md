# CLI

命令行界面：Command Line Interface

bin
package.json

- bin
- files

tsup 打包

针对项目配置 `tsup.config.ts`
`tsup.config.ts`

调试

1. npm link miaoma
2. ./bin/miaoma
3. node ./bin/miaoma

在`package.json`中 `files`字段作用是定义在执行`npm publish`发布包时，那些文件或目录应该被上传到`npm`仓库

- 默认情况，`npm`会上传全部文件，通过设置`files`可以排除掉源代码（src）、测试文件（test）、配置文件（ts.config.json）等开发环境才需要的文件，从而大幅减少用户安装你的cli工具时的下载体积
