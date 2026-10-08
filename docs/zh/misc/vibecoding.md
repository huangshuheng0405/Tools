# Vibecoding

## spinner

用在**不知道还要等多久**的时候：圆环匀速旋转，只表达「在忙」，不表达「还剩多少」。

<div class="ld-demo">
  <div class="ld-stage">
    <div class="ld-spinner"></div>
  </div>
</div>

## progress bar

用在**进度可以计算**的时候：宽度从 0 涨到 100%，用户能预估还要多久。

<div class="ld-demo">
  <div class="ld-stage">
    <div class="ld-bar"><span></span></div>
  </div>
</div>

## circular progress

用在**小空间里的明确进度**：占位只有一条环，比进度条小得多，适合按钮角落、卡片角标。

<div class="ld-demo">
  <div class="ld-stage">
    <svg class="ld-circular" viewBox="0 0 48 48" width="48" height="48">
      <circle cx="24" cy="24" r="20" fill="none" stroke="var(--vp-c-divider)" stroke-width="4"></circle>
      <circle class="ld-circular__arc" cx="24" cy="24" r="20" fill="none" stroke="#0066cc" stroke-width="4" stroke-linecap="round"></circle>
    </svg>
  </div>
</div>

## skeleton

内容还没回来时**先把版式占住**（骨架屏），避免页面从一片空白突然跳成有内容。

<div class="ld-demo">
  <div class="ld-stage">
    <div class="ld-skeleton">
      <div class="ld-skeleton__avatar"></div>
      <div class="ld-skeleton__lines">
        <div class="ld-skeleton__line"></div>
        <div class="ld-skeleton__line ld-skeleton__line--short"></div>
      </div>
    </div>
  </div>
</div>

## shimmer

骨架屏上再扫一条**移动亮带**，比单纯呼吸更有「正在取数据」的感觉。

<div class="ld-demo">
  <div class="ld-stage">
    <div class="ld-skeleton ld-shimmer">
      <div class="ld-skeleton__avatar"></div>
      <div class="ld-skeleton__lines">
        <div class="ld-skeleton__line"></div>
        <div class="ld-skeleton__line ld-skeleton__line--short"></div>
      </div>
    </div>
  </div>
</div>

## button loading

提交后**锁住按钮**：转圈 + 变暗 + 光标变 `progress`，防止重复提交。演示用隐藏的 checkbox 做成可点击切换（真实项目里这层状态由 `disabled` 接管）。

<div class="ld-demo">
  <div class="ld-stage">
    <label class="ld-btn" title="点击切换加载状态">
      <input type="checkbox" class="ld-btn__toggle" />
      <span class="ld-btn__spinner"></span>
      <span class="ld-btn__text">提交</span>
    </label>
  </div>
</div>

## page loader

**整个页面还没准备好**时，用一层半透明遮罩盖住内容，中间放个小 spinner。

<div class="ld-demo">
  <div class="ld-stage">
    <div class="ld-page">
      <div class="ld-page__dots"><span></span><span></span><span></span></div>
      <div class="ld-page__overlay">
        <div class="ld-spinner ld-spinner--sm"></div>
      </div>
    </div>
  </div>
</div>

<style>
  .ld-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    padding: 22px 16px;
    min-height: 132px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
  }
  .ld-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  /* 1. spinner —— 旋转圆环 */
  .ld-spinner {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid var(--vp-c-divider);
    border-top-color: #0066cc;
    animation: ld-spin 0.8s linear infinite;
  }
  .ld-spinner--sm {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
  @keyframes ld-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* 2. progress bar —— 进度条 */
  .ld-bar {
    width: min(320px, 100%);
    height: 6px;
    border-radius: 3px;
    background: var(--vp-c-divider);
    overflow: hidden;
  }
  .ld-bar > span {
    display: block;
    width: 0;
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, #0066cc, #00a8ff);
    animation: ld-bar-fill 2s ease-in-out infinite;
  }
  @keyframes ld-bar-fill {
    0% {
      width: 0%;
    }
    80% {
      width: 100%;
    }
    100% {
      width: 100%;
    }
  }

  /* 3. circular progress —— 环形进度 */
  .ld-circular {
    animation: ld-spin 1.2s linear infinite;
  }
  .ld-circular__arc {
    stroke-dasharray: 126;
    animation: ld-circ-dash 1.5s ease-in-out infinite;
  }
  @keyframes ld-circ-dash {
    0% {
      stroke-dashoffset: 110;
    }
    50% {
      stroke-dashoffset: 24;
    }
    100% {
      stroke-dashoffset: 110;
    }
  }

  /* 4. skeleton —— 骨架屏 */
  .ld-skeleton {
    display: flex;
    align-items: center;
    gap: 10px;
    width: min(320px, 100%);
  }
  .ld-skeleton__avatar {
    flex: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--vp-c-divider);
    animation: ld-pulse 1.5s ease-in-out infinite;
  }
  .ld-skeleton__lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ld-skeleton__line {
    height: 9px;
    border-radius: 5px;
    background: var(--vp-c-divider);
    animation: ld-pulse 1.5s ease-in-out infinite;
  }
  .ld-skeleton__line--short {
    width: 55%;
  }
  @keyframes ld-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }

  /* 5. shimmer —— 骨架屏上的移动亮带 */
  .ld-shimmer {
    position: relative;
    overflow: hidden;
  }
  .ld-shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
    animation: ld-shimmer-sweep 1.4s ease-in-out infinite;
  }
  .dark .ld-shimmer::after {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.09), transparent);
  }
  @keyframes ld-shimmer-sweep {
    0% {
      transform: translateX(-160%);
    }
    100% {
      transform: translateX(280%);
    }
  }

  /* 6. button loading —— 提交后锁住按钮（纯 CSS 可切换） */
  .ld-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 104px;
    padding: 9px 18px;
    border-radius: 8px;
    background: #0066cc;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s ease;
  }
  .ld-btn__toggle {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
  .ld-btn__spinner {
    display: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    animation: ld-spin 0.7s linear infinite;
  }
  .ld-btn__toggle:checked ~ .ld-btn__spinner {
    display: block;
  }
  .ld-btn__toggle:checked ~ .ld-btn__text {
    opacity: 0.9;
  }
  .ld-btn:has(.ld-btn__toggle:checked) {
    background: #3f80c4;
    cursor: progress;
  }

  /* 7. page loader —— 整页加载遮罩 */
  .ld-page {
    position: relative;
    width: min(320px, 100%);
    height: 84px;
    border-radius: 8px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    overflow: hidden;
  }
  .ld-page__dots {
    display: flex;
    gap: 4px;
    padding: 8px;
  }
  .ld-page__dots > span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--vp-c-divider);
  }
  .ld-page__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--vp-c-bg) 72%, transparent);
    backdrop-filter: blur(2px);
  }

  @media (prefers-reduced-motion: reduce) {
    .ld-demo * {
      animation: none !important;
    }
  }
</style>

## 卡片

- 左侧色条卡片：左边凸出一个小方块/小标签

左侧色条卡片：卡片左边一条细渐变色条紧贴边缘，配合一个同色系的圆角图标块，用来一眼区分卡片的分类或状态：

<div class="accent-card" style="--accent: #10b981">
  <span class="accent-card__icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg>
  </span>
  <span class="accent-card__text">
    <span class="accent-card__title">商品管理</span>
    <span class="accent-card__desc">查看、搜索商品，管理库存与价格（admin 可增删改）</span>
  </span>
  <span class="accent-card__chevron">›</span>
</div>

<style>
  .accent-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: 480px;
    margin: 18px 0;
    padding: 13px 16px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg);
    /* 让左侧色条贴合左圆角 */
    overflow: hidden;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease;
  }
  /* 左侧细渐变色条，紧贴卡片左缘、贯穿整高 */
  .accent-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 45%, #fff), var(--accent));
  }
  .accent-card:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--accent) 40%, var(--vp-c-divider));
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  /* 同色系圆角图标块 */
  .accent-card__icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    color: var(--accent);
  }
  .accent-card__icon svg {
    width: 21px;
    height: 21px;
  }
  .accent-card__text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .accent-card__title {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
  .accent-card__desc {
    overflow: hidden;
    font-size: 12.5px;
    color: var(--vp-c-text-3);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .accent-card__chevron {
    flex: none;
    color: var(--vp-c-text-3);
    font-size: 19px;
    line-height: 1;
  }
</style>

## 3D倾斜光影面板

为card添加跟随触摸位置的**3D透视倾斜**与径向反射流光，松手带**Spring阻尼回正**

把鼠标在下面这张卡片上移动试试——卡片会朝你的光标方向倾斜，一束径向高光会跟着光标走，松手时卡片像弹簧一样带着阻尼回弹复位：

<TiltCard />

## 共享元素无缝展开

实现Card到详情页的**共享元素转场**（Shared Element Transition），背景与Card容器做**连续平滑缩放**

点下面任意一张卡片——卡片会「无缝」放大成居中的详情面板，位置与尺寸连续过渡；关闭时再收回原处：

<SharedElementDemo />

## Tooltip

适合给图标、按钮或字段补充说明，悬停或聚焦时出现

把鼠标移到下面的图标上（或按 Tab 聚焦）试试：

<div class="vb-tip-row">
  <span class="vb-tip" data-tip="复制到剪贴板">
    <button class="vb-tip__btn" type="button" aria-label="复制">📋</button>
  </span>
  <span class="vb-tip" data-tip="加入收藏">
    <button class="vb-tip__btn" type="button" aria-label="收藏">☆</button>
  </span>
  <span class="vb-tip vb-tip--bottom" data-tip="下方提示也可以">
    <button class="vb-tip__btn" type="button" aria-label="更多">⋯</button>
  </span>
</div>

## Popover

适合点击后查看补充说明，可以放更多说明

点击下面的按钮展开浮层（用原生 `<details>` 实现，无需 JS）：

<details class="vb-popover">
  <summary class="vb-popover__trigger">查看详情 ▾</summary>
  <div class="vb-popover__panel">
    <p class="vb-popover__title">补充说明</p>
    <p>Popover 比 Tooltip 能装更多内容：可以放标题、正文，甚至一小块操作区。</p>
  </div>
</details>

## Modal

模态框，一般居中显示

<OverlayDemo variant="modal" />

## Drawer

抽屉，从侧边栏滑入的详情模板

<OverlayDemo variant="drawer" />

## Buttom Sheet

适合手机端的底部操作层，从底部向上弹出

<OverlayDemo variant="sheet" />

## Notification

右上角弹出一个卡片

点下面的按钮试试——通知卡片会从浏览器右上角滑入，3.5 秒后自动收起，也可以点右上角的 × 手动关闭：

<NotifyCard />

## Breadcrumb

面包屑，页面层级太深了，顶上显示一下当前在哪，能点回上一层

<nav class="vb-breadcrumb" aria-label="面包屑">
  <a class="vb-breadcrumb__link" href="#">首页</a>
  <span class="vb-breadcrumb__sep">/</span>
  <a class="vb-breadcrumb__link" href="#">前端</a>
  <span class="vb-breadcrumb__sep">/</span>
  <a class="vb-breadcrumb__link" href="#">Vue</a>
  <span class="vb-breadcrumb__sep">/</span>
  <span class="vb-breadcrumb__current" aria-current="page">响应式原理</span>
</nav>

## Anchor

锚点，页面很长，点右边的小目录直接跳到对应段落

<div class="vb-anchor">
  <div class="vb-anchor__doc">
    <h4 id="vb-anchor-sec-1" class="vb-anchor__h">一、安装</h4>
    <p>先安装依赖，再初始化配置文件。</p>
    <h4 id="vb-anchor-sec-2" class="vb-anchor__h">二、配置</h4>
    <p>在配置里填写你的选项，支持多种预设。</p>
    <h4 id="vb-anchor-sec-3" class="vb-anchor__h">三、使用</h4>
    <p>引入后即可在任意页面调用对应能力。</p>
  </div>
  <nav class="vb-anchor__toc" aria-label="本页目录">
    <a class="vb-anchor__link is-active" href="#vb-anchor-sec-1">安装</a>
    <a class="vb-anchor__link" href="#vb-anchor-sec-2">配置</a>
    <a class="vb-anchor__link" href="#vb-anchor-sec-3">使用</a>
  </nav>
</div>

## Back to Top

滚到很下面之后，右下角出现一个按钮一键回到顶部

在下面的框里往下滚动，右下角会浮出「回到顶部」按钮，点一下平滑滚回顶部：

<BackToTop />

## Hero

首屏，网站最上面那块太空了，想要大图加大字，让用户一下知道这个网站是干嘛的

<div class="vb-hero">
  <div class="vb-hero__inner">
    <p class="vb-hero__eyebrow">FRONT-END NOTES</p>
    <h1 class="vb-hero__title">把零散的知识<br />沉淀成体系</h1>
    <p class="vb-hero__sub">254 篇全栈笔记，覆盖前端、后端、数据库与运维。</p>
    <div class="vb-hero__actions">
      <a class="vb-hero__btn vb-hero__btn--primary" href="#">开始阅读</a>
      <a class="vb-hero__btn vb-hero__btn--ghost" href="#">技术栈</a>
    </div>
  </div>
</div>

## CTA

在页面防个显眼的地方，让人看了就想点，例如”免费试用“

<div class="vb-cta">
  <div class="vb-cta__text">
    <p class="vb-cta__title">准备好开始了吗？</p>
    <p class="vb-cta__sub">免费试用 14 天，无需信用卡。</p>
  </div>
  <a class="vb-cta__btn" href="#">免费试用</a>
</div>

## Header

页头，最上面那条，一般放logo、导航、登录按钮

<header class="vb-header">
  <span class="vb-header__logo">◈ MyDocs</span>
  <nav class="vb-header__nav">
    <a href="#">文档</a>
    <a href="#">博客</a>
    <a href="#">关于</a>
  </nav>
  <button class="vb-header__login" type="button">登录</button>
</header>

## Footer

页脚，页面最底下那块，放链接或版权信息

<footer class="vb-footer">
  <div class="vb-footer__col">
    <p class="vb-footer__brand">MyDocs</p>
    <p class="vb-footer__desc">个人全栈学习笔记库</p>
  </div>
  <div class="vb-footer__col">
    <p class="vb-footer__h">产品</p>
    <a href="#">文档</a>
    <a href="#">更新日志</a>
  </div>
  <div class="vb-footer__col">
    <p class="vb-footer__h">社区</p>
    <a href="#">GitHub</a>
    <a href="#">讨论区</a>
  </div>
</footer>
<p class="vb-footer__copy">© 2026 MyDocs · 保留所有权利</p>

## Siderbar

侧边栏，左边一列功能菜单，右边一大块展示内容，像后台系统

<div class="vb-admin">
  <aside class="vb-admin__side">
    <p class="vb-admin__brand">后台系统</p>
    <a class="vb-admin__item is-active" href="#">概览</a>
    <a class="vb-admin__item" href="#">用户</a>
    <a class="vb-admin__item" href="#">订单</a>
    <a class="vb-admin__item" href="#">设置</a>
  </aside>
  <div class="vb-admin__main">
    <p class="vb-admin__main-title">概览</p>
    <div class="vb-admin__cards">
      <div class="vb-admin__card"><span>今日访问</span><strong>1,284</strong></div>
      <div class="vb-admin__card"><span>新增用户</span><strong>56</strong></div>
      <div class="vb-admin__card"><span>转化率</span><strong>3.8%</strong></div>
    </div>
  </div>
</div>

## Masonry

瀑布流，图片高矮不一样，别硬裁成一样高度，矮的下面自动补上新的即可

<div class="vb-masonry">
  <div class="vb-masonry__item" style="height: 120px; background: linear-gradient(135deg, #0066cc, #00a8ff)">A</div>
  <div class="vb-masonry__item" style="height: 180px; background: linear-gradient(135deg, #7c3aed, #c026d3)">B</div>
  <div class="vb-masonry__item" style="height: 90px; background: linear-gradient(135deg, #059669, #34d399)">C</div>
  <div class="vb-masonry__item" style="height: 150px; background: linear-gradient(135deg, #ea580c, #f59e0b)">D</div>
  <div class="vb-masonry__item" style="height: 100px; background: linear-gradient(135deg, #0284c7, #38bdf8)">E</div>
  <div class="vb-masonry__item" style="height: 160px; background: linear-gradient(135deg, #be123c, #fb7185)">F</div>
</div>

## Spring

弹性，弹出出现时带一点回弹，像弹簧一样轻轻晃一下

<div class="vb-spring-demo">
  <div class="vb-spring-card">Spring</div>
</div>

## Fade in/out

渐入渐出，切换内容的时候，让旧的淡出，新的淡入

<div class="vb-fade">
  <div class="vb-fade__a">第一篇 · 淡入</div>
  <div class="vb-fade__b">第二篇 · 淡入</div>
</div>

## 阅读进度条

页面很长时，顶部一条细进度条跟着滚动走，让人知道「读到哪儿了」。纯 CSS（`animation-timeline: scroll()`），不用监听 scroll 事件、也不用逐帧计算。

在下面的框里往下滚动，顶部那条进度会跟着填满：

<div class="vb-read">
  <div class="vb-read__bar"><span class="vb-read__fill"></span></div>
  <p>这条进度条的长度 = 已滚动的距离 ÷ 还能滚的距离，由浏览器自己算，代码里只写了一句 `animation-timeline: scroll(nearest block)`。</p>
  <p>好处是不占主线程：scroll 事件里手动算百分比会在滚动时每帧触发重排，而滚动驱动动画交给合成线程，滚多快都不掉帧。</p>
  <p>它绑的是「最近的滚动容器」。把这段放进一个 `overflow: auto` 的盒子里，进度条就跟着这个盒子走，不会串到整页的滚动上。</p>
  <p>长文档、长列表、聊天记录都适合：进度条本身就是「还有多少没看完」的天然提示。</p>
  <p>往下面继续滚——进度条应该已经快满了。到底之后它会停在一整条，而不是超出去。</p>
  <p>如果你看不到进度变化，多半是浏览器还不支持 `animation-timeline`（Chrome 115+ / Safari 26 起支持），这时进度条会保持空槽，但不会报错。</p>
</div>

## 流光边框

卡片描边跑一圈流动的渐变光，用来强调「重点 / 推荐 / 可点击」。纯 CSS：用 `@property` 把角度注册成可动画的 `<angle>`，再让 `conic-gradient` 绕着转。

<div class="vb-glow">
  <div class="vb-glow__inner">
    <p class="vb-glow__tag">PRO</p>
    <p class="vb-glow__title">流光边框卡片</p>
    <p class="vb-glow__desc">描边沿着一圈渐变持续流动，不用图片、不用 JS，适合强调重点卡片或推荐位。</p>
  </div>
</div>

## 光标光斑

鼠标在卡片上移动时，一束柔和的径向光跟光标走，离开后淡出。常拿来做「聚光灯」式的卡片、导航高亮或代码块高亮。

把鼠标移到下面这张卡片上（触屏可按住拖动）：

<SpotlightCard />

## 打字机

让一段文字像被敲出来一样逐字出现，末尾配一个闪烁的光标。纯 CSS：`steps()` 按字符数分步加宽 + 一个 step-end 的闪光标。

下面这行命令会一直循环「打完 — 停一下 — 重打」：

<div class="vb-type">
  <span class="vb-type__text">pnpm dev -- --host</span>
</div>

## 数字滚动

数据看板上的关键指标，从 0 缓动涨到目标值，比直接显示一个死数字更有「刚算出来」的感觉。用 `requestAnimationFrame` + easeOutCubic，进入视口才触发。

往下滚到这个卡片时它会开始跳数字（已经滚过去的话刷新一下页面）：

<CountUpStat />

## 涟漪按钮

点一下按钮，从**按下的那个点**扩散一圈水波，给点击一个即时的反馈。落点由 JS 从 `pointerdown` 的坐标算，水波是一个绝对定位的圆做 `scale` 扩散，`overflow: hidden` 把它裁在圆角里。

在按钮的不同位置点几下试试，水波就从你点的那个地方冒出来：

<div class="vb-ripple-demo">
  <RippleButton>提交订单</RippleButton>
  <RippleButton variant="violet">加入收藏</RippleButton>
</div>

<style>
  /* ===== vibecoding 演示样式（纯 CSS 部分，统一 vb- 前缀） ===== */

  /* Tooltip */
  .vb-tip-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 28px 8px;
  }
  .vb-tip {
    position: relative;
    display: inline-flex;
  }
  .vb-tip__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    font-size: 17px;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .vb-tip__btn:hover {
    background: var(--vp-c-default-soft);
  }
  .vb-tip::after {
    content: attr(data-tip);
    position: absolute;
    left: 50%;
    bottom: calc(100% + 8px);
    z-index: 5;
    padding: 5px 9px;
    border-radius: 6px;
    white-space: nowrap;
    background: var(--vp-c-text-1);
    color: var(--vp-c-bg);
    font-size: 12px;
    line-height: 1.2;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%) translateY(4px);
    transition:
      opacity 0.16s ease,
      transform 0.16s ease;
  }
  .vb-tip:hover::after,
  .vb-tip:focus-within::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .vb-tip--bottom::after {
    top: calc(100% + 8px);
    bottom: auto;
    transform: translateX(-50%) translateY(-4px);
  }
  .vb-tip--bottom:hover::after,
  .vb-tip--bottom:focus-within::after {
    transform: translateX(-50%) translateY(0);
  }

  /* Popover（原生 details） */
  .vb-popover {
    position: relative;
    display: inline-block;
    padding: 12px 0;
  }
  .vb-popover__trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  .vb-popover__trigger::-webkit-details-marker {
    display: none;
  }
  .vb-popover[open] .vb-popover__trigger {
    border-color: #0066cc;
    color: #0066cc;
  }
  .vb-popover__panel {
    position: absolute;
    left: 0;
    top: calc(100% - 4px);
    z-index: 5;
    width: 262px;
    padding: 14px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-bg-elv, #fff);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    font-size: 13px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
    animation: vb-pop-in 0.18s ease;
  }
  .vb-popover__title {
    margin: 0 0 4px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
  .vb-popover__panel p {
    margin: 0;
  }
  @keyframes vb-pop-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  /* Breadcrumb */
  .vb-breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 14px 0;
    font-size: 14px;
  }
  .vb-breadcrumb__link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color 0.15s ease;
  }
  .vb-breadcrumb__link:hover {
    color: #0066cc;
  }
  .vb-breadcrumb__sep {
    color: var(--vp-c-text-3);
  }
  .vb-breadcrumb__current {
    color: var(--vp-c-text-1);
    font-weight: 600;
  }

  /* Anchor */
  .vb-anchor {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding: 8px 0 4px;
  }
  .vb-anchor__doc {
    flex: 1;
    min-width: 0;
  }
  .vb-anchor__h {
    margin: 14px 0 4px;
    font-size: 15px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
  .vb-anchor__doc p {
    margin: 0 0 4px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--vp-c-text-2);
  }
  .vb-anchor__toc {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 132px;
    padding-left: 12px;
    border-left: 2px solid var(--vp-c-divider);
  }
  .vb-anchor__link {
    display: block;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 12px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition:
      color 0.15s ease,
      background 0.15s ease;
  }
  .vb-anchor__link:hover {
    color: #0066cc;
  }
  .vb-anchor__link.is-active {
    background: color-mix(in srgb, #0066cc 10%, transparent);
    color: #0066cc;
    font-weight: 600;
  }
  @media (max-width: 640px) {
    .vb-anchor__toc {
      display: none;
    }
  }

  /* Hero */
  .vb-hero {
    position: relative;
    overflow: hidden;
    padding: 56px 32px;
    border-radius: 16px;
    text-align: center;
    background: radial-gradient(120% 120% at 50% 0%, #1d1d1f 0%, #000 70%);
    color: #fff;
  }
  .vb-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(60% 50% at 50% 0%, rgba(0, 102, 204, 0.45), transparent 70%);
  }
  .vb-hero__inner {
    position: relative;
  }
  .vb-hero__eyebrow {
    margin: 0 0 12px;
    font-size: 12px;
    letter-spacing: 0.18em;
    color: rgba(255, 255, 255, 0.5);
  }
  .vb-hero__title {
    margin: 0 0 14px;
    font-size: 40px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
  .vb-hero__sub {
    max-width: 420px;
    margin: 0 auto 26px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
  }
  .vb-hero__actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .vb-hero__btn {
    padding: 10px 22px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition:
      transform 0.2s ease,
      background 0.2s ease;
  }
  .vb-hero__btn:hover {
    transform: translateY(-2px);
  }
  .vb-hero__btn--primary {
    background: #0066cc;
    color: #fff;
  }
  .vb-hero__btn--primary:hover {
    background: #0058b0;
  }
  .vb-hero__btn--ghost {
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
  }
  .vb-hero__btn--ghost:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  @media (max-width: 640px) {
    .vb-hero {
      padding: 40px 20px;
    }
    .vb-hero__title {
      font-size: 28px;
    }
  }

  /* CTA */
  .vb-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    padding: 24px 28px;
    border-radius: 16px;
    background: linear-gradient(120deg, #0066cc, #00a8ff);
    color: #fff;
    box-shadow: 0 14px 34px rgba(0, 102, 204, 0.28);
  }
  .vb-cta__title {
    margin: 0 0 4px;
    font-size: 20px;
    font-weight: 600;
  }
  .vb-cta__sub {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
  }
  .vb-cta__btn {
    flex: none;
    padding: 11px 26px;
    border-radius: 999px;
    background: #fff;
    color: #0066cc;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .vb-cta__btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  /* Header */
  .vb-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 12px 18px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: color-mix(in srgb, var(--vp-c-bg) 80%, transparent);
    backdrop-filter: blur(8px);
  }
  .vb-header__logo {
    font-size: 15px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }
  .vb-header__nav {
    display: flex;
    flex: 1;
    gap: 18px;
  }
  .vb-header__nav a {
    font-size: 14px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color 0.15s ease;
  }
  .vb-header__nav a:hover {
    color: var(--vp-c-text-1);
  }
  .vb-header__login {
    padding: 7px 16px;
    border: none;
    border-radius: 999px;
    background: #0066cc;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .vb-header__login:hover {
    background: #0058b0;
  }

  /* Footer */
  .vb-footer {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 20px;
    padding: 24px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
  }
  .vb-footer__brand {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }
  .vb-footer__desc {
    margin: 0;
    font-size: 13px;
    color: var(--vp-c-text-3);
  }
  .vb-footer__h {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
  .vb-footer__col a {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    color: var(--vp-c-text-2);
    text-decoration: none;
  }
  .vb-footer__col a:hover {
    color: #0066cc;
  }
  .vb-footer__copy {
    margin: 12px 0 0;
    font-size: 12px;
    color: var(--vp-c-text-3);
    text-align: center;
  }
  @media (max-width: 640px) {
    .vb-footer {
      grid-template-columns: 1fr;
    }
  }

  /* Sidebar（后台布局） */
  .vb-admin {
    display: flex;
    overflow: hidden;
    min-height: 200px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg);
  }
  .vb-admin__side {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 150px;
    padding: 14px 10px;
    background: var(--vp-c-bg-soft);
    border-right: 1px solid var(--vp-c-divider);
  }
  .vb-admin__brand {
    margin: 0 0 10px;
    padding: 0 8px;
    font-size: 13px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }
  .vb-admin__item {
    display: block;
    padding: 7px 10px;
    border-radius: 7px;
    font-size: 13px;
    color: var(--vp-c-text-2);
    text-decoration: none;
  }
  .vb-admin__item:hover {
    background: var(--vp-c-default-soft);
    color: var(--vp-c-text-1);
  }
  .vb-admin__item.is-active {
    background: color-mix(in srgb, #0066cc 12%, transparent);
    color: #0066cc;
    font-weight: 600;
  }
  .vb-admin__main {
    flex: 1;
    min-width: 0;
    padding: 16px;
  }
  .vb-admin__main-title {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
  .vb-admin__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 10px;
  }
  .vb-admin__card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-bg-soft);
  }
  .vb-admin__card span {
    font-size: 12px;
    color: var(--vp-c-text-3);
  }
  .vb-admin__card strong {
    font-size: 18px;
    color: var(--vp-c-text-1);
  }

  /* Masonry */
  .vb-masonry {
    columns: 3;
    column-gap: 12px;
  }
  .vb-masonry__item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    break-inside: avoid;
  }
  @media (max-width: 640px) {
    .vb-masonry {
      columns: 2;
    }
  }

  /* Spring */
  .vb-spring-demo {
    display: flex;
    justify-content: center;
    padding: 32px 8px;
  }
  .vb-spring-card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 96px;
    border-radius: 14px;
    background: linear-gradient(135deg, #0066cc, #00a8ff);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    box-shadow: 0 12px 28px rgba(0, 102, 204, 0.35);
    animation: vb-spring-pop 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  @keyframes vb-spring-pop {
    0% {
      transform: scale(0.85);
      opacity: 0.4;
    }
    55% {
      transform: scale(1.06);
      opacity: 1;
    }
    72% {
      transform: scale(0.98);
    }
    86% {
      transform: scale(1.01);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Fade in/out */
  .vb-fade {
    position: relative;
    height: 92px;
  }
  .vb-fade__a,
  .vb-fade__b {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #fff;
    font-weight: 600;
    animation: vb-fade-cycle 4s ease-in-out infinite;
  }
  .vb-fade__a {
    background: linear-gradient(135deg, #0066cc, #00a8ff);
  }
  .vb-fade__b {
    background: linear-gradient(135deg, #7c3aed, #c026d3);
    animation-delay: -2s;
  }
  @keyframes vb-fade-cycle {
    0%,
    42% {
      opacity: 1;
    }
    50%,
    92% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  /* Read progress（滚动驱动动画，纯 CSS） */
  .vb-read {
    max-width: 520px;
    height: 190px;
    overflow-y: auto;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
    scrollbar-width: thin;
    overscroll-behavior: contain;
  }
  .vb-read__bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: block;
    height: 3px;
    background: var(--vp-c-divider);
  }
  .vb-read__fill {
    display: block;
    height: 100%;
    transform: scaleX(0);
    transform-origin: left center;
    background: linear-gradient(90deg, #0066cc, #00a8ff);
  }
  .vb-read p {
    margin: 0;
    padding: 10px 16px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--vp-c-text-2);
  }
  @supports (animation-timeline: scroll()) {
    .vb-read__fill {
      animation-name: vb-read-progress;
      animation-duration: auto;
      animation-timing-function: linear;
      animation-timeline: scroll(nearest block);
    }
  }
  @keyframes vb-read-progress {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  /* Glow border（@property 注册角度 + conic-gradient，纯 CSS） */
  @property --vb-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  .vb-glow {
    max-width: 380px;
    margin: 0 auto;
    padding: 2px;
    border-radius: 16px;
    background: conic-gradient(from var(--vb-angle), #0066cc, #00e0ff, #7c3aed, #0066cc);
    box-shadow: 0 10px 30px rgba(0, 102, 204, 0.18);
    animation: vb-glow-rotate 4s linear infinite;
  }
  .vb-glow__inner {
    padding: 22px;
    border-radius: 14px;
    background: var(--vp-c-bg-soft);
  }
  .vb-glow__tag {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: #0066cc;
  }
  .vb-glow__title {
    margin: 6px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
  .vb-glow__desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
  }
  @keyframes vb-glow-rotate {
    to {
      --vb-angle: 360deg;
    }
  }

  /* Typewriter（纯 CSS：steps() 逐字 + 光标闪烁） */
  .vb-type {
    display: flex;
    justify-content: flex-start;
    padding: 26px 12px;
  }
  .vb-type__text {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    width: 0;
    padding-right: 2px;
    border-right: 2px solid #0066cc;
    font-family: var(--vp-font-family-mono);
    font-size: 18px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    animation:
      vb-typing 3.6s steps(18, end) infinite,
      vb-caret 0.9s step-end infinite;
  }
  @keyframes vb-typing {
    0% {
      width: 0;
    }
    60%,
    100% {
      width: 18ch;
    }
  }
  @keyframes vb-caret {
    50% {
      border-right-color: transparent;
    }
  }

  /* Ripple button 的按钮本体样式在 RippleButton.vue 里，这里只管演示区的排布 */
  .vb-ripple-demo {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    padding: 26px 8px;
  }

  @media (prefers-reduced-motion: reduce) {
    .vb-spring-card,
    .vb-fade__a,
    .vb-fade__b,
    .vb-popover__panel,
    .vb-glow,
    .vb-type__text {
      animation: none !important;
    }
    .vb-fade__b {
      opacity: 0;
    }
    .vb-type__text {
      width: auto;
      border-right-color: transparent;
    }
  }
</style>
