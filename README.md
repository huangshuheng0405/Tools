侧边栏文字怎么决定
现在配置了这些规则：

- 文件有 frontmatter title 时，优先用 title
- 没有 title 时，用文件里的 H1 标题
- 两者都没有时，才用文件名
- 目录下存在 index.md 时，目录名称和目录链接会尽量使用 index.md 的标题
- index.md 会排在当前侧边栏第一位

```md
---
title: Webpack 构建流程
---

# Webpack 构建流程
```
