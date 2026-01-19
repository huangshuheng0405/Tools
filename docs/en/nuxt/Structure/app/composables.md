# Composables Directory

Nuxt uses the `composables/` directory to automatically import your Vue composables. This allows you to encapsulate reusable logic and use it directly throughout your application without manual imports.

## Auto-imports

Nuxt automatically scans files in the `composables/` directory and automatically imports top-level exports (named exports) and default exports (default exports) into your application.

### Example

Create a `composables/useFoo.ts` file:

```ts [composables/useFoo.ts]
export const useFoo = () => {
  return useState('foo', () => 'bar')
}
```

Now you can use `useFoo()` directly in your components:

```vue [app.vue]
<script setup>
const foo = useFoo()
</script>

<template>
  <div>
    {{ foo }}
  </div>
</template>
```

## Naming Conventions

- **File Name**: Recommended to use `camelCase`, e.g., `useUser.ts`.
- **Function Name**: Also recommended to use `camelCase` and start with `use`, e.g., `useUser`, `useAuth`.

## Writing Composables

### Default Exports vs Named Exports

You can use named exports:

```ts [composables/utils.ts]
export const useFormatDate = (date) => {
  /* ... */
}
export const useFormatCurrency = (amount) => {
  /* ... */
}
```

You can also use default exports (usually when the file name matches the function name):

```ts [composables/useBar.ts]
export default function () {
  return 'bar'
}
```

_Note: When using default exports, the auto-imported name is the filename (without extension)._ See [Difference between Default and Named Exports](/Tips/default-vs-named-export)

## State Sharing (useState)

In Composables, you often need to use `useState` to create a reactive state shared across components. This is safer than using `ref` because `ref` can cause state leakage between requests during Server-Side Rendering (SSR).

```ts [composables/useCounter.ts]
export const useCounter = () => {
  return useState('counter', () => 0)
}
```

## Scanning Mechanism

By default, Nuxt only scans **top-level files** in the `composables/` directory.

### Nested Directories

If you have nested directories, e.g., `composables/nested/utils.ts`, functions inside **will not** be auto-imported unless you re-export them or configure Nuxt.

**Method 1: Re-export (Recommended)**

Re-export in `composables/index.ts`:

```ts [composables/index.ts]
export { useNestedUtils } from './nested/utils'
```

**Method 2: Configure Scan Paths**

Add directories to the scan list in `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  imports: {
    dirs: [
      // Scan all subdirectories under composables
      'composables/**'
    ]
  }
})
```

## Type Support

Nuxt automatically generates type definitions, so you get full TypeScript support and autocompletion when writing code without extra configuration. The generated type definitions are located in `.nuxt/imports.d.ts`.
