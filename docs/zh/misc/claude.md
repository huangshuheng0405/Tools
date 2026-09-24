# Claude

## Skills

### Superpowers

[Superpowers](https://github.com/obra/superpowers)

完整的软件开发方法论,基于一组可组合的 skills 和初始指令,让编码代理自动按流程工作。核心原则:**TDD(红绿) + YAGNI + DRY**。

典型工作流:

1. `brainstorming` — 任何创作(新功能/组件/修改行为)前必须先调用,探索意图、需求与设计
2. `writing-plans` — 有了规格后、动代码前,编写实现计划
3. `subagent-driven-development` / `executing-plans` — 按计划驱动子代理逐任务执行、审查
4. `verification-before-completion` — 完成前验证

其他 skills:

| Skill                                              | 作用                                          |
| -------------------------------------------------- | --------------------------------------------- |
| `test-driven-development`                          | 实现功能/bug 修复前,先写测试(红→绿)           |
| `systematic-debugging`                             | 遇到 bug/测试失败/意外行为,先系统排查再提修复 |
| `requesting-code-review` / `receiving-code-review` | 发起 / 接收代码审查                           |
| `using-git-worktrees`                              | 用 git worktree 隔离工作区                    |
| `dispatching-parallel-agents`                      | 并行派发子代理做独立任务                      |
| `finishing-a-development-branch`                   | 收尾开发分支                                  |
| `writing-skills`                                   | 编写新 skill                                  |
| `using-superpowers`                                | 会话启动时加载,决定如何查找与使用 skills      |

### UI UX Pro Max

[UI UX Pro Max](https://ui-ux-pro-max-skill.nextlevelbuilder.io/#how-it-works)

为跨平台/多框架构建专业 UI/UX 提供设计智能的 AI 技能,内置可搜索的本地数据库。

| 内容       | 数量                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| UI 风格    | 67                                                                                             |
| 色彩方案   | 161                                                                                            |
| 字体搭配   | 57                                                                                             |
| 产品类型   | 161                                                                                            |
| UX 指南    | 99                                                                                             |
| 图表类型   | 25                                                                                             |
| 支持技术栈 | 10(React、Next.js、Vue、Svelte、SwiftUI、React Native、Flutter、Tailwind、shadcn/ui、HTML/CSS) |

包含的子 skills:

| Skill           | 作用                                                                                |
| --------------- | ----------------------------------------------------------------------------------- |
| `ui-ux-pro-max` | 主技能,搜索设计智能数据库(页面、组件、配色、字体、布局、可访问性、动效、数据可视化) |
| `design`        | 综合设计:logo(55 种风格)、企业识别计划 CIP、mockups、图标、社交图片                 |
| `design-system` | 设计系统 / 设计令牌(三层 token:primitive → semantic → component)                    |
| `ui-styling`    | 用 shadcn/ui + Tailwind 构建美观、可访问的 UI                                       |
| `brand`         | 品牌声音、视觉识别、风格指南一致性                                                  |
| `banner-design` | 社交/广告/网站 hero/印刷的 banner 设计(多种风格)                                    |
| `slides`        | 用 Chart.js 创建 HTML 演示文稿                                                      |

### Context7

[Context7](https://context7.com/)

MCP 服务器,用于获取库/框架/API 的**最新**文档。即使是知名库也应使用——训练数据可能过时。覆盖 API 语法、配置、版本迁移、库相关调试、CLI 用法。

### Ponytail

[Ponytail](https://github.com/DietrichGebert/ponytail)

把代理变成一个「懒得写代码的资深工程师」:同一个功能,别人写五十行,他看一眼,换成一行。

核心是写代码前先爬**七级阶梯**,停在第一个成立的台阶上:

```
1. 这玩意需要存在吗?        → 不需要就跳过(YAGNI)
2. 这个仓库里已经有了吗?    → 复用,别重写
3. 标准库能做吗?            → 用标准库
4. 平台原生特性覆盖了吗?    → 用原生的
5. 已安装的依赖能解决吗?    → 用已有的,别加新的
6. 能一行写完吗?            → 一行
7. 以上都不行:写最小可用的那份
```

阶梯在**理解问题之后**才跑,不是代替理解:先读完改动要碰的代码、把真实流程走一遍,再挑台阶。

不简化的东西:信任边界的输入校验、防数据丢失的错误处理、安全、可访问性、以及用户明确要求的内容。

强度等级(默认 `full`):

| 等级             | 说明                                          |
| ---------------- | --------------------------------------------- |
| `/ponytail lite` | 轻度约束                                      |
| `/ponytail full` | 默认,严格执行阶梯                            |
| `/ponytail ultra`| 最激进                                        |
| `/ponytail off`  | 关闭(或直接说「stop ponytail」/「normal mode」) |

配套命令:

| 命令                | 作用                                                       |
| ------------------- | ---------------------------------------------------------- |
| `/ponytail-review`  | 只看当前 diff 的过度设计,给一份「可删除清单」              |
| `/ponytail-audit`   | 审计整个仓库(不只是 diff)的过度设计                         |
| `/ponytail-debt`    | 把散落的 `ponytail:` 注释收集成债务台账,避免「以后再说」变成永远不说 |
| `/ponytail-gain`    | 展示基准测试的影响看板(代码量/成本/耗时)                    |
| `/ponytail-help`    | 上述命令的速查                                             |

`ponytail:` 注释用于标记**故意砍掉、但知道上限**的简化,格式是写明天花板和升级路径,例如:

```js
// ponytail: 全局锁,对吞吐量敏感时改成按账户加锁
```

官方基准(真实 Claude Code 会话,改 FastAPI + React 真实仓库,Haiku 4.5,n=4):代码量 **-54%**、成本 **-20%**、耗时 **-27%**,安全性 100%。代码量降幅最大的地方正是「有过度构建陷阱」的地方(日期选择器 404 行 → 23 行,因为直接用 `<input type="date">`);本来就精简的代码降幅接近零。

### Grill Me

[Matt Pocock · Skills](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me)

本机 skill(`~/.claude/skills/grill-me`,底层调用 `grilling`),用于**拷问**一个计划、决策或想法。上游里 `grill-me` 只是个兼容指针,真正的指令在同目录的 `grilling`。

它把你的思路展开成一棵**设计树**:每个决定都会分叉出挂在它下面的决定。

工作方式是按**轮次**推进。某一时刻的**前沿(frontier)**,是所有前置条件已经敲定的决定——也就是你现在就能问、不用猜还没听到的答案的那些问题。一轮把整个前沿一次性问完:每个问题编号,并给出**你推荐的答案**;然后等用户回答,再问下一轮。

```
❓ **Q1** - **<问题标题>**: <问题正文,可以多段、可以给多个选项>

➡️ <推荐的答案>

---

❓ **Q2** - **<问题标题>**: <问题正文>

➡️ <推荐的答案>
```

用户的每一轮回答都会重塑这棵树:已定的决定把前沿往外推,解锁那些依赖它们的问题。**查事实是代理的活,不是用户的**——前沿问题如果需要环境里的事实(文件系统、工具等),派子代理去找,不要问用户能自己查到的东西。而**决定是用户的**:每个都摆到用户面前,然后等。

前沿空了就算结束——设计树每个分支都走过,没有任何东西被默默假设。在用户确认达成共识之前,不要动手实施。
