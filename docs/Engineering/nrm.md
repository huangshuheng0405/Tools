# nrm

nrm是一个专门用来管理npm镜像源的命令行工具。能让你在官方源、国内镜像源之间切换切换。

## Installation

```bash [npm]
npm install -g nrm
```

## basic

几种基本操作

```bash
nrm -V 查看版本号
nrm ls 列出所有镜像源 并标记当前使用的镜像源（带*）
nrm use <registry> 切换到指定的镜像源
nrm add <registry> [url] 添加一个新的镜像源（自定义）
nrm del <registry> 删除指定的镜像源
nrm rename <registry> <new-name> 重命名指定的镜像源
nrm test [registry] 测试所有或指定源的响应时间 帮助选择最快的源
nrm current 查看当前使用的镜像源
```
