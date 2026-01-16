## 这里放站点静态资源（favicon/图片等）

VitePress 会把 `docs/public/` 映射到站点根路径 `/`。

### 设置 ico（推荐）

1. 把你的图标文件命名为 `favicon.ico`
2. 放到本目录：`docs/public/favicon.ico`

然后浏览器会以 `/favicon.ico` 访问到它（已在 `docs/.vitepress/config.ts` 里通过 `head` 显式引用）。

### 可选：更清晰的图标

- `docs/public/favicon.svg` → `/favicon.svg`
- `docs/public/apple-touch-icon.png` → `/apple-touch-icon.png`（iOS）


