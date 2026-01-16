# Nuxt 3 Project Setup Guide

## Prerequisites

Before getting started, ensure your development environment meets the following requirements:

- **Node.js**: 18.x or higher
- **Package Manager**: npm, yarn, pnpm, or bun

## Create Project

### Method 1: Using npx

```bash
npm create nuxt@latest <project-name>
```

### Method 2: Using yarn

```bash
yarn create nuxt <project-name>
```

### Method 3: Using pnpm

```bash
pnpm create nuxt@latest <project-name>
```

### Method 4: Using bun

```bash
bun create nuxt@latest <project-name>
```

## Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd <project-name>
```

Choose the appropriate command based on your package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

## Start Development Server

After installation, start the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun run dev
```

Development server runs on `http://localhost:3000` by default

## Project Structure

Basic Nuxt 3 project structure:

```
project-name/
├── .nuxt/              # Build output directory
├── assets/             # Style files, images, etc.
├── components/         # Vue components
├── composables/        # Composable functions
├── layouts/            # Layout components
├── middleware/         # Route middleware
├── pages/              # Page routes
├── plugins/            # Plugins
├── public/             # Static assets
├── server/             # Server-side code
├── app.vue             # Application entry component
├── nuxt.config.ts      # Nuxt configuration file
└── package.json        # Project configuration file
```

## Build for Production

### Generate Static Site (SSG)

```bash
npm run generate
```

### Build SSR Application

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

  // Application configuration
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

  // Modules configuration
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

## Command Summary

| Command               | Description                 |
| --------------------- | --------------------------- |
| `npm run dev`         | Start development server    |
| `npm run build`       | Build for production        |
| `npm run generate`    | Generate static site        |
| `npm run preview`     | Preview production build    |
| `npm run postinstall` | Generate Nuxt type files    |

## Next Steps

- 📖 Read [Nuxt 3 Official Documentation](https://nuxt.com)
- 🎨 Explore [Nuxt Modules](https://nuxt.com/modules)
- 💚 Join [Nuxt Community](https://discord.nuxt.com)

## References

- [Nuxt 3 Official Documentation](https://nuxt.com)
- [Nuxt 3 GitHub Repository](https://github.com/nuxt/nuxt)
- [Vue 3 Documentation](https://vuejs.org)
