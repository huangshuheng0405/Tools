# 路由模式

- hash 模式
- history 模式
- memory 模式

## createWebHashHistory

路由的记录依赖于 hash

- 跳转时，href = '/#/xxxxx'
- 浏览器前进退后的操作，window.addEventListener('hashchange', () => {})

## createWebHistory

路由的记录依赖于 浏览器原生记录

- 跳转时，history.pushState popState go forward back
- 浏览器前进退后的操作，window.addEventListener('popstate', () => {})

## createMemoryHistory

路由的记录记录在内存中，内存中定义了一个栈来存储历史记录

- 跳转，自定义
- 监听，不需要，因为不需要与外部路由状态同步的逻辑
