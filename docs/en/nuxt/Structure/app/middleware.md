# Route Middleware

Nuxt provides a customizable **route middleware** framework that allows you to run code before navigating to a specific route. This is very useful for authentication (e.g., checking if a user is logged in), redirection, logging, or modifying page metadata.

Nuxt's middleware runs on top of Vue Router's navigation guards.

## Middleware Types

There are three types of route middleware in Nuxt:

1.  **Anonymous/Inline Middleware**: Defined directly in the page component using `definePageMeta`.
2.  **Named Middleware**: Placed in the `middleware/` directory and imported asynchronously in pages.
3.  **Global Middleware**: Placed in the `middleware/` directory and ending with `.global.ts` or `.global.js`, running on **every** route change.

## 1. Named Middleware

Create a file in the `middleware/` directory, the filename is the middleware name.

```ts [middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  // isAuthenticated() is an example composable
  if (isAuthenticated() === false) {
    return navigateTo('/login')
  }
})
```

Use the middleware in a page:

```vue [pages/dashboard.vue]
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

You can also pass an array to apply multiple middleware:

```ts
definePageMeta({
  middleware: ['auth', 'other-middleware']
})
```

## 2. Global Middleware

If you want a middleware to run on **every** route switch, just add the `.global` suffix to the filename.

```ts [middleware/analytics.global.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('Navigating to:', to.path)
})
```

Global middleware are executed in alphabetical order of filenames (unless using prefixes like `01.setup.global.ts` to control order).

## 3. Inline Middleware

For simple, page-specific logic, you can define it directly within the page.

```vue [pages/secret.vue]
<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline logic
      if (to.params.id === '1') {
        return abortNavigation()
      }
    }
  ]
})
</script>
```

## Middleware Return Values

Middleware functions can return the following values to control navigation:

- **No return value (undefined/void)**: Approve navigation, continue to the next middleware.
- **`navigateTo(route)`**: Redirect to the given path.
- **`abortNavigation(error)`**: Abort navigation. Optionally pass an error message.

### Example: Redirection

```ts [middleware/redirect.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
```

## Execution Order

The execution order of middleware is as follows:

1.  **Global Middleware** (sorted alphabetically or by numeric prefix)
2.  **Page-defined Middleware** (in array order)

## Dynamically Adding Middleware

You can use the `addRouteMiddleware()` helper to dynamically add middleware in plugins or pages.

```ts [plugins/middleware.ts]
export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    'global-test',
    () => {
      console.log('This is a dynamically added global middleware')
    },
    { global: true }
  )
})
```

## Server and Client

By default, middleware runs on server-side rendering (initial load) and client-side navigation.

If you only want to run it in a specific environment, you can add logic checks:

```ts [middleware/client-only.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return
  // Logic executed only on the client
  console.log('Client navigation')
})
```

<!-- TODO 接着做nuxt复习 -->
