# React Hooks

Hooks 是 React 16.8 引入的特性，让你在函数组件中使用 state 以及其他 React 功能，无需编写 class 组件。

## 状态管理

| Hook | 说明 |
| :--- | :--- |
| [useState](./useState) | 向组件添加状态变量，是 React 中最基础、最常用的 Hook |
| [useRef](./useRef) | 持有跨渲染周期的持久化引用，修改不触发重渲染，常用于 DOM 操作 |
| [useContext](./useContext) | 无需逐层透传 props，在组件树中共享全局数据（主题、语言等） |

## 副作用处理

| Hook | 说明 |
| :--- | :--- |
| [useEffect](./useEffect) | 处理副作用（API 请求、DOM 操作、订阅等），可替代生命周期函数 |
| [useLayoutEffect](./useLayoutEffect) | 与 useEffect 类似，但在浏览器绘制前同步执行，会阻塞 DOM 渲染 |
| [useImperativeHandle](./useImperativeHandle) | 向父组件暴露子组件的实例方法或属性，类似 Vue 的 `defineExpose` |

## 性能优化

| Hook | 说明 |
| :--- | :--- |
| [useMemo](./useMemo) | 缓存计算结果，依赖不变时跳过重复计算 |
| [useCallback](./useCallback) | 缓存函数引用，避免子组件不必要的重渲染 |

## 并发特性

| Hook | 说明 |
| :--- | :--- |
| [useTransition](./useTransition) | 将耗时状态更新标记为非紧急任务，保持 UI 交互流畅 |
| [useDeferredValue](./useDeferredValue) | 延迟更新某个值，用于优化大列表搜索等高频更新场景 |

## 其他

| Hook | 说明 |
| :--- | :--- |
| [useSyncExternalStore](./useSyncExternalStore) | 订阅外部数据源（状态管理库、浏览器 API），确保并发模式下数据一致 |
| [useId](./useId) | 生成跨越服务端渲染的唯一 ID，用于无障碍属性（`aria-labelledby` 等） |
