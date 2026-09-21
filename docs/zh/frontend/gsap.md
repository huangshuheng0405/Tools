# GSAP

GSAP（GreenSock Animation Platform）官方 AI Skill，仓库地址：[greensock/gsap-skills](https://github.com/greensock/gsap-skills)。

它教 AI 代理正确地使用 GSAP：核心 API、Timeline、ScrollTrigger、插件、React/Vue/Svelte 框架用法、纯 JS 写法以及性能优化。采用 [Agent Skills](https://agentskills.io/) 格式，兼容 Cursor、Claude Code、Codex、Windsurf、Copilot 等 40+ 代理。

> **GSAP 已 100% 免费**——包括所有插件。在 Webflow 收购 GSAP 之后，原本属于 Club GSAP 的插件（如 **SplitText**、**MorphSVG** 等）对所有人免费开放，包括商业使用。所有东西都能从公开的 `gsap` npm 包安装，无需 Club 会员、无需 `.npmrc` / auth token、无需私有 registry。

## 安装

### npx skills（推荐）

兼容 Cursor、Claude Code、Codex、Windsurf、Copilot、Google Antigravity 等 [40+ 代理](https://github.com/vercel-labs/skills#supported-agents)：

```bash
npx skills add https://github.com/greensock/gsap-skills
```

CLI 会自动检测已安装的代理。要显式指定某个代理（例如 Antigravity），加 `--agent`：

```bash
npx skills add https://github.com/greensock/gsap-skills --agent antigravity
```

### Claude Code

在 Claude Code 中使用 skill/plugin 市场：

```bash
/plugin marketplace add greensock/gsap-skills
```

参考 [Agent Skills 文档](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)。

### Cursor

**Settings → Rules → Add Rule → Remote Rule (Github)**，填入 `greensock/gsap-skills`。也可以用上面的 `npx skills add` 安装。

### Clone / 手动复制

把仓库里的 `skills/` 文件夹复制到对应代理的 skill 目录：

| 代理               | Skill 目录                                                           |
| ------------------ | -------------------------------------------------------------------- |
| Claude Code        | `~/.claude/skills/`                                                  |
| Cursor             | `~/.cursor/skills/`                                                  |
| OpenCode           | `~/.config/opencode/skills/`                                         |
| OpenAI Codex       | `~/.codex/skills/`                                                   |
| Google Antigravity | `~/.gemini/antigravity/skills/`（全局）或 `.agent/skills/`（工作区） |
| Pi                 | `~/.pi/agent/skills/`                                                |

## Skills 清单

| Skill                  | 说明                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **gsap-core**          | 核心 API：`gsap.to()` / `from()` / `fromTo()`、缓动、时长、stagger、defaults                                                                           |
| **gsap-timeline**      | 时间轴：顺序编排、位置参数、label、嵌套、播放控制                                                                                                      |
| **gsap-scrolltrigger** | ScrollTrigger：滚动联动动画、固定（pin）、scrub、触发器、refresh 与清理                                                                                |
| **gsap-plugins**       | 插件：ScrollToPlugin、ScrollSmoother、Flip、Draggable、Inertia、Observer、SplitText、ScrambleText、SVG 与物理插件、CustomEase、EasePack、GSDevTools 等 |
| **gsap-utils**         | `gsap.utils`：clamp、mapRange、normalize、interpolate、random、snap、toArray、selector、wrap、pipe 等工具                                              |
| **gsap-react**         | React：`useGSAP` hook、refs、`gsap.context()`、清理、SSR                                                                                               |
| **gsap-performance**   | 性能：优先 transform 而非布局属性、will-change、批处理、ScrollTrigger 技巧                                                                             |
| **gsap-frameworks**    | Vue、Svelte 等：生命周期、作用域选择器、卸载时清理                                                                                                     |

## Quick reference（供 AI 代理）

规范化的 GSAP 写法示例：

```js
// 1. 导入并注册插件（每个应用一次）
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// 2. 单个 tween —— 优先用 transform 别名和 autoAlpha
gsap.to('.box', { x: 100, autoAlpha: 1, duration: 0.6, ease: 'power2.inOut' })

// 3. 顺序编排用 Timeline（优先于链式 delay）
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power2' } })
tl.to('.a', { x: 100 })
  .to('.b', { y: 50 }, '+=0.2')
  .to('.c', { opacity: 0 }, '-=0.1')

// 4. ScrollTrigger —— 挂到 timeline 或顶层 tween；布局变化后调用 refresh
const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
  },
})
tl2.to('.panel', { x: 100 }).to('.panel', { rotation: 5, duration: 0.7 })
// DOM/布局变化后：ScrollTrigger.refresh();

// 5. React：useGSAP + scope + 清理（选择器必须带 scope）
// import { useGSAP } from "@gsap/react";
// gsap.registerPlugin(useGSAP);
// useGSAP(() => { gsap.to(ref.current, { x: 100 }); }, { scope: containerRef });
// 或：useEffect(() => { const ctx = gsap.context(() => { ... }, containerRef); return () => ctx.revert(); }, []);
```

## 仓库结构

```
gsap-skills/
  README.md
  AGENTS.md          # 代理编辑此仓库的指引
  .github/
    copilot-instructions.md   # GitHub Copilot 的仓库级指令
    instructions/             # 路径级 Copilot 指令（react / scrolltrigger）
  .claude-plugin/    # Claude Code 插件配置
  .cursor-plugin/    # Cursor 插件配置
  assets/            # Logo 与图标资源
  skills/
    llms.txt         # skill 索引（名称、摘要、触发词）
    gsap-core/       SKILL.md
    gsap-timeline/   SKILL.md
    gsap-scrolltrigger/ SKILL.md
    gsap-plugins/    SKILL.md
    gsap-utils/      SKILL.md
    gsap-react/      SKILL.md
    gsap-performance/  SKILL.md
    gsap-frameworks/ SKILL.md
  examples/          # 最小参考 demo（vanilla + React）
```

## GitHub Copilot

Copilot 不会加载 Cursor/Claude 的 skill 文件。要在仓库里获得 GSAP 指引，把 [.github/copilot-instructions.md](https://github.com/greensock/gsap-skills/blob/main/.github/copilot-instructions.md)（以及可选的 [.github/instructions/](https://github.com/greensock/gsap-skills/blob/main/.github/instructions) 路径级文件）复制到目标仓库。参考 [GitHub Copilot customization](https://docs.github.com/en/copilot/concepts/response-customization)。

## License

MIT
