# Volta

[Volta](https://volta.sh/) 是一个用 Rust 编写的 JavaScript 工具链版本管理器,用来管理 `node`、`npm`、`yarn`、`pnpm` 的版本。

它和 nvm 最大的区别是**不用手动切换**:版本号写在 `package.json` 的 `volta` 字段里,进入项目目录时自动生效,团队成员装完 Volta 就能拿到一致的 Node 和包管理器版本。

Volta 通过 shim 实现:`~/.volta/bin` 被放到 `PATH` 最前面,`node`、`npm` 等都是轻量转发脚本,执行时再按当前目录决定真正的二进制文件,所以切换版本没有等待时间。

## 安装

### Windows

```powershell
winget install Volta.Volta
```

也可以从 [GitHub Releases](https://github.com/volta-cli/volta/releases) 下载 `.msi` 安装包。

### macOS / Linux

```bash [curl]
curl https://get.volta.sh | bash
```

```bash [跳过自动配置]
curl https://get.volta.sh | bash -s -- --skip-setup
```

安装脚本会向 `.profile`、`.zshrc` 等文件写入 `VOLTA_HOME` 和 `PATH`。加了 `--skip-setup` 则只装二进制,需要自己配置环境变量。

安装完成后**重启终端**,然后验证:

```bash
volta -v
node -v
```

## 核心概念

Volta 中有两套工具链,优先级从高到低:

| 层级 | 配置位置 | 生效范围 | 设置方式 |
| --- | --- | --- | --- |
| 项目工具链 | `package.json` 的 `volta` 字段 | 当前项目目录 | `volta pin` 或手写 |
| 默认工具链 | `~/.volta/tools/user` | 其他所有目录 | `volta install` |

进入项目目录后,项目工具链会覆盖默认工具链;离开项目目录则回落到默认版本。可以只锁定 Node 而不锁定包管理器,未锁定的部分使用默认工具链。

## 安装与切换版本

```bash
volta install node@22.5.1   # 精确版本
volta install node@22        # 大版本,安装当前最新的 22.x
volta install node@lts       # LTS
volta install node@latest    # 最新版
volta install node           # 等价于 latest

volta install npm@10.8.1
volta install yarn@1.22.22
volta install yarn@latest
```

`volta install` 也用来装全局包:

```bash
volta install typescript
volta install @vue/cli@latest
volta install your-package@^14.4.3
```

工具名后面的 `@版本` 支持精确版本、大版本、`^` 范围和 `lts`、`latest` 这类别名。传入大版本或范围时,Volta 会解析成当时最新的具体版本记录下来。

## 项目锁定

在项目根目录执行 `volta pin`,会写入(或更新)`package.json`:

```bash
volta pin node@20.16
volta pin yarn@1.19
```

```json
{
  "volta": {
    "node": "20.16.0",
    "yarn": "1.19.2"
  }
}
```

写完后当前目录立即生效:

```bash
node -v   # v20.16.0
yarn -v   # 1.19.2
```

`volta` 字段可以直接手写,也可以提交到 Git,这样其他成员 clone 下来就自动使用相同版本,不需要在 README 里写"请使用 Node 20"这类约定。

## 查看当前状态

```bash
volta list             # 当前目录实际生效的工具
volta list --current   # 同上
volta list --default   # 默认工具链
volta list all         # 默认 + 项目工具链
volta list node        # 只看 node
volta which node       # node 的真实二进制路径
volta which yarn       # 排查走了哪个版本时很有用
```

`volta which` 是排查"版本不对"的第一手段:输出路径里会包含具体版本号,可以直接看出 Volta 用的是项目版本还是默认版本。

## 预下载

`volta fetch` 只下载到本地,不修改工具链配置:

```bash
volta fetch node@20.16.0
volta fetch node@20.16.0 yarn@1.22.22
```

适合在 CI 里先并行下载,或者在没有网络的环境提前准备。

## 临时指定版本运行

`volta run` 可以不改任何配置,用指定版本执行一次命令。版本参数写在命令**前面**,命令自己的参数写在**后面**:

```bash
volta run --node 18.19.0 node -v
volta run --node lts -- npm run build

volta run --node 20.16.0 -- npm ci
volta run --npm 10.8.1 -- npm run lint

volta run --bundled-npm node -v   # 强制使用 Node 自带的 npm
volta run --no-yarn node -v       # 不注入 yarn

volta run --env NODE_ENV=production -- node server.js
```

`--env` 可以重复使用。验证"在旧版本 Node 上会不会挂"时,这个命令比临时切换版本方便。

## 卸载

```bash
volta uninstall node@20.16.0
volta uninstall typescript
```

被 `volta pin` 写进 `package.json` 的版本不能通过 `volta uninstall` 撤销,只能重新 `volta pin` 到别的版本,或者手动删掉 `package.json` 里的 `volta` 字段。

## pnpm 支持

pnpm 支持是**实验特性**,默认关闭,需要设置环境变量 `VOLTA_FEATURE_PNPM=1`。

```bash [macOS / Linux]
export VOLTA_FEATURE_PNPM=1
```

```powershell [Windows]
# 用户级环境变量,设置后需新开终端
[Environment]::SetEnvironmentVariable('VOLTA_FEATURE_PNPM', '1', 'User')
```

启用后:

```bash
volta install pnpm
volta pin pnpm@9.0.0
volta list pnpm
```

已知限制:

- 不支持 `pnpm install -g`,全局包要改用 `volta install <package>`。
- 没有自动迁移。如果之前把 pnpm 当作普通包装过(`volta install pnpm` 但没开开关),需要手动重装一次。

## 环境变量

| 变量 | 取值 | 说明 |
| --- | --- | --- |
| `VOLTA_HOME` | 路径 | Volta 的数据目录,默认 `~/.volta`(Windows 为 `%LOCALAPPDATA%\Volta`) |
| `VOLTA_FEATURE_PNPM` | `0` / `1` | 设为 `1` 开启 pnpm 支持,默认 `0` |

自定义 `VOLTA_HOME` 后,需要保证 `$VOLTA_HOME/bin` 在 `PATH` 中,可以重新执行 `volta setup`(Unix)来修正 profile 脚本。

## 命令速查

| 命令 | 作用 |
| --- | --- |
| `volta install <tool[@version]>` | 安装工具或全局包到默认工具链 |
| `volta uninstall <tool>` | 从工具链移除工具 |
| `volta pin <tool[@version]>` | 把版本写入 `package.json` 的 `volta` 字段 |
| `volta list [tool]` | 查看工具链,支持 `--current`、`--default`、`all` |
| `volta which <binary>` | 查看实际被调用的二进制路径 |
| `volta fetch <tool[@version]>` | 只下载,不修改配置 |
| `volta run [...] <command>` | 用临时指定的版本运行命令 |
| `volta setup` | 重新配置 shell 环境(Unix) |
| `volta completions <shell>` | 生成 shell 补全脚本,支持 `zsh`、`bash`、`fish`、`powershell`、`elvish` |

## 常见坑

- **和 nvm 冲突**。`~/.volta/bin` 必须排在 nvm、系统 Node 之前,否则实际生效的是别人的 Node。同时装两套版本管理器容易出问题,建议只留一个。
- **Volta 不读 `.nvmrc` 和 `.node-version`**,也不读 `engines` 字段。版本信息只认 `package.json` 里的 `volta`。
- **`npm install -g` 装的全局包不受 Volta 管理**,跨 Node 版本不可靠;全局工具统一用 `volta install <package>` 安装,用 `volta uninstall` 卸载。
- **`volta install` 的全局包是共享的**,运行时使用当前生效的 Node 版本,不会为每个 Node 版本单独安装一份。
- **IDE 和外部工具可能绕过 shim**。如果运行配置里写死了 Node 的绝对路径,或者终端没加载 shell 配置,Volta 就不会生效。用 `volta which node` 确认。
- **`volta install node@22` 这类大版本写法**,会被解析成当时最新的具体版本;想保证可复现应使用完整版本号,或让 `volta pin` 写入解析后的精确版本。
- **安装后必须重启终端**(Windows 上还需要新开的进程)才能读到更新后的 `PATH`。
- **Volta 只管 Node 生态**。Java、Python、Go 等工具链不在它的管理范围内。
