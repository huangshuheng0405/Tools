# Nuxt 3 Layout System (Layouts)

Nuxt provides a powerful layout system that allows you to extract common UI structures (such as headers, footers, sidebars) into reusable layout components.

## 1. Enabling Layouts

To use the layout system, first create a `layouts/` directory in the project root. Nuxt will automatically import all components in this directory.

Layout components must contain a `<slot />` to render page content.

## 2. Default Layout

If a `layouts/default.vue` exists in your project, it will be used as the default layout for all pages.

```vue [layouts/default.vue]
<template>
  <div class="default-layout">
    <header>
      <nav>Common Navigation Bar</nav>
    </header>

    <main>
      <!-- Page content will be rendered here -->
      <slot />
    </main>

    <footer>Common Footer</footer>
  </div>
</template>
```

Wrap `<NuxtPage>` with `<NuxtLayout>` in `app.vue`:

```vue [app.vue]
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## 3. Custom Layouts

You can create named layouts to serve specific pages, such as login pages or admin dashboards.

### Creating a Custom Layout

Create a file named `layouts/custom.vue`:

```vue [layouts/custom.vue]
<template>
  <div class="custom-layout">
    <p>This is a specific header for the custom layout</p>
    <slot />
  </div>
</template>
```

### Using in Pages

Specify the layout in the page component using the `definePageMeta` macro:

```vue [pages/about.vue]
<script setup lang="ts">
definePageMeta({
  layout: 'custom'
})
</script>

<template>
  <div>
    <h1>About Page</h1>
    <p>This page uses the custom layout</p>
  </div>
</template>
```

If you want to completely disable the layout, you can set `layout: false`:

```vue
<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
```

## 4. Dynamically Changing Layouts

You can use the `setPageLayout` composable to change the layout dynamically at runtime.

```vue
<script setup lang="ts">
function enableCustomLayout() {
  setPageLayout('custom')
}
</script>

<template>
  <div>
    <button @click="enableCustomLayout">Switch to Custom Layout</button>
  </div>
</template>
```

## 5. Using with `<NuxtLayout>`

In some scenarios, you might want to manually control where the layout renders, or use layouts outside of `app.vue`.

```vue [pages/login.vue]
<script setup lang="ts">
definePageMeta({
  layout: false // Disable default layout mechanism
})
</script>

<template>
  <NuxtLayout name="auth">
    <div class="login-form">
      <h1>Login</h1>
      <!-- Login Form -->
    </div>
  </NuxtLayout>
</template>
```

This approach allows you to use the layout as a normal component and pass props to it.

## 6. Common Use Cases

- **Default Layout**: Standard pages containing top navigation and bottom copyright information.
- **Auth Layout**: Login/Registration pages, usually without navigation bars, with a clean background.
- **Admin Layout**: Admin dashboard with sidebar and top breadcrumbs.
- **Empty Layout**: Used for 404 pages or full-screen display pages.

## References

- [Nuxt 3 Docs - Layouts](https://nuxt.com/docs/guide/directory-structure/layouts)
