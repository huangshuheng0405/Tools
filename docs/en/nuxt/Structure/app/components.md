# Components Directory

The `components/` directory is where you put your Vue components in a Nuxt project. Nuxt automatically imports these components, meaning you can use them directly in your pages and other components without explicitly importing them.

## Auto-imports

Nuxt automatically scans files in the `components/` directory and registers components based on filenames.

For example, if you have a file `components/AppHeader.vue`:

```vue [components/AppHeader.vue]
<template>
  <header>
    <h1>My App</h1>
  </header>
</template>
```

You can use it directly in `app.vue` or other pages:

```vue
<template>
  <div>
    <AppHeader />
    <NuxtPage />
  </div>
</template>
```

## Directory Structure and Component Names

If there are nested directories in `components/`, component names will be generated based on the path and filename, with duplicate segments removed.

### Example

Suppose your directory structure is as follows:

```
components/
|-- base/
|   |-- foo/
|   |   |-- Button.vue
|-- BaseButton.vue
```

- `components/base/foo/Button.vue` corresponds to component name `<BaseFooButton />`
- `components/BaseButton.vue` corresponds to component name `<BaseButton />`

Nuxt is smart enough to remove duplicates if part of the directory name matches the filename. For example, `components/base/BaseButton.vue` will also become `<BaseButton />` instead of `<BaseBaseButton />`.

## Dynamic Components

If you need to use Vue's `<component :is="someComponent">` syntax to dynamically render components, you need to use the `resolveComponent` helper.

```vue
<template>
  <component :is="clickable ? MyButton : 'div'" />
</template>

<script setup lang="ts">
const MyButton = resolveComponent('MyButton')
</script>
```

Or, if you are using the component name as a string:

```vue
<component :is="resolveComponent('MyComponent')" />
```

## Lazy Loading

To optimize bundle size, you can prefix the component name with `Lazy` to load the component on demand. This is particularly useful for components that are only displayed after specific interactions.

```vue
<template>
  <div>
    <button @click="show = true">Show List</button>
    <LazyTheList v-if="show" />
  </div>
</template>

<script setup>
const show = ref(false)
</script>
```

In the example above, the `TheList` component and its dependencies will only be loaded when `show` becomes `true`.

## Client and Server Components

### Client-Only Components (.client.vue)

If a component can only run on the client (e.g., uses browser-specific APIs like `window` or `document`), you can add the `.client.vue` suffix to the file.

- File: `components/Comments.client.vue`
- Usage: `<Comments />`

This component will only be mounted on the client. During server-side rendering, it will be rendered as a placeholder.

### Server-Only Components (.server.vue)

**Server Components** are an advanced feature of Nuxt that allows you to render complex components on the server without sending any JavaScript to the client. This is very useful for rendering static content (such as HTML converted from Markdown).

- File: `components/Highlight.server.vue`
- Usage: `<Highlight />`

### `<ClientOnly>` Component

If you want to wrap a section of content in the template that only renders on the client, you can use the `<ClientOnly>` component.

```vue
<template>
  <ClientOnly>
    <CommentSection />
    <template #fallback>
      <p>Loading comments...</p>
    </template>
  </ClientOnly>
</template>
```

## Global Registration (.global.vue)

By default, Nuxt components are auto-imported on demand. If you want a component to be registered globally (e.g., for use in dynamic Markdown content), you can add the `.global.vue` suffix.

- File: `components/BaseUtils.global.vue`

This way, the component will be registered as a global component and can be used anywhere, even in dynamic content not compiled by Nuxt.

## Configuring Scan Directories

If you want to add other directories to the component scan path, you can configure the `components` option in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  components: [
    // Equivalent to default behavior
    { path: '~/components' },
    // Add a custom directory
    { path: '~/ui-components', prefix: 'UI' }
  ]
})
```

With this configuration, `ui-components/Button.vue` can be used via `<UIButton />`.
