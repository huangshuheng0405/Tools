# Claude

<img width='200px' src="/public/claude-icon.svg" alt="Claude" />

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
