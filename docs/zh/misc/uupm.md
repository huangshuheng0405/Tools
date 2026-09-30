# UI/UX Pro Max 笔记

> 来源：https://uupm.cc（AI-Powered Design Intelligence）
> 更新时间：2026-09-29

## 一句话定位

**UI/UX Pro Max（uupm）** = 一个可搜索的 UI 设计智能数据库，覆盖界面风格、配色、字体搭配、图表类型、落地页模式、UX 指南，并配 AI 推荐，帮你从一句 prompt 直接产出漂亮、可直接使用的界面代码。

## 数据库规模

| 类别 | 数量 |
|------|------|
| UI Styles（界面风格） | 57 |
| Color Palettes（配色） | 95 |
| Font Pairings（字体搭配） | 56 |
| Tech Stacks（技术栈） | 8 |
| Chart Types（图表类型） | 24 |
| Landing Patterns（落地页模式） | 29（其中 14 个转化导向页面结构） |
| Website Demos（成品示例） | 39 |

## 六大内容域

1. **设计风格（Design Styles）**：Glassmorphism、Neumorphism、Minimalism、Brutalism、Aurora UI 等 45+ 种，含配色、动效、框架兼容性
2. **配色（Color Palettes）**：按产品定制——SaaS / 电商 / 医疗 / 金融等，含 Primary、Secondary、CTA、Background、Text、Border
3. **字体（Typography）**：50+ 字体搭配，集成 Google Fonts、Tailwind 配置，按情绪推荐（如 Space Grotesk、Inter、Playfair）
4. **图表（Chart Types）**：数据可视化推荐，含库建议（Chart.js、Recharts、D3.js）与无障碍说明
5. **落地页（Landing Patterns）**：14 个转化优化的页面结构，含 CTA 位置策略与配色建议（Hero+Features、Video-First、Pricing 等）
6. **UX 指南（UX Guidelines）**：动画、无障碍（a11y）、z-index、加载状态等的最佳实践与反模式

## 支持的 8 个技术栈

React（state/hooks/性能）、Next.js（SSR/路由/API routes）、Vue（Composition API/Pinia/Vue Router）、Svelte（Runes/stores/SvelteKit）、SwiftUI（Views/State/导航）、React Native（组件/导航/列表）、Flutter（Widgets/State/主题）、Tailwind（工具类/响应式/a11y）。

## 工作流程：6 步从 prompt 到可用 UI

以"给宠物美容服务做个落地页"为例：

1. **你的 Prompt**
   ```
   $ Build a landing page for a pet grooming service. Playful and friendly style, with booking CTA.
   ```

2. **AI 推理（Reasoning）**：把 prompt 拆成结构化字段
   - Product: pet-service / Style: playful, friendly / Page: landing / CTA: booking
   - → 在 product、style、typography、color、landing、ux 等领域搜索

3. **搜索设计数据库**：命中并返回具体设计决策
   - PRODUCT: Pet Tech App
   - STYLE: Micro-interactions
   - TYPOGRAPHY: Fredoka + Nunito
   - LANDING: Hero + Features + CTA
   - UX RULE: Use animations for loading only
   - COLORS: Primary #3B82F6 / Secondary #60A5FA / CTA #F97316 / Background #F8FAFC / Text #1E293B

4. **生成代码**：直接产出带 Tailwind 类名的 HTML/组件
   ```html
   <!-- Pet Grooming Landing -->
   <section class="bg-[#F8FAFC]">
     <h1 class="font-['Fredoka'] text-[#1E293B]">Happy Pets, Happy Life</h1>
     <button class="bg-[#F97316] hover:bg-[#EA580C]">Book Grooming</button>
   </section>
   ```

5. **质量清单（Quality Checklist）**：SVG 图标（不用 emoji）、hover 反馈、暗色模式对比度、响应式布局

6. **最终成品**：可点击查看 live demo（如 https://uupm.cc/demo/pet-grooming）

## Demo 画廊

- 39 个真实网站 demo，20 个分类（SaaS、教育、宠物、AI/Chatbot、电商、金融/加密、医疗、创意、地产、游戏、餐饮、健身、旅行、NFT/Web3、美业、开发者工具、娱乐、法律、活动等）
- 26 个浅色 / 13 个深色
- 每个 demo 支持 Light/Dark 切换，并可 "Show Prompt" 查看其原始 prompt
- 风格示例：SaaS Analytics Dashboard（Glassmorphism+Flat）、Educational Platform（Claymorphism+Vibrant）、Luxury E-commerce（Liquid Glass+Glassmorphism）、Fintech Crypto Dashboard（Glassmorphism+OLED Dark）

## 备注

- 命令入口形如 `$ uipro`，核心价值是把「设计决策」沉淀成可搜索的数据库，再用 AI 把 prompt 映射到具体风格/配色/字体/落地页/UX 规则，最后生成可直接用的代码（Tailwind 友好）。
- 适合作为前端开发的「设计脚手架」，解决"不知道用什么风格/配色/字体"的冷启动问题。
