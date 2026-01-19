# Nuxt 3 Project Creation Steps

## Prerequisites

Before getting started, please ensure your development environment meets the following requirements:

- **Node.js**: 18.x or higher
- **Package Manager**: npm, yarn, pnpm, or bun

## Create Project

::: code-group

```sh [npm]
npm create nuxt@latest <project-name>
```

```sh [yarn]
yarn create nuxt <project-name>
```

```sh [pnpm]
pnpm create nuxt@latest <project-name>
```

```sh [bun]
bun create nuxt@latest <project-name>
```

:::

## Install Dependencies

Enter the project directory and install dependencies:

```bash
cd <project-name>
```

Choose the corresponding command based on the package manager you use:

::: code-group

```sh [npm]
npm install
```

```sh [yarn]
yarn install
```

```sh [pnpm]
pnpm install
```

```sh [bun]
bun install
```

:::

## Start Development Server

After installation is complete, start the development server:

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

The development server runs at `http://localhost:3000` by default.

## Project Structure

Basic structure of a Nuxt 3 project:

```
project-name/
├── .nuxt/              # Build output directory
├── assets/             # Assets like styles, images
├── components/         # Vue components
├── composables/        # Composables
├── layouts/            # Layout components
├── middleware/         # Route middleware
├── pages/              # Page routes
├── plugins/            # Plugins
├── public/             # Static assets
├── server/             # Server-side code
├── app.vue             # App entry component
├── nuxt.config.ts      # Nuxt configuration file
└── package.json        # Project configuration file
```

## Build for Production

### Generate Static Site (SSG)

```bash
npm run generate
```

### Build SSR App

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Common Configuration

### nuxt.config.ts Basic Configuration

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },

  // App configuration
  app: {
    head: {
      title: 'My Nuxt App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // Module configuration
  modules: [],

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL
    }
  }
})
```

## Deployment

### Vercel Deployment

1. Push project to GitHub
2. Import project in Vercel
3. Vercel will automatically detect Nuxt 3 and configure build settings
4. Click deploy

### Netlify Deployment

Build command:

```bash
npm run build
```

Publish directory:

```
.output/public
```

## Common Commands Summary

| Command               | Description               |
| --------------------- | ------------------------- |
| `npm run dev`         | Start development server  |
| `npm run build`       | Build for production      |
| `npm run generate`    | Generate static site      |
| `npm run preview`     | Preview production build  |
| `npm run postinstall` | Generate Nuxt type files  |

## Next Steps

- 📖 Read [Nuxt 3 Official Documentation](https://nuxt.com)
- 🎨 Explore [Nuxt Modules](https://nuxt.com/modules)
- 💚 Join [Nuxt Community](https://discord.nuxt.com)

## References

- [Nuxt 3 Official Documentation](https://nuxt.com)
- [Nuxt 3 GitHub Repository](https://github.com/nuxt/nuxt)
- [Vue 3 Documentation](https://vuejs.org)

## Tips

When creating a nuxt project fails

Method 1: Set proxy in terminal (Most recommended)
If you have a proxy enabled on your computer, just turning it on is not enough; you need to tell the terminal (command line) to use this proxy.

Check your proxy port

Open your proxy software settings and find the HTTP/HTTPS proxy port (usually 7890, 1080, or 10809).

```bash
set http_proxy=http://127.0.0.1:7890 & set https_proxy=http://127.0.0.1:7890
```

Run creation command again

After setting the proxy above, do not close the current window, directly enter `npx nuxi@latest init <project-name>`, usually it will download instantly.
