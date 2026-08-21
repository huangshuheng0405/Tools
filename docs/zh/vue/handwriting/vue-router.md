# vue-router

::: code-group

```js [/my-router/index.js]
import { ref, inject, defineComponent, h, computed } from 'vue'

const ROUTER_KEY = Symbol('ROUTER_KEY')

export function useRouter() {
  return inject(ROUTER_KEY)
}

export function createRouter(options) {
  return new Router(options)
}

class Router {
  constructor(options) {
    this.history = options.history
    this.routes = options.routes
    // 当前路径，响应式
    this.current = ref(this.history.url)

    // 监听 URL 变化
    this.history.bindEvents(() => {
      this.current.value = window.location.hash.slice(1)
    })
  }

  install(app) {
    // 提供 router 实例
    app.provide(ROUTER_KEY, this)

    // 注册 RouterLink
    app.component(
      'RouterLink',
      defineComponent({
        props: { to: { type: String, required: true } },
        setup(props, { slots }) {
          return () => h('a', { href: '#' + props.to }, slots.default())
        }
      })
    )

    // 注册 RouterView
    app.component(
      'RouterView',
      defineComponent({
        setup() {
          const router = inject(ROUTER_KEY)

          // 计算当前应该渲染的组件
          const comp = computed(() => {
            const route = router.routes.find(
              (route) => route.path === router.current.value
            )
            return route ? route.component : null
          })

          return () => (comp.value ? h(comp.value) : null)
        }
      })
    )
  }
}

export function createWebHashHistory() {
  function bindEvents(fn) {
    window.addEventListener('hashchange', fn)
  }
  return {
    url: window.location.hash.slice(1) || '/',
    bindEvents
  }
}
```

```js [/router/index.js]
import { createRouter, createWebHashHistory } from '../my-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

:::

## Tips

`defineComponent`只是为了类型推导和代码提示，只是把接收到的对象原封不动的返回了

`setup`的第二个参数是`context`（上下文对象），解构拿到`slots`

`h`函数接收三个参数

- **`type` (类型)**：必填。可以是字符串（HTML 标签名，如 `'div'`），也可以是一个组件对象（如 `Home` 组件）。
- **`props` (属性)**：可选。一个对象，包含 HTML 属性、DOM 属性和事件监听器（如 `{ id: 'foo', onClick: () => {} }`）。
- **`children` (子节点)**：可选。可以是字符串（文本节点）、数组（多个子 `VNode`），或者是插槽函数。

当执行`app.use(router)`时，调用该对象中的`install`方法，并把`app`实例作为第一个参数传进去

`window.location.hash.slice(1)`在拿什么？

假设你现在的网址是：`https://localhost:3000/#/about`

- `window.lovation.hash`：拿到的是字符串`#/about`
- `.slice(1)`：去掉第一个字符，得到的就是`/about`
