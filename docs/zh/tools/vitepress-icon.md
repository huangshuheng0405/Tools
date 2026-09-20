# Vitepress Plugin Froup Icons

## Getting Started

### Install

```bash
npm install vitepress-plugin-group-icons
```

### Configuration

```ts [.vitepress/config.ts] {2-5,8-11,13-15}
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
})
```

```ts [.vitepress/theme/index.ts] {2}
import Theme from 'vitepress/theme'
import 'virtual:group-icons.css'

export default Theme
```
