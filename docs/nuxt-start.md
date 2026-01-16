# Nuxt 3 项目创建步骤

## 前置要求

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js**: 18.x 或更高版本
- **包管理器**: npm、yarn、pnpm 或 bun

## 创建项目

### 方法一：使用 npx

```bash
npm create nuxt@latest <project-name>
```

### 方法二：使用 yarn

```bash
yarn create nuxt <project-name>
```

### 方法三： 使用 pnpm

```bash
pnpm create nuxt@latest <project-name>
```

### 方法四：使用 bun

```bash
bun create nuxt@latest <project-name>
```

## 安装依赖

进入项目目录并安装依赖：

```bash
cd <project-name>
```

根据您使用的包管理器选择对应命令：

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install

# 使用 bun
bun install
```

## 启动开发服务器

安装完成后，启动开发服务器：

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev

# 使用 bun
bun run dev
```

开发服务器默认运行在 `http://localhost:3000`

## 项目结构

Nuxt 3 项目的基本结构：

```
project-name/
├── .nuxt/              # 构建输出目录
├── assets/             # 样式、图片等资源文件
├── components/         # Vue 组件
├── composables/        # 组合式函数
├── layouts/            # 布局组件
├── middleware/         # 路由中间件
├── pages/              # 页面路由
├── plugins/            # 插件
├── public/             # 静态资源
├── server/             # 服务器端代码
├── app.vue             # 应用入口组件
├── nuxt.config.ts      # Nuxt 配置文件
└── package.json        # 项目配置文件
```

## 构建生产版本

### 生成静态站点（SSG）

```bash
npm run generate
```

### 构建 SSR 应用

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 常用配置

### nuxt.config.ts 基础配置

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },

  // 应用配置
  app: {
    head: {
      title: 'My Nuxt App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // CSS 配置
  css: ['~/assets/css/main.css'],

  // 模块配置
  modules: [],

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL
    }
  }
})
```

## 部署

### Vercel 部署

1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. Vercel 会自动检测 Nuxt 3 并配置构建设置
4. 点击部署即可

### Netlify 部署

构建命令：

```bash
npm run build
```

发布目录：

```
.output/public
```

## 常用命令总结

| 命令                  | 说明               |
| --------------------- | ------------------ |
| `npm run dev`         | 启动开发服务器     |
| `npm run build`       | 构建生产版本       |
| `npm run generate`    | 生成静态站点       |
| `npm run preview`     | 预览生产构建       |
| `npm run postinstall` | 生成 Nuxt 类型文件 |

## 下一步

- 📖 阅读 [Nuxt 3 官方文档](https://nuxt.com)
- 🎨 探索 [Nuxt Modules](https://nuxt.com/modules)
- 💚 加入 [Nuxt 社区](https://discord.nuxt.com)

## 参考资源

- [Nuxt 3 官方文档](https://nuxt.com)
- [Nuxt 3 GitHub 仓库](https://github.com/nuxt/nuxt)
- [Vue 3 文档](https://vuejs.org)

## Tips

创建 nuxt 项目失败时

方法一：在终端设置代理（最推荐，治标治本）
如果你电脑上开了“魔法”（VPN/梯子），光开着是不够的，你得告诉终端（命令行）去使用这个代理。

查看你的代理端口

打开你的代理软件设置，找到 HTTP/HTTPS 代理端口（通常是 7890、1080 或 10809）。

```bash
set http_proxy=http://127.0.0.1:7890 & set https_proxy=http://127.0.0.1:7890
```

再次运行创建命令

设置完上面的代理后，不要关闭当前窗口，直接输入 npx nuxi@latest init <项目名>，通常就能秒下载了。
