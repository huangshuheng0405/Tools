# SSR

**SSR** (**Server-Side Rendering**) is a rendering method that converts Vue components into HTML strings on the server and sends them directly to the browser.

In traditional **CSR** (**Client-Side Rendering**), the browser receives an "empty shell" HTML and a bunch of JS files. The page content will not be displayed until the JS is downloaded and executed. In contrast, **SSR** allows the page to contain complete content when it arrives at the browser.

## Isomorphism

SSR does not completely abandon client-side rendering, but rather combines both.

1. **Server:**
   - Receives browser requests.
   - Converts Vue components into HTML strings using `@vue/server-renderer` (or Vite SSR plugin).
   - Injects the HTML into the template and returns it to the browser.

2. **Browser:**
   - Receives the page containing the complete HTML, allowing users to see the content immediately.
   - **Hydration**: This is the key step. The browser downloads the Vue JS code, and Vue takes over the existing HTML, binding event listeners to it, making it an interactive Single Page Application (SPA).

## Disadvantages

- Development constraints:
  - Only `beforeCreate` and `created` lifecycle hooks are executed on the server; `mounted` and others will not be triggered on the server.
  - You cannot directly use browser-specific APIs (such as `window`, `document`, `localStorage`). You must check the environment in specific hooks.

- Server load: The server needs to run Vue instances in real-time and render HTML, consuming more CPU and memory than simply serving static files (CSR).
- Complex deployment: Requires a Node.js runtime environment, and involves handling cache strategies, reverse proxy (like Nginx) configurations, etc.

## Handwritten `SSR`

Based on `Vite + Express`

### Directory

```
my-vite-ssr-app/
├── index.html          # HTML Template (contains SSR injection placeholder)
├── server.js           # Express server main file (handles HTTP requests and Vite middleware)
├── package.json
├── vite.config.js      # Vite Config
├── src/
│   ├── main.js         # Common creation logic (exports createApp for both SSR and client)
│   ├── entry-client.js # Client entry (mounts App to DOM, activates interaction)
│   ├── entry-server.js # Server entry (converts App to HTML string)
│   ├── router/
│   │   └── index.js    # Router code (distinguishes History mode)
│   ├── views/          # Page components
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── App.vue         # Root component
│   └── assets/         # Static resources (CSS, Images)
└── dist/               # Bundled directory (generated after build)
    ├── client/         # Client static resources
    └── server/         # Server rendering bundle
```

### Code

::: code-group

```js [entry-client.js]
import { createClientApp } from './main'

const { app, router } = createClientApp()

// Wait for router to be ready before mounting to prevent hydration mismatch
router.isReady().then(() => {
  app.mount('#app')
})
```

```js [entry-server.js]
import { renderToString } from 'vue/server-renderer'
import { createServerApp } from './main'

export async function render(url) {
  const { app, router } = createServerApp()

  router.push(url)
  await router.isReady()

  const ctx = {}
  const html = await renderToString(app, ctx)
  return html
}
```

```js [main.js]
import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createServerApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}

export function createClientApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}
```

```json [package.json]
{
  "name": "vue-ssr",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "express": "^4.2.1",
    "pinia": "^2.2.0",
    "prettier": "^3.3.0",
    "vue": "^3.5.0",
    "vue-router": "^4.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.5",
    "vite": "^8.0.2"
  }
}
```

```js [server.js]
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Create Vite development server instance (middleware mode)
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    const url = req.originalUrl

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // 2. Apply Vite HTML transforms (handles HMR and hot update scripts)
      template = await vite.transformIndexHtml(url, template)

      // 3. Load the server entry
      // vite.ssrLoadModule automatically transforms ESM to Node.js runnable code
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')

      // 4. Render the app HTML
      const appHtml = await render(url)

      // 5. Inject the app-rendered HTML into the template
      const html = template.replace(
        '<div id="app"></div>',
        `<div id="app">${appHtml}</div>`
      )

      // 6. Send the rendered HTML back
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  console.log('Server started at http://localhost:5173')
  app.listen(5173)
}

createServer()
```

```js [router/index.js]
import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory
} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('../views/About.vue')
  }
]

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  })
}
```

```vue [App.vue]
<script setup></script>

<template>
  <div>
    <nav>
      <RouterLink to="/">Home | </RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
```

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite SSR</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/entry-client.js"></script>
  </body>
</html>
```

```js [vite.config.js]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()]
})
```

:::

### Detail

The execution process can be divided into three main stages:

#### 1. Server Startup

1. Execution entry: Run the command, Node.js starts executing `server.js`.
2. Initialize server: In `server.js`, an `Express` instance is created, and the `Vite` service is started in middleware mode. `Vite` handles static resources and hot updates, while `Express` handles page routing.
3. Listen to port: The server starts listening on port `5173`, waiting for user access.

#### 2. Handle Browser Requests

When you open `localhost:5173` in your browser:

1. Intercept request: `app.use('*', async(req,res) => {})` of `Express` intercepts your request.
2. Read template: Reads `index.html` from the project root directory.
3. Load server entry: Dynamically loads `entry-server.js` via `Vite`'s `ssrLoadModule`.
4. Create `Vue` instance:
   - `entry-server.js` calls `createServerApp()` in `main.js`.
   - `main.js` creates and returns a brand new Vue instance and Router instance.

5. Match route and render:
   - `entry-server.js` navigates the route to the corresponding page via `router.push(url)` based on the requested URL (e.g., `/` or `/about`).
   - After matching the page component (e.g., `Home.vue`), it uses `renderToString` to render this Vue component tree into a pure static HTML string.

6. Return HTML: `server.js` injects this HTML string into the `<div id="app"></div>` placeholder of `index.html`, and then sends the complete HTML to the browser.

#### 3. Client Takeover and Hydration

1. Initial browser rendering: The browser receives the HTML and immediately displays the page (the page is visible, but interactions like buttons have not yet taken effect because JS events have not been mounted).
2. Load client script: When the browser parses the HTML, it finds `<script type="module" src="/src/entry-client.js"></script>` (defined in index.html), so it starts requesting and executing the client code.

3. Client initialization:
   - Executes `entry-client.js`.
   - It calls `createClientApp()` in `main.js`, creating another `Vue` instance and `Router` instance on the browser side.

4. Activate page (Hydration):
   - After the client router is ready, executes `app.mount("#app")`.
   - Vue will inspect the existing DOM (the HTML just sent by the server) and will not regenerate the DOM. Instead, it "binds" event listeners (like `@click` of a button) to the existing static DOM.
   - At this point, the page is completely "alive", and subsequent route navigations (like clicking `About`) are completely taken over by `Vue Router` on the frontend, turning into a traditional SPA (Single Page Application) experience.

## ⚠️ Advanced & Common Issues (Important)

### 1. Hydration Mismatch

If the virtual DOM generated by the client is inconsistent with the actual DOM structure returned by the server, Vue will throw a Hydration Mismatch error.

**Common Causes:**

- **Using indeterminate data**: For example, using `Math.random()` or current time `new Date()` during component rendering, causing the server-rendered value to be different from the client-rendered value.
- **Irregular HTML structure**: For example, nesting block-level elements (like `<div>`) inside `<p>` tags. The browser automatically corrects the HTML structure, which causes the client to fail to find the corresponding DOM during hydration.
- **Environment-specific variables**: Using `typeof window !== 'undefined'` for rendering logic, causing the server and client to enter different branches.

**Solution:**
Put client-only logic into the `onMounted` hook, because `onMounted` is only executed after client hydration is complete.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <div v-if="isClient">
    <!-- This is only rendered on the client side to avoid structural inconsistency -->
    <p>{{ Math.random() }}</p>
  </div>
</template>
```

### 2. State Management & Data Fetching

In SSR, if a page needs to initiate an API request to fetch data, we cannot let the client re-initiate the request (which would defeat the purpose of SSR). We need to **prefetch data on the server**, and then send the data to the client along with the HTML.

**Process:**

1. The server requests data at the component level.
2. After the data request is complete, the server uses a state management tool (like `Pinia`) to save these states.
3. The server serializes the Pinia state into an inline script (e.g., `window.__INITIAL_STATE__ = {...}`) and embeds it into `index.html`.
4. Before initializing the app, the client directly reads data from `window.__INITIAL_STATE__` and injects it into the client's Pinia (this process is called **Dehydration & Hydration**).

### 3. Cross-Request State Pollution

In traditional client-side (CSR) development, we are used to defining singleton variables at the top of the file:

```javascript
// ❌ This is a disaster in SSR!
const state = reactive({ count: 0 })
export default {
  /* ... */
}
```

**Reason**: The Node.js server is a long-running process. If two different users access it at the same time, they will share this global `state`, causing data pollution and security leaks!

**Correct Practice**:
**A brand new Vue instance, Router instance, and Pinia instance must be created for each request.** This is why in the handwritten code earlier, `main.js` provides a `createApp()` factory function instead of directly exporting an `app` instance.

```javascript
// ✅ Create an independent scope for each request
export function createServerApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  const pinia = createPinia() // Always a new Pinia instance

  app.use(router)
  app.use(pinia)

  return { app, router, pinia }
}
```
