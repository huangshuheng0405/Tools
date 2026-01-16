# Nuxt 3 Routing System (Advanced)

Nuxt 3 routing is based on [vue-router](https://router.vuejs.org/) and is automatically configured via file-system conventions.

## 1. Basic Routing Conventions

Nuxt automatically scans the `pages/` directory:

- `pages/index.vue` -> `/`
- `pages/about.vue` -> `/about`
- `pages/settings/profile.vue` -> `/settings/profile`

---

## 2. Dynamic Routing Deep Dive

### 2.1 Basic Dynamic Parameters

Use square brackets `[id].vue` for filenames.

- Path: `/users/123`
- Access: `useRoute().params.id`

### 2.2 Multiple Parameters

You can combine multiple parameters in a path:

- Structure: `pages/shop/[category]/[id].vue`
- Path: `/shop/shoes/123` -> `{ category: 'shoes', id: '123' }`

### 2.3 Optional Parameters (Nuxt 3 Exclusive)

Use double square brackets `[[id]].vue`.

- `pages/archive/[[page]].vue`
- Matches `/archive` (empty page) and `/archive/1` (page is '1').

### 2.4 Catch-all Routes

Use `[...slug].vue` to capture the remaining path.

- `pages/docs/[...slug].vue` matches `/docs/intro` and `/docs/guide/install/linux`.

---

## 3. Nested Routes & Views

Nested routes allow you to keep a portion of the UI (like a sidebar) while only updating the child view.

### Directory Structure Requirements

1. Create a parent page file `parent.vue`.
2. Create a directory with the same name `parent/`.
3. Place child pages in `parent/` (e.g., `child.vue`).

### View Rendering

You must use `<NuxtPage />` in `parent.vue`:

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

This is one of Nuxt 3's most powerful features for configuring route behavior at the page level.

```vue
<script setup>
definePageMeta({
  // 1. Specify layout
  layout: 'custom',
  // 2. Route aliases (can have multiple)
  alias: ['/my-profile', '/account'],
  // 3. Route middleware
  middleware: ['auth'],
  // 4. Custom metadata (accessible via route.meta)
  title: 'User Settings',
  // 5. Page transitions
  pageTransition: { name: 'fade' },
  // 6. Keep state
  keepalive: true
})
</script>
```

---

## 5. Navigation & Links

### 5.1 `<NuxtLink>`

- **Smart Prefetching**: Nuxt automatically downloads the code for a page when its link enters the viewport.
- **External Links**: Automatically detects `http` or `mailto:` and renders as a standard `<a>` tag.
- **Active Class**: Automatically applies `.router-link-active`.

### 5.2 `navigateTo` (Programmatic Navigation)

Recommended for use within `setup` or `methods`.

```typescript
// Simple redirect
await navigateTo('/dashboard')

// With parameters and history handling
await navigateTo(
  {
    path: '/search',
    query: { q: 'nuxt' }
  },
  {
    replace: true, // Replace current history
    external: false // Whether it's an external link
  }
)
```

---

## 6. Route Middleware (Navigation Guards)

### Execution Order

1. `global` middleware (sorted by filename).
2. Middleware defined in `definePageMeta` in order.

### Return Values

- No return: Continue navigation.
- `navigateTo('/')`: Redirect to a new path.
- `abortNavigation()`: Stop current navigation.
- `abortNavigation(error)`: Stop and throw an error.

---

## 7. Route Validation & Error Handling

Use the `validate` hook to prevent invalid parameters from entering a page.

```vue
<script setup>
definePageMeta({
  validate: async (route) => {
    const isValid = /^\d+$/.test(route.params.id)
    if (!isValid) {
      // Throw a 404 error
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }
    return true
  }
})
</script>
```

---

## 8. Page Transitions

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
