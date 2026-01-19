# Nuxt 3 Routing System (Deep Dive)

Nuxt 3's routing system is based on [vue-router](https://router.vuejs.org/) and is automatically configured via file system conventions.

## 1. Basic Routing Conventions

Nuxt automatically scans the `pages/` directory:

- `pages/index.vue` -> `/`
- `pages/about.vue` -> `/about`
- `pages/settings/profile.vue` -> `/settings/profile`

---

## 2. Dynamic Routing Analysis

### 2.1 Basic Dynamic Parameters

File names use square brackets `[id].vue`.

- Path: `/users/123`
- Access: `useRoute().params.id`

### 2.2 Multi-Parameter Routing

You can combine multiple parameters in a path:

- Structure: `pages/shop/[category]/[id].vue`
- Path: `/shop/shoes/123` -> `{ category: 'shoes', id: '123' }`

### 2.3 Optional Parameters (Nuxt 3 Specific)

Use double brackets `[[id]].vue`.

- `pages/archive/[[page]].vue`
- Matches `/archive` (page is empty) and `/archive/1` (page is '1').

### 2.4 Catch-all

Use `[...slug].vue` to catch remaining paths.

- `pages/docs/[...slug].vue` matches `/docs/intro` and `/docs/guide/install/linux`.

---

## 3. Nested Routes and Views

Nested routes allow you to keep part of the UI (like a sidebar) in a parent page while only updating the child view.

### Directory Structure Requirements

1. Create a parent page file `parent.vue`.
2. Create a directory with the same name `parent/`.
3. Place child pages in `parent/` (e.g., `child.vue`).

### View Rendering

`<NuxtPage />` must be used in `parent.vue`:

```vue
<template>
  <div class="layout">
    <aside>Sidebar Navigation</aside>
    <main>
      <!-- Child page content will be inserted here -->
      <NuxtPage />
    </main>
  </div>
</template>
```

---

## 4. Page Metadata `definePageMeta`

This is one of Nuxt 3's most powerful features for configuring routing behavior at the page level.

```vue
<script setup>
definePageMeta({
  // 1. Specify layout
  layout: 'custom',
  // 2. Route aliases (can be multiple)
  alias: ['/my-profile', '/account'],
  // 3. Route guards
  middleware: ['auth'],
  // 4. Custom data (accessible via route.meta)
  title: 'User Settings',
  // 5. Page transition animation
  pageTransition: { name: 'fade' },
  // 6. Keep page state
  keepalive: true
})
</script>
```

---

## 5. Navigation and Links

### 5.1 `<NuxtLink>`

- **Smart Prefetching**: When a link enters the viewport, Nuxt automatically downloads the code for that page (JS only, data not included).
- **External Links**: Automatically detects `http` or `mailto:` and renders as a normal `<a>` tag.
- **Active Class**: Automatically applies `.router-link-active`.

### 5.2 `navigateTo` (Programmatic Navigation)

Recommended for use in `setup` or `methods`.

```typescript
// Simple navigation
await navigateTo('/dashboard')

// With parameters and history handling
await navigateTo(
  {
    path: '/search',
    query: { q: 'nuxt' }
  },
  {
    replace: true, // Replace current history
    external: false // Is external link
  }
)
```

---

## 6. Route Middleware (Navigation Guards)

### Execution Order

1. `global` middleware (sorted alphabetically by filename).
2. Order defined in `definePageMeta` within the page.

### Return Value Specification

- No return value: Continue navigation.
- `navigateTo('/')`: Redirect to new path.
- `abortNavigation()`: Stop current navigation.
- `abortNavigation(error)`: Stop and throw error.

---

## 7. Route Validation and Error Handling

Use the `validate` hook to prevent illegal parameters from entering the page.

```vue
<script setup>
definePageMeta({
  validate: async (route) => {
    const isValid = /^\d+$/.test(route.params.id)
    if (!isValid) {
      // Throw 404 error
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }
    return true
  }
})
</script>
```

---

## 8. Page Transition Animation

Enable global configuration in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
```

Define styles in `app.vue` or global CSS:

```css
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
```
