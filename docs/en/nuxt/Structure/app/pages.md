# Pages Directory

Nuxt provides an optional `pages/` directory, a file-based routing system. If you create this directory, Nuxt automatically generates Vue Router configuration based on the file structure.

## Basic Routing

Nuxt automatically generates route paths based on filenames.

- `pages/index.vue` -> `/`
- `pages/about.vue` -> `/about`
- `pages/contact.vue` -> `/contact`

```vue [pages/about.vue]
<template>
  <h1>About Page</h1>
</template>
```

## Dynamic Routing

Use square brackets `[]` to wrap filenames or directory names to create dynamic routes.

- `pages/users/[id].vue` -> `/users/1`, `/users/abc`

You can access parameters via `useRoute()` in the page:

```vue [pages/users/[id].vue]
<script setup>
const route = useRoute()
console.log(route.params.id)
</script>

<template>
  <div>User ID: {{ route.params.id }}</div>
</template>
```

## Catch-all Routes

Use `[...slug].vue` syntax to match all nested paths.

- `pages/posts/[...slug].vue` -> `/posts/a`, `/posts/a/b`, `/posts/a/b/c`

```vue [pages/posts/[...slug].vue]
<script setup>
const route = useRoute()
</script>

<template>
  <p>Path: {{ route.params.slug }}</p>
</template>
```

## Nested Routes

You can define nested routes by creating a `.vue` file with the same name as the directory. The parent component needs to use `<NuxtPage />` to render child routes.

File structure:

```
pages/
|-- parent/
|   |-- child.vue
|-- parent.vue
```

```vue [pages/parent.vue]
<template>
  <div>
    <h1>Parent</h1>
    <NuxtPage />
  </div>
</template>
```

When accessing `/parent/child`, the content of `child.vue` will be rendered in the `<NuxtPage />` position of `parent.vue`.

## Page Metadata (Page Meta)

You can use the `definePageMeta` macro to define metadata for pages, such as layout, middleware, etc.

```vue [pages/login.vue]
<script setup>
definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>
```

## Navigation

Use the `<NuxtLink>` component to navigate between pages. It behaves as an SPA during client-side navigation and as an `<a>` tag for SEO.

```vue [app.vue]
<template>
  <NuxtLink to="/about">Go to About</NuxtLink>
</template>
```

## Only One Page?

If you don't need routing, or the app is simple, you actually don't need the `pages/` directory. You can just use `app.vue` as the entry point, which is useful for building landing pages or simple single-page applications.
